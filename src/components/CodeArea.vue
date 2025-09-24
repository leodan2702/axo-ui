<template>
  <MonacoEditor
    theme="vs"
    :options="options"
    language="python"
    :width="'100%'"  
    :height="'100%'" 
    :diffEditor="false"
    :original="original"
    v-model:value="activeObjectsStore.form.axo_code"
    class="code-editor"
  ></MonacoEditor>
</template>

<script setup>
import MonacoEditor from 'monaco-editor-vue3'
import {ref} from "vue"
import { useActiveObjectsStore } from '@/store/active_objects'

const activeObjectsStore = useActiveObjectsStore()
const code = ref(`from axo import Axo, axo_method

# write your code here
`)


</script>
<style scoped>
.code-editor {
  width: 90% !important;
  height: 65vh !important; /* ocupa 75% de la altura visible */
}
</style>