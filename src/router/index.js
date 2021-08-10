import Vue from 'vue'
import VueRouter from 'vue-router'
// import store from '@/store/'
// import TyhMessage from 'tyh-ui/packages/message'

Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    component: () => import('@/views/layout'),
    children: [
      // 首页
      {
        path: '',
        name: 'home',
        component: () => import('@/views/home'),
        meta: { requiresAuth: false }
      },
      // 设置
      {
        path: '/setting',
        name: 'setting',
        component: () => import('@/views/setting'),
        meta: { requiresAuth: true }
      }
    ]
  },
  // 登录
  {
    path: '/user/login',
    name: 'login',
    component: () => import('@/views/login'),
    meta: { requiresAuth: false }
  },
  // 注册
  {
    path: '/user/register',
    name: 'register',
    component: () => import('@/views/register'),
    meta: { requiresAuth: false }
  }
]

const router = new VueRouter({
  routes
})

// 解决路由冗余导航报错问题
// const originalPush = VueRouter.prototype.push
// VueRouter.prototype.push = function push (location) {
//   return originalPush.call(this, location).catch(err => err)
// }

// router.beforeEach((to, from, next) => {
//   const user = store.state.userInfo
//   // 如果需要登录的路由
//   if (to.meta.requiresAuth) {
//     // 判断用户信息是否存在
//     if (user) {
//       // 存在就直接通过
//       return next()
//     }
//     // 否则消息提示 并跳转登录页面
//     TyhMessage({
//       message: '请登录后再试',
//       type: 'success',
//       iconClass: 'tyh-ui-danger-01'
//     })
//     return next('/user/login')
//   }
//   // 不需要登录的直接通过
//   return next()
// })

export default router
