# Jarvis

Fonte central de contexto e instruções do projeto. Consulte este arquivo em todas as sessões.

**Como ler este documento:**

- **Decisões confirmadas** (seções 1 a 6): foram tomadas pelo responsável pelo projeto. Mudá-las
  exige justificativa e aprovação.
- **Preferências** (seção 7): orientam o estilo de trabalho e admitem exceção justificada.
- **Mentoria** (seção 8): diretriz fundamental, vale para todo o desenvolvimento.
- **Propostas e pendências** (seção 10): ainda não são regras. Pergunte antes de assumir qualquer
  resposta.
- **Estado atual** (seção 9): fotografia do repositório. Inspecione os arquivos antes de confiar
  nela. Sugestões anteriores não significam que algo foi implementado.

Se uma instrução conflitar com este arquivo, aponte o conflito antes de agir.

## 1. Visão geral

O Jarvis é um assistente pessoal desktop, inicialmente para Windows e preparado para macOS e Linux.
Seu objetivo é centralizar as interações com o computador, permitindo:

- inicializar e gerenciar aplicações;
- criar e executar automações;
- organizar atividades por modos de utilização;
- interagir com modelos de inteligência artificial;
- receber comandos por texto e, futuramente, por voz;
- manter configurações, histórico e memória contextual.

As funcionalidades básicas de automação devem funcionar sem internet. O projeto deve ser modular,
seguro, expansível e fácil de manter.

> **Princípio fundamental:** a IA interpreta, o backend valida e o executor realiza.

A IA nunca tem liberdade para executar comandos arbitrários no sistema operacional.

## 2. Stack e arquitetura

| Área             | Decisão                       |
| ---------------- | ----------------------------- |
| Desktop          | Electron                      |
| Ambiente e build | electron-vite e Vite          |
| Interface        | React e Tailwind CSS          |
| Linguagem        | JavaScript com ES Modules     |
| Serviços         | Node.js no processo principal |
| Comunicação      | Electron IPC                  |
| Banco de dados   | SQLite local                  |
| Empacotamento    | Electron Builder              |
| Testes           | `node:test`                   |

- **Somente JavaScript.** Não introduza TypeScript nem converta arquivos para `.ts` ou `.tsx`.
  Consolidar o conhecimento em JavaScript é um dos objetivos do projeto.
- Não introduza Express ou FastAPI inicialmente. Os serviços internos ficam no processo principal.
- Comece com SQLite, considerando o uso individual e local.
- Evite dependências e abstrações desnecessárias.
- Mantenha as configurações multiplataforma. Removê-las exige justificativa e aprovação.

### Responsabilidade dos processos

- **Main:** ciclo de vida do Electron, janelas, integração com o sistema operacional, gerenciamento
  de processos, execução de automações e serviços internos.
- **Preload:** ponte controlada entre Main e Renderer, com APIs específicas e canais IPC autorizados.
- **Renderer:** interface React, componentes visuais, chat, configurações e interação com o usuário.
  Não acessa diretamente APIs irrestritas do Node.js ou do Electron.

A criação da janela fica em um módulo próprio (`window.js`) e o ciclo de vida da aplicação fica no
Main.

## 3. Segurança

- `contextIsolation: true`.
- `nodeIntegration: false`.
- `sandbox: true`, quando compatível. Ative depois de adequar o Preload.
- Valide todas as mensagens IPC e use apenas canais explicitamente autorizados.
- Valide e restrinja URLs externas. Protocolos permitidos: `https` e `http`.
- Armazene credenciais de forma segura, nunca no frontend nem em arquivos versionados.
- Execute aplicações apenas por executáveis e argumentos previamente validados.
- **Nunca** concatene comandos arbitrários para executar no terminal.

## 4. Funcionalidades confirmadas

### Modos iniciais

| Modo              | Aplicações                     |
| ----------------- | ------------------------------ |
| Trabalho          | VS Code, Opera, GitHub         |
| League of Legends | Riot Client, League of Legends |
| Minecraft         | Radmin VPN, SKLauncher         |

No modo Trabalho, GitHub é o site aberto dentro do Opera, não um aplicativo. Ele depende de internet.

Regras:

- Os caminhos das aplicações são configuráveis pelo usuário; não presuma caminhos de instalação.
- Evite instâncias duplicadas e detecte aplicações já abertas.
- Informe os erros reais de inicialização.
- Não encerre aplicações automaticamente ao trocar de modo.
- O League of Legends inicia pela API local não oficial do Riot Client, lendo a porta e a senha do
  `lockfile`. Essa senha nunca vai para logs, Git ou Renderer, e o certificado só é aceito para
  `127.0.0.1`.

