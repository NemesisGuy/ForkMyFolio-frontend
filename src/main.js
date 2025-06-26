import './assets/main.css';
import 'bootstrap/dist/css/bootstrap.min.css'; // Added Bootstrap CSS

import { createApp } from 'vue';
// import { createPinia } from 'pinia'; // Removed Pinia import

import App from './App.vue';
import router from './router'; // Will check/update router/index.ts next

const app = createApp(App);

// app.use(createPinia()); // Removed Pinia usage
app.use(router);

app.mount('#app');
