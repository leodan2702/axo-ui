<template>
  <MonacoEditor
    theme="vs"
    :options="options"
    language="python"
    :width="500"
    :height="800"
    :diffEditor="false"
    :original="original"
    v-model:value="activeObjectsStore.form.axo_code"
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
.code-area{
    background-color: #f2f2f2ff ;
    max-width: 750px;
    height: 450px;
}
</style>