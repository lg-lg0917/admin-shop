import Vue from 'vue'
import App from './App.vue'
import router from './router'
// import './styles/common.css'
import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
import axios from 'axios'
Vue.config.productionTip = false
// 只要是vue的插件，如果是基于模块化开发模式，必须use一下，才能使用
Vue.use(ElementUI)
// 将axio挂载到vue的原型上 使axios在其他的地方也能使用 所有的实例都可以共享
Vue.prototype.$axios = axios
axios.defaults.baseURL = 'http://localhost:8888/api/private/v1/'

// 添加请求拦截器
axios.interceptors.request.use(function (config) {
  // 在发送请求之前做些什么
  config.headers.Authorization = localStorage.getItem('token')
  return config
}, function (error) {
  // 对请求错误做些什么
  return Promise.reject(error)
})

// 添加响应拦截器
axios.interceptors.response.use(function (response) {
  // 对响应数据做点什么
  response = response.data
  if (response.meta.status === 401) {
    response.meta.msg = '您的登录已失效'
    localStorage.removeItem('token')
    router.push('/login')
  }
  return response
}, function (error) {
  // 对响应错误做点什么
  return Promise.reject(error)
})

new Vue({
  router,
  render: h => h(App)
}).$mount('#app')
