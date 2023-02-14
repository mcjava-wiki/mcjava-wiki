import * as path from 'path';
import type { GatsbyConfig } from "gatsby";

const visit = require('unist-util-visit')

/** @type {import('unified').Plugin<Array<void>, import('hast').Root>} */
function rehypeMetaAsAttributes() {
  return (tree: any) => {
    visit(tree, 'element', (node: { tagName: string; data: { meta: any }; properties: { meta: any } }) => {
      if (node.tagName === 'code' && node.data && node.data.meta) {
        node.properties.meta = node.data.meta
      }
    })
  }
}

const config: GatsbyConfig = {
  pathPrefix: `${process.env.PATH_PREFIX}`,
  graphqlTypegen: {
    typesOutputPath: './src/types/gatsby-types.d.ts'
  },
  siteMetadata: {
    title: "mcjava-wiki",
    githubRepository: 'mcjava-wiki/mcjava-wiki',
    githubDefaultBranch: 'main',
    discordInviteCode: 'rqsKmmh89J',
    sections: [
      'About',
      'Basics',
      'External Programs',
      'Textures',
      'Models',
      'Predicates',
      'Sounds',
      'Languages',
      'Block States',
      'Particles',
      'Fonts',
      'GUIs',
      'Texts',
      'Shaders',
      'Bedrock Equivalencies',
      'Techniques',
      'Troubleshooting'
    ],
    baseDirectory: path.resolve(__dirname, './'),
    navItems: [{ title: 'Docs', url: '/docs/about/introduction/' }],
    description: "Comprehensive documentation for creating and editing Minecraft: Java Edition resource packs",
    siteUrl: "https://wiki.mcjava.dev",
    author: 'Kas-tle',
    docSearch: {
      apiKey: 'b682d90da6cabb2ac9a4d1d236b24d92',
      indexName: 'mcjava',
      appId: '3QIDHF9CHG',
    },
  },
  plugins: [
    // Build
    {
      resolve: 'gatsby-plugin-styled-components',
      options: {
        topLevelImportPaths: ['@xstyled/styled-components'],
      },
    },
    {
      resolve: `gatsby-remark-images`,
      options: {
        linkImagesToOriginal: false,
        backgroundColor: `transparent`,
      },
    },
    'gatsby-plugin-catch-links',
    {
      resolve: 'gatsby-plugin-mdx',
      options: {
        extensions: [`.mdx`, `.md`],
        mdxOptions: {
          remarkPlugins: [
            require(`remark-gfm`),
          ],
          rehypePlugins: [rehypeMetaAsAttributes],
        },
        gatsbyRemarkPlugins: [
          {
            resolve: `gatsby-remark-images`,
            options: {
              maxWidth: 1200,
            },
          },
          { resolve: 'gatsby-remark-autolink-headers' },
        ],
      },
    },
    'gatsby-transformer-sharp',
    'gatsby-plugin-sharp',
    'gatsby-plugin-react-helmet',

    // Source
    {
      resolve: 'gatsby-source-filesystem',
      options: {
        path: `${__dirname}/pages`,
        name: 'default-page',
      },
    },
    {
      resolve: 'gatsby-source-filesystem',
      options: {
        path: `${__dirname}/images`,
        name: 'default-image',
      },
    },
    {
      resolve: 'gatsby-source-filesystem',
      options: {
        path: `./pages/docs`,
        name: 'doc',
      },
    },
    {
      resolve: 'gatsby-source-filesystem',
      options: {
        path: `./pages`,
        ignore: ['**/docs/**'],
        name: 'page',
      },
    },
    {
      resolve: 'gatsby-source-filesystem',
      options: {
        path: `./images`,
        name: 'image',
      },
    },
    // SEO
    {
      resolve: 'gatsby-plugin-sitemap',
      options: {},
    },
    'gatsby-plugin-meta-redirect',
    {
      resolve: `gatsby-plugin-manifest`,
      options: {
        name: "mcjava-wiki",
        short_name: "mcjava-wiki",
        start_url: '/',
        display: 'minimal-ui',
        icon: 'images/logo-manifest.png',
      },
    },
    {
      resolve: 'gatsby-plugin-robots-txt',
      options: {
        resolveEnv: () => process.env.CONTEXT || process.env.NODE_ENV,
        env: {
          production: {
            policy: [{ userAgent: '*' }],
          },
          'branch-deploy': {
            policy: [{ userAgent: '*', disallow: ['/'] }],
            sitemap: null,
            host: null,
          },
          'deploy-preview': {
            policy: [{ userAgent: '*', disallow: ['/'] }],
            sitemap: null,
            host: null,
          },
        },
      },
    },
  ],
}

export default config;