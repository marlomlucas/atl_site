# Pesquisa de referências e melhorias para a ATL

Data: 19/10/2026, America/Sao_Paulo.

Este diagnóstico precede a [revisão visual da mesma data](revisao-visual-2026-10-19.md). As observações sobre tamanhos de fonte e a paleta descrevem o estado anterior; a revisão posterior já ampliou a leitura e ajustou as cores. As demais propostas de estrutura e conteúdo continuam como recomendações.

## Resultado e limites

Foi revisado o código atual da ATL e foram consultadas referências técnicas oficiais acessíveis no GitHub. Os seis sites indicados retornaram bloqueio do proxy antes da obtenção de conteúdo. A comparação competitiva permanece pendente: este relatório não atribui layouts, funcionalidades, textos ou padrões a páginas que não puderam ser inspecionadas.

| Site solicitado | Acesso nesta execução | Conteúdo e aparência |
| --- | --- | --- |
| https://www.qualitor.com.br/ | CONNECT 403 | Não inspecionados |
| https://www.processor.com.br/ | CONNECT 403 | Não inspecionados |
| http://infoteam.com.br/ | HTTP 403 “Domain forbidden”; HTTPS também CONNECT 403 | Não inspecionados |
| https://cegconsultoria.com.br/ | CONNECT 403 | Não inspecionados |
| https://constat.com.br/ | CONNECT 403 | Não inspecionados |
| https://www.sispro.com.br/ | CONNECT 403 | Não inspecionados |

Também não foi possível realizar uma busca geral em um mecanismo de pesquisa: não há ferramenta de busca web habilitada nesta sessão. Os portais diretos de web.dev, Google Search e W3C foram bloqueados. As referências oficiais citadas abaixo foram obtidas pelos respectivos repositórios públicos no GitHub; isso permitiu fundamentar recomendações técnicas, mas não substitui a análise atual dos concorrentes.

Os seis domínios solicitados e `web.dev`, `developers.google.com` e `www.w3.org` foram adicionados ao rascunho de rede, preservando os destinos já existentes do Radar. Esse salvamento não aplica o acesso à máquina. Após salvar as configurações, repetir os acessos e inspecionar também as versões móveis; ampliar a lista apenas se redirecionamentos ou recursos necessários demonstrarem novos destinos.

## O que a ATL já tem

- Proposta inicial, quatro serviços, processo de trabalho, trajetória do fundador, dúvidas frequentes e contato.
- WhatsApp e e-mail reais, LinkedIn e GitHub informados por Marlom C. Lucas.
- HTML estático, fontes locais e carregamento dos painéis de mercado sob interação.
- Elementos de acessibilidade: link de pular conteúdo, rótulos, foco visível, navegação por teclado e preferência de movimento reduzido.
- Radar com fontes identificadas e tratamento de indisponibilidade. A validação de dados ao vivo continua pendente conforme `docs/radar-do-dia.md`.

Essas observações vêm dos arquivos do projeto. Não foram coletadas métricas de audiência, taxas de contato ou resultados comerciais; os benefícios das propostas são hipóteses a avaliar depois da publicação.

## Melhorias prioritárias

