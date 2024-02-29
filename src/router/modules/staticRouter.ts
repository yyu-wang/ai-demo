/**
 * staticRouter (静态路由)
 */
import { RouteRecordRaw } from 'vue-router'

import Layout from '@/layout/index.vue'

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
        path: '/assistant',
        name: 'assistant',
        component: () => import('@/views/admin/assistant/index.vue'),
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
        component: () => import('@/views/admin/assistant/chat.vue'),
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
          title: 'Overview',
          titleEn: 'Overview',
          titleZh: '综览',
          titleZhHk: '綜覽',
          icon: 'TrendCharts'
        }
      },
      {
        path: '/classes',
        name: 'classes',
        component: () => import('@/views/admin/classes/index.vue'),
        meta: {
          isHide: true,
          title: 'Class Management',
          titleEn: 'Class Management',
          titleZh: '班级管理',
          titleZhHk: '班級管理',
          icon: 'Memo'
        }
      }
    ]
  }
]