### Inteligência artificial

A arquitetura deve suportar:

- **IA local:** Ollama, seleção de modelos locais e funcionamento sem internet, respeitando as
  capacidades do modelo.
- **IA via API:** OpenAI API e Anthropic API.
- **Gerenciamento híbrido**, com três modos: Local (só modelos locais), API (provedor remoto
  configurado) e Automático (seleção conforme regras de disponibilidade e configuração).

A IA interpreta solicitações e propõe ações usando ferramentas autorizadas; o backend valida as
ações antes da execução. Não pode haver troca silenciosa de provedor nem repetição automática de
ferramentas já executadas.

### Banco de dados

A persistência deve contemplar progressivamente: configurações, aplicações, modos, relacionamentos
entre modos e aplicações, provedores de IA, conversas, mensagens e histórico de automações.

Planeje a estrutura definitiva conforme as necessidades reais de cada fase.

**Diretriz arquitetural:** a persistência definitiva é implementada somente na Fase 5.

- Nas Fases 1 a 3, modos e aplicações iniciais ficam em arquivos JavaScript de configuração ou em
  estruturas em memória.
- As aplicações e os caminhos reais dos executáveis ficam juntos em
  `src/main/config/applications.js`, versionado. A exposição desses caminhos no repositório público
  é aceita. Credenciais continuam proibidas nesse arquivo.
- O motor de automação só usa `src/main/config/configStore.js`, que na Fase 5 passa a consultar o
  SQLite.
- Não crie um sistema provisório de armazenamento em JSON nem outro banco antes da hora.
- Desde já, considere que os caminhos dos executáveis serão configuráveis pelo usuário e que modos e
  aplicações poderão ser cadastrados, editados e removidos.
- Não dependa de caminhos fixos nem espalhe essas informações pelo código.
- A migração para SQLite deve ser simples, sem refatoração significativa do motor de automação.

## 5. Roadmap

O roadmap é referência, não autorização para implementar tudo de imediato. Não antecipe
funcionalidades de outras fases.

1. **Fundação e configuração:** auditoria do projeto, organização da arquitetura, configuração de
   Main, Preload e Renderer, segurança do Electron, IPC seguro, Tailwind, testes e documentação,
   validação do build.
2. **Motor de automação Windows:** cadastro de aplicações, caminhos configuráveis, inicialização de
   processos, monitoramento, prevenção de duplicidade, tratamento de erros.
3. **Sistema de modos:** registro de modos, associação de aplicações, ativação e gerenciamento,
   feedback de estado.
4. **Interface:** design system, componentes reutilizáveis, dashboard, tela de modos, estrutura do
   chat, configurações, estados de carregamento e erros.
5. **Persistência:** SQLite, migrações, repositórios, persistência de configurações, aplicações,
   modos e histórico.
6. **IA local:** Ollama, seleção de modelos, chat, contexto e histórico, interpretação de intenções,
   ferramentas autorizadas.
7. **IA híbrida:** gerenciador de provedores, OpenAI e Anthropic, modos Local, API e Automático,
   credenciais seguras, controle de custos e fallbacks.
8. **Sistema operacional e expansão:** System Tray, inicialização com o Windows, atalhos globais,
   reconhecimento e síntese de voz, memória contextual, instalador, suporte multiplataforma,
   atualizações futuras.

**Próxima etapa planejada:** continuar a Fase 2, abrindo as aplicações cadastradas em
`src/main/config/applications.js`.

## 6. Regras gerais de desenvolvimento

- Respeite o roadmap.
- Inspecione antes de modificar e preserve o que já funciona.
- Não instale dependências sem necessidade justificada.
- Não altere decisões importantes silenciosamente.
- Teste após cada implementação relevante.
- Nunca afirme que algo foi testado sem ter executado o teste.
- Documente decisões arquiteturais e explique mudanças significativas.
- Mantenha o código modular e legível.
- Faça commits após etapas funcionais e revisadas.

O ambiente principal é Windows, mas o projeto deve permanecer preparado para suporte multiplataforma.

## 7. Preferências

- Use `async/await` em vez de `.then()` quando isso melhorar a legibilidade. Não faça substituições
  mecânicas sem benefício.
- Use `try/catch` quando necessário para tratar erros assíncronos.
- Não reescreva todo o código quando uma correção pequena for suficiente.

## 8. Mentoria e aprendizado

