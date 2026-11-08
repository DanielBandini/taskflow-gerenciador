'use strict';

const STORAGE_KEY = 'taskflow.tasks.v1';
const THEME_KEY = 'taskflow.theme.v1';
const priorityNames = { low: 'Baixa', medium: 'Média', high: 'Alta' };
const state = { tasks: loadTasks(), filter: 'all', nav: 'all', search: '', editingId: null };

const $ = (selector) => document.querySelector(selector);
const elements = {
  list: $('#taskList'), empty: $('#emptyState'), dialog: $('#taskDialog'), form: $('#taskForm'),
  title: $('#taskTitle'), description: $('#taskDescription'), priority: $('#taskPriority'),
  date: $('#taskDate'), search: $('#searchInput'), toast: $('#toast')
};

function loadTasks() {
  try {
    const data = JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]');
    return Array.isArray(data) ? data.filter(task => task && typeof task.id === 'string' && typeof task.title === 'string') : [];
  } catch { return []; }
}
function saveTasks() {
  try { localStorage.setItem(STORAGE_KEY, JSON.stringify(state.tasks)); }
  catch { announce('Não foi possível salvar no navegador. Verifique o armazenamento.'); }
}
function dateISO(date) { return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`; }
function todayISO() { return dateISO(new Date()); }
function formatDate(value) { if (!/^\d{4}-\d{2}-\d{2}$/.test(value || '')) return ''; const [y, m, d] = value.split('-'); return `${d}/${m}/${y}`; }
function announce(message) { elements.toast.textContent = message; elements.toast.hidden = false; clearTimeout(announce.timer); announce.timer = setTimeout(() => { elements.toast.hidden = true; }, 2500); }
function openDialog(id = null) {
  state.editingId = id;
  elements.form.reset();
  $('#dialogTitle').textContent = id ? 'Editar tarefa' : 'Nova tarefa';
  $('#saveTask').textContent = id ? 'Salvar alterações' : 'Salvar tarefa';
  if (id) {
    const task = state.tasks.find(item => item.id === id);
    if (!task) return;
    elements.title.value = task.title;
    elements.description.value = task.description;
    elements.priority.value = task.priority;
    elements.date.value = task.dueDate;
  }
  elements.dialog.showModal();
  elements.title.focus();
}
function closeDialog() { elements.dialog.close(); state.editingId = null; }
function matches(task) {
  if (state.nav === 'today' && (task.dueDate !== todayISO() || task.completed)) return false;
  if (state.nav === 'upcoming' && (task.completed || !task.dueDate || task.dueDate <= todayISO())) return false;
  if (state.nav === 'done' && !task.completed) return false;
  if (state.filter === 'pending' && task.completed) return false;
  if (state.filter === 'done' && !task.completed) return false;
  const query = state.search.trim().toLocaleLowerCase('pt-BR');
  return !query || `${task.title} ${task.description}`.toLocaleLowerCase('pt-BR').includes(query);
}
function make(tag, className, text) { const el = document.createElement(tag); if (className) el.className = className; if (text !== undefined) el.textContent = text; return el; }
function createRow(task) {
  const row = make('article', `task-row${task.completed ? ' completed' : ''}`);
  const check = make('input', 'task-check'); check.type = 'checkbox'; check.checked = task.completed; check.setAttribute('aria-label', `Concluir ${task.title}`);
  check.addEventListener('change', () => { task.completed = check.checked; saveTasks(); render(); announce(task.completed ? 'Tarefa concluída!' : 'Tarefa reaberta.'); });
  const copy = make('div', 'task-copy'); copy.append(make('h3', '', task.title));
  if (task.description) copy.append(make('p', '', task.description));
  const meta = make('div', 'task-meta'); meta.append(make('span', `priority-tag priority-${task.priority}`, `● ${priorityNames[task.priority] || 'Média'}`));
  if (task.dueDate) { const late = !task.completed && task.dueDate < todayISO(); meta.append(make('span', `date-tag${late ? ' overdue' : ''}`, `${late ? 'Atrasada • ' : '◷ '}${formatDate(task.dueDate)}`)); }
  copy.append(meta);
  const actions = make('div', 'row-actions');
  const edit = make('button', 'action-button', '✎'); edit.type = 'button'; edit.title = 'Editar tarefa'; edit.setAttribute('aria-label', `Editar ${task.title}`); edit.addEventListener('click', () => openDialog(task.id));
  const remove = make('button', 'action-button delete', '♲'); remove.type = 'button'; remove.title = 'Excluir tarefa'; remove.setAttribute('aria-label', `Excluir ${task.title}`);
  remove.addEventListener('click', () => { if (!window.confirm(`Excluir a tarefa “${task.title}”?`)) return; state.tasks = state.tasks.filter(item => item.id !== task.id); saveTasks(); render(); announce('Tarefa excluída.'); });
  actions.append(edit, remove); row.append(check, copy, actions); return row;
}
function render() {
  const total = state.tasks.length, done = state.tasks.filter(task => task.completed).length, pending = total - done;
  const progress = total ? Math.round(done / total * 100) : 0;
  $('#totalStat').textContent = total; $('#pendingStat').textContent = pending; $('#doneStat').textContent = done;
  $('#progressStat').textContent = `${progress}%`; $('#progressFill').style.width = `${progress}%`; $('#progressBar').setAttribute('aria-valuenow', progress);
  const visible = state.tasks.filter(matches).sort((a,b) => Number(a.completed)-Number(b.completed) || (a.dueDate || '9999').localeCompare(b.dueDate || '9999') || b.createdAt.localeCompare(a.createdAt));
  elements.list.replaceChildren(...visible.map(createRow)); elements.empty.hidden = visible.length > 0;
  $('#taskCount').textContent = visible.length; $('#clearCompleted').disabled = done === 0;
  document.querySelectorAll('[data-filter]').forEach(btn => { const active = btn.dataset.filter === state.filter; btn.classList.toggle('active', active); btn.setAttribute('aria-pressed', String(active)); });
  document.querySelectorAll('[data-nav]').forEach(btn => { const active = btn.dataset.nav === state.nav; btn.classList.toggle('active', active); btn.setAttribute('aria-current', active ? 'page' : 'false'); });
  $('#tasksTitle').firstChild.textContent = ({ all: 'Minhas tarefas ', today: 'Para hoje ', upcoming: 'Próximas tarefas ', done: 'Concluídas ' })[state.nav];
}
$('#openTaskModal').addEventListener('click', () => openDialog());
$('#emptyAdd').addEventListener('click', () => openDialog());
$('#closeDialog').addEventListener('click', closeDialog);
$('#cancelDialog').addEventListener('click', closeDialog);
elements.dialog.addEventListener('click', e => { if (e.target === elements.dialog) closeDialog(); });
elements.dialog.addEventListener('close', () => { state.editingId = null; });
elements.form.addEventListener('submit', event => {
  event.preventDefault();
  if (!elements.form.reportValidity()) return;
  const title = elements.title.value.trim();
  if (!title) { elements.title.setCustomValidity('Informe um título.'); elements.form.reportValidity(); return; }
  elements.title.setCustomValidity('');
  const values = { title, description: elements.description.value.trim(), priority: elements.priority.value, dueDate: elements.date.value };
  if (state.editingId) { const task = state.tasks.find(t => t.id === state.editingId); if (task) Object.assign(task, values); }
  else { state.tasks.unshift({ id: typeof crypto.randomUUID === 'function' ? crypto.randomUUID() : `${Date.now()}-${Math.random()}`, ...values, completed: false, createdAt: new Date().toISOString() }); }
  saveTasks(); closeDialog(); state.nav = 'all'; state.filter = 'all'; state.search = ''; elements.search.value = ''; render(); announce('Tarefa salva com sucesso!');
});
elements.title.addEventListener('input', () => elements.title.setCustomValidity(''));
document.querySelectorAll('[data-filter]').forEach(btn => btn.addEventListener('click', () => { state.filter = btn.dataset.filter; render(); }));
document.querySelectorAll('[data-nav]').forEach(btn => btn.addEventListener('click', () => { state.nav = btn.dataset.nav; state.filter = 'all'; render(); }));
elements.search.addEventListener('input', e => { state.search = e.target.value; render(); });
$('#clearCompleted').addEventListener('click', () => { const count = state.tasks.filter(task => task.completed).length; if (count && window.confirm(`Excluir ${count} tarefa(s) concluída(s)?`)) { state.tasks = state.tasks.filter(task => !task.completed); saveTasks(); render(); announce('Tarefas concluídas removidas.'); } });
function applyTheme(theme) { document.body.classList.toggle('light', theme === 'light'); $('#themeToggle').textContent = theme === 'light' ? '☾' : '☀'; $('#themeToggle').setAttribute('aria-label', theme === 'light' ? 'Ativar tema escuro' : 'Ativar tema claro'); }
let theme = localStorage.getItem(THEME_KEY) === 'light' ? 'light' : 'dark'; applyTheme(theme);
$('#themeToggle').addEventListener('click', () => { theme = theme === 'dark' ? 'light' : 'dark'; applyTheme(theme); try { localStorage.setItem(THEME_KEY, theme); } catch {} });
render();

// Atalho de produtividade: Ctrl+K (ou Cmd+K) abre a busca.
document.addEventListener('keydown', event => {
  if ((event.ctrlKey || event.metaKey) && event.key.toLowerCase() === 'k') {
    event.preventDefault();
    elements.search.focus();
  }
});
