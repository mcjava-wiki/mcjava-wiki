import { graphql } from 'gatsby'

export const pageQuery = graphql`
  query DocPageQuery($id: String!) {
    mdx(id: { eq: $id }) {
      fields {
        pageType
        title
        editLink
        contributors {
          link
          name
        }
      }
      tableOfContents
    }
  }
`

function DocTemplate({ children }: { children: React.ReactNode }) {
  return children
}

export default DocTemplate