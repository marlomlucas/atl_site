import { test, expect, type Page, type Route } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';

const WEATHER_ENDPOINT = /(?:https:\/\/api\.met\.no\/weatherapi\/locationforecast\/2\.0\/compact|\/weather-api\/locationforecast)\?/;
const MARKET_SCRIPT = 'https://s3.tradingview.com/external-embedding/embed-widget-market-quotes.js';
const HOUR = 60 * 60 * 1000;

function weatherPayload(reference = new Date(), updatedAt = reference.toISOString()) {
  return {
    type: 'Feature',
    geometry: { type: 'Point', coordinates: [-51.2177, -30.0346, 10] },
    properties: {
      meta: { updated_at: updatedAt, units: { air_temperature: 'celsius', wind_speed: 'm/s' } },
      timeseries: Array.from({ length: 24 }, (_, index) => ({
        time: new Date(reference.getTime() + (index + 1) * HOUR).toISOString(),
        data: {
          instant: { details: { air_temperature: 21.5, wind_speed: 5 } },
          next_1_hours: { summary: { symbol_code: index % 2 === 0 ? 'clearsky_day' : 'partlycloudy_day' } },
        },
      })),
    },
  };
}

async function fulfillWeather(route: Route, payload = weatherPayload()) {
  await route.fulfill({
    status: 200,
    contentType: 'application/json',
    headers: { 'access-control-allow-origin': '*' },
    body: JSON.stringify(payload),
  });
}

// Only emulate the vendor's mounting contract. No market prices are fabricated.
const mockMarketScript = `(() => {
  const script = document.currentScript;
  const config = JSON.parse(script.textContent);
  const widget = script.parentElement.querySelector('.tradingview-widget-container__widget');
  const frame = document.createElement('iframe');
  frame.src = 'about:blank';
  frame.dataset.widgetConfig = JSON.stringify(config);
  widget.append(frame);
})();`;

async function fulfillMarket(route: Route) {
  await route.fulfill({ status: 200, contentType: 'application/javascript', body: mockMarketScript });
}

async function showWeather(page: Page) {
  await page.locator('#radar').getByRole('tab', { name: 'Tempo', exact: true }).click();
  const panel = page.getByRole('tabpanel', { name: 'Tempo', exact: true });
  await expect(panel).toBeVisible();
  return panel;
}

async function expectNoRadarOverflow(page: Page) {
  const dimensions = await page.locator('#radar').evaluate(radar => ({
    viewport: document.documentElement.clientWidth,
    document: document.documentElement.scrollWidth,
    radar: radar.clientWidth,
    content: radar.scrollWidth,
  }));
  expect(dimensions.document, JSON.stringify(dimensions)).toBeLessThanOrEqual(dimensions.viewport + 1);
  expect(dimensions.content, JSON.stringify(dimensions)).toBeLessThanOrEqual(dimensions.radar + 1);
}

test.beforeEach(async ({ page }) => {
  // Every provider request is intercepted, including keyboard-triggered loads.
  await page.route(WEATHER_ENDPOINT, route => fulfillWeather(route));
  await page.route(MARKET_SCRIPT, route => route.abort('failed'));
});

test('abas usam seleção única e navegação por setas, Home e End', async ({ page }) => {
  await page.goto('/');
  const radar = page.locator('#radar');
  const tabs = radar.getByRole('tab');
  await expect(tabs).toHaveCount(4);
  const currencies = radar.getByRole('tab', { name: 'Moedas', exact: true });
  await expect(currencies).toHaveAttribute('aria-selected', 'true');
  await expect(currencies).toHaveAttribute('tabindex', '0');
  await expect(radar.getByRole('tabpanel')).toHaveCount(1);
  await currencies.focus();

  for (const [key, label] of [
    ['ArrowRight', 'Criptomoedas'],
    ['ArrowRight', 'Commodities e minérios'],
    ['End', 'Tempo'],
    ['ArrowRight', 'Moedas'],
    ['ArrowLeft', 'Tempo'],
    ['Home', 'Moedas'],
  ]) {
    await page.keyboard.press(key);
    const selected = radar.getByRole('tab', { name: label, exact: true });
    await expect(selected).toBeFocused();
    await expect(selected).toHaveAttribute('aria-selected', 'true');
    await expect(selected).toHaveAttribute('tabindex', '0');
    await expect(radar.locator('[role="tab"][aria-selected="true"]')).toHaveCount(1);
    await expect(radar.locator('[role="tab"][tabindex="0"]')).toHaveCount(1);
    await expect(radar.getByRole('tabpanel')).toHaveCount(1);
    await expect(radar.getByRole('tabpanel', { name: label, exact: true })).toBeVisible();
  }
});

