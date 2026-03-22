import type { SidebarsConfig } from '@docusaurus/plugin-content-docs'

const sidebars: SidebarsConfig = {
  docsSidebar: [
    {
      type: 'category',
      label: 'Product',
      items: [
        'product/overview',
        'product/information-architecture',
        'product/route-map'
      ]
    },
    {
      type: 'category',
      label: 'Tutorials',
      items: [
        'tutorials/getting-started'
      ]
    },
    {
      type: 'category',
      label: 'API',
      items: [
        'api/overview'
      ]
    },
    {
      type: 'category',
      label: 'Changelog',
      items: [
        'changelog/overview'
      ]
    },
    {
      type: 'category',
      label: 'FAQ',
      items: [
        'faq/overview'
      ]
    }
  ]
}

export default sidebars