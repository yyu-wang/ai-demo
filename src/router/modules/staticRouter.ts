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
        name: 'chat',
        component: () => import('@/views/chat/index.vue'),
        meta: {
          isHide: true,
          title: 'chat',
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
      {
        path: '/AssistantList',
        name: 'AssistantList',
        component: () => import('@/views/admin/assistantCopy/index.vue'),
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
        path: '/chat1',
        name: 'chat1',
        component: () => import('@/views/admin/assistantCopy/chat.vue'),
        meta: {
          isHide: true,
          title: 'chat1',
          icon: 'Comment'
        }
      },

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
