export default function decorate(block) {
  const rows = [...block.children];

  const profileImageRow = rows[8];

  const picture = profileImageRow?.querySelector('picture');

  block.innerHTML = '';

  if (picture) {
    block.append(picture.cloneNode(true));
  } else {
    block.innerHTML = '<p>No image found</p>';
  }
}
