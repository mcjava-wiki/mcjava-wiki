import { CreateNodeArgs, GatsbyNode, PageProps  } from "gatsby";
import * as fs from 'fs';
import * as path from 'path';
import { createFilePath } from 'gatsby-source-filesystem';
const { getSiteUrl } = require('./src/theme-options.ts')
import { tlds, sites, routes } from './src/util/constants';
import { load } from 'cheerio';

import config from './gatsby-config';

export const createSchemaCustomization: GatsbyNode["createSchemaCustomization"] = ({ actions }) => {
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

export const onPreBootstrap: GatsbyNode["onPreBootstrap"] = async (options) => {
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

  function getGithubLink(tld: string, route: string) {
    const siteMetadata = config.siteMetadata;
    if (!siteMetadata) return '';
    const {
      baseDirectory = path.resolve(__dirname, './'),
      githubRepositoryURL = `https://${sites.GITHUB}.${tld}/${siteMetadata.githubRepository}`,
      githubDefaultBranch = siteMetadata.githubDefaultBranch,
    } = options
    const repositoryURL = githubRepositoryURL;
    if (!baseDirectory || !repositoryURL) return '';
    const relativePath = node.internal.contentFilePath.replace(
      baseDirectory,
      '',
    )
    return `${repositoryURL}${route}${githubDefaultBranch}${relativePath}`;
  }

  const getData = async (url: URL | RequestInfo) => {
    const response = await fetch(url);
    return response.text();
  };
  
  interface Contributor {
    name: string;
    link: string;
  }

  const getContributors = async () => {
    const contributorsHtml = await getData(getGithubLink(tlds.COM, routes.CONTRIBUTORS_LIST));
    const $ = load(contributorsHtml);
    
    const contributors: Contributor[] = [];
    $(".avatar").each((_i: any, element: any) => {
      const href = $(element).parent().attr('href');
      if (href) {
        const name = href.slice(1);
        const link = $(element).attr('src');
        const contributor: Contributor = {
          name: name ? name.trim() : '',
          link: link ? link : ''
        };
        
        contributor.name = name ? name.trim() : '';
        contributor.link = link ? link : '';
        contributors.push(contributor);
      }
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
    value: getGithubLink(tlds.DEV, routes.BLOB),
  })

}

export const onCreateNode: GatsbyNode["onCreateNode"] = async (...args: [CreateNodeArgs]) => {
  if (args[0].node.internal.type === 'Mdx') {
    await onCreateMdxNode(...args, {})
  }
}

export const createPages: GatsbyNode["createPages"] = async ({ graphql, actions, reporter }) => {
  const { createPage, createRedirect } = actions;

  const allMdx: {
    errors?: any;
    data?: Queries.CreatePagesQuery;
  } = await graphql(`
    query CreatePages {
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

  if (allMdx.errors) {
    reporter.panicOnBuild(`Error while running GraphQL query.`)
    console.log(allMdx.errors)
    return
  }

  const data = allMdx.data;
  if (!data) return;
  
  const filteredEdges = data.allMdx.edges.filter((edge: Queries.CreatePagesQuery["allMdx"]["edges"][0]) => {
    const parent = edge.node.parent;
    if (!parent) return true;
    if (typeof parent === "object" && "sourceInstanceName" in parent && parent.sourceInstanceName === 'default-page') {
      if (!edge.node.fields) return true;
      const { slug } = edge.node.fields
      const hasCustom404 = data.allMdx.edges.find(
        (_edge: { node: any; }) => edge !== _edge && _edge.node.fields.slug === slug,
      )
      return !hasCustom404
    }
    return true
  })

  // Create pages
  filteredEdges.forEach(({ node }) => {
    if (!node.fields || !node.fields.slug) return;
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
        `./src/templates/${node.fields.pageType}.ts?__contentFilePath=${node.internal.contentFilePath}`,
      ),
      context: {
        id: node.id,
        frontmatter: node.frontmatter,
        contentFilePath: node.internal.contentFilePath,
      },
    })
  })
}

export const pluginOptionsSchema: GatsbyNode["pluginOptionsSchema"] = (/** @type {{ Joi: import('joi') }} */ { Joi }) => {
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
