<script>
  import {Node} from '../lib';

  const test = {
    type: 'heading',
    depth: 1,
    children: [
      {type: 'text', value: 'Hello World!'}
    ]
  }

</script>

<Node node={test} />

<style lang="scss">

</style>