test('mercados carregam automaticamente e enviam os instrumentos corretos ao widget', async ({ page }) => {
  let requests = 0;
  await page.route(MARKET_SCRIPT, async route => {
    requests++;
    await fulfillMarket(route);
  });
  await page.goto('/');
  await expect(page.locator('#radar iframe')).toHaveCount(1);
  expect(requests).toBe(1);
  await expect(page.locator('#radar').getByRole('button', { name: 'Carregar cotações', exact: true })).toHaveCount(0);

  const panels = [
    { label: 'Moedas', title: 'Moedas em reais', symbols: ['FX_IDC:USDBRL', 'FX_IDC:EURBRL', 'FX_IDC:CLPBRL'] },
    { label: 'Criptomoedas', title: 'Criptomoedas em dólar', symbols: ['BITSTAMP:BTCUSD', 'BITSTAMP:ETHUSD', 'COINBASE:SOLUSD', 'BITSTAMP:XRPUSD', 'BITSTAMP:LTCUSD'] },
    { label: 'Commodities e minérios', title: 'Commodities e metais', symbols: ['TVC:GOLD', 'TVC:SILVER', 'COMEX:HG1!', 'TVC:USOIL', 'TVC:UKOIL', 'CBOT:ZS1!', 'CBOT:ZC1!'] },
  ];
  for (const [index, expected] of panels.entries()) {
    const panel = page.getByRole('tabpanel', { name: expected.label, exact: true });
    if (index > 0) await page.locator('#radar').getByRole('tab', { name: expected.label, exact: true }).click();
    const iframe = panel.locator('iframe');
    await expect(iframe).toBeVisible();
    await expect(iframe).toHaveAttribute('src', 'about:blank');
    await expect(iframe).toHaveAttribute('title', `Painel TradingView — ${expected.title}`);
    const config = JSON.parse((await iframe.getAttribute('data-widget-config'))!);
    expect(config).toMatchObject({ width: '100%', height: '100%', locale: 'br', colorTheme: 'dark', isTransparent: false, backgroundColor: '#080d0a' });
    expect(config.symbolsGroups.flatMap((group: { symbols: Array<{ name: string }> }) => group.symbols.map(symbol => symbol.name))).toEqual(expected.symbols);
    await expect(panel.locator('[data-market-state]')).toBeHidden();
    await expect(panel.locator('[data-load-market]')).toBeHidden();
    expect(requests).toBe(index + 1);
  }
  await expect(page.getByRole('link', { name: 'Consultar na SGX', exact: true })).toHaveAttribute('href', 'https://www.sgx.com/derivatives/products/iron-ore');
  await page.locator('#radar').getByRole('tab', { name: 'Moedas', exact: true }).click();
  expect(requests).toBe(3);
  await expect(page.getByRole('tabpanel', { name: 'Moedas', exact: true }).locator('iframe')).toHaveCount(1);
});

test('falha do mercado exibe fonte e permite tentar novamente sem duplicar widget', async ({ page }) => {
  let attempts = 0;
  await page.route(MARKET_SCRIPT, async route => {
    attempts++;
    if (attempts === 1) await route.abort('failed');
    else await fulfillMarket(route);
  });
  await page.goto('/');
  const panel = page.getByRole('tabpanel', { name: 'Moedas', exact: true });
  await expect(panel.getByRole('status')).toContainText('O painel não está disponível agora');
  expect(attempts).toBe(1);
  await expect(panel.locator('iframe')).toHaveCount(0);
  await expect(panel.getByRole('link', { name: 'Cotações por TradingView', exact: true })).toHaveAttribute('href', 'https://br.tradingview.com/markets/currencies/');
  const retry = panel.getByRole('button', { name: 'Tentar novamente', exact: true });
  await expect(retry).toBeEnabled();
  await retry.click();
  await expect(panel.locator('iframe')).toBeVisible();
  expect(attempts).toBe(2);
  await page.locator('#radar').getByRole('tab', { name: 'Moedas', exact: true }).click();
  await expect(panel.locator('iframe')).toHaveCount(1);
  expect(attempts).toBe(2);
});

