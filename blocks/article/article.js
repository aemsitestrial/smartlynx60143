import { getAEMPublish, getAEMAuthor } from '../../scripts/endpointconfig.js';

const escapeHtml = (value = '') => String(value)
  .replace(/&/g, '&amp;')
  .replace(/</g, '&lt;')
  .replace(/>/g, '&gt;')
  .replace(/"/g, '&quot;')
  .replace(/'/g, '&#39;');

function getFallbackArticle(block) {
  const title = block.querySelector('h1, h2, h3, h4, h5')?.textContent?.trim() || 'Article';

  const description = block.querySelector('p')?.textContent?.trim()
    || 'Article content is available in the authored document.';

  return {
    title,
    content: {
      plaintext: description,
    },
  };
}

/* eslint-disable no-underscore-dangle */
export default async function decorate(block) {
  const aempublishurl = getAEMPublish();
  const aemauthorurl = getAEMAuthor();
  const persistedquery = '/graphql/execute.json/tcs/ArticleByPath';

  const sourceLink = block.querySelector('a[href]');

  let rawArticlePath = '';

  if (sourceLink) {
    rawArticlePath = new URL(
      sourceLink.href,
      window.location.origin,
    ).pathname;
  } else {
    rawArticlePath = block
      .querySelector(':scope div:first-child div')
      ?.textContent
      ?.trim() || '';
  }

  const articlepath = rawArticlePath || block.dataset?.path || '';

  const variationname = block.children?.[1]?.textContent?.trim() || 'main';

  console.log('ARTICLE PATH:', articlepath);
  console.log('VARIATION:', variationname);
  console.log('PUBLISH URL:', aempublishurl);
  console.log('AUTHOR URL:', aemauthorurl);

  if (!articlepath || (!aempublishurl && !aemauthorurl)) {
    const fallback = getFallbackArticle(block);

    block.innerHTML = `
      <div class="article-content" data-aue-type="text">
        <div>
          <h4 class="headline">${escapeHtml(fallback.title)}</h4>
          <p class="detail">${escapeHtml(fallback.content.plaintext)}</p>
        </div>
      </div>
    `;

    return;
  }

  const baseUrl = window.location.origin.includes('author')
    ? aemauthorurl
    : aempublishurl;

  const url = `${baseUrl}${persistedquery};path=${encodeURIComponent(articlepath)};variation=${encodeURIComponent(variationname)};ts=${Date.now()}`;

  console.log('GRAPHQL URL:', url);

  let cfReq = getFallbackArticle(block);

  try {
    const response = await fetch(url, {
      credentials: 'include',
    });

    console.log('FETCH STATUS:', response.status);

    if (response.ok) {
      const contentfragment = await response.json();

      console.log('CF RESPONSE:', contentfragment);

      if (contentfragment?.data?.articleByPath?.item) {
        cfReq = contentfragment.data.articleByPath.item;
      }
    }
  } catch (error) {
    console.error('Article fetch failed:', error);
  }

  const itemId = `urn:aemconnection:${articlepath}/jcr:content/data/master`;

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
          data-aue-prop="headline"
          data-aue-label="headline"
          data-aue-type="text"
          class="headline"
        >
          ${escapeHtml(cfReq.title || 'Article')}
        </h4>

        <p
          data-aue-prop="detail"
          data-aue-label="detail"
          data-aue-type="richtext"
          class="detail"
        >
          ${escapeHtml(
    cfReq.content?.plaintext
            || cfReq.content
            || 'Article content is available in the authored document.',
  )}
        </p>
      </div>
    </div>
  `;
}
