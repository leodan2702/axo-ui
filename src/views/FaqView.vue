<template>
  <div class="pa-4 pa-md-8">
    <!-- Header -->
    <div class="d-flex align-center justify-space-between mb-4">
      <div>
        <h1 class="text-h5 text-md-h4 font-weight-bold mb-1">Frequently Asked Questions</h1>
        <p class="text-body-2 text-medium-emphasis mb-0">
          Find quick answers on how to create roles, endpoints, active objects, and choreographies — how to execute them and how to review the results.
        </p>
      </div>
      <v-avatar size="44" color="primary" variant="tonal" class="d-none d-md-flex">
        <v-icon icon="mdi-comment-question-outline" />
      </v-avatar>
    </div>

    <!-- Filters -->
    <v-row class="mb-4" dense>
      <v-col cols="12" md="6">
        <v-text-field
          v-model="query"
          variant="outlined"
          density="comfortable"
          hide-details
          placeholder="Search: create role, endpoint, run choreography..."
          prepend-inner-icon="mdi-magnify"
          clearable
        />
      </v-col>
      <v-col cols="12" md="3">
        <v-select
          v-model="selectedCategory"
          :items="categories"
          variant="outlined"
          density="comfortable"
          hide-details
          prepend-inner-icon="mdi-filter-variant"
          label="Category"
          clearable
        />
      </v-col>
      <v-col cols="12" md="3" class="d-flex align-center">
        <v-switch
          v-model="expandFirst"
          inset
          color="primary"
          hide-details
          label="Expand first card"
        />
      </v-col>
    </v-row>

    <!-- FAQ Cards Grid -->
    <v-row dense>
      <v-col
        v-for="(item, i) in filteredFaqs"
        :key="i"
        cols="12" sm="6" md="4"
      >
        <FaqCard
          :id="i"
          :icon="item.icon"
          :title="item.q"
          :subtitle="item.subtitle"
          :answer="item.a"
          :defaultOpen="expandFirst && i === 0"
          :actions="item.actions"
        />
      </v-col>
    </v-row>

    <!-- Empty state -->
    <div v-if="!filteredFaqs.length" class="text-center py-12">
      <v-icon icon="mdi-emoticon-confused-outline" size="40" class="mb-2" />
      <div class="text-body-1">No results found for your search.</div>
      <div class="text-body-2 text-medium-emphasis">Try searching “choreography”, “endpoint”, or “role”.</div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import FaqCard from '@/components/FaqCard.vue'

const query = ref('')
const selectedCategory = ref(null)
const expandFirst = ref(true)

const faqs = ref([
{
  icon: 'mdi-badge-account',
  category: 'Security',
  q: 'How to create a role?',
  subtitle: 'Minimum permissions per resource',
  a: 'Open the security panel, select “New Role”, define its name and set permissions for each action (create, read, update, execute), then save.',
  actions: [{ label: 'Go to Roles', to: '/roles', icon: 'mdi-arrow-right' }]
},
{
  icon: 'mdi-access-point-network',
  category: 'Endpoints',
  q: 'How to create an endpoint?',
  subtitle: 'Required host and ports',
  a: 'Go to the endpoint catalog, add a new one, enter the required host and ports, validate connectivity, and save.',
  actions: [{ label: 'New Endpoint', to: '/endpoints', icon: 'mdi-plus' }]
},
{
  icon: 'mdi-cog',
  category: 'Active Objects',
  q: 'How to register an Active Object (AO)?',
  subtitle: 'Alias and default parameters',
  a: 'In the AO catalog, create a new one, assign its alias or execution method, and define default init parameters.',
  actions: [{ label: 'AO Catalog', to: '/my-objects', icon: 'mdi-arrow-right' }]
},
{
  icon: 'mdi-vector-polyline',
  category: 'Choreographies',
  q: 'How to create a choreography?',
  subtitle: 'Connecting AOs on the canvas',
  a: 'In the editor, drag AOs onto the canvas, connect them with edges in the desired order, and configure parameters for each node.',
  actions: [{ label: 'Go to Editor', to: '/design', icon: 'mdi-pencil-ruler' }]
},
{
  icon: 'mdi-tune-variant',
  category: 'Parameters',
  q: 'How to differentiate init and call parameters?',
  subtitle: 'Execution lifecycle',
  a: 'init is used when the AO is instantiated; call is sent each time the choreography is executed.',
},
{
  icon: 'mdi-bucket-outline',
  category: 'Buckets',
  q: 'How to validate the destination bucket?',
  subtitle: 'Quick metadata verification',
  a: 'Enter the bucket ID and use the shortcut icon to open its metadata in a new tab.',
},
{
  icon: 'mdi-play-circle-outline',
  category: 'Execution',
  q: 'How to execute a choreography?',
  subtitle: 'Save and run',
  a: 'Save the definition, click “Run”, and monitor the progress in the execution panel.',
  actions: [{ label: 'Run', to: '/design?run=true', icon: 'mdi-play' }]
},
{
  icon: 'mdi-file-chart-outline',
  category: 'Observability',
  q: 'How to view results and logs?',
  subtitle: 'Traces and artifacts',
  a: 'Open the execution panel to view traces and states. Artifacts can be accessed through the configured bucket metadata.',
},
{
  icon: 'mdi-source-branch',
  category: 'Choreographies',
  q: 'How to connect AOs together?',
  subtitle: 'Edges and logical order',
  a: 'Create edges from one AO’s output to the next AO’s input, defining the logical order of the flow.',
},
{
  icon: 'mdi-cable-data',
  category: 'Endpoints',
  q: 'Why can’t I instantiate an endpoint from the editor?',
  subtitle: 'References vs. creation',
  a: 'It must exist first in the endpoint catalog; then it can be referenced from the flow configuration.',
},
{
  icon: 'mdi-shield-key-outline',
  category: 'Security',
  q: 'How to manage access permissions?',
  subtitle: 'Roles and policies per resource',
  a: 'Assign roles to users and define policies for each action (create, read, update, execute) on every resource.',
},
{
  icon: 'mdi-clipboard-list-outline',
  category: 'Best Practices',
  q: 'How to test a choreography before deployment?',
  subtitle: 'Iterative testing',
  a: 'Use sample data, run the choreography in stages, and validate intermediate outputs before executing the full flow.',
}

])

const categories = computed(() => {
  const set = new Set(faqs.value.map(f => f.category))
  return Array.from(set)
})

const filteredFaqs = computed(() => {
  const q = query.value.trim().toLowerCase()
  const cat = (selectedCategory.value || '').toString().toLowerCase()

  return faqs.value.filter(f => {
    const hitQ =
      !q ||
      f.q.toLowerCase().includes(q) ||
      (f.a && f.a.toLowerCase().includes(q)) ||
      (f.subtitle && f.subtitle.toLowerCase().includes(q))
    const hitC = !cat || f.category.toLowerCase() === cat
    return hitQ && hitC
  })
})
</script>

<style scoped>
/* Minor layout touches */
</style>
