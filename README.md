# ATL Soluções em Tecnologia — site institucional

Site da ATL Soluções em Tecnologia, fundada por Marlom C. Lucas, voltado a sistemas sob medida, sites, aplicativos e consultoria de TI. O **modelo 03** combina seções claras e escuras, com ATL em dourado e símbolo de código verde. A direção atual está documentada em [modelo 03](docs/modelo-03.md).

## Desenvolvimento

Requer Node.js 24 LTS (ou versão compatível com `engines` no `package.json`) e npm. No Windows, com PowerShell:

```powershell
Set-Location D:\atl_site
npm.cmd run dev
```

Se `node_modules` estiver ausente ou precisar ser sincronizado com o `package-lock.json`, execute `npm.cmd ci` antes de iniciar. Não é necessário reinstalar as dependências a cada execução.

O servidor usa a porta 4321 por padrão. O cache de npm fica em `../.cache/npm`, fora do checkout. Os comandos usam um pequeno script Node para definir a telemetria do Astro sem depender de sintaxe de shell específica do Linux.

```powershell
npm.cmd run check       # Astro e TypeScript
npm.cmd run build       # checagem e geração estática em dist/
npm.cmd run test:e2e    # testes funcionais e de acessibilidade
npm.cmd run preview     # servir o build para validação
```

Os mesmos scripts funcionam com `npm run …` em outros sistemas. Os testes preferem o Chromium gerenciado pelo Playwright, quando disponível. Como alternativa, no Windows procuram uma instalação de Chrome ou Edge. Para escolher outro executável instalado, defina `PLAYWRIGHT_CHROMIUM_EXECUTABLE_PATH`:

```powershell
$env:PLAYWRIGHT_CHROMIUM_EXECUTABLE_PATH = 'C:\caminho\para\chrome.exe'
npm.cmd run test:e2e
```

O Playwright inicia o servidor automaticamente quando necessário. As verificações com respostas simuladas não confirmam os dados ao vivo do Radar. Não é preciso manter o processo vivo entre tarefas.

## Tecnologias e decisões

- **Astro + TypeScript:** HTML estático e JavaScript para menu, resumo de projeto e Radar. Uma página institucional não precisa enviar um framework de aplicação inteiro ao visitante.
- **CSS responsivo:** layout fluido, pontos de quebra para celular/tablet/desktop, foco visível e respeito a movimento reduzido.
- **Manrope + Inter:** fontes variáveis locais, somente o subconjunto latino. Não há solicitações ao Google Fonts durante a navegação.
- **Playwright + axe:** fluxo de navegação, menu, perguntas frequentes, diálogo, download e verificações automáticas de acessibilidade.
- **Sem analytics próprio ou formulário remoto:** o painel inicial de cotações do TradingView carrega automaticamente ao abrir a página. Os demais painéis carregam ao selecionar suas abas; a previsão de MET Norway carrega ao selecionar Tempo. O site não envia o resumo do projeto a esses fornecedores.

## Radar do dia

A página inicial inclui moedas (USD/EUR/CLP em BRL), criptomoedas em USD, commodities/metais e previsão do tempo. Porto Alegre (RS) é a cidade padrão, com opção de troca. Mercados usam widgets TradingView; o clima usa dados atribuídos a MET Norway (CC BY 4.0), com data de emissão e cache. Minério de ferro tem consulta direta na SGX, sem preço incorporado confirmado.

Veja [fontes, unidades e limites da integração](docs/radar-do-dia.md). Há registros de bloqueio do acesso externo nas execuções anteriores: os testes da interface e dos tratamentos de falha usam respostas simuladas, e a disponibilidade dos símbolos e os dados ao vivo ainda precisam de validação em uma origem pública permitida. Não há dados financeiros fictícios ou previsão fixa no HTML do site.

## Contato comercial

Os dados públicos informados pelo fundador estão centralizados em `src/data/company.ts`: nome da empresa, apresentação profissional, e-mail, WhatsApp, LinkedIn e GitHub.

- O botão **Conversar pelo WhatsApp** abre uma conversa com o número **(51) 99470-9009**, no formato internacional `5551994709009`, com uma mensagem inicial editável. O visitante decide se a envia.
- O link de e-mail usa `mailto:marlomlucas@hotmail.com` e abre o aplicativo de e-mail do visitante com assunto preenchido. Não existe envio automático ou confirmação de recebimento.
- LinkedIn e GitHub aparecem junto à apresentação profissional de Marlom C. Lucas.
- A opção de organizar a ideia continua disponível: baixa um arquivo `.txt` com o resumo do projeto, sem transmitir ou persistir as informações na aplicação. O navegador pode restaurar campos ou guardar o arquivo segundo as preferências do visitante.

Para substituir o e-mail no ambiente, sem editar os dados da empresa:

1. Copie `.env.example` para `.env`, preservando um arquivo existente.
2. Defina `PUBLIC_CONTACT_EMAIL` com um e-mail público real da ATL.
3. Reinicie o servidor de desenvolvimento ou execute `npm run build` novamente.

A variável é pública e incluída no HTML; nunca use uma senha ou chave nela. Caso esteja vazia ou inválida, utiliza-se o e-mail fornecido pelo fundador em `src/data/company.ts`.

## Conteúdo e identidade

- Página principal: `src/pages/index.astro`.
- Identificação e canais públicos: `src/data/company.ts`.
- Radar: `src/components/Radar.astro`, `src/scripts/radar.ts`, `src/data/markets.ts` e `src/lib/weather.ts`.
- Identidade e estilos: `src/styles/global.css` e `src/components/Logo.astro`.
- Visual conceitual do bloco inicial: `src/components/HeroVisual.astro`; não representa um produto entregue.
- Interações locais: `src/scripts/site.ts`.
- Fundamentação de cores, fontes e posicionamento: [direção criativa](docs/direcao-criativa.md).
- Paleta híbrida e organização visual atuais: [modelo 03](docs/modelo-03.md).
- Histórico da paleta e da escala tipográfica anteriores: [revisão visual](docs/revisao-visual-2026-10-19.md).

A marca vetorial é uma interpretação simplificada da imagem de referência, não o arquivo-mestre original. A experiência de 20 anos é atribuída ao fundador. Não foram inventados clientes, depoimentos ou números de projetos.

## Antes da publicação do site

Definir o domínio e revisar a redação final dos serviços. O nome de apresentação adotado é **ATL Soluções em Tecnologia**, com os canais informados pelo fundador. O site estático pode ser hospedado em um serviço compatível com `dist/`. Depois de definir o domínio, configurar URL canônica, sitemap e metadados sociais absolutos conforme o destino de hospedagem. Não há domínio, backend ou implantação pública configurados nesta versão.

A análise dos sites externos foi bloqueada pela política de rede do ambiente; o documento de direção criativa distingue referências sugeridas de uma pesquisa atual verificada. Os testes automáticos não substituem avaliação humana com tecnologias assistivas nem testes em dispositivos reais.
