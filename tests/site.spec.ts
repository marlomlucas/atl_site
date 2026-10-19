import { readFile } from 'node:fs/promises';
import { test, expect, type Page } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';

async function openBrief(page: Page) {
  const opener = page.locator('.brief-open').first();
  await opener.click();
  const dialog = page.getByRole('dialog', { name: 'Vamos organizar sua ideia?' });
  await expect(dialog).toBeVisible();
  return { opener, dialog };
}

async function expectNoOverflow(page: Page) {
  const dimensions = await page.evaluate(() => ({
    viewport: document.documentElement.clientWidth,
    document: document.documentElement.scrollWidth,
    body: document.body.scrollWidth,
  }));
  expect(dimensions.document, JSON.stringify(dimensions)).toBeLessThanOrEqual(dimensions.viewport + 1);
  expect(dimensions.body, JSON.stringify(dimensions)).toBeLessThanOrEqual(dimensions.viewport + 1);
}

test('navegação leva às seções e o link de pular conteúdo funciona com teclado', async ({ page }) => {
  await page.goto('/');
  await expect(page).toHaveTitle(/ATL Soluções em Tecnologia/);
  await expect(page.getByRole('heading', { level: 1 })).toHaveText('Boas ideias.Softwareà altura.');
  await page.keyboard.press('Tab');
  await expect(page.getByRole('link', { name: 'Pular para o conteúdo' })).toBeFocused();
  await page.keyboard.press('Enter');
  await expect(page).toHaveURL(/#conteudo$/);

  const destinations = [
    ['Soluções', 'solucoes'],
    ['Como trabalhamos', 'abordagem'],
    ['Sobre a ATL', 'sobre'],
    ['Vamos conversar', 'contato'],
  ];
  for (const [name, id] of destinations) {
    await page.getByRole('navigation', { name: 'Navegação principal' }).getByRole('link', { name, exact: true }).click();
    await expect(page).toHaveURL(new RegExp(`#${id}$`));
    await expect(page.locator(`#${id}`)).toBeInViewport();
  }
  await page.getByRole('link', { name: 'Voltar ao topo' }).click();
  await expect(page).toHaveURL(/#inicio$/);
  await expect(page.getByRole('heading', { level: 1 })).toBeInViewport();
});

test('visitante encontra o fundador e os canais de contato da ATL', async ({ page }) => {
  await page.goto('/');
  await expect(page.locator('#sobre')).toContainText('Marlom C. Lucas');
  await page.getByRole('link', { name: 'Vamos falar do seu projeto', exact: true }).click();
  await expect(page).toHaveURL(/#contato$/);
  const contact = page.locator('#contato');
  await expect(contact).toBeInViewport();

  const whatsApp = contact.getByRole('link', { name: /WhatsApp/i }).first();
  await expect(whatsApp).toBeVisible();
  const whatsAppUrl = new URL((await whatsApp.getAttribute('href'))!);
  expect(whatsAppUrl.origin).toBe('https://wa.me');
  expect(whatsAppUrl.pathname).toBe('/5551994709009');
  await expect(contact.getByRole('link', { name: /marlomlucas@hotmail\.com/ })).toHaveAttribute('href', /^mailto:marlomlucas@hotmail\.com(?:\?|$)/);
  await expect(page.locator('#sobre').getByRole('link', { name: /LinkedIn/i })).toHaveAttribute('href', 'https://www.linkedin.com/in/marlom-c-lucas/');
  await expect(page.locator('#sobre').getByRole('link', { name: /GitHub/i })).toHaveAttribute('href', 'https://github.com/marlomlucas');
});

for (const width of [320, 360, 390, 768, 960, 1024, 1440]) {
  test(`layout permanece dentro da tela de ${width}px, inclusive menu e formulário`, async ({ page }, testInfo) => {
    await page.setViewportSize({ width, height: 900 });
    await page.goto('/');
    await page.evaluate(() => document.fonts.ready);
    await expectNoOverflow(page);
    if (width <= 960) {
      await page.getByRole('button', { name: 'Abrir menu' }).click();
      await expectNoOverflow(page);
      await page.keyboard.press('Escape');
    }
    await page.screenshot({ path: testInfo.outputPath(`atl-${width}px.png`), fullPage: true });
    const { dialog } = await openBrief(page);
    await expectNoOverflow(page);
    const box = await dialog.boundingBox();
    expect(box).not.toBeNull();
    expect(box!.x).toBeGreaterThanOrEqual(0);
    expect(box!.x + box!.width).toBeLessThanOrEqual(width);
    await dialog.getByLabel('Qual desafio você quer resolver?').fill('Uma descrição longa para verificar que o campo mantém o conteúdo dentro do formulário. '.repeat(15));
    await expectNoOverflow(page);
  });
}

test('menu móvel responde a clique, navegação, Escape e mudança para desktop', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto('/');
  const toggle = page.locator('.menu-toggle');
  const nav = page.getByRole('navigation', { name: 'Navegação principal' });
  await expect(nav).toBeHidden();
  await toggle.click();
  await expect(toggle).toHaveAttribute('aria-expanded', 'true');
  await expect(toggle).toHaveAccessibleName('Fechar menu');
  await expect(nav).toBeVisible();
  await nav.getByRole('link', { name: 'Soluções', exact: true }).click();
  await expect(page).toHaveURL(/#solucoes$/);
  await expect(nav).toBeHidden();
  await expect(toggle).toHaveAttribute('aria-expanded', 'false');
  await toggle.click();
  await page.keyboard.press('Escape');
  await expect(nav).toBeHidden();
  await expect(toggle).toBeFocused();
  await toggle.click();
  await page.locator('.hero-note').click();
  await expect(nav).toBeHidden();
  await toggle.click();
  await toggle.click();
  await expect(nav).toBeHidden();
  await toggle.click();
  await page.setViewportSize({ width: 1440, height: 1000 });
  await expect(toggle).toHaveAttribute('aria-expanded', 'false');
  await expect(nav).toBeVisible();
  await page.setViewportSize({ width: 390, height: 844 });
  await expect(nav).toBeHidden();
});

test('FAQ revela e recolhe respostas por clique e teclado', async ({ page }) => {
  await page.goto('/');
  const question = page.locator('.faq-item').first();
  const answer = question.locator('p');
  const summary = question.locator('summary');
  await expect(answer).toBeHidden();
  await summary.click();
  await expect(answer).toBeVisible();
  await expect(answer).toContainText('Podemos começar pelo desafio');
  await summary.press('Enter');
  await expect(answer).toBeHidden();
  await summary.press('Space');
  await expect(answer).toBeVisible();
});

test('diálogo mantém foco, valida os campos e restaura o foco ao fechar', async ({ page }) => {
  await page.goto('/');
  const { opener, dialog } = await openBrief(page);
  await expect(dialog.getByRole('button', { name: 'Fechar resumo do projeto' })).toBeFocused();
  await page.locator('.logo-link').first().evaluate((link: HTMLAnchorElement) => link.focus());
  await expect(dialog.getByRole('button', { name: 'Fechar resumo do projeto' })).toBeFocused();
  await page.keyboard.press('Tab');
  await expect(dialog.getByLabel('Como você chamaria seu projeto?')).toBeFocused();
  await page.keyboard.press('Tab');
  await expect(dialog.getByLabel('Do que você precisa?')).toBeFocused();
  await page.keyboard.press('Tab');
  await expect(dialog.getByLabel('Qual desafio você quer resolver?')).toBeFocused();
  await page.keyboard.press('Tab');
  await expect(dialog.getByRole('button', { name: 'Baixar resumo do projeto' })).toBeFocused();
  await page.keyboard.press('Shift+Tab');
  await expect(dialog.getByLabel('Qual desafio você quer resolver?')).toBeFocused();

  const submit = dialog.getByRole('button', { name: 'Baixar resumo do projeto' });
  const name = dialog.getByLabel('Como você chamaria seu projeto?');
  const challenge = dialog.getByLabel('Qual desafio você quer resolver?');
  await submit.click();
  await expect(name).toBeFocused();
  expect(await name.evaluate((field: HTMLInputElement) => field.validity.valueMissing)).toBe(true);
  await name.fill('Site ATL');
  await submit.click();
  await expect(challenge).toBeFocused();
  expect(await challenge.evaluate((field: HTMLTextAreaElement) => field.validity.valueMissing)).toBe(true);
  await name.fill('   ');
  await challenge.fill('   ');
  await submit.click();
  await expect(dialog.getByRole('status')).toContainText('Preencha o nome do projeto e o desafio');

  await page.keyboard.press('Escape');
  await expect(dialog).toBeHidden();
  await expect(opener).toBeFocused();
  await opener.click();
  await dialog.getByRole('button', { name: 'Fechar resumo do projeto' }).click();
  await expect(dialog).toBeHidden();
  await expect(opener).toBeFocused();
});

test('briefing baixa arquivo UTF-8 com os dados informados sem transmissão', async ({ page }, testInfo) => {
  await page.goto('/');
  await page.waitForLoadState('networkidle');
  const { dialog } = await openBrief(page);
  const transmissions: string[] = [];
  page.on('request', request => {
    if (['fetch', 'xhr', 'ping'].includes(request.resourceType()) || request.method() !== 'GET') {
      transmissions.push(`${request.method()} ${request.url()}`);
    }
  });
  await dialog.getByLabel('Como você chamaria seu projeto?').fill('Gestão Café São João ☕');
  await dialog.getByLabel('Do que você precisa?').selectOption({ label: 'Sistema sob medida' });
  const challenge = 'Organizar pedidos, emissão e integração — ação, eficiência e conexão.\nAtender clientes em português.';
  await dialog.getByLabel('Qual desafio você quer resolver?').fill(challenge);
  const downloadPromise = page.waitForEvent('download');
  await dialog.getByRole('button', { name: 'Baixar resumo do projeto' }).click();
  const download = await downloadPromise;
  expect(download.suggestedFilename()).toBe('atl-resumo-do-projeto.txt');
  const path = testInfo.outputPath(download.suggestedFilename());
  await download.saveAs(path);
  const content = await readFile(path, 'utf8');
  expect(content).toContain('ATL — Resumo do projeto');
  expect(content).toContain('Projeto: Gestão Café São João ☕');
  expect(content).toContain('Solução: Sistema sob medida');
  expect(content).toContain(challenge);
  expect(content).toContain('Nenhuma informação foi enviada automaticamente.');
  await expect(dialog.getByRole('status')).toContainText('Nenhuma informação foi enviada.');
  expect(transmissions).toEqual([]);
});

test('página e diálogo atendem às regras automáticas WCAG 2 AA', async ({ page }) => {
  await page.goto('/');
  const pageResults = await new AxeBuilder({ page }).withTags(['wcag2a', 'wcag2aa', 'wcag21aa']).analyze();
  expect(pageResults.violations).toEqual([]);
  await openBrief(page);
  const dialogResults = await new AxeBuilder({ page }).withTags(['wcag2a', 'wcag2aa', 'wcag21aa']).analyze();
  expect(dialogResults.violations).toEqual([]);
});

test('menu móvel aberto atende às regras automáticas WCAG 2 AA', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto('/');
  await page.getByRole('button', { name: 'Abrir menu' }).click();
  const results = await new AxeBuilder({ page }).withTags(['wcag2a', 'wcag2aa', 'wcag21aa']).analyze();
  expect(results.violations).toEqual([]);
});
