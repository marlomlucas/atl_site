# Direção criativa — ATL

Base: referências visuais fornecidas pelo fundador, escopo inicial informado e princípios de design e acessibilidade. A empresa está começando; sua atuação principal é desenvolvimento de software, sistemas, sites, aplicativos e consultoria de TI.

Nome de apresentação adotado com base na resposta do fundador: **ATL Soluções em Tecnologia**. A assinatura mantém ATL em destaque e usa o descritor para esclarecer a atuação sem limitar a empresa a um único tipo de produto. A apresentação profissional identifica **Marlom C. Lucas — Engenheiro de Software | Consultoria e Desenvolvimento de Sistemas**, com os canais de contato e perfis públicos fornecidos por ele. O WhatsApp é a ação principal; e-mail e resumo do projeto oferecem caminhos complementares.

## Alcance da pesquisa

Em 18/10/2026, no fuso do cliente, foram tentados acessos HTTPS às fontes abaixo. O proxy deste ambiente retornou `403 Forbidden` antes da conexão. Portanto, **não houve auditoria dos sites atuais, comparação de seus layouts ou levantamento quantitativo de mercado**. Os endereços são referências sugeridas para uma revisão futura; as recomendações seguintes são uma proposta para a ATL, não resultados de pesquisa externa recente.

| Referência sugerida | O que observar em uma revisão futura                                                       | Link oficial                  |
| ------------------- | ------------------------------------------------------------------------------------------ | ----------------------------- |
| Thoughtworks        | Como uma consultoria relaciona tecnologia a problemas de negócio e comprova competência    | https://www.thoughtworks.com/ |
| CI&T                | Clareza de serviços e linguagem para quem contrata desenvolvimento e transformação digital | https://ciandt.com/br/pt-br   |
| Cheesecake Labs     | Comunicação de serviços de produto, aplicativos e desenvolvimento                          | https://cheesecakelabs.com/   |
| Vercel              | Hierarquia tipográfica, explicação técnica e apresentação de interfaces                    | https://vercel.com/           |
| Linear              | Consistência visual e demonstração de produto                                              | https://linear.app/           |

Vercel e Linear são empresas de produto; sua estética pode inspirar a apresentação, mas a ATL precisa comunicar uma prestação de serviço. Na análise competitiva futura, separar qualidade visual de evidências comerciais: serviço oferecido, público atendido, processo, resultados verificáveis e facilidade de contato.

## Posicionamento e conteúdo

A proposta inicial é **desenvolvimento próximo do cliente, com rigor técnico e atenção ao negócio**. Usar linguagem acessível a quem decide a contratação, sem exigir familiaridade com ferramentas de programação.

- Apresentar sistemas sob medida, sites, aplicativos e consultoria como quatro portas de entrada claras.
- A primeira tela deve explicar o que a ATL faz e oferecer um caminho para conversar sobre um projeto.
- Organizar a página em proposta de valor, serviços, processo de trabalho, apresentação do fundador e contato.
- Deixar tecnologias em posição de apoio. A faixa de ícones enviada pelo fundador é uma referência de repertório técnico; não deve substituir a explicação dos benefícios para o cliente.
- Usar a trajetória real: fundador graduado em Engenharia de Software, formado em Técnico em Informática e com 20 anos de atuação em tecnologia. Essa experiência pertence ao fundador, não à idade da empresa.
- Reservar espaço para projetos e depoimentos quando existirem materiais autorizados. Não inventar clientes, volume de entregas, tamanho da equipe, avaliações ou resultados.
- Apresentar qualquer tela conceitual como demonstração visual, sem sugerir que é um produto entregue a um cliente.

Evitar promessas genéricas de transformação e diferenciais que qualquer empresa poderia afirmar. Clareza de escopo, comunicação e um processo explicado podem construir confiança enquanto a empresa forma seu portfólio.

## Cores e identidade

**Direção atual: modelo 03**, aprovado em 19/10/2026, America/Sao_Paulo. A página combina seções claras e escuras para ampliar o conforto de leitura, preservando a marca ATL em dourado e o símbolo de código verde. Veja a [especificação completa do modelo 03](modelo-03.md), com paletas, escopos CSS e critérios de contraste.

A direção predominantemente escura anterior foi substituída no quesito paleta. Seus valores, cálculos e resultados permanecem no [registro histórico da revisão visual](revisao-visual-2026-10-19.md); não devem orientar novas cores nem ser lidos como validação do modelo atual.

