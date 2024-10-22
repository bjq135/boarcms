export default {
  lang: 'zn-CN',
  title: 'BoarCMS 文档', 
  titleTemplate: 'BoarCMS',
  description: 'BoarCMS（野猪内容管理系统） 是一个基于 Node.js、Express 和 MySQL 开发的 CMS。',
  // base: '/boar', // base URL
  outDir: '../public/docs/boarcms',
  themeConfig: {
    // logo: '/logo.svg',
    // 顶部导航栏内容
    nav: [
      { text: '文档首页', link: '/' }
    ],
    // 侧边栏导航内容
    sidebar: [
      { text: '首页', link: '/index.md' },
      { text: '权限接口', link: '/api/auth' },
      { text: '文章接口', link: '/api/articles' },
      { text: '分类接口', link: '/api/categories' },
      { text: '页面接口', link: '/api/pages' },
      { text: '通用接口', link: '/api/common' },
      { text: '上传接口', link: '/api/upload' },
      { text: '图片接口', link: '/api/images' },
      { text: '用户接口', link: '/api/user' },
      // { text: 'AI 生成', link: '/api/ai.md' },
    ]
  }


};
