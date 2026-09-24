export default async function decorate(block) {
  console.clear();

  console.log('========== QUOTE DEBUG ==========');

  console.log('Total Rows:', block.children.length);

  [...block.children].forEach((row, index) => {
    console.log(`Row ${index}:`, row.innerHTML);
  });

  const profileImageField = block.children[8];

  console.log('Profile Image Field:', profileImageField);

  console.log(
    'Profile Image Field HTML:',
    profileImageField?.innerHTML || 'EMPTY',
  );

  const layoutField = block.children[4]?.firstElementChild;

  let layout = 'default';

  if (layoutField) {
    const value = layoutField.textContent.trim().toLowerCase();

    console.log('Layout Text:', value);

    if (value.includes('center')) {
      layout = 'centered';
    } else if (value.includes('right')) {
      layout = 'right';
    } else if (value.includes('profile')) {
      layout = 'profile';
    }
  }

  console.log('Final Layout:', layout);

  const picture = profileImageField?.querySelector('picture');
  const img = profileImageField?.querySelector('img');
  const link = profileImageField?.querySelector('a');

  console.log('Picture Found:', picture);
  console.log('Image Found:', img);
  console.log('Link Found:', link);

  block.innerHTML = `
    <div style="padding:20px;">
      <h2>Debug Mode</h2>
      <p><strong>Layout:</strong> ${layout}</p>

      <h3>Image Output</h3>

      <div class="quote-author-image">
        ${profileImageField?.innerHTML || 'NO IMAGE'}
      </div>
    </div>
  `;
}
