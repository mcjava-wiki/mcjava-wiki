import * as React from 'react'
import { graphql, useStaticQuery  } from 'gatsby'
import { Seo } from './Seo'

const HeadQuery = graphql`
  query HeadQuery {
    site {
      siteMetadata {
        title
      }
    }
  }
`

export function Head({ title = '' }: { title?: string }) {
  const data: Queries.HeadQueryQuery = useStaticQuery(HeadQuery)
  const metaTitle = String(title || data?.site?.siteMetadata?.title || '')
  return (
    <Seo
      title={
        title
          ? `${title} - ${metaTitle}`
          : metaTitle
      }
    />
  )
}
