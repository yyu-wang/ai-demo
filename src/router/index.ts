import { createRouter, createWebHistory } from 'vue-router'
import NProgress from '@/config/NProgress'
import { staticRouter } from '@/router/modules/staticRouter'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [...staticRouter]
})

/**
 * @description 路由拦截 beforeEach
 * */
router.beforeEach(async (to, from, next) => {
  // 1.NProgress 开始
  NProgress.start()

  // 2.动态设置标题
  const title = 'EduGPT'
  document.title = to.meta.title ? `${to.meta.title} - ${title}` : title

  // 检查是否存在路由
  const exists = router.hasRoute(to.name as string)

  if (!exists) {
    // 如果路由不存在，导航到404页面
    next('/404')
  }
  // 3.判断是访问登陆页，有 Token 就在当前页面，没有 Token 重置路由到登陆页
  // const token = sessionStorage.getItem('token')
  // if (to.path.toLocaleLowerCase() === '/login') {
  //   if (token) return next(from.fullPath)
  //   return next()
  // }

  // // 判断是否有 Token，没有重定向到 login 页面
  // if (!token) return next({ path: '/login', replace: true })

  // 正常访问页面
  next()
})

/**
 * @description 路由跳转错误
 * */
router.onError((error) => {
  NProgress.done()
  console.warn('路由错误', error.message)
})

/**
 * @description 路由跳转结束
 * */
router.afterEach(() => {
  NProgress.done()
})
export default router
