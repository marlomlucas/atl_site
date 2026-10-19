# Revisão visual — ATL

Data: 19/10/2026, America/Sao_Paulo.

## Direção

Manter a identidade da referência enviada: grafite, ATL em dourado e símbolo de código verde. A revisão torna os fundos mais neutros e organiza a função de cada acento. As mudanças se baseiam no site da ATL e nos cálculos de contraste; a comparação visual dos seis sites indicados continua pendente de acesso, conforme o relatório de pesquisa.

O dourado concentra a assinatura e os destaques de títulos. O verde identifica ações, seleção e foco. Painéis passam a usar grafite neutro, com acentos discretos. Essas escolhas visam consistência e hierarquia; não são garantias de percepção psicológica ou conversão.

## Paleta

| Função                       | Cor       |
| ---------------------------- | --------- |
| Fundo                        | `#101314` |
| Superfície                   | `#191D1F` |
| Superfície em destaque/hover | `#22282B` |
| Texto principal              | `#F4F1E9` |
| Texto secundário             | `#B4BCB8` |
| Dourado                      | `#E0BC73` |
| Verde de ação                | `#A9D283` |
| Verde em hover               | `#BADF99` |
| Texto escuro nos botões      | `#132016` |
| Borda de campos e botões     | `#6F8077` |
| Divisórias decorativas       | `#3A4542` |

O símbolo da marca tem um degradê de verde `#168447` a `#A9D283`, inspirado no anexo. Favicon e cor do navegador acompanham a paleta. Os IDs dos degradês do cabeçalho e rodapé são distintos.

Contrastes sRGB calculados localmente, para combinações opacas:

| Combinação                     | Razão   |
| ------------------------------ | ------- |
| Texto principal / fundo        | 16,53:1 |
| Texto secundário / fundo       | 9,62:1  |
| Texto secundário / superfície  | 8,75:1  |
| Dourado / fundo                | 10,32:1 |
| Verde / fundo                  | 10,87:1 |
| Texto escuro / botão verde     | 9,82:1  |
| Borda de controle / superfície | 4,07:1  |

Texto claro sobre o botão verde continua inadequado (1,52:1); os botões usam texto escuro. As divisórias decorativas têm contraste sutil e não são usadas como única pista de um campo ou botão. Esses cálculos não representam uma auditoria completa de acessibilidade.

## Fontes e escala

**Manrope para títulos e Inter para leitura**, mantidas como fontes variáveis locais. O problema principal era a escala inconsistente entre larguras, e não a escolha das famílias.

| Elemento                       | Revisão                                              |
| ------------------------------ | ---------------------------------------------------- |
| Parágrafos principais          | 16 px em celular, tablet e desktop                   |
| Navegação e controles de texto | 14 px                                                |
| Campos de formulário           | 16 px                                                |
| Legendas e metadados úteis     | 12 px                                                |
| Descritor compacto da marca    | 10 px; 9 px em telas pequenas                        |
| Títulos                        | Manrope com pesos 550/600 e espaçamento proporcional |

Antes, o corpo chegava a 14 px no celular e os controles eram 13 px. A revisão remove os tamanhos conflitantes desses grupos nos pontos de quebra e centraliza sua escala. Os pequenos rótulos da ilustração inicial são decorativos, ficam fora da leitura assistiva e não substituem o conteúdo da página. Tipos dos painéis incorporados do TradingView pertencem ao provedor.

Títulos deixam de depender de valores muito negativos e fixos de espaçamento entre letras. Os parágrafos mantêm largura controlada e entrelinha confortável. A escala se mantém mesmo quando o layout muda para uma coluna.

## Componentes e responsividade

- Cartões com padding de 32 px no desktop e 24 px no celular, cantos discretos e estados de foco/hover consistentes.
- Foco de 3 px e bordas de controles separadas das divisórias decorativas.
- Links de ação, menu móvel e fechamento do diálogo com áreas de interação ampliadas.
- Menu compacto até 960 px, com o mesmo limite no CSS e no comportamento por JavaScript.
- Fundo do Radar alinhado ao grafite geral, com texto de apoio ampliado e seleção verde.
- Movimentos de hover discretos, preservando a preferência por movimento reduzido.

O conteúdo e a ordem das seções foram preservados. Páginas de serviços, projetos e reposicionamento do Radar são propostas separadas do relatório de pesquisa.

## Verificação

O build e a suite funcional foram exercitados após as mudanças, com 32 cenários validados. A cobertura de larguras foi ampliada para 320, 360, 390, 768, 960, 1024 e 1440 px. A inspeção complementar conferiu navegação, contato e cartões meteorológicos com valores negativos e descrições longas; em telas de até 360 px, a temperatura tem tamanho ajustado para preservar o valor e a unidade na mesma linha.

As consultas externas dos testes são simuladas: isso permite avaliar interface e falhas sem afirmar que cotações ou previsão reais foram verificadas. As verificações automáticas não apresentaram violações nos estados examinados; isso não substitui avaliação com tecnologias assistivas e pessoas reais.
