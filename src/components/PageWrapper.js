import React from 'react'
import { PageLayout } from './PageLayout'
import { DocLayout } from './DocLayout'
import { withPrefix } from "gatsby"
import Helmet from "react-helmet"

export function PageWrapper({
  children,
  props: {
    data: { mdx },
  },
}) {
  if (!mdx?.fields?.pageType) return children
  switch (mdx.fields.pageType) {
    case 'doc':
      return (
        <DocLayout
          title={mdx.fields.title}
          tableOfContents={mdx.tableOfContents}
          editLink={mdx.fields.editLink}
        >
          {children}
          <Helmet>
            <script src={withPrefix('Contributors.js')} type="text/javascript" />
          </Helmet>
        </DocLayout>
      )
    case 'page':
      return <PageLayout title={mdx.fields.title}>{children}</PageLayout>
    default:
      return children
  }
}
