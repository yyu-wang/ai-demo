/**
 * staticRouter (静态路由)
 */
import { RouteRecordRaw } from 'vue-router'

import Layout from '@/layout/index.vue'
import AssistantLayout from '@/layout/assistant.vue'

export const staticRouter: RouteRecordRaw[] = [
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
    path: '/404',
    name: '404',
    component: () => import('@/views/404.vue'),
    meta: {
      isHide: true,
      title: '404'
    }
  },
  //   助手模块抽离
  {
    path: '/AssistantLayout',
    name: 'assistantLayout',
    component: AssistantLayout,
    children: [
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
    ]
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
      // {
      //   path: '/assistant',
      //   name: 'assistant',
      //   component: () => import('@/views/assistant/index.vue'),
      //   meta: {
      //     isHide: true,
      //     title: 'Assistant',
      //     icon: 'Tools'
      //   }
      // },
      {
        path: '/overview',
        name: 'overview',
        component: () => import('@/views/admin/overview/index.vue'),
        meta: {
          isHide: true,
          title: 'overview',
          icon: 'TrendCharts'
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
