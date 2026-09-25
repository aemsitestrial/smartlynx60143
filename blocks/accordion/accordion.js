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
    const dateField = row.children[5];
    const locationField = row.children[6];
    const ctaLabelField = row.children[7];
    const ctaLinkField = row.children[8];
    const flagField = row.children[9];
    const bannerField = row.children[10];

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

      if (layout === 'horizontal') {
        block.classList.add('horizontal');
        details.classList.add('horizontal-item');
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

    const titleSection = document.createElement('div');
    titleSection.className = 'accordion-title-section';

    const flagPicture = flagField?.querySelector('picture');

    if (flagPicture) {
      const flagWrapper = document.createElement('div');

      flagWrapper.className = 'accordion-flag';

      flagWrapper.append(flagPicture.cloneNode(true));

      titleSection.append(flagWrapper);
    }

    const title = document.createElement('h2');

    title.className = 'accordion-title';
    title.textContent = label.textContent.trim();

    titleSection.append(title);

    body.prepend(titleSection);

    if (
      dateField?.textContent.trim()
      || locationField?.textContent.trim()
    ) {
      const meta = document.createElement('div');

      meta.className = 'accordion-meta';

      meta.textContent = `${dateField?.textContent.trim() || ''} | ${locationField?.textContent.trim() || ''}`;

      body.append(meta);
    }

    const bannerPicture = bannerField?.querySelector('picture');

    if (bannerPicture) {
      const bannerWrapper = document.createElement('div');

      bannerWrapper.className = 'accordion-banner';

      bannerWrapper.append(bannerPicture.cloneNode(true));

      body.append(bannerWrapper);
    }

    const description = body.querySelector('p');

    if (description) {
      description.classList.add('accordion-description');
    }

    if (
      ctaLabelField?.textContent.trim()
      && ctaLinkField?.textContent.trim()
    ) {
      const cta = document.createElement('a');

      cta.href = ctaLinkField.textContent.trim();
      cta.textContent = ctaLabelField.textContent.trim();
      cta.className = 'accordion-cta';

      body.append(cta);
    }

    details.append(summary, body);

    row.replaceWith(details);
  });

  /* ONLY ONE ACCORDION OPEN AT A TIME */

  const accordionItems = block.querySelectorAll('.accordion-item');

  accordionItems.forEach((item) => {
    item.addEventListener('toggle', () => {
      if (!item.open) {
        return;
      }

      accordionItems.forEach((other) => {
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
