import './assets/main.css';
import 'bootstrap/dist/css/bootstrap.min.css'; // Added Bootstrap CSS

import { createApp } from 'vue';
// import { createPinia } from 'pinia'; // Removed Pinia import

import App from './App.vue';
import router from './router';
import { authService } from './services/authService'; // Import authService

// Initialize auth state before mounting the app
authService.loadAuthState();

const app = createApp(App);

// app.use(createPinia()); // Removed Pinia usage
app.use(router);

app.mount('#app');
