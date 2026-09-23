export default async function decorate(block) {
  const quotation = block.children[0]?.firstElementChild;
  const attribution = block.children[1]?.firstElementChild;
  const layoutField = block.children[2]?.firstElementChild;

  const blockquote = document.createElement('blockquote');

  let layout = 'default';

  if (layoutField) {
    layout = layoutField.textContent.trim().toLowerCase();
  }

  blockquote.classList.add(layout);

  quotation.className = 'quote-quotation';
  blockquote.append(quotation);

  if (attribution) {
    attribution.className = 'quote-attribution';
    blockquote.append(attribution);

    const ems = attribution.querySelectorAll('em');

    ems.forEach((em) => {
      const cite = document.createElement('cite');
      cite.innerHTML = em.innerHTML;
      em.replaceWith(cite);
    });
  }

  block.innerHTML = '';
  block.append(blockquote);
}
