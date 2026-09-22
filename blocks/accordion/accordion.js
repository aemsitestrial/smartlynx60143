import { moveInstrumentation } from '../../scripts/scripts.js';

export default function decorate(block) {
  let hasSearch = false;

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

    if (layoutField) {
      const layout = layoutField.textContent.trim().toLowerCase();

      if (layout === 'single-open') {
        details.classList.add('single-open');
      }

      if (layout === 'highlighted') {
        details.classList.add('highlighted');
      }

      if (layout === 'search') {
        details.classList.add('search-layout');
        hasSearch = true;
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
      const color = textColorField.textContent.trim();

      if (color) {
        details.style.setProperty('--accordion-text', color);
      }

      textColorField.remove();
    }

    details.append(summary, body);

    row.replaceWith(details);
  });

  const singleOpenItems = block.querySelectorAll('.single-open');

  singleOpenItems.forEach((item) => {
    item.addEventListener('toggle', () => {
      if (!item.open) {
        return;
      }

      singleOpenItems.forEach((other) => {
        if (other !== item) {
          other.removeAttribute('open');
        }
      });
    });
  });

  if (hasSearch) {
    const search = document.createElement('input');

    search.type = 'search';
    search.placeholder = 'Search...';

    search.addEventListener('input', () => {
      const term = search.value.toLowerCase();

      block.querySelectorAll('.accordion-item').forEach((item) => {
        const text = item.textContent.toLowerCase();

        item.style.display = text.includes(term) ? '' : 'none';
      });
    });

    block.prepend(search);
  }
}
