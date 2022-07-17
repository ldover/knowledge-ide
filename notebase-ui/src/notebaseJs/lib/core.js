export class System {
  constructor(title, statements = []) {
    this.title = title;
    this.statements = statements
  }

  add(...nodes) {
    return (this.statements = [...this.statements, ...nodes])
  }

  render() {
    return {
      type: 'root',
      note: this,
      children: this.statements
    }
  }
}


export class Statement extends System {
  constructor(title, statements = []) {
    super(title, statements)
  }

  // todo: consider creating a root structure and assigning a type: 'statement'
  render() {
    const out = super.render();
    return out.children;
  }
}

const valueNode = (type, value) => ({
  type,
  value
});

export const reference = (node) => valueNode("reference", node);