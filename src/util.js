/** Dispatch event on click outside of node */
export function clickOutside(node) {

  const handleClick = event => {
    if (node && !node.contains(event.target) && !event.defaultPrevented) {
      node.dispatchEvent(
        new CustomEvent('outclick', node)
      )
    }
  }

  document.addEventListener('click', handleClick, true);

  return {
    destroy() {
      document.removeEventListener('click', handleClick, true);
    }
  }
}

export function getFileType(file) {
  // try to infer type
  if (file.path.endsWith('.mdl')) return 'mdl';
  if (file.path.endsWith('.kdl')) return 'kdl';

  return null;
}