| Aplicação | Tema |
| --- | --- |
| Cabeçalho, navegação, hero, processo, cartão da experiência do fundador, painel de contato e rodapé | Escuro |
| Faixa de apresentação, interface externa do Radar, serviços, empresa/fundador, FAQ e briefing | Claro |

| Papel | Escuro | Claro |
| --- | --- | --- |
| Fundo principal | `#1B2723` | `#F2F5EF` |
| Superfície/cartões | `#2D4138` | `#FFFFFF` |
| Texto principal | `#F4F7EE` | `#18392B` |
| Texto secundário | `#CBD6CD` | `#4D6658` |
| Dourado/bronze | `#E8C780` | `#795A18` |
| Verde de ação | `#4FC58C` | `#166B45` |
| Texto sobre botão verde | `#0F2A1B` | `#FFFFFF` |
| Borda de controles | `#95AB9C` | `#688773` |

O dourado destaca a identidade e os elementos importantes; o verde identifica ações, links e elementos de tecnologia. As classes `.theme-light` e `.theme-dark` definem tokens locais para textos, superfícies, botões e foco. Áreas claras podem usar `#E7EFE5` em faixas e `#EEF5EB` em cartões secundários. O contato admite um gradiente discreto entre `#1B3226` e `#2D4A38`. Evitar excesso de gradientes, brilho e transparências.

Texto comum deve atingir 4,5:1; textos grandes e elementos de interface aplicáveis, 3:1. Nas superfícies escuras, botões verdes claros ou dourados recebem texto escuro. Nas áreas claras, botões verdes escuros recebem texto branco, e textos dourados usam o bronze `#795A18`. Dourado claro sobre branco e branco sobre verde claro não oferecem contraste suficiente. O foco precisa continuar visível em cada tema, inclusive em cartões de tema diferente da seção. As divisórias decorativas não substituem bordas de controles.

O Radar tem interface externa clara e pode conter o painel incorporado do TradingView em tema escuro. Os iframes pertencem ao provedor e não devem ter o conteúdo interno alterado. As integrações reais ainda dependem da validação descrita na [documentação do Radar](radar-do-dia.md).

## Tipografia

**Manrope para títulos e Inter para corpo e controles**, hospedadas junto da aplicação. Manrope oferece presença geométrica nos títulos; Inter mantém boa leitura em parágrafos, menus e formulários. Ambas têm desenho contemporâneo sem depender de uma aparência de terminal.

- Usar poucas variações de peso e carregar apenas as necessárias.
- Usar texto corrido e controles principais em 16 px, navegação em 14 px e metadados úteis em 13 px, com entrelinha confortável e parágrafos com largura controlada. A assinatura compacta e os detalhes da ilustração têm exceções; esses detalhes decorativos não carregam informações essenciais.
- Evitar caixa alta em frases longas; pequenas etiquetas podem usar espaçamento moderado.
- Usar números e termos técnicos com parcimônia. Fonte monoespaçada pode aparecer em pequenos detalhes, sem dominar o site empresarial.
- Hospedar arquivos localmente reduz dependência de serviços externos na navegação; preservar as licenças distribuídas com os pacotes.

Referências sugeridas: [Manrope no Google Fonts](https://fonts.google.com/specimen/Manrope), [Inter — site do projeto](https://rsms.me/inter/) e [Fontsource](https://fontsource.org/). A escolha é uma recomendação de projeto; os sites não foram auditados nesta sessão.

## Responsividade e qualidade

A primeira versão deve funcionar com conteúdo real e navegação por teclado, do celular ao desktop. Dar prioridade a hierarquia clara, áreas de toque confortáveis, menu móvel utilizável, leitura sem rolagem horizontal e respeito a `prefers-reduced-motion`.

Evitar efeitos que comprometam carregamento ou leitura. Imagens devem ter dimensões definidas e texto alternativo adequado; ícones decorativos devem ficar fora da leitura assistiva. Formulários precisam de rótulos e mensagens compreensíveis, com destino de envio real antes de serem apresentados como funcionais.

Revisar a implementação em larguras móveis e desktop, confirmar foco e ordem de navegação, executar a compilação e verificar links. A validação final de acessibilidade e desempenho deve ser feita sobre a página implementada, não inferida apenas desta paleta.
