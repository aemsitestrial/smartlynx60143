import { moveInstrumentation } from '../../scripts/scripts.js';

export default function decorate(block) {
  [...block.children].forEach((row) => {
    const label = row.children[0];

    const summary = document.createElement('summary');
    summary.className = 'accordion-item-label';
    summary.append(...label.childNodes);

    const body = row.children[1];
    body.className = 'accordion-item-body';

    const details = document.createElement('details');

    moveInstrumentation(row, details);

    details.className = 'accordion-item';

    const layoutField = row.children[2];

    if (layoutField) {
      const layout = layoutField.textContent.trim().toLowerCase();

      if (layout === 'faq') {
        details.classList.add('faq');
      }

      layoutField.remove();
    }

    details.append(summary, body);

    row.replaceWith(details);
  });
}
