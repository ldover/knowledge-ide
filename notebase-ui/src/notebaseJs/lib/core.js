export class System {
  constructor(node, statements) {
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
  constructor(node, statements) {
    super(node, statements)
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
