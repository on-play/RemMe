import { createApp } from 'vue';
import App from './App.vue';
import '../popup/style.css'; // Reuse same styles

const app = createApp(App);
app.mount('#app');

