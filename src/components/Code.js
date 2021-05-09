import React from 'react'
import rangeParser from 'parse-numeric-range';
import styled, { useTheme, th, up, css } from '@xstyled/styled-components'
import Highlight, { defaultProps } from 'prism-react-renderer'
import {
  LiveProvider,
  LiveEditor,
  LiveError,
  LivePreview as BaseLivePreview,
} from 'react-live'
import { mdx } from '@mdx-js/react'

const Pre = styled.pre`
  position: relative;
  font-size: 15;
  line-height: 1.45;
  word-break: normal;
  overflow: auto;
  direction: ltr;
  text-align: left;
  white-space: pre;
  word-spacing: normal;
  word-break: normal;
  margin: 3 -3;
  background-color: editor-background;
  color: editor-on;
  direction: ltr;
  text-align: left;
  white-space: pre;
  word-spacing: normal;
  word-break: normal;
  hyphens: none;
  padding: 4 0;

  textarea {
    &:focus {
      outline: none;
    }
  }

  & .token-line {
    line-height: 1.3em;
    height: 1.3em;
  }

  ${up(
    'sm',
    css`
      border-radius: editor;
      margin: 3 -2;
    `,
  )}
`

// line highlighting
const calculateLinesToHighlight = (meta) => {
  const REhighlights = /highlights={([\d,-]+)}/
  if (REhighlights.test(meta)) {
    const strlineNumbers = REhighlights.exec(meta)[1]
    const lineNumbers = rangeParser(strlineNumbers)
    return (index) => (lineNumbers.includes(index + 1))
  } else {
    return () => false
  }
}

// code block title
const CodeLabel = styled.button`
  position: absolute;
  left: 0;
  border-radius: 0 0 0.25rem 0rem;
  font-size: 12px;
  letter-spacing: 0.025rem;
  padding: 0.25rem 0.5rem;
  text-align: right;
  top: 0;
  background: #6466ec;
  color: #ffffff;
`
const getCodeTitle = (meta) => {
  const REtitle = /title={(.*?)}/
  if (REtitle.test(meta)) {
    const codeTitle = REtitle.exec(meta)[1]
    return <CodeLabel>{codeTitle}</CodeLabel>
  } else {
    return () => false
  }
}


// line numbering
const LineNo = styled.span`
  display: inline-block;
  width: 2em;
  user-select: none;
  opacity: 0.3;
  display: inline-flex;
  justify-content: flex-end;
  padding-right: 0.5rem;
`

const LivePreview = styled(BaseLivePreview)`
  padding: preview-padding-y preview-padding-x;
  margin: 3 -3 -3;
  border-top: 1;
  border-color: editor-border;
  border-image: initial;

  white-space: normal;
  font-family: base;
  overflow: hidden;

  background-color: background;
  color: on-background;

  ${up(
    'sm',
    css`
      border-right: 1;
      border-left: 1;
      border-radius: editor;
      border-bottom-left-radius: 0;
      border-bottom-right-radius: 0;
      border-color: editor-border;
      margin-left: -2;
      margin-right: -2;
    `,
  )}
`

const globalModules = {
  react: 'React',
}

export function LiveConfig({ modules }) {
  Object.assign(globalModules, modules)
  return null
}

function req(path) {
  const dep = globalModules[path]

  if (!dep) {
    throw new Error(
      `Unable to resolve path to module '${path}'. Use "LiveConfig" to provide modules.`,
    )
  }
  return dep
}

function importToRequire(code) {
  return (
    code
      // { a as b } => { a: b }
      .replace(/([0-9a-z_$]+) as ([0-9a-z_$]+)/gi, '$1: $2')
      // import { a } from "a" => const { a } = require("b")
      .replace(
        /import {([^}]+)} from ([^\s;]+);?/g,
        'const {$1} = require($2);',
      )
      // import a from "a" => const a = require("a").default || require("a")
      .replace(
        /import ([\S]+) from ([^\s;]+);?/g,
        'const $1 = require($2).default || require($2);',
      )
      // import * as a from "a"
      .replace(
        /import \* as ([\S]+) from ([^\s;]+);?/g,
        'const $1 = require($2);',
      )
      // import a from "a" => const a = require("a").default || require("a")
      .replace(
        /import (.+),\s?{([^}]+)} from ([^\s;]+);?/g,
        [
          'const $1 = require($3).default || require($3);',
          'const {$2} = require($3);',
        ].join('\n'),
      )
  )
}

export function usePrismTheme() {
  const theme = useTheme()
  return th('prism-theme')({ theme })
}


// setup clipboard copy function
const copyToClipboard = (str) => {
  const el = document.createElement("textarea")
  el.value = str
  el.setAttribute("readonly", "")
  el.style.position = "absolute"
  el.style.left = "-9999px"
  document.body.appendChild(el)
  el.select()
  document.execCommand("copy")
  document.body.removeChild(el)
}

// setup cody copy button
const CopyCode = styled.button`
  position: absolute;
  right: 5rem;
  border-radius: 0 0 0.25rem 0.25rem;
  font-size: 12px;
  letter-spacing: 0.025rem;
  padding: 0.25rem 0.5rem;
  text-align: right;
  top: 0;
  opacity: 0.3;
  visibility: visible;
  &:hover{
    opacity: 1;
    visibility: visible;
  }
`

export function Code({ children, lang = 'markup', metastring, live, noInline }) {
  const prismTheme = usePrismTheme()
  if (live) {
    return (
      <LiveProvider
        code={children.trim()}
        transformCode={(code) => `/* @jsx mdx */ ${importToRequire(code)}`}
        scope={{ mdx, require: req }}
        language={lang}
        theme={prismTheme}
        noInline={noInline}
      >
        <LivePreview />
        <Pre
          as="div"
          style={{ borderTopLeftRadius: 0, borderTopRightRadius: 0 }}
        >
          <LiveEditor padding={0} />
        </Pre>
        <LiveError />
      </LiveProvider>
    )
  }
  const handleClick = () => { copyToClipboard(children.trim()) }
  const shouldHighlightLine = calculateLinesToHighlight(metastring)
  return (
    <Highlight
      {...defaultProps}
      code={children.trim()}
      language={lang}
      theme={prismTheme}
    >
      {({ className, style, tokens, getLineProps, getTokenProps }) => (
        <Pre className={className} style={style}>
          {getCodeTitle(metastring)}
          <div>
          <CopyCode onClick={handleClick}>Copy</CopyCode>
          {tokens.map((line, i) => {
            const lineProps = getLineProps({ line, key: i })
            if (shouldHighlightLine(i)) {
              lineProps.className = `${lineProps.className} highlight-line`
            }
            return (
            <div {...lineProps}>
              <LineNo>{i + 1}</LineNo>
              {line.map((token, key) => (
                <span {...getTokenProps({ token, key })} />
              ))}
            </div>
            )
          })}
          </div>
        </Pre>
      )}
    </Highlight>
  )
}
