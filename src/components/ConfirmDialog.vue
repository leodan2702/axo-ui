<template>
  <v-dialog v-model="show" max-width="400">
    <v-card>
      <v-card-title class="text-h6">{{ title }}</v-card-title>
      <v-card-text>{{ text }}</v-card-text>
      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn text color="blue" @click="cancel">Cancel</v-btn>
        <v-btn text color="red" @click="confirm">Delete</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script setup>
import { defineProps, defineEmits, ref, watch } from 'vue'

const props = defineProps({
  modelValue: Boolean,
  title: { type: String, default: 'Confirm Deletion' },
  text: { type: String, default: 'Are you sure?' }
})

const emit = defineEmits(['update:modelValue', 'confirm'])

const show = ref(props.modelValue)

watch(() => props.modelValue, val => show.value = val)
watch(show, val => emit('update:modelValue', val))

const cancel = () => show.value = false
const confirm = () => {
  emit('confirm')
  show.value = false
}
</script>
