import React from 'react'
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

export function Head({ title }) {
  const data: Queries.HeadQueryQuery = useStaticQuery(HeadQuery)
  return (
    <Seo
      title={
        title
          ? `${title} - ${data?.site?.siteMetadata?.title}`
          : data?.site?.siteMetadata?.title
      }
    />
  )
}
