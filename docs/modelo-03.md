# Modelo 03 — identidade visual da ATL

Data: 19/10/2026, America/Sao_Paulo.

Esta é a direção visual atual da ATL Soluções em Tecnologia. A composição combina áreas claras e escuras para deixar a leitura mais confortável, preservando o verde e o dourado da marca existente. Substitui a paleta predominantemente escura da [revisão visual anterior](revisao-visual-2026-10-19.md). Os fatos e resultados daquela revisão permanecem como histórico.

## Distribuição dos temas

| Área | Tema e aplicação |
| --- | --- |
| Cabeçalho, navegação e menu móvel | Escuro; a marca e os controles mantêm leitura sobre o fundo verde escuro |
| Hero e ilustração conceitual | Escuro; dourado nos destaques e verde nas ações |
| Faixa de apresentação após o hero | Claro; transição para as áreas de consulta e conteúdo |
| Radar do dia | Claro na interface externa, abas, previsão, mensagens e controles; o widget financeiro pode continuar escuro |
| Soluções e serviços | Claro; cartões brancos e destaque sem reduzir o contraste do texto |
| Abordagem/processo | Escuro; continuidade da identidade entre as áreas claras |
| Empresa e fundador | Claro; o cartão dos aproximadamente 20 anos de experiência do fundador permanece escuro |
| Perguntas frequentes | Claro, incluindo perguntas abertas e fechadas |
| Painel principal de contato | Escuro; gradiente discreto permitido |
| Rodapé | Escuro |
| Formulário/modal de briefing | Claro, incluindo campos, rótulos, validação e mensagens |

A experiência pertence a Marlom C. Lucas; não representa o tempo de existência da ATL. Mantêm-se o conteúdo comercial, a ordem geral das seções e as funcionalidades existentes, sem criar clientes, depoimentos, números comerciais ou novas páginas.

## Paleta aprovada

| Papel | Tema escuro | Tema claro |
| --- | --- | --- |
| Fundo principal | `#1B2723` | `#F2F5EF` |
| Superfície/cartões | `#2D4138` | `#FFFFFF` |
| Texto principal | `#F4F7EE` | `#18392B` |
| Texto secundário | `#CBD6CD` | `#4D6658` |
| Dourado/bronze para texto | `#E8C780` | `#795A18` |
| Verde de ação | `#4FC58C` | `#166B45` |
| Texto no botão verde | `#0F2A1B` | `#FFFFFF` |
| Borda de controles | `#95AB9C` | `#688773` |

Complementos aprovados:

- Verde de hover nas áreas claras: `#0E5638`.
- Faixas claras: `#E7EFE5`.
- Cartões secundários claros: `#EEF5EB`.
- Divisórias decorativas claras: `#CAD8CB`.
- Painel de contato: gradiente discreto de `#1B3226` a `#2D4A38`.

O dourado representa a assinatura e os destaques importantes. O verde identifica ações, links e elementos de tecnologia. Ajustes locais de hover, borda e foco devem preservar essas funções e o contraste. Evitar brilho, neon, transparências excessivas e gradientes que atrapalhem a leitura.

## Organização no código

As superfícies são definidas pelos escopos `.theme-light` e `.theme-dark` em `src/styles/global.css`. Eles sobrescrevem os tokens semânticos compartilhados, como `--bg`, `--surface`, `--surface-subtle`, `--surface-hover`, `--text`, `--muted`, `--gold`, `--green`, `--ink`, `--line`, `--control-border`, `--green-hover` e `--focus`. Assim, texto, links, cartões e controles herdam cores coerentes com a seção onde aparecem.

Ao colocar um cartão escuro dentro de uma seção clara, aplicar o escopo de tema do próprio cartão. Definir também `color-scheme` adequado para os controles nativos. O modal de briefing precisa receber o tema claro explicitamente, pois aparece sobre a página e deve conservar esse tema independentemente do elemento que o abriu.

Novos ajustes devem preferir os tokens do tema a cores fixas espalhadas nos componentes. Bordas de controles e divisórias decorativas têm funções diferentes: uma divisão sutil pode organizar o layout, mas não deve ser a única pista para identificar um campo, botão ou estado selecionado.

Os arquivos principais são `src/pages/index.astro`, `src/styles/global.css`, `src/components/Radar.astro` e os componentes da identidade existente. A implementação mantém Astro, TypeScript e JavaScript somente nas interações necessárias; não adiciona framework, backend, rastreador ou formulário externo.

## Marca e tipografia

Mantêm-se a logo vetorial e os recursos existentes: símbolo de código verde e letras ATL douradas. Não há nova marca nem alteração de identidade comercial.

