const fs = require('fs')
const path = require('path')
const { createFilePath } = require('gatsby-source-filesystem')
const { getSiteUrl } = require('./src/theme-options')
const fetch = require('node-fetch');
const cheerio = require('cheerio');

function createSchemaCustomization({ actions }) {
  const { createTypes } = actions
  const typeDefs = `
    type NavItem {
      title: String!
      url: String!
    }

    type AlgoliaDocSearchMetadata {
      apiKey: String!
      indexName: String!
      appId: String
    }

    type SiteSiteMetadata {
      title: String!
      description: String!
      siteUrl: String!
      author: String
      githubRepositoryURL: String
      sections: [String!]
      navItems: [NavItem!]
      docSearch: AlgoliaDocSearchMetadata
    }

    type MdxFrontmatter {
      title: String!
      description: String
      slug: String
      section: String
      order: Int
      redirect: String
    }
  `
  createTypes(typeDefs)
}

function createDirectoryIfNotExists({ reporter }, pathname) {
  if (!fs.existsSync(pathname)) {
    reporter.info(`creating the ${pathname} directory`)
    fs.mkdirSync(pathname)
  }
}

async function onPreBootstrap(options) {
  // Create all required directories
  createDirectoryIfNotExists(options, 'pages')
  createDirectoryIfNotExists(options, 'pages/docs')
  createDirectoryIfNotExists(options, 'images')
}

async function onCreateMdxNode({ node, getNode, actions }, options) {

  const { createNodeField } = actions
  const slug = node.frontmatter.slug || createFilePath({ node, getNode })
  const pageType = /\/pages\/docs\//.test(node.internal.contentFilePath)
    ? 'doc'
    : 'page'

  function getOrderField() {
    if (!Number.isNaN(Number(node.frontmatter.order))) {
      return node.frontmatter.order
    }
    return -9999
  }

  const url = new URL(getSiteUrl(options))
  url.pathname = slug

  function getGithubLink(tld) {
    const {
      baseDirectory = path.resolve(__dirname, './'),
      githubRepositoryURL = `https://github.${tld}/mcjava-wiki/mcjava-wiki`,
      githubDefaultBranch = 'main',
    } = options
    const repositoryURL = githubRepositoryURL
    if (!baseDirectory || !repositoryURL) return ''
    const relativePath = node.internal.contentFilePath.replace(
      baseDirectory,
      '',
    )
    return `${repositoryURL}/contributors-list/${githubDefaultBranch}${relativePath}`
  }

  const getData = async (url) => {
    const response = await fetch(url);
    return response.text();
  };
  
  const getContributors = async () => {
    const contributorsHtml = await getData(getGithubLink('com'));
    const $ = cheerio.load(await contributorsHtml);
    const contributors = [];
    $(".avatar").each((i, element) => {
      const contributor = {};
      const name = $(element).parent().attr('href').slice(1);
      contributor.name = name ? name.trim() : '';
      const link = $(element).attr('src');
      contributor.link = link ? link : '';
      contributors.push(contributor);
    });
  
    return contributors;
  };
  
  try {
    const contributors = await getContributors();
    createNodeField({
      node,
      name: 'contributors',
      value: contributors,
    });
  } catch (error) {
    console.error(error);
  }

  createNodeField({
    name: 'id',
    node,
    value: node.id,
  })

  createNodeField({
    name: 'pageType',
    node,
    value: pageType,
  })

  createNodeField({
    name: 'title',
    node,
    value: node.frontmatter.title,
  })

  createNodeField({
    name: 'description',
    node,
    value: node.frontmatter.description || '',
  })

  createNodeField({
    name: 'slug',
    node,
    value: slug,
  })

  createNodeField({
    name: 'section',
    node,
    value: node.frontmatter.section || '',
  })

  createNodeField({
    name: 'redirect',
    node,
    value: node.frontmatter.redirect || '',
  })

  createNodeField({
    name: 'order',
    node,
    value: getOrderField(),
  })

  createNodeField({
    name: 'url',
    node,
    value: url.toString(),
  })

  createNodeField({
    name: 'editLink',
    node,
    value: getGithubLink('dev'),
  })

}

async function onCreateNode(...args) {
  if (args[0].node.internal.type === 'Mdx') {
    await onCreateMdxNode(...args)
  }
}

async function createPages({ graphql, actions, reporter }) {
  const { createPage, createRedirect } = actions

  const { data, errors } = await graphql(`
    query {
      allMdx {
        edges {
          node {
            id
            fields {
              slug
              pageType
              redirect
            }
            parent {
              ... on File {
                sourceInstanceName
              }
            }
            internal {
              contentFilePath
            }
          }
        }
      }
    }
  `)

  if (errors) {
    reporter.panicOnBuild(`Error while running GraphQL query.`)
    console.log(errors)
    return
  }

  const filteredEdges = data.allMdx.edges.filter((edge) => {
    if (edge.node.parent.sourceInstanceName === 'default-page') {
      const { slug } = edge.node.fields
      const hasCustom404 = data.allMdx.edges.find(
        (_edge) => edge !== _edge && _edge.node.fields.slug === slug,
      )
      return !hasCustom404
    }
    return true
  })

  // Create pages
  filteredEdges.forEach(({ node }) => {
    if (node.fields.redirect) {
      createRedirect({
        fromPath: node.fields.slug,
        toPath: node.fields.redirect,
        redirectInBrowser: true,
      })
      return
    }

    createPage({
      path: node.fields.slug,
      component: path.resolve(
        __dirname,
        `./src/templates/${node.fields.pageType}.js?__contentFilePath=${node.internal.contentFilePath}`,
      ),
      context: {
        id: node.id,
        frontmatter: node.frontmatter,
        contentFilePath: node.internal.contentFilePath,
      },
    })
  })
}

const pluginOptionsSchema = (/** @type {{ Joi: import('joi') }} */ { Joi }) => {
  return Joi.object({
    // Validate that the anonymize option is defined by the user and is a boolean
    name: Joi.string().required(),
    description: Joi.string().required(),
    siteUrl: Joi.string(),
    shortName: Joi.string(),
    sections: Joi.array().items(Joi.string()),
    navItems: Joi.array().items(
      Joi.object({
        title: Joi.string().required(),
        url: Joi.string().required(),
      }),
    ),
    baseDirectory: Joi.string(),
    githubRepositoryURL: Joi.string(),
    githubDefaultBranch: Joi.string(),
    author: Joi.string(),
    docSearch: Joi.object({
      apiKey: Joi.string().required(),
      indexName: Joi.string().required(),
      appId: Joi.string(),
    }),
    sitemap: Joi.object(),
  })
}

module.exports = {
  createSchemaCustomization,
  onPreBootstrap,
  onCreateNode,
  createPages,
  pluginOptionsSchema,
}
