import { defineConfig,loadEnv } from 'vite'
import vue from '@vitejs/plugin-vue'
import vuetify from 'vite-plugin-vuetify';

export default defineConfig(({ mode }) => {
  // Load all env variables based on the current mode.
  // The third argument '' allows loading variables without the VITE_ prefix.
  const env = loadEnv(mode, process.cwd(), '');

  return {
    base: env.VITE_BASE_PATH || '',
    plugins: [vue(),vuetify()],
    resolve:{
      alias: {
        '@': '/src',
      }
    },
    // Example: Using an environment variable to configure the dev server
    server: {
      port: Number(env.VITE_SERVER_PORT) || 5173, // Use the variable here
    },
    
    // Example: Passing a variable to your client-side code
    define: {
      // You can still expose variables to your app this way
      '__APP_TITLE__': JSON.stringify(env.VITE_APP_TITLE),
    }
  };
});


// https://vite.dev/config/
// export default defineConfig({
//   base: BASE_PATH,
//   plugins: [
//     vue(),
//     vuetify()
//   ],
//   resolve: {
//     alias: {
//       '@': '/src',
//     }
//   }
// })





