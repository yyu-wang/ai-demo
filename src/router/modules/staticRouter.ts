/**
 * staticRouter (静态路由)
 */
import { RouteRecordRaw } from 'vue-router'
import AdminLayout from '@/layout/admin/index.vue'
import ClientLayout from '@/layout/client/index.vue'

export const staticRouter: RouteRecordRaw[] = [
  {
    path: '/login',
    name: 'login',
    component: () => import('@/views/login/LoginView.vue'),
    meta: {
      isHide: false,
      title: 'login'
    }
  },
  {
    path: '/404',
    name: '404',
    component: () => import('@/views/404.vue'),
    meta: {
      isHide: false,
      title: '404'
    }
  },
  {
    path: '/adminLayout',
    name: 'adminLayout',
    component: AdminLayout,
    children: [
      {
        path: '/',
        name: 'home',
        component: () => import('@/views/admin/home/index.vue'),
        meta: {
          isHide: false,
          title: 'Home',
          titleEn: 'Home',
          titleZh: '首页',
          titleZhHk: '首頁',
          icon: 'HomeFilled'
        }
      },
      // {
      //   path: '/assistant',
      //   name: 'assistant',
      //   component: () => import('@/views/assistant/index.vue'),
      //   meta: {
      //     isHide: false,
      //     title: 'Assistant',
      //     titleEn: 'Assistant',
      //     titleZh: '助手',
      //     titleZhHk: '助手',
      //     icon: 'Tools'
      //   }
      // },
      // {
      //   path: '/chat',
      //   name: 'chat',
      //   component: () => import('@/views/assistant/chat.vue'),
      //   meta: {
      //     isHide: true,
      //     title: 'chat',
      //     icon: 'Comment'
      //   }
      // },
      // {
      //   path: '/draw',
      //   name: 'draw',
      //   component: () => import('@/views/draw/index.vue'),
      //   meta: {
      //     isHide: false,
      //     title: 'Draw',
      //     titleEn: 'Draw',
      //     titleZh: '画图',
      //     titleZhHk: '畫圖',
      //     icon: 'Picture'
      //   }
      // },
      // {
      //   path: '/overview',
      //   name: 'overview',
      //   component: () => import('@/views/admin/overview/index.vue'),
      //   meta: {
      //     isHide: false,
      //     title: 'Overview',
      //     titleEn: 'Overview',
      //     titleZh: '综览',
      //     titleZhHk: '綜覽',
      //     icon: 'TrendCharts'
      //   }
      // },
      {
        path: '/classes',
        name: 'classes',
        component: () => import('@/views/admin/classes/index.vue'),
        meta: {
          isHide: false,
          title: 'Class Management',
          titleEn: 'Class Management',
          titleZh: '班级管理',
          titleZhHk: '班級管理',
          icon: 'Memo'
        }
      },
      {
        path: '/menu',
        name: 'menu',
        component: () => import('@/views/admin/menu/menu.vue'),
        meta: {
          isHide: false,
          title: 'Menu',
          titleEn: 'Menu',
          titleZh: '菜单管理',
          titleZhHk: '菜單管理',
          icon: 'Memo'
        }
      }
    ]
  },
  {
    path: '/clientLayout',
    name: 'clientLayout',
    component: ClientLayout,
    children: [
      {
        path: '/assistant',
        name: 'assistant',
        component: () => import('@/views/assistant/index.vue'),
        meta: {
          isHide: false,
          title: 'Assistant',
          titleEn: 'Assistant',
          titleZh: '助手',
          titleZhHk: '助手',
          icon: 'Tools'
        }
      },
      {
        path: '/chat',
        name: 'chat',
        component: () => import('@/views/assistant/chat.vue'),
        meta: {
          isHide: true,
          title: 'chat',
          icon: 'Comment'
        }
      },
      {
        path: '/draw',
        name: 'draw',
        component: () => import('@/views/draw/index.vue'),
        meta: {
          isHide: false,
          title: 'Draw',
          titleEn: 'Draw',
          titleZh: '画图',
          titleZhHk: '畫圖',
          icon: 'Picture'
        }
      }
    ]
  }
]