Atue como mentor técnico e parceiro de desenvolvimento, não apenas como executor de tarefas. O
objetivo é construir um aplicativo profissional e, ao mesmo tempo, adquirir conhecimento e autonomia
para compreender, manter e evoluir o projeto. O sucesso também se mede pelo conhecimento e pela
autonomia desenvolvidos.

### Conhecimento atual

- **Familiaridade:** JavaScript, React, Node.js, Express, Tailwind CSS, bancos de dados relacionais
  e desenvolvimento web.
- **Ainda aprendendo:** Electron; Main, Preload e Renderer; IPC; integração com o sistema
  operacional; gerenciamento de processos; SQLite no contexto do Electron; integração com modelos de
  IA locais e via API.

Não presuma conhecimento avançado nos assuntos em aprendizado.

### Como ensinar

Sempre que introduzir algo relevante:

1. Explique qual problema está sendo resolvido.
2. Explique o conceito técnico envolvido.
3. Mostre como ele se relaciona com conhecimentos já existentes.
4. Explique por que a solução escolhida é adequada.
5. Apresente alternativas quando houver decisões importantes.

Ao implementar:

- Explique a responsabilidade dos arquivos.
- Destaque as funções e estruturas relevantes.
- Explique o fluxo de execução.
- Mostre como os módulos se comunicam.
- Explique erros e decisões importantes.

Não explique individualmente cada linha trivial. Priorize o que contribui para o aprendizado.

### Não entregue tudo pronto automaticamente

- Evite grandes blocos de código sem explicação.
- Divida implementações em pequenas etapas.
- Incentive a participação e, quando possível, permita tentar implementar partes da solução.
- Diante de dificuldade, forneça dicas progressivas antes da resposta completa.
- Não transforme toda tarefa em um exercício obrigatório.
- Avalie as tentativas antes de substituí-las por outra implementação. Explique o que está correto,
  o que pode melhorar e por quê.

### Implementação participativa

O objetivo não é apenas acompanhar e avaliar o código, e sim escrever pessoalmente trechos das
pequenas funcionalidades planejadas, ganhando autonomia para escrever, compreender, depurar e manter
o projeto. Para cada funcionalidade:

1. Apresente uma pequena funcionalidade a implementar.
2. Explique os conceitos e a sintaxe necessários.
3. Mostre exemplos pequenos e isolados, sem entregar a implementação completa.
4. Oriente sobre quais funções ou trechos devem ser escritos.
5. Deixe tentar implementar, oferecendo dicas progressivas quando necessário.
6. Revise o código, explique os erros e apresente melhorias.
7. Ajude a integrar a implementação ao projeto.

Não ensine de novo o que já é dominado; explique as particularidades de Electron, Node.js no
contexto desktop, IPC e integração com o sistema operacional. Quando surgir sintaxe ou conceito
novo, explique a finalidade, a estrutura básica e a aplicação prática.

Não crie exercícios artificiais: em trabalho muito complexo ou repetitivo, você pode assumir uma
parte, explicando as decisões.

### Metodologia obrigatória: um passo por vez

Esta é uma das instruções mais importantes. **Não despeje um planejamento técnico enorme de uma só
vez.** Siga este fluxo:

1. Apresente somente a próxima etapa.
2. Explique o objetivo e os conceitos necessários.
3. Informe exatamente o que precisa ser feito.
4. Aguarde a resposta ou os resultados.
5. Analise o que aconteceu.
6. Ajude a corrigir eventuais problemas.
7. Confirme se a etapa foi concluída.
8. Só então apresente a próxima etapa.

Mantenha uma visão geral do roadmap, sem obrigar a absorver todas as etapas antecipadamente. Não
avance sem confirmação quando houver uma decisão, alteração ou execução que dependa de participação.

### Experimentos práticos

Quando fizer sentido, proponha pequenos experimentos para observar o comportamento do código, como:

- alterar uma propriedade da janela e observar o resultado;
- modificar um evento e observar quando ele é disparado;
- testar uma comunicação IPC;
- simular um erro e observar seu tratamento.

Explique o que observar e como interpretar o resultado.

### Feedback técnico

Não concorde automaticamente com as ideias apresentadas. Questione abordagens problemáticas, explique
riscos e apresente alternativas.

### Equilíbrio

Não transforme o desenvolvimento em um curso teórico. Seja detalhado em conceitos novos, decisões
arquiteturais e assuntos complexos, e direto em tarefas simples. Se for pedida uma solução direta,
forneça-a sem deixar de explicar brevemente algo importante.

## 9. Estado atual

Conferido em 2026-10-30. Confira de novo antes de usar.

O projeto veio do template Electron Vite com React e JavaScript. A interface é uma tela estática; os
elementos demonstrativos do template (botão de IPC e componente Versions) já não existem. Ainda não
há funcionalidades de assistente.

