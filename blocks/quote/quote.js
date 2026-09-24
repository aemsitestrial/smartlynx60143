import { createOptimizedPicture } from '../../scripts/aem.js';

export default function decorate(block) {
  const rows = [...block.children];

  const quotationRow = rows[0];
  const attributionRow = rows[1];
  const titleRow = rows[2];
  const descriptionRow = rows[3];
  const layoutRow = rows[4];
  const profileImageRow = rows[8];

  const layout = layoutRow?.textContent.trim().toLowerCase() || 'default';

  let picture;

  const image = profileImageRow?.querySelector('img');

  if (image) {
    picture = image.closest('picture');

    const optimizedPicture = createOptimizedPicture(
      image.src,
      image.alt || '',
      false,
      [
        { width: '200' },
        { width: '400' },
        { width: '800' },
      ],
    );

    picture.replaceWith(optimizedPicture);
    picture = optimizedPicture;
  }

  const blockquote = document.createElement('blockquote');
  blockquote.classList.add(layout);

  if (titleRow?.innerHTML.trim()) {
    const title = document.createElement('div');
    title.className = 'quote-title';
    title.innerHTML = titleRow.innerHTML;
    blockquote.append(title);
  }

  if (quotationRow?.innerHTML.trim()) {
    const quotation = document.createElement('div');
    quotation.className = 'quote-quotation';
    quotation.innerHTML = quotationRow.innerHTML;
    blockquote.append(quotation);
  }

  if (descriptionRow?.innerHTML.trim()) {
    const description = document.createElement('div');
    description.className = 'quote-description';
    description.innerHTML = descriptionRow.innerHTML;
    blockquote.append(description);
  }

  if (layout === 'profile') {
    const author = document.createElement('div');
    author.className = 'quote-author';

    if (picture) {
      const imageWrapper = document.createElement('div');
      imageWrapper.className = 'quote-author-image';

      imageWrapper.append(picture);

      author.append(imageWrapper);
    }

    const info = document.createElement('div');
    info.className = 'quote-author-info';

    if (attributionRow?.innerHTML.trim()) {
      const attribution = document.createElement('div');
      attribution.className = 'quote-attribution';
      attribution.innerHTML = attributionRow.innerHTML;

      info.append(attribution);
    }

    author.append(info);
    blockquote.append(author);
  } else if (attributionRow?.innerHTML.trim()) {
    const attribution = document.createElement('div');
    attribution.className = 'quote-attribution';
    attribution.innerHTML = attributionRow.innerHTML;

    blockquote.append(attribution);
  }

  block.textContent = '';
  block.append(blockquote);
}
