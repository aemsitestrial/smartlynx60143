import { getAEMPublish, getAEMAuthor } from '../../scripts/endpointconfig.js';

const escapeHtml = (value = '') => String(value)
  .replace(/&/g, '&amp;')
  .replace(/</g, '&lt;')
  .replace(/>/g, '&gt;')
  .replace(/"/g, '&quot;')
  .replace(/'/g, '&#39;');

function getFallbackArticle(block) {
  const title = block.querySelector('h1, h2, h3, h4, h5')?.textContent?.trim()
    || 'Article';

  const description = block.querySelector('p')?.textContent?.trim()
    || 'Article content is available in the authored document.';

  return {
    title,
    content: {
      plaintext: description,
    },
  };
}

export default async function decorate(block) {
  const aempublishurl = getAEMPublish();
  const aemauthorurl = getAEMAuthor();

  const persistedquery = '/graphql/execute.json/aem-boilerplate-frescopa/ArticleByPath';

  const sourceLink = block.querySelector('a[href]');

  let rawArticlePath = '';

  if (sourceLink) {
    rawArticlePath = new URL(
      sourceLink.href,
      window.location.origin,
    ).pathname;
  } else {
    rawArticlePath = block
      .querySelector(':scope > div:first-child > div')
      ?.textContent
      ?.trim() || '';
  }

  const articlepath = (rawArticlePath || block.dataset?.path || '').replace(/\.html$/, '');

  const variationname = 'main';

  console.log('PUBLISH URL:', aempublishurl);
  console.log('AUTHOR URL:', aemauthorurl);
  console.log('ARTICLE PATH:', articlepath);
  console.log('VARIATION:', variationname);

  if (!articlepath || (!aempublishurl && !aemauthorurl)) {
    const fallback = getFallbackArticle(block);

    block.innerHTML = `
      <div class="article-content">
        <div>
          <h4>${escapeHtml(fallback.title)}</h4>
          <p>${escapeHtml(fallback.content.plaintext)}</p>
        </div>
      </div>
    `;

    return;
  }

  const baseUrl = window.location.origin.includes('author')
    ? aemauthorurl
    : aempublishurl;

  const url = `${baseUrl}${persistedquery};path=${articlepath};variation=${variationname};ts=${Date.now()}`;

  console.log('GRAPHQL URL:', url);

  let cfReq = getFallbackArticle(block);

  try {
    const response = await fetch(url, {
      credentials: 'include',
    });

    console.log('FETCH STATUS:', response.status);

    const result = await response.json();

    console.log('GRAPHQL RESPONSE:', result);

    if (result?.data?.articleByPath?.item) {
      cfReq = result.data.articleByPath.item;
    }
  } catch (error) {
    console.error('ARTICLE FETCH ERROR:', error);
  }

  const itemId = `urn:aemconnection:${articlepath}/jcr:content/data/main`;

  block.innerHTML = `
    <div
      class="article-content"
      data-aue-resource="${itemId}"
      data-aue-label="article content fragment"
      data-aue-type="reference"
      data-aue-filter="cf"
    >
      <div>
        <h4
          data-aue-prop="title"
          data-aue-label="title"
          data-aue-type="text"
        >
          ${escapeHtml(cfReq.title || 'Article')}
        </h4>

        <p
          data-aue-prop="content"
          data-aue-label="content"
          data-aue-type="richtext"
        >
          ${escapeHtml(
    cfReq.content?.plaintext
            || cfReq.content
            || 'No content found',
  )}
        </p>
      </div>
    </div>
  `;
}
