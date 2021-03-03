import Vue from 'vue'
import App from './App.vue'
import './registerServiceWorker'
import router from './router'
import store from './store'
import '@/assets/style/common.scss'
import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
import YZ from "yzmap-core";
import yzmap from "yzmap-mobile";
import "yzmap-core/dist/yzmap.core.css";
import "yzmap-mobile/lib/yzmap-mobile.css";
Vue.config.productionTip = false

Vue.use(ElementUI)
Vue.use(YZ)
Vue.use(yzmap)
window.$app = new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
