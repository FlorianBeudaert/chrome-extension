function createProgressBar(percentage = 100) {
  const container = document.createElement('div');
  container.className = 'taken-into-account-progress-container';

  const bar = document.createElement('div');
  bar.className = 'taken-into-account-progress-bar';
  bar.style.width = `${percentage}%`;

  container.appendChild(bar);
  return container;
}

function insertProgressBarInProjectCell(cell) {
  if (cell.querySelector('.taken-into-account-progress-container')) return;

  const supportingText = cell.querySelector('.mdl-card__supporting-text');
  if (supportingText) {
    const progressBar = createProgressBar();
    supportingText.insertBefore(progressBar, supportingText.firstChild);
  }
}

function processAllProjectCells() {
  const projectCells = document.querySelectorAll('.project-cell');
  projectCells.forEach(insertProgressBarInProjectCell);
}

processAllProjectCells();

const observer = new MutationObserver(() => {
  processAllProjectCells();
});
observer.observe(document.body, { childList: true, subtree: true });
