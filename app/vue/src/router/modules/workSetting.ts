import { h, resolveComponent } from 'vue'

const workSetting = {
  path: 'settings',
  name: '설 정 관 리',
  redirect: '/settings/projects',
  component: {
    render() {
      return h(resolveComponent('router-view'))
    },
  },
  meta: { title: '설 정 관 리', auth: true },
  children: [
    {
      path: 'projects',
      name: '프로젝트 목록',
      component: () => import('@/views/_Work/Settings/Index.vue'),
    },
    {
      path: 'users',
      name: '사용자',
      component: () => import('@/views/_Work/Settings/Index.vue'),
    },
    {
      path: 'groups',
      name: '그룹',
      component: () => import('@/views/_Work/Settings/Index.vue'),
    },
    {
      path: 'roles',
      name: '역할 및 권한',
      component: () => import('@/views/_Work/Settings/Index.vue'),
    },
    {
      path: 'trackers',
      name: '작업 유형',
      component: () => import('@/views/_Work/Settings/Index.vue'),
    },
    {
      path: 'statuses',
      name: '작업 상태',
      component: () => import('@/views/_Work/Settings/Index.vue'),
    },
    {
      path: 'workflows',
      name: '업무 흐름',
      component: () => import('@/views/_Work/Settings/Index.vue'),
    },
    {
      path: 'custom_fields',
      name: '사용자 정의 항목',
      component: () => import('@/views/_Work/Settings/Index.vue'),
    },
    {
      path: 'enumerations',
      name: '코드값',
      component: () => import('@/views/_Work/Settings/Index.vue'),
    },
    {
      path: 'settings',
      name: '제반 설정',
      component: () => import('@/views/_Work/Settings/Index.vue'),
    },
    {
      path: 'auth_sources',
      name: 'LDAP 인증',
      component: () => import('@/views/_Work/Settings/Index.vue'),
    },
    {
      path: 'plugins',
      name: '플러그인',
      component: () => import('@/views/_Work/Settings/Index.vue'),
    },
    {
      path: 'info',
      name: '정보',
      component: () => import('@/views/_Work/Settings/Index.vue'),
    },
  ],
}

export default workSetting
