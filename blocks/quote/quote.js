import { createOptimizedPicture } from '../../scripts/aem.js';

export default async function decorate(block) {
  const quotation = block.children[0]?.firstElementChild;
  const attribution = block.children[1]?.firstElementChild;
  const title = block.children[2]?.firstElementChild;
  const description = block.children[3]?.firstElementChild;
  const layoutField = block.children[4]?.firstElementChild;
  const backgroundField = block.children[5]?.firstElementChild;
  const textColorField = block.children[6]?.firstElementChild;
  const quoteColorField = block.children[7]?.firstElementChild;
  const profileImageField = block.children[8];

  const blockquote = document.createElement('blockquote');

  let layout = 'default';

  if (layoutField) {
    const value = layoutField.textContent.trim().toLowerCase();

    if (value.includes('center')) {
      layout = 'centered';
    } else if (value.includes('right')) {
      layout = 'right';
    } else if (value.includes('profile')) {
      layout = 'profile';
    }
  }

  blockquote.classList.add(layout);

  if (title?.textContent.trim()) {
    title.className = 'quote-title';
    blockquote.append(title);
  }

  if (quotation) {
    quotation.className = 'quote-quotation';
    blockquote.append(quotation);
  }

  if (description?.textContent.trim()) {
    description.className = 'quote-description';
    blockquote.append(description);
  }

  if (layout === 'profile' && attribution) {
    const authorWrapper = document.createElement('div');
    authorWrapper.className = 'quote-author';

    const imageWrapper = document.createElement('div');
    imageWrapper.className = 'quote-author-image';

    const image = profileImageField?.querySelector('img');

    if (image) {
      const picture = createOptimizedPicture(
        image.src,
        image.alt || attribution.textContent.trim() || 'Profile Image',
        false,
        [{ width: '100' }],
      );

      imageWrapper.append(picture);
      authorWrapper.append(imageWrapper);
    }

    const authorInfo = document.createElement('div');
    authorInfo.className = 'quote-author-info';

    attribution.className = 'quote-attribution';
    authorInfo.append(attribution);

    authorWrapper.append(authorInfo);
    blockquote.append(authorWrapper);
  } else if (attribution) {
    attribution.className = 'quote-attribution';
    blockquote.append(attribution);
  }

  const ems = blockquote.querySelectorAll('em');

  ems.forEach((em) => {
    const cite = document.createElement('cite');
    cite.innerHTML = em.innerHTML;
    em.replaceWith(cite);
  });

  if (backgroundField?.textContent.trim()) {
    blockquote.style.setProperty(
      '--quote-bg',
      backgroundField.textContent.trim(),
    );
  }

  if (textColorField?.textContent.trim()) {
    blockquote.style.setProperty(
      '--quote-text',
      textColorField.textContent.trim(),
    );
  }

  if (quoteColorField?.textContent.trim()) {
    blockquote.style.setProperty(
      '--quote-color',
      quoteColorField.textContent.trim(),
    );
  }

  block.innerHTML = '';
  block.append(blockquote);
}
