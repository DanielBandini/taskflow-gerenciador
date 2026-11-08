# TaskFlow — Gerenciador de Tarefas

Projeto acadêmico de gerenciamento de tarefas, desenvolvido com **HTML, CSS e JavaScript puro**.

## Funcionalidades

- Criar, editar, concluir e excluir tarefas.
- Definir prioridade (baixa, média ou alta) e data limite.
- Pesquisar tarefas por título ou descrição.
- Filtrar tarefas pendentes e concluídas.
- Visualizar tarefas de hoje e tarefas futuras.
- Acompanhar indicadores e percentual de conclusão.
- Alternar entre tema escuro e claro.
- Salvar automaticamente as tarefas no armazenamento local do navegador (`localStorage`).
- Interface responsiva para celular e computador.

## Executar

1. Abra a pasta no Visual Studio Code.
2. Abra `index.html` no navegador, ou use a extensão **Live Server** no VS Code.
3. Clique em **Nova tarefa** para cadastrar a primeira atividade.

Não precisa instalar bibliotecas ou iniciar servidor. A fonte usa Google Fonts; sem internet, o navegador usa uma fonte alternativa.

## Tecnologias

- HTML5
- CSS3
- JavaScript (ES6+)
- Git e GitHub

## Arquivos

- `index.html`: estrutura da interface.
- `style.css`: aparência, modo claro/escuro e responsividade.
- `script.js`: interações, filtros, armazenamento e estatísticas.

## Exemplo de workflow Git

> Os passos abaixo precisam ser realizados **de verdade** no seu computador ou GitHub Desktop. Ter os arquivos aqui não cria histórico ou branches automaticamente.

```bash
git init
git add .
git commit -m "feat: estrutura inicial do TaskFlow"
git branch -M main

git checkout -b feature/estilo
# Faça uma alteração de estilo em style.css e salve
git add style.css
git commit -m "style: ajustar interface"
git checkout main
git merge feature/estilo

git checkout -b feature/funcionalidades
# Faça uma alteração em script.js e salve
git add script.js
git commit -m "feat: aprimorar funcionalidades"
git checkout main
git merge feature/funcionalidades
```

Após criar no GitHub um repositório **vazio** chamado `taskflow`:

```bash
git remote add origin https://github.com/SEU-USUARIO/taskflow.git
git push -u origin main
git push origin feature/estilo feature/funcionalidades
```

Substitua `SEU-USUARIO` pelo seu usuário do GitHub. Se configurar Git por HTTPS, poderá precisar autenticar pelo navegador/Git Credential Manager.

## Atividade em dupla / outro repositório

1. Entre no repositório público de um colega e abra **Issues → New issue**; descreva um bug ou sugestão concreta.
2. Para fazer um **Pull Request real**, obtenha acesso de colaborador ao repositório ou faça um **Fork**.
3. No seu fork ou branch, altere algum arquivo, faça commit e push.
4. Clique em **Contribute → Open pull request** (ou **Compare & pull request**), descreva o que mudou e envie ao repositório original.
5. Guarde prints do issue, da PR, das branches, dos commits e do merge para comprovar a entrega.

## Observações

O `localStorage` guarda dados no navegador/dispositivo atual. Não há login nem sincronização com banco de dados. Limpar os dados do site pode apagar tarefas.
