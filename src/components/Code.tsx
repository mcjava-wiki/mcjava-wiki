import React from 'react'
import rangeParser from 'parse-numeric-range';
import styled, { useTheme, th, up, css, useColorMode } from '@xstyled/styled-components'
import Highlight, { defaultProps, Language, PrismTheme } from 'prism-react-renderer'
import {
  LiveProvider,
  LiveEditor,
  LiveError,
  LivePreview as BaseLivePreview,
} from 'react-live'
import { FaClipboard } from 'react-icons/fa'
import { langStyles } from '../util/constants';

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

  box-shadow: rgba(34, 211, 238, 0.20) 0px 0px 200px;

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
const calculateLinesToHighlight = (meta: string) => {
  const REhighlights = /highlights={([\d,-]+)}/
  const match = REhighlights.exec(meta)
  if (match) {
    const strlineNumbers = match[1]
    const lineNumbers = rangeParser(strlineNumbers)
    return (index: number) => (lineNumbers.includes(index + 1))
  } else {
    return () => false
  }
}

// code block title
const CodeLabel = styled.button`
  position: absolute;
  left: -0.5rem;
  border-radius: 0.25rem 0 0.25rem 0rem;
  font-size: 12px;
  letter-spacing: 0.025rem;
  padding: 0.25rem 0.5rem;
  text-align: right;
  top: 0;
  background: #0891B2;
  color: #ffffff;
`
const getCodeTitle = (meta: string) => {
  const REtitle = /title={(.*?)}/
  const match = REtitle.exec(meta)
  if (match) {
    const codeTitle = match[1]
    return <CodeLabel>{codeTitle}</CodeLabel>
  } else {
    return () => false
  }
}


const LanguageMarker = styled.button`
  position: absolute;
  right: -0.5rem;
  border-radius: 0 0.25rem 0 0.25rem;
  font-size: 10px;
  letter-spacing: 0.025rem;
  padding: 0.25rem 0.75rem;
  text-align: right;
  top: 0;
  background: #ffffff;
  color: #000000;
`

const getLanguageMarker = (className: string) => {
  const lang = className.split(' ')[1]
  if (lang === 'language-markup') {
    return () => false
  } else {
    const Icon = langStyles[lang].icon;
    return (
        <LanguageMarker 
          className={`lang-marker ${className}`} 
          style={{ background: langStyles[lang].backgroundColor, color: langStyles[lang].textColor }}
        >
          <Icon style={{ display: 'inline-block', marginTop: -3, fontSize: 14 }}/>&nbsp;{langStyles[lang].shortName}
        </LanguageMarker>
      )
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

const globalModules: { [key: string]: string } = {
  react: 'React',
}

export function LiveConfig({ modules }: { modules: Record<string, any> }) {
  Object.assign(globalModules, modules)
  return null
}

function req(path: string | number) {
  const dep = globalModules[path]

  if (!dep) {
    throw new Error(
      `Unable to resolve path to module '${path}'. Use "LiveConfig" to provide modules.`,
    )
  }
  return dep
}

function importToRequire(code: string) {
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

export function usePrismTheme(): PrismTheme {
  const theme = useTheme();
  const [mode] = useColorMode();
  const prismTheme = th(`prism-theme-${mode === 'light' ? 'light' : 'dark'}`)({ theme });

  if (typeof prismTheme !== 'object') {
    return {
      plain: {},
      styles: []
    };
  }

  return prismTheme;
}


// setup clipboard copy function
const copyToClipboard = (str: string) => {
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
  right: -0.5rem;
  border-radius: 0.25rem 0 0.25rem 0;
  font-size: 12px;
  letter-spacing: 0.025rem;
  padding: 0.25rem 0.5rem;
  text-align: right;
  bottom: 0;
  opacity: 0.3;
  visibility: visible;
  background: #67E8F9;
  &:hover{
    opacity: 1;
    visibility: visible;
  }
  &:active{
    opacity: 1;
    visibility: visible;
    background: #34D399;
  }
`

export function Code({ children, lang = 'markup', meta }: {
  children: React.ReactNode;
  lang?: string;
  meta?: any;
}) {
  const prismTheme = usePrismTheme() as PrismTheme;

  if (typeof children !== 'string') {
    throw new Error(`Expected children to be a string, but received a ${typeof children}.`)
  }

  if (/live/.test(meta)) {
    return (
      <LiveProvider
        code={children.trim()}
        transformCode={(code) => `${importToRequire(code)}`}
        scope={{ require: req }}
        language={lang as Language}
        theme={prismTheme}
        noInline={/noInline/.test(meta)}
      >
        <LivePreview />
        <Pre
          as="div"
          style={{ borderTopLeftRadius: 0, borderTopRightRadius: 0 }}
        >
          <LiveEditor />
        </Pre>
        <LiveError />
      </LiveProvider>
    )
  }
  const handleClick = () => { copyToClipboard(children.trim()) }
  const shouldHighlightLine = calculateLinesToHighlight(meta)
  return (
    <Highlight
      {...defaultProps}
      code={children.trim()}
      language={lang as Language}
      theme={prismTheme}
    >
      {({ className, style, tokens, getLineProps, getTokenProps }) => (
        <div style={{ position: 'relative' }}>
          <>
          <Pre className={className} style={style}>
            <div>
              <div>
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
            </div>
          </Pre>
          <CopyCode onClick={handleClick}>
            <FaClipboard />
          </CopyCode>
          {getCodeTitle(meta)}
          {getLanguageMarker(className)}
          </>
        </div>
      )}
    </Highlight>
  )
}
