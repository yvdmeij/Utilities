import type { RateSource } from './i18n.svelte';

// English names and signs are hardcoded fallbacks; the dropdown shows localized
// names via Intl.DisplayNames. A currency only appears if the active source has a rate.
export const CURRENCIES: Record<string, string> = {
  AUD: 'Australian Dollar',
  BGN: 'Bulgarian Lev',
  BRL: 'Brazilian Real',
  CAD: 'Canadian Dollar',
  CHF: 'Swiss Franc',
  CNY: 'Chinese Yuan',
  CZK: 'Czech Koruna',
  DKK: 'Danish Krone',
  EUR: 'Euro',
  GBP: 'British Pound',
  HKD: 'Hong Kong Dollar',
  HUF: 'Hungarian Forint',
  IDR: 'Indonesian Rupiah',
  ILS: 'Israeli Shekel',
  INR: 'Indian Rupee',
  ISK: 'Icelandic Króna',
  JPY: 'Japanese Yen',
  KRW: 'South Korean Won',
  MXN: 'Mexican Peso',
  MYR: 'Malaysian Ringgit',
  NOK: 'Norwegian Krone',
  NZD: 'New Zealand Dollar',
  PHP: 'Philippine Peso',
  PLN: 'Polish Złoty',
  RON: 'Romanian Leu',
  SEK: 'Swedish Krona',
  SGD: 'Singapore Dollar',
  THB: 'Thai Baht',
  TRY: 'Turkish Lira',
  USD: 'US Dollar',
  ZAR: 'South African Rand',
};

export const CURRENCY_SIGNS: Record<string, string> = {
  AUD: 'A$',
  BGN: 'лв',
  BRL: 'R$',
  CAD: 'C$',
  CHF: 'CHF',
  CNY: '¥',
  CZK: 'Kč',
  DKK: 'kr',
  EUR: '€',
  GBP: '£',
  HKD: 'HK$',
  HUF: 'Ft',
  IDR: 'Rp',
  ILS: '₪',
  INR: '₹',
  ISK: 'kr',
  JPY: '¥',
  KRW: '₩',
  MXN: '$',
  MYR: 'RM',
  NOK: 'kr',
  NZD: 'NZ$',
  PHP: '₱',
  PLN: 'zł',
  RON: 'lei',
  SEK: 'kr',
  SGD: 'S$',
  THB: '฿',
  TRY: '₺',
  USD: '$',
  ZAR: 'R',
};

export interface RateData {
  rateDate: string;
  /** Units of each currency per one unit of the source's base currency. */
  rates: Record<string, number>;
}

interface SdmxSeries {
  attributes: number[];
  observations: Record<string, [string]>;
}

// Norges Bank quotes NOK per 1 (or per 100) units of each currency, and a series
// can be dead (RUB, HRK, BGN) with an observation months or years old. Turn that
// into units of currency per 1 NOK, keeping only series that are current.
// biome-ignore lint/suspicious/noExplicitAny: raw SDMX-JSON payload
function parseNorgesBank(json: any): RateData {
  const structure = json.data.structure;
  const baseCodes: string[] = structure.dimensions.series[1].values.map(
    (v: { id: string }) => v.id,
  );
  const dates: string[] = structure.dimensions.observation[0].values.map(
    (v: { id: string }) => v.id,
  );
  const attrs = structure.attributes.series as {
    id: string;
    values: { id: string }[];
  }[];
  const multIdx = attrs.findIndex((a) => a.id === 'UNIT_MULT');
  const series = json.data.dataSets[0].series as Record<string, SdmxSeries>;

  const latest: Record<string, { date: string; perNok: number }> = {};
  let newest = '';
  for (const [key, s] of Object.entries(series)) {
    const code = baseCodes[Number(key.split(':')[1])];
    if (!(code in CURRENCIES)) continue;
    const [obsIdx, [value]] = Object.entries(s.observations)[0];
    const date = dates[Number(obsIdx)];
    const mult = Number(attrs[multIdx].values[s.attributes[multIdx]].id);
    const nokPerUnit = Number.parseFloat(value) / 10 ** mult;
    if (!(nokPerUnit > 0)) continue;
    latest[code] = { date, perNok: 1 / nokPerUnit };
    if (date > newest) newest = date;
  }

  const cutoff = new Date(`${newest}T00:00:00Z`).getTime() - 7 * 86400000;
  const rates: Record<string, number> = { NOK: 1 };
  for (const [code, { date, perNok }] of Object.entries(latest)) {
    if (new Date(`${date}T00:00:00Z`).getTime() >= cutoff) rates[code] = perNok;
  }
  return { rateDate: newest, rates };
}

function onlyKnown(rates: Record<string, number>): Record<string, number> {
  return Object.fromEntries(
    Object.entries(rates).filter(([c]) => c in CURRENCIES),
  );
}

const FETCHERS: Record<RateSource, (res: Response) => Promise<RateData>> = {
  // open.er-api.com — updates once per day, including weekends. Terms require attribution.
  erapi: async (res) => {
    const data = await res.json();
    if (data.result !== 'success') throw new Error('ExchangeRate-API error');
    const rateDate = new Date(data.time_last_update_unix * 1000)
      .toISOString()
      .slice(0, 10);
    return { rateDate, rates: onlyKnown({ ...data.rates, USD: 1 }) };
  },
  norgesbank: async (res) => parseNorgesBank(await res.json()),
};

const URLS: Record<RateSource, string> = {
  erapi: 'https://open.er-api.com/v6/latest/USD',
  norgesbank:
    'https://data.norges-bank.no/api/data/EXR/B..NOK.SP?format=sdmx-json&lastNObservations=1&locale=en',
};

/**
 * Fetch the latest rates from a source. `fresh` bypasses the browser's HTTP cache so
 * a manual refresh really asks the server again.
 */
export async function fetchRates(
  source: RateSource,
  fresh = false,
): Promise<RateData> {
  // Guard against a hung connection leaving us stuck on the loading state.
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), 8000);
  try {
    const res = await fetch(URLS[source], {
      signal: controller.signal,
      cache: fresh ? 'no-store' : 'default',
    });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const data = await FETCHERS[source](res);
    if (!data.rateDate || Object.keys(data.rates).length === 0)
      throw new Error('No rates');
    return data;
  } finally {
    clearTimeout(timer);
  }
}