test('tempo mostra quatro previsões futuras, unidades, fonte e emissão do provedor', async ({ page }) => {
  const reference = new Date();
  let requests = 0;
  await page.route(WEATHER_ENDPOINT, async route => {
    requests++;
    const url = new URL(route.request().url());
    expect(url.searchParams.get('lat')).toBe('-30.0346');
    expect(url.searchParams.get('lon')).toBe('-51.2177');
    await fulfillWeather(route, weatherPayload(reference));
  });
  await page.goto('/');
  expect(requests).toBe(0);
  const date = page.locator('#radar-date');
  await expect(date).toHaveAttribute('datetime', new Intl.DateTimeFormat('en-CA', { timeZone: 'America/Sao_Paulo' }).format(reference));
  await expect(date).not.toBeEmpty();
  const panel = await showWeather(page);
  const cards = panel.locator('.radar-weather-card');
  await expect(cards).toHaveCount(4);
  expect(requests).toBe(1);
  await expect(panel.getByRole('status')).toContainText('Próximas horas em Porto Alegre');
  await expect(panel.getByRole('status')).toContainText('não medições em tempo real');
  await expect(cards.locator('.radar-weather-temperature')).toHaveText(['21,5 °C', '21,5 °C', '21,5 °C', '21,5 °C']);
  await expect(cards.locator('.radar-weather-wind')).toHaveText(['Vento: 18 km/h', 'Vento: 18 km/h', 'Vento: 18 km/h', 'Vento: 18 km/h']);
  for (const [index, offset] of [1, 6, 12, 18].entries()) {
    await expect(cards.nth(index).locator('time')).toHaveAttribute('datetime', new Date(reference.getTime() + offset * HOUR).toISOString());
  }
  const issued = new Intl.DateTimeFormat('pt-BR', { dateStyle: 'short', timeStyle: 'short', timeZone: 'America/Sao_Paulo' }).format(reference);
  await expect(panel.locator('#radar-weather-updated')).toHaveText(`Previsão emitida em ${issued} (horário local).`);
  await expect(panel.getByRole('link', { name: 'MET Norway', exact: true })).toHaveAttribute('href', 'https://www.met.no/en');
  await expect(panel.getByRole('link', { name: 'CC BY 4.0', exact: true })).toHaveAttribute('href', 'https://creativecommons.org/licenses/by/4.0/');
  await expect(panel.getByRole('link', { name: 'Consultar no Yr', exact: true })).toHaveAttribute('href', 'https://www.yr.no/en');
});

for (const failure of ['desatualizada', 'inválida', 'unidade incompatível', 'HTTP 403']) {
  test(`tempo rejeita resposta ${failure}, não mostra números e permite nova consulta`, async ({ page }) => {
    let attempts = 0;
    await page.route(WEATHER_ENDPOINT, async route => {
      attempts++;
      if (attempts > 1) return fulfillWeather(route);
      if (failure === 'HTTP 403') return route.fulfill({ status: 403, body: 'Forbidden' });
      const payload = weatherPayload();
      if (failure === 'desatualizada') payload.properties.meta.updated_at = new Date(Date.now() - 25 * HOUR).toISOString();
      else if (failure === 'unidade incompatível') payload.properties.meta.units.wind_speed = 'km/h';
      else payload.properties.timeseries[0].data.instant.details.air_temperature = 1000;
      await fulfillWeather(route, payload);
    });
    await page.goto('/');
    const panel = await showWeather(page);
    await expect(panel.getByRole('status')).toContainText('não está disponível agora');
    await expect(panel.locator('.radar-weather-card')).toHaveCount(0);
    await expect(panel.locator('#radar-weather-periods')).toBeHidden();
    await expect(panel.locator('#radar-weather-updated')).not.toContainText('Previsão emitida');
    await panel.getByRole('button', { name: 'Tentar novamente', exact: true }).click();
    await expect(panel.locator('.radar-weather-card')).toHaveCount(4);
    await expect(panel.getByRole('button', { name: 'Tentar novamente', exact: true })).toBeHidden();
    expect(attempts).toBe(2);
  });
}

