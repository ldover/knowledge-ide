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

export function computeRelativePath(from, to) {
  const url0Parts = from.split('/');
  const url1Parts = to.split('/');

  let j;

  // Don't check the file at the end, hence url1Parts.length - 1 (solves edge case when from === to)
  for (let i = 0; i < url1Parts.length - 1; i++) {
    if (url0Parts[i] === url1Parts[i]) {
      j = i;
    } else {
      break;
    }
  }

  if (j === undefined) throw new Error('Invalid paths share no common folder');

  const url0PartsTrimmed = url0Parts.slice(j + 1);
  const url1PartsTrimmed = url1Parts.slice(j + 1);

  let backwardsPath = url0PartsTrimmed.length - 1 > 0 ? [...Array(url0PartsTrimmed.length - 1 )].map(() => '..').join('/') : '.'
  let forwardsPath = url1PartsTrimmed.join('/');

  return [backwardsPath, forwardsPath].join('/');
}
