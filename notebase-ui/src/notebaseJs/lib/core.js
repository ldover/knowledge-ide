export class System {
  constructor(title, nodes = []) {
    this.title = title;
    this.nodes = nodes
  }

  add(...nodes) {
    return (this.nodes = [...this.nodes, ...nodes])
  }

  render() {
    return {
      type: 'system',
      system: this,
      children: this.nodes
    }
  }
}


export class Statement extends System {
  constructor(title, nodes = []) {
    super(title, nodes)
  }

  render() {
    return {
      type: 'statement',
      statement: this,
      children: this.nodes
    }
  }
}

const valueNode = (type, value) => ({
  type,
  value
});

export const reference = (node) => valueNode("reference", node);