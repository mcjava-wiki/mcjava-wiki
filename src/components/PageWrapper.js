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
  const isBrowser = typeof window !== 'undefined'
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
            {isBrowser && <script defer="defer" src={withPrefix('Contributors.js')} />}
          </Helmet>
        </DocLayout>
      )
    case 'page':
      return <PageLayout title={mdx.fields.title}>{children}</PageLayout>
    default:
      return children
  }
}
