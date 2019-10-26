import Vue from 'vue'
import VueRouter from 'vue-router'
import Login from '../components/Login.vue'
import Index from '../components/Index.vue'
import Users from '../components/User.vue'
import Roles from '../components/Roles.vue'
import Rights from '../components/Rights.vue'
// import引入
Vue.use(VueRouter)

const originalPush = VueRouter.prototype.push
VueRouter.prototype.push = function push (location) {
  return originalPush.call(this, location).catch(err => err)
}

const routes = [
  { path: '/', redirect: '/index' },
  { path: '/index',
    component: Index,
    children: [
      { path: '/user', component: Users },
      { path: '/roles', component: Roles },
      { path: '/rights', component: Rights }
    ]
  },
  { path: '/Login', component: Login }
]

const router = new VueRouter({
  routes
})
// 所有的路由在被访问时，都会先经过全局前置守卫，只有前置守卫放行了，才能显示匹配的路由    to到哪里去 from从哪里来 next是否放行next（地址）
// localStorage.getItem()
router.beforeEach((to, from, next) => {
  // console.log(to)
  // 做个判断如果去登陆就放行，或者是有token令牌也放行
  // 其他情况，拦截到登录页
  const token = localStorage.getItem('token')
  if (to.path === '/login' || token) {
    next()
  } else {
    next('/login')
  }
})
export default router // 输出默认值
