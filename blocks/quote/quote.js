export default function decorate(block) {
  const rows = [...block.children];

  const quotation = rows[0]?.textContent?.trim() || '';
  const attribution = rows[1]?.textContent?.trim() || '';
  const title = rows[2]?.textContent?.trim() || '';
  const description = rows[3]?.textContent?.trim() || '';
  const layout = rows[4]?.textContent?.trim() || 'default';

  const profileImage = rows[8]?.textContent?.trim() || '';

  block.innerHTML = '';

  const quote = document.createElement('blockquote');
  quote.classList.add('quote', layout);

  if (profileImage && layout === 'profile') {
    const img = document.createElement('img');
    img.src = profileImage;
    img.alt = attribution || 'Profile Image';
    img.classList.add('quote-profile-image');
    quote.append(img);
  }

  if (title) {
    const heading = document.createElement('p');
    heading.className = 'quote-title';
    heading.innerHTML = title;
    quote.append(heading);
  }

  if (quotation) {
    const quotationEl = document.createElement('div');
    quotationEl.className = 'quote-text';
    quotationEl.innerHTML = quotation;
    quote.append(quotationEl);
  }

  if (description) {
    const desc = document.createElement('div');
    desc.className = 'quote-description';
    desc.innerHTML = description;
    quote.append(desc);
  }

  if (attribution) {
    const attr = document.createElement('cite');
    attr.innerHTML = attribution;
    quote.append(attr);
  }

  block.append(quote);
}
