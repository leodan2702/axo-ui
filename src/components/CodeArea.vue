<template>
  <MonacoEditor
    theme="vs"
    :options="options"
    language="python"
    :width="800"
    :height="800"
    :diffEditor="false"
    :original="original"
    v-model:value="code"
  ></MonacoEditor>
</template>

<script setup>
import MonacoEditor from 'monaco-editor-vue3'
import {ref} from "vue"
const code = ref(`from axo import Axo, axo_method

# write your code here
`)


</script>
<style scoped>
.code-area{
    background-color: #f2f2f2ff ;
    max-width: 750px;
    height: 450px;
}
</style>