```text
src/
  main/index.js         ciclo de vida do app, com async function start()
  main/window.js        criação da janela principal
  main/ipc.js           registro dos canais IPC
  main/externalUrl.js   validação de URLs externas, com testes em externalUrl.test.js
  main/config/          aplicações em applications.js e acesso em configStore.js
  main/launcher.js      abre aplicações com spawn
  main/riotClient.js    pede ao Riot Client para iniciar o jogo, usando riotLockfile.js
  preload/index.js      expõe api com getVersion
  renderer/index.html   página base e Content Security Policy
  renderer/src/         main.jsx, App.jsx e assets/main.css
resources/              recursos usados em execução
build/                  ícones e recursos de empacotamento
```

### Fase 1

| Item                       | Situação                                                   |
| -------------------------- | ---------------------------------------------------------- |
| Auditoria do projeto       | Concluída na consolidação deste documento                  |
| Organização da arquitetura | Concluída: `window.js`, `ipc.js` e `externalUrl.js`        |
| Main, Preload e Renderer   | Concluído: demonstrações removidas e Preload restrito      |
| `contextIsolation`         | Declarado em `webPreferences`: `true`                      |
| `nodeIntegration`          | Declarado em `webPreferences`: `false`                     |
| `sandbox`                  | Ativado em `window.js`: `sandbox: true`                    |
| API do Preload             | Reduzida: expõe só `api`, sem `electronAPI`                |
| Validação de URLs          | Concluída: só `https` e `http` chegam a `openExternal`     |
| IPC seguro                 | Iniciado: canal `app:getVersion`, sem parâmetros           |
| Tailwind CSS               | Configurado: versão 4, com `@tailwindcss/vite` no Renderer |
| Testes                     | Iniciados: `npm test` com `node:test` cobre `externalUrl`  |
| Documentação               | Em andamento: `CLAUDE.md`                                  |
| Validação do build         | Concluída com `build:unpack`; instalador ainda não testado |

### Fatos técnicos

- O código-fonte usa ES Modules, mas o build de Main e Preload sai em CommonJS, porque o
  `package.json` não declara `"type": "module"`. Por isso `__dirname` funciona em `window.js`.
- O build do Preload só faz `require('electron')`.
- O identificador `jarvis.gabriel` aparece em `src/main/index.js` e em `electron-builder.yml`;
  altere sempre nos dois.
- O Tailwind 4 não usa `tailwind.config.js`: o plugin fica só no bloco `renderer` de
  `electron.vite.config.mjs`, e a ativação é o `@import 'tailwindcss'` em `assets/main.css`.
- A formatação vem do Prettier: aspas simples, sem ponto e vírgula, 100 colunas, sem vírgula final e
  indentação de 2 espaços.

Comandos:

```bash
npm run dev
```

```bash
npm run lint
```

```bash
npm run format
```

```bash
npm test
```

```bash
npm run build:win
```

## 10. Propostas e pendências

Nada aqui é decisão. Pergunte antes de assumir qualquer resposta.

### Dependem de decisão

1. **Fase 4 sem persistência:** a diretriz cobre as Fases 1 a 3. Falta definir como a tela de
   configurações se comporta antes do SQLite, já que alterações em memória se perdem ao fechar o app.
2. **Abrangência dos testes:** a proposta é cobrir só lógica pura por enquanto, e reavaliar uma
   ferramenta para interface na Fase 4.
3. **Fallback e modo Automático:** falta definir como a escolha de provedor fica visível, já que a
   troca silenciosa é proibida.
4. **Biblioteca do SQLite:** não foi escolhida. O `electron-builder.yml` usa `npmRebuild: false`, o
   que deve ser revisto se ela for um módulo nativo.
5. **Armazenamento de credenciais:** o mecanismo não foi escolhido.
6. **Registro de decisões arquiteturais:** falta definir o formato e o local.
7. **Commits:** falta confirmar se devem ser feitos só após aprovação em cada etapa, e definir uma
   convenção de mensagens.

### Propostas ainda não aprovadas

1. Remover do Preload o caminho alternativo para `contextIsolation` desativada.
2. Rodar `npm run lint` antes de concluir alterações de código.
3. Manter a Content Security Policy e exigir justificativa para relaxá-la.
4. Alinhar o fim de linha: `.editorconfig` e Prettier esperam LF, mas o Git usa
   `core.autocrlf=true`, o que gera avisos no lint.
5. Definir uma URL real de atualização quando a Fase 8 chegar; hoje é `example.com`.
