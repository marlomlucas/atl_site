import {
  MARKET_PANELS,
  MARKET_WIDGET_SCRIPT,
  marketWidgetConfig,
  type MarketPanelId,
} from "../data/markets";
import {
  WEATHER_CITIES,
  fetchWeather,
  type WeatherCity,
  type WeatherForecast,
} from "../lib/weather";

const radar = document.querySelector<HTMLElement>("#radar");
const date = document.querySelector<HTMLTimeElement>("#radar-date");
if (date) {
  const now = new Date();
  date.dateTime = new Intl.DateTimeFormat("en-CA", {
    timeZone: "America/Sao_Paulo",
  }).format(now);
  date.textContent = new Intl.DateTimeFormat("pt-BR", {
    dateStyle: "full",
    timeZone: "America/Sao_Paulo",
  }).format(now);
}

const marketLoads = new Map<MarketPanelId, "loading" | "mounted">();
function loadMarket(id: MarketPanelId) {
  if (marketLoads.has(id)) return;
  const panel = radar?.querySelector<HTMLElement>(
    `[data-market-panel="${id}"]`,
  );
  const slot = panel?.querySelector<HTMLElement>("[data-widget-slot]");
  const state = panel?.querySelector<HTMLElement>("[data-market-state]");
  const status = panel?.querySelector<HTMLElement>("[data-market-status]");
  const button = panel?.querySelector<HTMLButtonElement>("[data-load-market]");
  if (!slot || !state || !status || !button) return;

  marketLoads.set(id, "loading");
  slot.replaceChildren();
  slot.hidden = true;
  state.hidden = false;
  status.textContent = "Consultando o painel do TradingView…";
  button.disabled = true;
  button.textContent = "Carregando…";

  const container = document.createElement("div");
  container.className = "tradingview-widget-container";
  const widget = document.createElement("div");
  widget.className = "tradingview-widget-container__widget";
  const attribution = document.createElement("div");
  attribution.className = "tradingview-widget-copyright";
  const source = document.createElement("a");
  source.href = MARKET_PANELS[id].sourceUrl;
  source.target = "_blank";
  source.rel = "noopener noreferrer";
  source.textContent = "Cotações por TradingView";
  attribution.append(source);
  const script = document.createElement("script");
  script.src = MARKET_WIDGET_SCRIPT;
  script.type = "text/javascript";
  script.async = true;
  script.textContent = JSON.stringify(marketWidgetConfig(id));

  let settled = false;
  const fail = () => {
    if (settled) return;
    settled = true;
    clearTimeout(timeout);
    script.remove();
    slot.replaceChildren();
    slot.hidden = true;
    state.hidden = false;
    marketLoads.delete(id);
    status.textContent =
      "O painel não está disponível agora. Você pode tentar novamente ou consultar as cotações na fonte abaixo.";
    button.disabled = false;
    button.textContent = "Tentar novamente";
  };
  const timeout = window.setTimeout(fail, 15_000);
  script.addEventListener("error", fail, { once: true });
  script.addEventListener(
    "load",
    () => {
      if (settled) return;
      // A loaded script or iframe does not prove that any market data is available.
      // Keep the provider's own timestamp, availability messages and attribution.
      const iframe = slot.querySelector("iframe");
      if (!iframe) {
        fail();
        return;
      }
      settled = true;
      clearTimeout(timeout);
      marketLoads.set(id, "mounted");
      iframe.title = `Painel TradingView — ${MARKET_PANELS[id].title}`;
      state.hidden = true;
      slot.hidden = false;
      button.disabled = false;
    },
    { once: true },
  );
  container.append(widget, attribution, script);
  slot.append(container);
}

radar
  ?.querySelectorAll<HTMLButtonElement>("[data-load-market]")
  .forEach((button) => {
    button.addEventListener("click", () =>
      loadMarket(button.dataset.loadMarket as MarketPanelId),
    );
  });

const citySelect = document.querySelector<HTMLSelectElement>("#radar-city");
const weatherStatus = document.querySelector<HTMLElement>(
  "#radar-weather-status",
);
const weatherRetry = document.querySelector<HTMLButtonElement>(
  "#radar-weather-retry",
);
const periods = document.querySelector<HTMLElement>("#radar-weather-periods");
const updated = document.querySelector<HTMLElement>("#radar-weather-updated");
const preferenceKey = "atl:radar:city:v1";
try {
  const preferred = localStorage.getItem(preferenceKey);
  if (citySelect && WEATHER_CITIES.some((city) => city.id === preferred))
    citySelect.value = preferred!;
} catch {
  /* City selection also works when browser storage is unavailable. */
}

function condition(symbol: string): {
  text: string;
  kind: "sun" | "cloud" | "rain";
} {
  const base = symbol.replace(/_(day|night|polartwilight)$/, "");
  if (base.includes("thunder"))
    return { text: "Possibilidade de trovoadas", kind: "rain" };
  if (base.includes("sleet")) return { text: "Chuva e neve", kind: "rain" };
  if (base.includes("snow")) return { text: "Previsão de neve", kind: "cloud" };
  if (base.includes("rain"))
    return {
      text: base.includes("heavy")
        ? "Previsão de chuva forte"
        : "Previsão de chuva",
      kind: "rain",
    };
  if (base === "clearsky") return { text: "Céu limpo", kind: "sun" };
  if (base === "fair") return { text: "Poucas nuvens", kind: "sun" };
  if (base === "partlycloudy")
    return { text: "Parcialmente nublado", kind: "cloud" };
  if (base === "cloudy") return { text: "Nublado", kind: "cloud" };
  if (base === "fog") return { text: "Neblina", kind: "cloud" };
  return { text: "Condição informada pelo provedor", kind: "cloud" };
}

