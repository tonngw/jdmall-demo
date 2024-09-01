import { createApp } from 'vue'
import './index.css'
import 'font-awesome/css/font-awesome.css'
import App from './App.vue'
import router from './router';
import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css'

const app = createApp(App);
app.use(ElementPlus);
app.use(router).mount('#app');
