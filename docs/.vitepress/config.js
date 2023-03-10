module.exports = {
  base: '/monkey-docs/',
  title: '🍌 MokeyDocs',
  description: '整理、记录学习笔记',
  
  markdown: {
    lineNumbers: true,
  },
  head: [
    [
      'meta',
      { name: 'referrer', content: 'no-referrer-when-downgrade' },
    ],
  ],

  themeConfig: {
    outline: 'deep',
    footer: {
      message: 'Released under the MIT License.',
      copyright: 'Copyright © 2023-PRESENT MonkeyDocs',
    },
    nav: [
      { text: '🐳 Docker 笔记', link: '/docker/guide/' },
      { text: '🐭 Go 笔记', link: '/golang/guide/' },
    ],

    sidebar : [
      {
        text: '🐳 Docker 笔记',
        collapsed: false,
        items: [
          { text: '介绍', link: '/docker/guide/' },
          { text: 'Docker 笔记（一）', link: '/docker/section_1/' },
          { text: 'Docker 笔记（二）', link: '/docker/section_2/' },
        ],
      },
      {
        text: '🐭 Go 笔记',
        collapsed: false,
        items: [
          { text: '介绍', link: '/golang/guide/' },
          { text: 'Go 开发环境安装', link: '/golang/env_install/' },
        ],
      },
    ]
    
  },

}