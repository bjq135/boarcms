export default {
  lang: 'zn-CN',
  title: '野猪API 文档', 
  titleTemplate: 'BoarAPI',
  description: '一个使用 Node.js 和 MySQL 的 Web 开发框架',
  // base: '/boar', // base URL
  outDir: '../public/docs/boar',
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
      // { text: '通用', link: '/api/common' },
      { text: '上传接口', link: '/api/upload' },
      { text: '图片接口', link: '/api/images' },
      { text: '用户接口', link: '/api/user' },
      // { text: 'AI 生成', link: '/api/ai.md' },
    ]
  }


};
