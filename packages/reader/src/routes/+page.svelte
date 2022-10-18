<script>
  import {Node} from '../lib';

  const test = {
    type: "root",
    children: [
      {
        type: 'heading',
        depth: 1,
        children: [
          {type: 'text', value: 'Hello World!'},
        ]
      },
      {
        type: 'link',
        title: 'Custom Title',
        url: './NoteA.mdl',
        children: [
          {type: 'text', value: 'Custom Title'}
        ]
      },
      {
        type: 'codemirror',
        language: 'kdl',
        value: "symbol X",
        path: 'X.kdl'
      }
    ]
  }

</script>

<Node node={test}/>

<style lang="scss">

</style>
