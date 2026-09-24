export default function decorate(block) {
  const imagePath = block.textContent.trim();

  block.innerHTML = `
    <div class="quote-image">
      ${imagePath}
    </div>
  `;
}
