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

      if (layout === 'highlighted') {
        details.classList.add('highlighted');
      }

      if (layout === 'search') {
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

    /* TITLE */

    const titleSection = document.createElement('div');
    titleSection.className = 'accordion-title-section';

    const flagPicture = flagField?.querySelector('picture');

    if (flagPicture) {
      const contentFlag = document.createElement('div');
      contentFlag.className = 'accordion-flag';

      contentFlag.append(flagPicture.cloneNode(true));

      titleSection.append(contentFlag);

      const summaryFlag = document.createElement('div');
      summaryFlag.className = 'accordion-flag accordion-summary-flag';

      summaryFlag.append(flagPicture.cloneNode(true));

      summary.append(summaryFlag);
    }

    const title = document.createElement('h2');

    title.className = 'accordion-title';
    title.textContent = label.textContent.trim();

    titleSection.append(title);

    body.append(titleSection);

    /* DATE + LOCATION */

    const hasMeta = dateField?.textContent.trim()
      || locationField?.textContent.trim();

    let meta;

    if (hasMeta) {
      meta = document.createElement('div');
      meta.className = 'accordion-meta';

      meta.textContent = `${dateField?.textContent.trim() || ''} | ${locationField?.textContent.trim() || ''}`;
    }

    /* IMAGE */

    let bannerWrapper;

    const bannerPicture = bannerField?.querySelector('picture');

    if (bannerPicture) {
      bannerWrapper = document.createElement('div');

      bannerWrapper.className = 'accordion-banner';

      bannerWrapper.append(bannerPicture.cloneNode(true));
    }

    /* DESCRIPTION */

    const description = body.querySelector('p');

    if (description) {
      description.classList.add('accordion-description');
    }

    /* CTA */

    let cta;

    if (
      ctaLabelField?.textContent.trim()
      && ctaLinkField?.textContent.trim()
    ) {
      cta = document.createElement('a');

      cta.href = ctaLinkField.textContent.trim();
      cta.textContent = ctaLabelField.textContent.trim();
      cta.className = 'accordion-cta';
    }

    /* ORDER */

    body.innerHTML = '';

    body.append(titleSection);

    if (meta) {
      body.append(meta);
    }

    if (bannerWrapper) {
      body.append(bannerWrapper);
    }

    if (description) {
      body.append(description);
    }

    if (cta) {
      body.append(cta);
    }

    details.append(summary, body);

    row.replaceWith(details);
  });

  /* ONLY ONE OPEN */

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

  /* SEARCH */

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
