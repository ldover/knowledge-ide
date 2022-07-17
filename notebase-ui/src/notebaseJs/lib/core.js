export class System {
  constructor(title, node, statements) {
    this.title = title;
    this.node = node;
    this.statements = statements;
  }

  render() {
    return {
      type: 'root',
      note: this,
      children: [
        this.node,
        ...this.statements.reduce((all, statement) => [...all, ...statement.render()], []),
      ]
    }
  }
}


export class Statement extends System {
  constructor(title, node, statements = []) {
    super(title, node, statements)
  }

  /** TODO:
   *  Consider doing this instead, after adapting the UI
   *  render() {
   *     const out = super.render();
   *     out.type = 'statement';
   *     return out;
   *   }
   */


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