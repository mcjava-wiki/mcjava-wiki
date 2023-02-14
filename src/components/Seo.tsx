import * as React from 'react'
import Helmet from 'react-helmet'
import { graphql, useStaticQuery } from 'gatsby'

const SEOQuery = graphql`
  query SEOQuery {
    socialImage: file(
      sourceInstanceName: { eq: "image" }
      name: { eq: "social" }
    ) {
      childImageSharp {
        gatsbyImageData(layout: FIXED, width: 1280, height: 640)
      }
    }

    defaultSocialImage: file(
      sourceInstanceName: { eq: "default-image" }
      name: { eq: "social" }
    ) {
      childImageSharp {
        gatsbyImageData(layout: FIXED, width: 1280, height: 640)
      }
    }

    site {
      siteMetadata {
        title
        description
        siteUrl
        author
      }
    }
  }
`

export function Seo({ title }: { title: string }) {
  const data: Queries.SEOQueryQuery = useStaticQuery(SEOQuery)
  const metaDescription = String(data?.site?.siteMetadata?.description || '')
  const metaTitle = String(title || data?.site?.siteMetadata?.title || '')
  const url = String(data?.site?.siteMetadata?.siteUrl || '')
  const socialImage = data.defaultSocialImage || data.socialImage
  const image = socialImage
  ? String((url || '') + socialImage?.childImageSharp?.gatsbyImageData?.images?.fallback?.src || '')
  : ''
  return (
    <Helmet
      htmlAttributes={{ lang: 'en' }}
      title={metaTitle}
      meta={[
        {
          name: 'description',
          content: typeof metaDescription === 'string' ? metaDescription : '',
        },
        {
          property: 'og:title',
          content: typeof metaTitle === 'string' ? metaTitle : '',
        },
        {
          property: 'og:url',
          content: typeof url === 'string' ? url : '',
        },
        {
          property: 'og:description',
          content: typeof metaDescription === 'string' ? metaDescription : '',
        },
        {
          property: 'og:type',
          content: 'website',
        },
        ...(typeof image === 'string'
          ? [
              {
                property: 'og:image',
                content: image,
              },
              {
                name: 'twitter:card',
                content: 'summary_large_image',
              },
              {
                name: 'twitter:image:src',
                content: image,
              },
            ]
          : []),
  
        {
          name: 'twitter:creator',
          content: typeof data?.site?.siteMetadata?.author === 'string' ? data?.site?.siteMetadata?.author : '',
        },
        {
          name: 'twitter:title',
          content: typeof metaTitle === 'string' ? metaTitle : '',
        },
        {
          name: 'twitter:description',
          content: typeof metaDescription === 'string' ? metaDescription : '',
        },
      ]}
    />
  )
}
