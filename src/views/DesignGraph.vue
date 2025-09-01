<template>
  <!-- main -->
  <v-main 
    class="d-flex flex-column justify-center align-center"
  >
    <v-container fluid class="pa-0 ma-0">
      <div class="flow-wrap mx-auto">
        <VueFlow :nodes="nodes" :edges="edges">
        </VueFlow>
      </div>

    </v-container>                  
  </v-main>
</template>

<script setup>
import { ref } from 'vue'
import { VueFlow } from '@vue-flow/core'

// these components are only shown as examples of how to use a custom node or edge
// you can find many examples of how to create these custom components in the examples page of the docs

// these are our nodes
const nodes = ref([
  // an input node, specified by using `type: 'input'`
  { 
    id: '1',
    type: 'input', 
    position: { x: 400, y: 5 },
    // all nodes can have a data object containing any data you want to pass to the node
    // a label can property can be used for default nodes
    data: { label: 'Microservice 1' },
  },

  // default node, you can omit `type: 'default'` as it's the fallback type
  { 
    id: '2', 
    position: { x: 100, y: 100 },
    data: { label: 'Service 1' },
  },

  // An output node, specified by using `type: 'output'`
  { 
    id: '3', 
    type: 'output', 
    position: { x: 400, y: 200 },
    data: { label: 'Microservice 2' },
  },

  // this is a custom node
  // we set it by using a custom type name we choose, in this example `special`
  // the name can be freely chosen, there are no restrictions as long as it's a string
  {
    id: '4',
    type: 'special', // <-- this is the custom node type name
    position: { x: 700, y: 100 },
    data: {
      label: 'Function',
      hello: 'world',
    },
  },
])

// these are our edges
const edges = ref([
  // default bezier edge
  // consists of an edge id, source node id and target node id
  { 
    id: 'e1->2',
    source: '1', 
    target: '2',
  },

  // set `animated: true` to create an animated edge path
  { 
    id: 'e2->3',
    source: '2', 
    target: '3', 
    animated: true,
  },

  // a custom edge, specified by using a custom type name
  // we choose `type: 'special'` for this example
  {
    id: 'e3->4',
    type: 'special',
    source: '3',
    target: '4',

    // all edges can have a data object containing any data you want to pass to the edge
    data: {
      hello: 'world',
    }
  },
])
</script>


<style>
/* import the necessary styles for Vue Flow to work */
@import '@vue-flow/core/dist/style.css';

/* import the default theme, this is optional but generally recommended */
@import '@vue-flow/core/dist/theme-default.css';
.flow-wrap {
  width: min(1200px, 90vw);   /* pick your target width */
  height: 700px;               /* or 600px / 100% if parent is sized */
  /* optional centering helper when not using Vuetify utils: margin: 0 auto; */
}

/* Let Vue Flow fill the wrapper */
.flow-wrap .vue-flow {
  width: 100%;
  height: 100%;
  /* background-color: gray; */
}

</style>