function weatherIcon(kind: "sun" | "cloud" | "rain") {
  const svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
  svg.setAttribute("viewBox", "0 0 40 40");
  svg.setAttribute("fill", "none");
  svg.setAttribute("stroke", "currentColor");
  svg.setAttribute("stroke-width", "1.4");
  svg.setAttribute("stroke-linecap", "round");
  svg.setAttribute("aria-hidden", "true");
  const path = document.createElementNS("http://www.w3.org/2000/svg", "path");
  path.setAttribute(
    "d",
    kind === "sun"
      ? "M20 10a10 10 0 1 0 0 20 10 10 0 0 0 0-20M20 2v4m0 28v4M2 20h4m28 0h4M7 7l3 3m20 20 3 3M7 33l3-3M30 10l3-3"
      : kind === "rain"
        ? "M11 25a7 7 0 0 1-1-14 10 10 0 0 1 19-1 7.5 7.5 0 1 1 1 15H11M12 30l-2 5m12-5-2 5m12-5-2 5"
        : "M11 30a8 8 0 0 1-1-16 11 11 0 0 1 21-1 8.5 8.5 0 1 1 0 17H11",
  );
  svg.append(path);
  return svg;
}

function renderWeather(forecast: WeatherForecast, city: WeatherCity) {
  if (!periods || !updated || !weatherStatus) return;
  const fragment = document.createDocumentFragment();
  const temperature = new Intl.NumberFormat("pt-BR", {
    maximumFractionDigits: 1,
  });
  const timeFormat = new Intl.DateTimeFormat("pt-BR", {
    weekday: "short",
    hour: "2-digit",
    minute: "2-digit",
    timeZone: city.timeZone,
  });
  forecast.periods.forEach((period) => {
    const card = document.createElement("article");
    card.className = "radar-weather-card";
    const time = document.createElement("time");
    time.dateTime = period.time;
    time.textContent = timeFormat.format(new Date(period.time));
    const icon = document.createElement("div");
    icon.className = "weather-symbol";
    const description = condition(period.symbol);
    icon.append(weatherIcon(description.kind));
    const value = document.createElement("p");
    value.className = "radar-weather-temperature";
    value.textContent = `${temperature.format(period.temperature)} °C`;
    const label = document.createElement("p");
    label.className = "radar-weather-condition";
    label.textContent = description.text;
    const wind = document.createElement("p");
    wind.className = "radar-weather-wind";
    wind.textContent = `Vento: ${temperature.format(period.windKmh)} km/h`;
    card.append(time, icon, value, label, wind);
    fragment.append(card);
  });
  periods.replaceChildren(fragment);
  periods.hidden = false;
  weatherStatus.textContent = `Próximas horas em ${city.name}. Temperaturas previstas, não medições em tempo real.`;
  updated.textContent = `Previsão emitida em ${new Intl.DateTimeFormat("pt-BR", { dateStyle: "short", timeStyle: "short", timeZone: city.timeZone }).format(new Date(forecast.updatedAt))} (horário local).`;
}

let weatherController: AbortController | null = null;
async function loadWeather() {
  const city =
    WEATHER_CITIES.find((city) => city.id === citySelect?.value) ??
    WEATHER_CITIES[0];
  if (!city || !weatherStatus || !periods || !weatherRetry) return;
  weatherController?.abort();
  const controller = new AbortController();
  weatherController = controller;
  const timeout = window.setTimeout(() => controller.abort(), 12_000);
  weatherStatus.textContent = `Consultando a previsão para ${city.name}…`;
  periods.hidden = true;
  periods.replaceChildren();
  weatherRetry.hidden = true;
  if (updated) updated.textContent = "A previsão pode mudar ao longo do dia.";
  try {
    const forecast = await fetchWeather(
      city,
      controller.signal,
      import.meta.env.DEV ? "/weather-api/locationforecast" : undefined,
    );
    if (weatherController !== controller) return;
    renderWeather(forecast, city);
  } catch {
    if (weatherController !== controller) return;
    weatherStatus.textContent = `A previsão para ${city.name} não está disponível agora. Tente novamente ou consulte o Yr abaixo.`;
    weatherRetry.hidden = false;
  } finally {
    clearTimeout(timeout);
  }
}

citySelect?.addEventListener("change", () => {
  try {
    localStorage.setItem(preferenceKey, citySelect.value);
  } catch {
    /* Optional preference only. */
  }
  void loadWeather();
});
weatherRetry?.addEventListener("click", () => void loadWeather());

const tabs = [
  ...(radar?.querySelectorAll<HTMLButtonElement>("[data-radar-tab]") ?? []),
];
function activateTab(tab: HTMLButtonElement, focus: boolean) {
  tabs.forEach((item) => {
    const selected = item === tab;
    item.setAttribute("aria-selected", String(selected));
    item.tabIndex = selected ? 0 : -1;
    const panel = document.getElementById(
      item.getAttribute("aria-controls") ?? "",
    );
    if (panel) panel.hidden = !selected;
  });
  if (focus) tab.focus();
  const id = tab.dataset.radarTab!;
  if (id === "tempo") void loadWeather();
  else if (id in MARKET_PANELS) loadMarket(id as MarketPanelId);
}
tabs.forEach((tab, index) => {
  tab.addEventListener("click", () => activateTab(tab, false));
  tab.addEventListener("keydown", (event) => {
    let next = index;
    if (event.key === "ArrowRight") next = (index + 1) % tabs.length;
    else if (event.key === "ArrowLeft")
      next = (index - 1 + tabs.length) % tabs.length;
    else if (event.key === "Home") next = 0;
    else if (event.key === "End") next = tabs.length - 1;
    else return;
    event.preventDefault();
    activateTab(tabs[next], true);
  });
});
