export const MARKET_PANELS = {
  moedas: {
    title: "Moedas em reais",
    description:
      "Dólar americano, euro e peso chileno. Cada par mostra o valor de uma unidade da moeda em reais.",
    sourceUrl: "https://br.tradingview.com/markets/currencies/",
    groups: [
      {
        name: "Moedas · BRL por unidade",
        symbols: [
          { name: "FX_IDC:USDBRL", displayName: "Dólar americano / Real" },
          { name: "FX_IDC:EURBRL", displayName: "Euro / Real" },
          { name: "FX_IDC:CLPBRL", displayName: "Peso chileno / Real" },
        ],
      },
    ],
  },
  cripto: {
    title: "Criptomoedas em dólar",
    description:
      "Bitcoin, Ethereum, Solana, XRP e Litecoin. Pares em USD, sem conversão para reais.",
    sourceUrl: "https://br.tradingview.com/markets/cryptocurrencies/",
    groups: [
      {
        name: "Criptomoedas · USD por unidade",
        symbols: [
          { name: "BITSTAMP:BTCUSD", displayName: "Bitcoin / USD" },
          { name: "BITSTAMP:ETHUSD", displayName: "Ethereum / USD" },
          { name: "COINBASE:SOLUSD", displayName: "Solana / USD" },
          { name: "BITSTAMP:XRPUSD", displayName: "XRP / USD" },
          { name: "BITSTAMP:LTCUSD", displayName: "Litecoin / USD" },
        ],
      },
    ],
  },
  commodities: {
    title: "Commodities e metais",
    description:
      "Metais, energia e agricultura. Os preços não são comparáveis entre si: cada instrumento tem sua moeda, unidade e mercado de referência.",
    sourceUrl: "https://br.tradingview.com/markets/futures/",
    groups: [
      {
        name: "Metais e energia · referências em USD",
        symbols: [
          { name: "TVC:GOLD", displayName: "Ouro · USD/onça troy" },
          { name: "TVC:SILVER", displayName: "Prata · USD/onça troy" },
          {
            name: "COMEX:HG1!",
            displayName: "Cobre futuro · COMEX · USD/libra",
          },
          { name: "TVC:USOIL", displayName: "Petróleo WTI · USD/barril" },
          { name: "TVC:UKOIL", displayName: "Petróleo Brent · USD/barril" },
        ],
      },
      {
        name: "Agricultura · futuros CBOT · centavos de USD/bushel",
        symbols: [
          {
            name: "CBOT:ZS1!",
            displayName: "Soja futura · CBOT · ¢USD/bushel",
          },
          {
            name: "CBOT:ZC1!",
            displayName: "Milho futuro · CBOT · ¢USD/bushel",
          },
        ],
      },
    ],
  },
} as const;

export type MarketPanelId = keyof typeof MARKET_PANELS;

export const MARKET_WIDGET_SCRIPT =
  "https://s3.tradingview.com/external-embedding/embed-widget-market-quotes.js";

export function marketWidgetConfig(id: MarketPanelId) {
  return {
    width: "100%",
    height: "100%",
    symbolsGroups: MARKET_PANELS[id].groups,
    showSymbolLogo: true,
    isTransparent: true,
    colorTheme: "dark",
    locale: "br",
  };
}
