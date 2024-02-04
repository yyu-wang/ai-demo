import { createRouter, createWebHistory } from 'vue-router'
import NProgress from '@/config/NProgress'
import Layout from '@/layout/index.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/login',
      name: 'login',
      component: () => import('@/views/login/LoginView.vue'),
      meta: {
        isHide: true,
        title: 'login'
      }
    },
    {
      path: '/layout',
      name: 'layout',
      component: Layout,
      children: [
        {
          path: '/',
          name: 'home',
          component: () => import('@/views/home/index.vue'),
          meta: {
            isHide: true,
            title: 'Home',
            icon: 'HomeFilled'
          }
        },
        {
          path: '/assistant',
          name: 'assistant',
          component: () => import('@/views/assistant/index.vue'),
          meta: {
            isHide: true,
            title: 'Assistant',
            icon: 'Tools'
          }
        },
        {
          path: '/chat',
          name: 'Playground',
          component: () => import('@/views/chat/index.vue'),
          meta: {
            isHide: true,
            title: 'Playground',
            icon: 'Comment'
          }
        }
        // {
        //   path: '/test',
        //   name: 'test',
        //   component: () => import('@/views/test/indexView.vue'),
        //   meta: {
        //     isHide: true,
        //     title: 'test',
        //     icon: 'Comment'
        //   }
        // }
      ]
    }
  ]
})

/**
 * @description 路由拦截 beforeEach
 * */
router.beforeEach(async (to, from, next) => {
  // 1.NProgress 开始
  NProgress.start()

  // 2.动态设置标题
  const title = 'ai-demo'
  document.title = to.meta.title ? `${to.meta.title} - ${title}` : title

  // 3.判断是访问登陆页，有 Token 就在当前页面，没有 Token 重置路由到登陆页
  const token = sessionStorage.getItem('token')
  if (to.path.toLocaleLowerCase() === '/login') {
    if (token) return next(from.fullPath)
    return next()
  }

  // 判断是否有 Token，没有重定向到 login 页面
  if (!token) return next({ path: '/login', replace: true })

  // userStore.setMenuActive(from.path)
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
