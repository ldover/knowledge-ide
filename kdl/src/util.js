export function computeAbsolutePath(absoluteUrl, relativeUrl) {
  const absoluteParts = absoluteUrl.split('/');
  const relativeParts = relativeUrl.split('/');

  let folderCursor = absoluteParts.length - 2; // We start at current folder

  for (let i = 0; i < relativeParts.length; i++) {
    const part = relativeParts[i];

    if (part === '.') {
      // Keep cursor
    } else if (part === '..') {
      // Walk back one folder
      if (folderCursor <= 0) {
        // imported file doesn't exist
        return null;
      }

      folderCursor -= 1;
    }

    // If last part it should be file and look if we have it all
    if (i >= relativeParts.length - 1) {
      return absoluteParts.slice(0, folderCursor + 1).concat([part]).join('/')
    }
  }
}
