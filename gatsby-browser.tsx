import React from 'react'
import { RootWrapper } from './src/components/RootWrapper'
import { PageWrapper } from './src/components/PageWrapper'
const Prism = require('prism-react-renderer/prism') as typeof import('prismjs');

window.Prism = Prism

require('./src/components/highlights')

require("./css/custom.css")

export const wrapRootElement = ({ element }) => {
  return <RootWrapper>{element}</RootWrapper>
}

export const wrapPageElement = ({ element, props }) => {
  return <PageWrapper props={props}>{element}</PageWrapper>
}
