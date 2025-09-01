import { createApp } from 'vue';
import App from './App.vue';
import router from './router';
import { createPinia } from 'pinia';
import { loadFonts } from './plugins/webfontloader';
import vuetify from './plugins/vuetify'; 
// Vue Flow styles

loadFonts();

const app = createApp(App);
const pinia = createPinia();

app
  .use(router)
  .use(pinia)
  .use(vuetify)
  .mount('#app');
