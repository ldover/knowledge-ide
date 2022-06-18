<script>

import FileTree from "./FileTree.svelte";
import CodeMirror from "./CodeMirror.svelte";
</script>

<div class="w-full flex h-full justify-between overflow-x-hidden">
    <div class="w-64 bg-gray-100">
        <FileTree/>
    </div>
    <div class="flex-grow h-full">
        <CodeMirror />
    </div>
    <div class="w-1/3 h-full">
        <iframe src="http://localhost:2345" height="1000px" width="100%" title="Notebase UI"></iframe>
    </div>
</div>

<style lang="scss">

</style>
