const { fetch } = require('got-fetch');
const { URL, resolve } = require('url');
async function getContent(url) {
  if (!isValidURL(url)) {
    console.log('No URL provided')
    return null;
  }
  const response = await fetch(url);
  try {
    const text = response.body.toString();
    return text;
  } catch (error) {
    console.log(error);
    return null
  }
}
function isValidURL(str) {
  var pattern = new RegExp('^(https?:\\/\\/)?' + // protocol
    '((([a-z\\d]([a-z\\d-]*[a-z\\d])*)\\.)+[a-z]{2,}|' + // domain name
    '((\\d{1,3}\\.){3}\\d{1,3}))' + // OR ip (v4) address
    '(\\:\\d+)?(\\/[-a-z\\d%_.~+]*)*' + // port and path
    '(\\?[;&a-z\\d%_.~+=-]*)?' + // query string
    '(\\#[-a-z\\d_]*)?$', 'i'); // fragment locator
  return !!pattern.test(str);
}
function fixRelativeLinks(body, domain) {
  if (!body) return null;
  return body.replace(/(href|src)="([^"]+)"/gi, (match, attr, link) => {
    const resolvedLink = new URL(link, domain).href
    return `${attr}="${resolvedLink}"`;
  })
}
module.exports = {
  getContent,
  fixRelativeLinks,
  isValidURL
}