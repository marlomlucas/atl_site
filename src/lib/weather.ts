export interface WeatherCity {
  readonly id: string;
  readonly name: string;
  readonly lat: number;
  readonly lon: number;
  readonly timeZone: string;
}

export interface WeatherPeriod {
  time: string;
  temperature: number;
  windKmh: number;
  symbol: string;
}

export interface WeatherForecast {
  /** When the provider issued this forecast, not when the page retrieved it. */
  updatedAt: string;
  periods: WeatherPeriod[];
}

export const WEATHER_CITIES: readonly WeatherCity[] = [
  {
    id: "porto-alegre",
    name: "Porto Alegre (RS)",
    lat: -30.0346,
    lon: -51.2177,
    timeZone: "America/Sao_Paulo",
  },
  {
    id: "caxias-do-sul",
    name: "Caxias do Sul",
    lat: -29.1678,
    lon: -51.1794,
    timeZone: "America/Sao_Paulo",
  },
  {
    id: "novo-hamburgo",
    name: "Novo Hamburgo",
    lat: -29.6878,
    lon: -51.1328,
    timeZone: "America/Sao_Paulo",
  },
  {
    id: "florianopolis",
    name: "Florianópolis",
    lat: -27.5954,
    lon: -48.548,
    timeZone: "America/Sao_Paulo",
  },
  {
    id: "sao-paulo",
    name: "São Paulo",
    lat: -23.5505,
    lon: -46.6333,
    timeZone: "America/Sao_Paulo",
  },
  {
    id: "rio-de-janeiro",
    name: "Rio de Janeiro",
    lat: -22.9068,
    lon: -43.1729,
    timeZone: "America/Sao_Paulo",
  },
  {
    id: "brasilia",
    name: "Brasília",
    lat: -15.7939,
    lon: -47.8828,
    timeZone: "America/Sao_Paulo",
  },
  {
    id: "santiago",
    name: "Santiago",
    lat: -33.4489,
    lon: -70.6693,
    timeZone: "America/Santiago",
  },
];

const HOUR = 60 * 60 * 1000;
const CACHE_VERSION = 1;
const CACHE_MIN_TTL = HOUR / 2;
const FORECAST_MAX_AGE = 24 * HOUR;
const FORECAST_FUTURE_TOLERANCE = 10 * 60 * 1000;
const PERIOD_TOLERANCE = 3 * HOUR;

type JsonObject = Record<string, unknown>;

function object(value: unknown, label: string): JsonObject {
  if (typeof value !== "object" || value === null || Array.isArray(value)) {
    throw new Error(`Previsão inválida: ${label}.`);
  }
  return value as JsonObject;
}

function number(
  value: unknown,
  label: string,
  min: number,
  max: number,
): number {
  if (
    typeof value !== "number" ||
    !Number.isFinite(value) ||
    value < min ||
    value > max
  ) {
    throw new Error(`Previsão inválida: ${label}.`);
  }
  return value;
}

function timestamp(value: unknown, label: string): number {
  if (typeof value !== "string")
    throw new Error(`Previsão inválida: ${label}.`);
  const parts =
    /^(\d{4})-(\d{2})-(\d{2})T(\d{2}):(\d{2}):(\d{2})(?:\.\d{1,3})?(Z|[+-]\d{2}:\d{2})$/.exec(
      value,
    );
  const parsed = Date.parse(value);
  if (!parts || !Number.isFinite(parsed))
    throw new Error(`Previsão inválida: ${label}.`);
  const [, year, month, day, hour, minute, second, zone] = parts;
  const daysInMonth = new Date(
    Date.UTC(Number(year), Number(month), 0),
  ).getUTCDate();
  if (
    Number(month) < 1 ||
    Number(month) > 12 ||
    Number(day) < 1 ||
    Number(day) > daysInMonth ||
    Number(hour) > 23 ||
    Number(minute) > 59 ||
    Number(second) > 59 ||
    (zone !== "Z" &&
      (Number(zone.slice(1, 3)) > 23 || Number(zone.slice(4)) > 59))
  )
    throw new Error(`Previsão inválida: ${label}.`);
  return parsed;
}

function symbolFor(data: JsonObject): string | null {
  for (const period of ["next_1_hours", "next_6_hours", "next_12_hours"]) {
    if (data[period] === undefined) continue;
    const summary = object(object(data[period], period).summary, "resumo");
    const symbol = summary.symbol_code;
    if (typeof symbol !== "string" || !/^[a-z][a-z0-9_]{0,79}$/.test(symbol)) {
      throw new Error("Previsão inválida: condição do tempo.");
    }
    return symbol;
  }
  // The final instant in a valid MET forecast has no following-period summary.
  return null;
}

