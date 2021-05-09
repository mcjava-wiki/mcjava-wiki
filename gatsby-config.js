const path = require('path')

module.exports = {
  siteMetadata: {
    title: "mcjava-wiki",
    githubRepositoryURL: 'https://github.com/mcjava-wiki/mcjava-wiki',
    githubDefaultBranch: 'main',
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
      'Techniques',
      'Troubleshooting'
    ],
    baseDirectory: path.resolve(__dirname, './'),
    navItems: [{ title: 'Docs', url: '/docs/about/introduction/' }],
    description: "Comprehensive documentation for creating and editing Minecraft: Java Edition resource packs",
    siteUrl: "https://wiki.mcjava.dev",
    author: 'Kas-tle',
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
        gatsbyRemarkPlugins: [
          {
            resolve: require.resolve(
              './src/plugins/gatsby-remark-autolink-headers',
            ),
          },
          {
            resolve: `gatsby-remark-images`,
            options: {
              maxWidth: 1200,
            },
          },
        ],
      },
    },
    'gatsby-transformer-sharp',
    'gatsby-plugin-sharp',
    'gatsby-plugin-react-helmet',
    {
      resolve: require.resolve(
        './src/plugins/gatsby-remark-autolink-headers',
      ),
    },

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
        path: `./pages`,
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
