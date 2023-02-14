import React from 'react'
import { ColorModeProvider, Preflight } from '@xstyled/styled-components'
import { MDXProvider } from './MDX'
import { GlobalStyle, ThemeProvider } from './Theme'

export function RootWrapper({ children }: { children: React.ReactNode }) {
  return (
    <ThemeProvider>
      <ColorModeProvider>
        <Preflight />
        <GlobalStyle />
        <MDXProvider components={undefined}>{children}</MDXProvider>
      </ColorModeProvider>
    </ThemeProvider>
  )
}
