import Vue from 'vue'
import App from './App.vue'
import router from './router'
// import './styles/common.css'
import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
Vue.config.productionTip = false
// 只要是vue的插件，如果是基于模块化开发模式，必须use一下，才能使用
Vue.use(ElementUI)

new Vue({
  router,
  render: h => h(App)
}).$mount('#app')
