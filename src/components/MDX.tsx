import React from 'react'
import { MDXProvider as BaseMDXProvider } from '@mdx-js/react'
import { Code } from './Code'
import { Table, TableContainer } from './Table'

function transformCode({ children, className, ...props }: { children: React.ReactNode; className: string; [key: string]: any }) {
  const lang = className && className.split('-')[1]
  return (
    <Code meta={undefined} lang={lang} {...props}>
      {children}
    </Code>
  )
}

function getCodeChild(children: React.ReactNode) {
  const childrenArray = React.Children.toArray(children)
  if (childrenArray.length !== 1) return null
  const [firstChild] = childrenArray
  if (!React.isValidElement(firstChild)) return null
  if (firstChild.type !== 'code') return null
  return firstChild
}

export const mdxComponents = {
  pre: ({ children }: { children: React.ReactNode }) => {
    const codeChild: any = getCodeChild(children)
    if (codeChild) {
      return transformCode(codeChild.props)
    }
    return <pre>{children}</pre>
  },
  table: ({ children }: { children: React.ReactNode }) => {
    return (
      <TableContainer>
        <Table>{children}</Table>
      </TableContainer>
    )
  },
}


export function MDXProvider({ children, components }: { children: React.ReactNode; components?: any  }) {
  return (
    <BaseMDXProvider components={{ ...mdxComponents, ...components }}>
      {children}
    </BaseMDXProvider>
  )
}
