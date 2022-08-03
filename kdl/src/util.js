/**
 * Computes absolute url given by current url and relative url
 * if absoluteUrl '~/fileA.kdl' and relative url './fileB.kdl', then new absolute is '~/fileB.kdl'
 * @param absoluteUrl
 * @param relativeUrl
 * @return {string|null} - returns url or null if invalid url
 */

export function computeAbsolutePath(absoluteUrl, relativeUrl) {
  const absoluteParts = absoluteUrl.split('/');
  const relativeParts = relativeUrl.split('/');

  let folderCursor = absoluteParts.length - 2; // We start at current folder
  let addParts = [];

  for (let i = 0; i < relativeParts.length; i++) {
    const part = relativeParts[i];

    if (part === '.') {
      // Keep cursor the same
    } else if (part === '..') {
      if (folderCursor <= 0) {
        // Invalid url, goes past root
        return null;
      }

      // Walk back one folder
      folderCursor -= 1;
    } else {
      addParts.push(part);
    }
  }

  return absoluteParts.slice(0, folderCursor + 1)
    .concat(addParts)
    .join('/')
}
