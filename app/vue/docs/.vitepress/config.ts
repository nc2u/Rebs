import {defineConfig} from "vitepress";

export default defineConfig({
  lang: 'ko-KR',
  title: 'REBS',
  description: '부동산 개발관리 프로그램',
  base: '/docs/',
  lastUpdated: true,
  // outDir: '../../django/templates/docs',
  markdown: {
    theme: 'material-palenight',
    lineNumbers: true
  },
  themeConfig: {
    logo: '/favicon.png',
    siteTitle: 'REBS',
    nav: [
      {text: '가이드', link: '/getting-started'},
      {
        text: 'Dropdown',
        items: [
          {text: 'Item A', link: '/item-1'},
          {text: 'Item B', link: '/item-2'},
          {text: 'Item C', link: '/item-3'}
        ]
      }
    ],
    sidebar: [
      {
        text: '소개',
        items: [
          {text: 'REBS란?', link: '/intro/'},
          {text: '시작하기', link: '/intro/getting-started'},
        ]
      },
      {
        text: '기본 설정',
        items: [
          {text: '회사정보 설정', link: '/settings/company'},
          {text: '프로젝트 설정', link: '/settings/project'},
          {text: '세부정보 설정', link: '/settings/details'},
          {text: '부지정보 관리', link: '/settings/site-manage'},
        ]
      },
      {
        text: '계약 수납 관리',
        items: [
          {text: '계약 등록 관리', link: '/contract/'},
          {text: '계약 해지 관리', link: '/contract/release'},
          {text: '수납 등록 관리', link: '/contract/payment'},
          {text: '고지서 발급 관리', link: '/contract/bill-notice'},
        ]
      },
      {
        text: '일반 입출금 관리',
        items: [
          {text: '기본 설정 관리', link: '/cashes/settings'},
          {text: '입출금 정보 관리', link: '/cashes/manage'},
        ]
      },
      {
        text: '문서 관리',
        items: [
          {text: '일반 문서 관리', link: '/document/'},
          {text: '소송 기록 관리', link: '/document/legal-case'},
        ]
      },
      {
        text: '권한 관리',
        items: [
          {text: '사용자 권한 관리', link: '/authority/'},
          {text: '관리자(admin) 페이지', link: '/authority/admin-page'},
        ]
      }
    ],
    socialLinks: [
      {icon: 'github', link: 'https://github.com/vuejs/vitepress'},
      {icon: 'slack', link: '...'},
    ],
    editLink: {
      pattern: 'https://github.com/vuejs/vitepress/edit/main/docs/:path',
      text: 'Edit this page on GitHub'
    },
    carbonAds: {
      code: 'your-carbon-code',
      placement: 'your-carbon-placement'
    },
    footer: {
      message: 'Released under the MIT License.',
      copyright: 'Copyright © 2019-present REBS'
    },
  }
})
