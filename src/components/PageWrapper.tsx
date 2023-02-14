import React from 'react'
import { PageLayout } from './PageLayout'
import { DocLayout } from './DocLayout'

export function PageWrapper({
  children,
  props: {
    data: { mdx },
  },
}: {
  children: React.ReactNode;
  props: {
    data: {
      mdx: {
        fields: {
          pageType: string;
          title: string;
          editLink: string;
          contributors: unknown;
        };
        tableOfContents: unknown;
        editLink: string;
        contributors: unknown;
      };
    };
  };
}) {
  if (!mdx?.fields?.pageType) return children
  switch (mdx.fields.pageType) {
    case 'doc':
      return (
        <DocLayout
          title={mdx.fields.title}
          tableOfContents={mdx.tableOfContents}
          editLink={mdx.fields.editLink}
          contributors={mdx.fields.contributors}
        >
          {children}
        </DocLayout>
      )
    case 'page':
      return <PageLayout title={mdx.fields.title}>{children}</PageLayout>
    default:
      return children
  }
}