| Prioridade | Melhoria | Evidência no site atual | Aplicação proposta |
| --- | --- | --- | --- |
| Alta | Páginas próprias de serviços | Há apenas `src/pages/index.astro`; todos os cards direcionam a `#contato` | Criar páginas de sistemas, sites, aplicativos e consultoria com problemas atendidos, entregáveis e contato relacionado |
| Alta | Projetos demonstráveis | Não há seção de projetos ou estudos de caso | Apresentar trabalhos reais autorizados, projetos próprios ou acadêmicos identificados; o site ATL pode ser um primeiro projeto explicado |
| Alta | Jornada comercial mais clara | O Radar aparece antes da seção de soluções | Mostrar serviços e evidências antes do painel completo; manter acesso direto ao Radar e considerar uma página própria `/radar` |
| Alta | Contato com contexto | Os quatro serviços chegam ao mesmo bloco e à mesma mensagem genérica de WhatsApp | Oferecer “Conversar sobre um sistema”, “Planejar meu site” etc., com assunto ou mensagem inicial correspondente |
| Média | Conteúdo útil sobre TI | Não há artigos ou guias | Publicar materiais assinados pelo fundador, voltados às dúvidas de quem contrata tecnologia |
| Média | SEO e compartilhamento | Há título, descrição e OG textual; faltam domínio configurado, canonical, og:url e imagem social | Definir domínio; configurar URLs absolutas, imagem de compartilhamento e metadados por página; gerar sitemap com a expansão das páginas |
| Média | Explicar o pós-entrega | As perguntas frequentes não detalham esse tema | Informar documentação, treinamento, garantia e manutenção conforme a oferta e os contratos que forem definidos |
| Média | Transparência e medição | Não há página de privacidade nem medição própria de resultados | Explicar provedores externos e armazenamento local; escolher uma medição mínima de acessos e cliques de contato, sem capturar conteúdo das mensagens |

### 1. Detalhar os quatro serviços

Cada página pode responder: qual problema resolve, para quem serve, como começa, o que pode ser entregue e qual é o próximo passo. O escopo deve ser combinado por projeto; os exemplos abaixo são uma proposta editorial, não novas promessas contratuais.

- **Sistemas sob medida:** organizar fluxos, automatizar tarefas repetitivas e integrar ferramentas. Mostrar um exemplo de fluxo antes/depois, sem resultados numéricos inventados.
- **Sites:** presença institucional, páginas de campanha, conteúdo, desempenho e experiência móvel. Explicar as diferenças de escopo e o que o cliente precisa fornecer.
- **Aplicativos:** objetivo, público, primeira versão, plataformas, integrações e evolução. Evitar estimativas de preço e prazo antes de entender o projeto.
- **Consultoria:** entender o cenário, avaliar alternativas e produzir um plano técnico compatível com a necessidade. Definir com Marlom os entregáveis antes de anunciá-los.

As páginas tornam a oferta mais compreensível e fornecem destinos específicos para buscas e campanhas. Isso não garante posições no Google ou aumento de contatos.

### 2. Construir confiança com evidências reais

A ATL está começando e seu fundador tem 20 anos de experiência em tecnologia. A apresentação deve manter essa distinção.

Um projeto publicado pode ter cinco partes: contexto, desafio, participação de Marlom/ATL, solução e resultado verificável. Na ausência de autorização para trabalhos anteriores, usar demonstrações próprias identificadas como tal. Para o próprio site ATL, é possível explicar objetivos, decisões de acessibilidade, arquitetura e limites das integrações externas.

Logos, depoimentos, certificações, métricas e nomes de clientes exigem material verdadeiro e autorização apropriada. Projetos demonstrativos devem permanecer claramente identificados, sem aparência de contratação inexistente.

### 3. Atender duas jornadas na página inicial

O Radar atende a consulta recorrente. A apresentação de serviços atende à contratação. Uma estrutura proposta é:

1. Proposta de valor e contato.
2. Serviços e exemplos de necessidades atendidas.
3. Projetos ou demonstrações reais.
4. Processo de trabalho.
5. Fundador e experiência.
6. Resumo do Radar com acesso ao painel completo.
7. Dúvidas frequentes e contato.

Um atalho “Radar do dia” no menu preserva o acesso rápido de visitantes recorrentes. A decisão sobre sua posição deve considerar, depois, uso do Radar e cliques comerciais. A relação entre visitas ao Radar e oportunidades para a ATL ainda não foi medida.

### 4. Conteúdo recorrente ligado à oferta

Sugestões de primeiros artigos, com autoria e data de revisão:

- “Sistema pronto ou sob medida: como escolher?”
- “Quando integrar planilhas e sistemas?”
- “O que preparar antes de contratar um site?”
- “O que entra no custo de manutenção de um site?”
- “Como planejar a primeira versão de um aplicativo?”