**Manrope** continua nos títulos e **Inter** nos textos e interfaces, com fontes variáveis locais do subconjunto latino. Os arquivos são servidos pela própria aplicação; não é necessário carregar Google Fonts durante a navegação. Preservam-se as licenças distribuídas com os pacotes.

Textos e controles principais usam 16 px, navegação usa 14 px e metadados úteis usam 13 px, com entrelinha adequada e largura controlada. Títulos têm hierarquia clara. O descritor compacto da marca mantém 10 px (9 px em telas pequenas), e os detalhes decorativos da ilustração permanecem fora da leitura assistiva. Legendas, rótulos e mensagens precisam permanecer legíveis no celular; reduzir as fontes para forçar o conteúdo a caber não resolve problemas de layout.

## Contraste e interação

O critério de projeto é pelo menos 4,5:1 para texto comum e 3:1 para textos grandes e elementos de interface aplicáveis. Estes valores foram calculados localmente com luminância relativa sRGB para cores sólidas e opacas; não constituem auditoria de toda a interface:

| Combinação | Contraste |
| --- | --- |
| Texto escuro `#18392B` / fundo claro `#F2F5EF` | 11,50:1 |
| Texto secundário do tema claro `#4D6658` / cartão branco | 6,26:1 |
| Bronze `#795A18` / cartão branco | 6,39:1 |
| Texto branco / botão verde escuro `#166B45` | 6,52:1 |
| Borda clara `#688773` / fundo claro `#F2F5EF` | 3,60:1 |
| Texto claro `#F4F7EE` / fundo escuro `#1B2723` | 14,24:1 |
| Texto secundário do tema escuro `#CBD6CD` / superfície `#2D4138` | 7,29:1 |
| Texto `#0F2A1B` / botão verde claro `#4FC58C` | 7,09:1 |
| Texto `#0F2A1B` / botão dourado `#E8C780` | 9,44:1 |
| Borda escura `#95AB9C` / superfície `#2D4138` | 4,46:1 |

Dourado claro `#E8C780` sobre branco resulta em 1,63:1 e não deve ser usado como texto. Branco sobre verde claro `#4FC58C` resulta em 2,17:1 e também é insuficiente para texto. Usar texto escuro em botões claros nas seções escuras e branco em botões verdes escuros nas seções claras. Evitar texto verde sobre dourado e dourado sobre verde.

Hover, seleção, carregamento, vazio, erro e foco precisam ser examinados no tema de cada componente. O foco de teclado deve ter contraste visível contra a superfície adjacente, incluindo controles sobre cartões e o modal. Preservam-se o link de pular conteúdo, rótulos, semântica, fechamento e contenção de foco do diálogo, além de `prefers-reduced-motion`.

A revisão responsiva deve considerar de 320 px ao desktop, com atenção a e-mail, temperaturas, unidades, botões, menu móvel e ausência de rolagem horizontal. Os testes manuais locais ficam a cargo do fundador; os resultados das verificações desta implementação devem ser informados na entrega, sem herdar aprovações de revisões anteriores.

## Radar e dados locais

A mudança trata da interface externa do Radar. Preservam-se TradingView, MET Norway, Porto Alegre (RS) como cidade inicial, troca de cidade, cache no navegador, carregamento mediante interação e atribuições. Não são criadas cotações nem previsões para preencher estados vazios.

O painel incorporado do TradingView pode continuar escuro dentro de um contêiner visualmente integrado à seção clara. Não se tenta alterar o conteúdo interno dos iframes de terceiros. Rótulos, moedas, unidades, horários, indicação de contratos futuros, links das fontes e mensagens de indisponibilidade permanecem necessários.

As integrações ao vivo **ainda não estão validadas**: verificações anteriores encontraram bloqueios de rede, e testes com respostas simuladas não confirmam conectividade, disponibilidade dos símbolos ou dados de produção. Os limites e os próximos passos permanecem em [Radar do dia](radar-do-dia.md).

O briefing continua sendo preenchido e baixado localmente como `.txt`. Não há envio automático dos dados. Contatos reais, links de WhatsApp, e-mail, LinkedIn e GitHub são preservados. Não há publicação em produção nesta tarefa.

## Verificações desta implementação

Em 19/10/2026, no Windows com Node.js 24.16.0 e Chrome local:

- `npm.cmd run check`: 17 arquivos Astro, sem erros, avisos ou sugestões.
- `npm.cmd run build`: checagem e geração estática concluídas.
- `npm.cmd run test:e2e`: 32 testes existentes aprovados, incluindo navegação, contatos, briefing, Radar, acessibilidade automática e larguras de 320 a 1440 px.
- Capturas de desktop e celular revisadas; combinações da paleta verificadas por cálculo de contraste.

Os testes do Radar usam respostas simuladas e não validam os dados ao vivo dos provedores. Os testes manuais locais permanecem a cargo do fundador.