test('troca de cidade persiste e cache evita consultas repetidas ao voltar ou recarregar', async ({ page }) => {
  const locations: string[] = [];
  await page.route(WEATHER_ENDPOINT, async route => {
    const url = new URL(route.request().url());
    locations.push(`${url.searchParams.get('lat')},${url.searchParams.get('lon')}`);
    await fulfillWeather(route);
  });
  await page.goto('/');
  const panel = await showWeather(page);
  await expect(panel.locator('.radar-weather-card')).toHaveCount(4);
  await panel.getByLabel('Sua cidade').selectOption('santiago');
  await expect(panel.getByRole('status')).toContainText('Próximas horas em Santiago');
  expect(locations).toEqual(['-30.0346,-51.2177', '-33.4489,-70.6693']);
  await page.locator('#radar').getByRole('tab', { name: 'Moedas', exact: true }).click();
  await showWeather(page);
  await expect(panel.locator('.radar-weather-card')).toHaveCount(4);
  expect(locations).toHaveLength(2);
  await page.reload();
  const restored = await showWeather(page);
  await expect(restored.getByLabel('Sua cidade')).toHaveValue('santiago');
  await expect(restored.getByRole('status')).toContainText('Próximas horas em Santiago');
  await expect(restored.locator('.radar-weather-card')).toHaveCount(4);
  expect(locations).toHaveLength(2);
  await restored.getByLabel('Sua cidade').selectOption('porto-alegre');
  await expect(restored.getByRole('status')).toContainText('Próximas horas em Porto Alegre');
  expect(locations).toHaveLength(2);
});

for (const width of [320, 360, 390, 768, 960, 1024, 1440]) {
  test(`radar cabe em ${width}px em todos os painéis de mercado e tempo`, async ({ page }, testInfo) => {
    await page.setViewportSize({ width, height: 900 });
    let mountWidget = false;
    await page.route(MARKET_SCRIPT, route => mountWidget ? fulfillMarket(route) : route.abort('failed'));
    await page.goto('/');
    await expectNoRadarOverflow(page);
    for (const label of ['Moedas', 'Criptomoedas', 'Commodities e minérios']) {
      mountWidget = false;
      if (label !== 'Moedas') await page.locator('#radar').getByRole('tab', { name: label, exact: true }).click();
      const panel = page.getByRole('tabpanel', { name: label, exact: true });
      await expect(panel.getByRole('button', { name: 'Tentar novamente', exact: true })).toBeVisible();
      await expectNoRadarOverflow(page);
      mountWidget = true;
      await panel.getByRole('button', { name: 'Tentar novamente', exact: true }).click();
      await expect(panel.locator('iframe')).toBeVisible();
      await expectNoRadarOverflow(page);
    }
    const weather = await showWeather(page);
    await expect(weather.locator('.radar-weather-card')).toHaveCount(4);
    await expectNoRadarOverflow(page);
    await page.locator('#radar').screenshot({ path: testInfo.outputPath(`radar-${width}px.png`) });
  });
}

test('radar atende às verificações automáticas WCAG 2 AA no tempo e fallback de mercado', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 900 });
  await page.goto('/');
  await expect(page.locator('#radar-panel-moedas').getByRole('status')).toContainText('O painel não está disponível agora');
  const fallback = await new AxeBuilder({ page }).include('#radar').withTags(['wcag2a', 'wcag2aa', 'wcag21aa']).analyze();
  expect(fallback.violations).toEqual([]);
  const weather = await showWeather(page);
  await expect(weather.locator('.radar-weather-card')).toHaveCount(4);
  const forecast = await new AxeBuilder({ page }).include('#radar').withTags(['wcag2a', 'wcag2aa', 'wcag21aa']).analyze();
  expect(forecast.violations).toEqual([]);
});
