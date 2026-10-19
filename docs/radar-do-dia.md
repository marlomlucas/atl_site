# Radar do dia

O Radar complementa a página institucional com informações de consulta recorrente. Fica abaixo da apresentação inicial, com acesso direto pelo menu; serviços e contato continuam fazendo parte da mesma página.

Na composição atual do [modelo 03](modelo-03.md), a seção e a interface externa do Radar usam o tema claro: abas, controles, mensagens de carregamento, falha e previsão seguem os tokens de `.theme-light`. O widget TradingView pode manter seu painel escuro dentro de um contêiner próprio. Não se modifica o conteúdo dos iframes de terceiros. A mudança visual preserva fontes, unidades, horários, atribuições, cache e carregamento mediante interação; não confirma a disponibilidade dos dados ao vivo.

## Conteúdo e unidades

| Painel               | Conteúdo                                             | Referência                                                                        |
| -------------------- | ---------------------------------------------------- | --------------------------------------------------------------------------------- |
| Moedas               | Dólar americano, euro e peso chileno                 | BRL por uma unidade de USD, EUR ou CLP; não é a cotação inversa                   |
| Criptomoedas         | Bitcoin, Ethereum, Solana, XRP e Litecoin            | Pares em USD, sem conversão para reais nem alegação de ranking por capitalização  |
| Commodities e metais | Ouro, prata, cobre, petróleo WTI/Brent, soja e milho | Cada rótulo identifica a unidade e, quando aplicável, o contrato futuro e a bolsa |
| Minério de ferro     | Consulta direta na SGX                               | Link para a fonte; não há uma cotação incorporada confirmada                      |
| Tempo                | Quatro horários próximos de agora, +6h, +12h e +18h  | Temperatura prevista em °C, vento em km/h e horários locais da cidade             |

Preços futuros, referências de metais e energia e preços de produtos físicos não são equivalentes. Soja e milho CBOT são apresentados em centavos de dólar por bushel. Não converter unidades ou moedas sem uma fonte apropriada. O Radar não atribui um horário próprio de atualização a cotações de terceiros: o painel do provedor informa seus horários, atrasos e disponibilidade.

Porto Alegre (RS) foi confirmada pelo fundador como cidade padrão. A pessoa pode escolher outra entre as cidades disponíveis. A escolha e o cache de previsão ficam no navegador; não há geolocalização automática, cadastro, chave de API pública ou assinatura contratada.

## Mercados: TradingView

Os botões e abas carregam o script oficial `https://s3.tradingview.com/external-embedding/embed-widget-market-quotes.js` apenas mediante interação. Cada painel é montado uma vez por visita. Preservam-se a identificação, os links e a atribuição ao TradingView. O site não extrai nem redistribui os preços em uma API própria.

O [repositório oficial do TradingView](https://github.com/tradingview/awesome-tradingview#tradingview-widgets) apresenta os widgets como produto de incorporação. A documentação específica é [Market quotes](https://www.tradingview.com/widget-docs/en/widgets/watchlists/market-quotes/). O formato da configuração foi corroborado por [uma implementação de terceiros](https://github.com/JorrinKievit/react-ts-tradingview-widgets/blob/main/src/components/MarketData.tsx), que não substitui a documentação oficial.

**Limitação desta execução:** a rede bloqueou o script, a documentação específica e as políticas completas. Nenhum símbolo ou preço ao vivo foi confirmado. Em especial, é necessário validar `FX_IDC:CLPBRL`, a disponibilidade dos futuros nos widgets e eventuais restrições do provedor. A incorporação é uma implementação inicial sujeita a essa validação; não constitui uma afirmação de licença comercial irrestrita. Antes da publicação pública do site, conferir as [políticas do TradingView](https://www.tradingview.com/policies/) e manter toda a atribuição exigida.

Se o script falhar ou não montar o painel, o Radar oferece nova tentativa e consulta na fonte. Se o script montar um iframe, isso comprova apenas a montagem: mensagens de instrumento indisponível, falhas posteriores e atrasos continuam sob controle do provedor. O código não declara que números foram recebidos com base apenas no evento `load`.

## Previsão: MET Norway

Endpoint: `https://api.met.no/weatherapi/locationforecast/2.0/compact` com latitude e longitude limitadas a quatro casas decimais. São feitas requisições GET simples, sem headers personalizados que provoquem preflight.

As fontes oficiais consultadas pelo GitHub foram:

- [Licença dos dados](https://github.com/metno/weatherapi-docs/blob/master/doc/License.md): CC BY 4.0 / NLOD 2.0, permitindo reutilização com atribuição.
- [Termos de serviço](https://github.com/metno/weatherapi-docs/blob/master/doc/TermsOfService.md).
- [Orientação sobre páginas dinâmicas e CORS](https://github.com/metno/weatherapi-docs/blob/master/doc/locationforecast/HowTO.md#dynamic-web-pages-and-cors).

A página mostra “Dados de MET Norway”, link para a fonte e link CC BY 4.0. `updated_at` é a emissão da previsão, e não a hora de abertura da página. Temperaturas são previstas, não observadas. O cache tem intervalo mínimo de 30 minutos e respeita `Expires` quando exposto; dados com emissão superior a 24 horas, datas inválidas, unidades inesperadas ou cobertura insuficiente são rejeitados. Falhas no armazenamento não interrompem a navegação. Ao trocar a cidade, cancela-se a consulta anterior para impedir que uma resposta atrasada substitua a seleção atual.

O uso direto no navegador depende de um domínio público identificável pelo `Origin`, adequado ao tráfego inicial baixo. Em desenvolvimento, `astro.config.mjs` oferece um proxy fechado `/weather-api/locationforecast`, com destino fixo MET Norway, verificação TLS e `User-Agent` identificando a ATL pelo repositório. Isso evita enviar uma origem `localhost` diretamente ao provedor; os testes ainda interceptam a rota local com respostas simuladas. Esse proxy de desenvolvimento não é um endpoint de produção. A configuração de egress da máquina também precisa permitir que o processo do servidor alcance o fornecedor.

Não usar chamadas diretas de `localhost` no build de produção como teste do provedor. Para validar o serviço a partir de um servidor ou para tráfego maior, implementar um proxy de produção com cache e `User-Agent` que identifique a ATL e seu contato, respeitando os termos do provedor. Esse proxy de produção não está implementado no site estático.

A API gratuita de Open-Meteo não foi adotada, pois suas condições restringem o uso comercial/promocional sem plano apropriado.

## Rede e validação

Nesta execução, o proxy do ambiente retornou `CONNECT 403` para os fornecedores. O teste da rota de desenvolvimento identificada retornou HTTP 502, sem resposta de previsão. Foram adicionados ao rascunho, preservando as regras existentes:

- `s3.tradingview.com`
- `www.tradingview-widget.com`
- `api.met.no`

Salvar o rascunho não aplica a rede ao processo atual. As regras precisam ser revisadas e salvas nas configurações do ambiente; a publicação do ambiente é uma etapa separada. Subrecursos do widget podem exigir outros domínios: ampliar somente após observar as requisições concretas bloqueadas, preservando os demais destinos.

`npm run build` valida o site estático. `npm run test:e2e` cobre as interações com respostas simuladas: carregamento sob demanda, parâmetros dos painéis, falha e nova tentativa, previsão, cache, cidade, teclado, responsividade e acessibilidade automática. Esses testes não comprovam conectividade, licença, disponibilidade dos símbolos ou dados de produção. Depois de aplicar a rede, validar os painéis reais e a previsão a partir de uma origem permitida antes de apresentar o Radar como validado ao vivo.
