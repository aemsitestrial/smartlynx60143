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
    const backgroundField = row.children[3];
    const textColorField = row.children[4];
    const borderColorField = row.children[5];

    if (layoutField) {
      const layout = layoutField.textContent.trim().toLowerCase();

      if (layout === 'faq') {
        details.classList.add('faq');
      }

      layoutField.remove();
    }

    if (backgroundField) {
      const bg = backgroundField.textContent.trim();

      if (bg) {
        details.style.setProperty('--accordion-bg', bg);
      }

      backgroundField.remove();
    }

    if (textColorField) {
      const textColor = textColorField.textContent.trim();

      if (textColor) {
        details.style.setProperty('--accordion-text', textColor);
      }

      textColorField.remove();
    }

    if (borderColorField) {
      const borderColor = borderColorField.textContent.trim();

      if (borderColor) {
        details.style.setProperty('--accordion-border', borderColor);
      }

      borderColorField.remove();
    }

    details.append(summary, body);

    row.replaceWith(details);
  });
}
