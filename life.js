(() => {
const buttons = [...document.querySelectorAll('[data-role-filter]')];
const cards = [...document.querySelectorAll('[data-role-group]')];
const status = document.querySelector('.role-filter-status');
buttons.forEach(button => button.addEventListener('click', () => {
  const group = button.dataset.roleFilter;
  buttons.forEach(b => b.setAttribute('aria-pressed', String(b === button)));
  let count = 0;
  cards.forEach(card => {
    card.hidden = group !== 'all' && card.dataset.roleGroup !== group;
    if (!card.hidden) count++;
  });
  if (status) status.textContent = '显示 ' + count + ' 类角色 · ' + button.textContent;
}));
document.querySelectorAll('.role-map-node').forEach(link => link.addEventListener('click', () => {
  buttons.find(b => b.dataset.roleFilter === 'all')?.click();
}));
window.addEventListener('beforeprint', () => {
  document.querySelectorAll('.chapter-depth').forEach(d => {d.dataset.beforePrintOpen = String(d.open); d.open = true;});
});
window.addEventListener('afterprint', () => {
  document.querySelectorAll('.chapter-depth').forEach(d => {d.open = d.dataset.beforePrintOpen === 'true';});
});
})();