Também cabem checklists curtos e exemplos explicados. Uma frequência sustentável de publicação e atualização depende da disponibilidade do fundador. A utilidade do conteúdo deve ser acompanhada por leitura, procura por serviços e contatos, além do volume de visitas.

## Melhorias técnicas fundamentadas

### Desempenho

Manter o HTML estático, as fontes locais e os widgets sob interação. No domínio publicado, acompanhar os indicadores de referência: **LCP até 2,5 s, INP até 200 ms e CLS até 0,1**, considerando também as interações com o Radar. São metas de referência, não resultados medidos na ATL.

Fonte oficial consultada: [GoogleChrome/web-vitals — rating thresholds](https://github.com/GoogleChrome/web-vitals#rating-thresholds). O arquivo antigo do repositório arquivado de web.dev que ainda menciona FID não foi usado como referência atual.

### SEO e compartilhamento

Definir o domínio antes de configurar `site` no Astro e URLs canônicas. Criar imagem de compartilhamento para WhatsApp/LinkedIn e títulos/descrições específicos para as páginas de serviços e artigos. Dados estruturados de organização podem descrever apenas informações reais da ATL; a apresentação em resultados de busca depende do mecanismo.

O canonical indica a URL preferencial ao mecanismo de pesquisa; ele não substitui conteúdo e estrutura. Fonte oficial consultada: [Google Lighthouse — auditoria de canonical](https://github.com/GoogleChrome/lighthouse/blob/main/core/audits/seo/canonical.js).

O sitemap pode acompanhar o crescimento do site. Sua ausência em uma página única não deve ser tratada como um problema de gravidade equivalente a conteúdo sem clareza ou navegação quebrada.

### Acessibilidade e leitura

Complementar os testes existentes com uso manual por teclado, leitor de tela, zoom de 200% e reflow em 320 CSS px. Verificar alvos de interação e espaçamento, em especial os links menores. As WCAG 2.2 AA têm critério de 24×24 CSS px com exceções; 44 px pode ser uma meta de conforto, sem confundir os dois valores.

Textos do corpo usam `clamp(14px, …, 16px)` e vários controles usam 13px. Aumentar a legibilidade merece revisão visual; não existe uma regra geral WCAG impondo fonte mínima de 16px.

Fontes oficiais consultadas:

- [W3C — tamanho mínimo do alvo](https://github.com/w3c/wcag/blob/main/understanding/22/target-size-minimum.html).
- [W3C — reflow](https://github.com/w3c/wcag/blob/main/understanding/21/reflow.html).
- [W3C — redimensionamento de texto](https://github.com/w3c/wcag/blob/main/understanding/20/resize-text.html).

## Roteiro sugerido

1. **Preparação comercial:** definir o público prioritário, detalhar os serviços, orientar os contatos e selecionar material demonstrável.
2. **Estrutura:** criar páginas de serviços/projetos, ajustar a ordem da home e decidir a apresentação resumida do Radar.
3. **Publicação:** definir domínio, hospedagem, metadados, compartilhamento, privacidade e validar os provedores reais do Radar.
4. **Evolução:** publicar conteúdo útil, acompanhar desempenho e contatos e ajustar a estrutura com evidências de uso.

Pontos que dependem do fundador: público prioritário, alcance geográfico real, projetos publicáveis, condições de manutenção/suporte, disponibilidade editorial e domínio. Porto Alegre foi escolhida como cidade do tempo; isso não estabelece, por si só, a localização ou a área de atendimento da empresa.

## Comparação a concluir após liberar a rede

Para cada um dos seis sites, registrar com URL e evidência: proposta da primeira tela, agrupamento de serviços/produtos, públicos ou setores, projetos e provas, conteúdo recorrente, ação principal de contato, navegação móvel e obstáculos encontrados. Separar observação de interpretação e considerar diferenças entre empresas de produto, consultorias e prestadoras de serviços.

Nenhuma alteração na aplicação foi feita nesta etapa. Este documento registra recomendações e o trabalho que ainda depende do acesso aos sites indicados.
