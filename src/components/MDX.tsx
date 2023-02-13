import React from 'react'
import { MDXProvider as BaseMDXProvider } from '@mdx-js/react'
import { Code } from './Code'
import { Table, TableContainer } from './Table'

function transformCode({ children, className, ...props }) {
  const lang = className && className.split('-')[1]
  return (
    <Code metastring={undefined} meta={undefined} lang={lang} {...props}>
      {children}
    </Code>
  )
}

function getCodeChild(children) {
  const childrenArray = React.Children.toArray(children)
  if (childrenArray.length !== 1) return null
  const [firstChild] = childrenArray
  if (!React.isValidElement(firstChild)) return null
  if (firstChild.type !== 'code') return null
  return firstChild
}

export const mdxComponents = {
  pre: ({ children }) => {
    const codeChild: any = getCodeChild(children)
    if (codeChild) {
      return transformCode(codeChild.props)
    }
    return <pre>{children}</pre>
  },
  table: ({ children }) => {
    return (
      <TableContainer>
        <Table>{children}</Table>
      </TableContainer>
    )
  },
}

export function MDXProvider({ children, components }) {
  return (
    <BaseMDXProvider components={{ ...mdxComponents, ...components }}>
      {children}
    </BaseMDXProvider>
  )
}