/** Select four forecast instants near now/+6h/+12h/+18h; never observations. */
export function normalizeWeather(
  payload: unknown,
  now: number | Date = Date.now(),
): WeatherForecast {
  const nowMs = now instanceof Date ? now.getTime() : now;
  if (!Number.isFinite(nowMs))
    throw new Error("Horário de referência inválido.");
  const properties = object(
    object(payload, "resposta").properties,
    "propriedades",
  );
  const meta = object(properties.meta, "metadados");
  const units = object(meta.units, "unidades");
  if (units.air_temperature !== "celsius" || units.wind_speed !== "m/s") {
    throw new Error("Previsão inválida: unidades de temperatura ou vento.");
  }
  const updatedMs = timestamp(meta.updated_at, "atualização");
  if (
    nowMs - updatedMs > FORECAST_MAX_AGE ||
    updatedMs - nowMs > FORECAST_FUTURE_TOLERANCE
  ) {
    throw new Error(
      "A previsão fornecida está desatualizada ou tem data inválida.",
    );
  }
  if (
    !Array.isArray(properties.timeseries) ||
    properties.timeseries.length < 4
  ) {
    throw new Error("A previsão não contém horários suficientes.");
  }

  const candidates: Array<WeatherPeriod & { milliseconds: number }> = [];
  let previous = -Infinity;
  for (const raw of properties.timeseries) {
    const entry = object(raw, "horário");
    const milliseconds = timestamp(entry.time, "horário");
    if (milliseconds <= previous)
      throw new Error("Previsão inválida: ordem dos horários.");
    previous = milliseconds;
    if (milliseconds <= nowMs) continue;
    const data = object(entry.data, "dados");
    const details = object(
      object(data.instant, "instante").details,
      "detalhes",
    );
    const temperature = number(
      details.air_temperature,
      "temperatura",
      -100,
      65,
    );
    const wind = number(details.wind_speed, "vento", 0, 150);
    const symbol = symbolFor(data);
    if (symbol === null) continue;
    candidates.push({
      time: new Date(milliseconds).toISOString(),
      temperature,
      windKmh: wind * 3.6,
      symbol,
      milliseconds,
    });
  }

  const used = new Set<number>();
  const periods: WeatherPeriod[] = [];
  for (const offset of [0, 6, 12, 18]) {
    const target = nowMs + offset * HOUR;
    const closest = candidates
      .filter((entry) => !used.has(entry.milliseconds))
      .reduce<(typeof candidates)[number] | undefined>(
        (best, entry) =>
          !best ||
          Math.abs(entry.milliseconds - target) <
            Math.abs(best.milliseconds - target)
            ? entry
            : best,
        undefined,
      );
    if (
      !closest ||
      Math.abs(closest.milliseconds - target) > PERIOD_TOLERANCE
    ) {
      throw new Error("A previsão não cobre as próximas 18 horas.");
    }
    used.add(closest.milliseconds);
    const { milliseconds: _milliseconds, ...period } = closest;
    periods.push(period);
  }
  return { updatedAt: new Date(updatedMs).toISOString(), periods };
}

function storage(): Storage | null {
  try {
    return typeof localStorage === "undefined" ? null : localStorage;
  } catch {
    return null;
  }
}

function readCache(key: string, now: number): WeatherForecast | null {
  try {
    const saved = storage()?.getItem(key);
    if (!saved) return null;
    const cached = object(JSON.parse(saved), "cache");
    if (
      cached.version !== CACHE_VERSION ||
      typeof cached.expiresAt !== "number" ||
      !Number.isFinite(cached.expiresAt) ||
      cached.expiresAt <= now
    ) {
      return null;
    }
    return normalizeWeather(cached.payload, now);
  } catch {
    // Corrupt, stale or inaccessible local data never prevents a fresh request.
    return null;
  }
}

/** Uses a simple cross-origin GET; the caller owns cancellation and timeouts. */
export async function fetchWeather(
  city: WeatherCity,
  signal?: AbortSignal,
  endpoint = "https://api.met.no/weatherapi/locationforecast/2.0/compact",
): Promise<WeatherForecast> {
  number(city.lat, "latitude", -90, 90);
  number(city.lon, "longitude", -180, 180);
  if (signal?.aborted)
    throw (
      signal.reason ?? new DOMException("Operação cancelada.", "AbortError")
    );
  const latitude = city.lat.toFixed(4);
  const longitude = city.lon.toFixed(4);
  const cacheKey = `atl:weather:v${CACHE_VERSION}:${city.id}:${latitude}:${longitude}`;
  const cached = readCache(cacheKey, Date.now());
  if (cached) return cached;

  const response = await fetch(`${endpoint}?lat=${latitude}&lon=${longitude}`, {
    signal,
  });
  if (!response.ok)
    throw new Error(
      `Previsão indisponível no momento (HTTP ${response.status}).`,
    );
  const payload: unknown = await response.json();
  const now = Date.now();
  const forecast = normalizeWeather(payload, now);
  let providerExpires = NaN;
  try {
    const expires = response.headers.get("Expires");
    if (expires) providerExpires = Date.parse(expires);
  } catch {
    // Expires may not be exposed by the provider's cross-origin response.
  }
  const expiresAt = Math.max(
    now + CACHE_MIN_TTL,
    Number.isFinite(providerExpires) ? providerExpires : 0,
  );
  try {
    storage()?.setItem(
      cacheKey,
      JSON.stringify({ version: CACHE_VERSION, expiresAt, payload }),
    );
  } catch {
    // Browsing still works when private mode or storage quotas prevent caching.
  }
  return forecast;
}
