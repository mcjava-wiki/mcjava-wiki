import * as React from 'react'
import { graphql, useStaticQuery } from 'gatsby'
import styled, { x, useColorMode, down, css } from '@xstyled/styled-components'
import { ScreenContainer } from './ScreenContainer'
import { DocSearch } from './DocSearch'
import { NavLink } from './Nav'
import { AppNav } from './AppNav'

const AppHeaderQuery = graphql`
  query AppHeader {
    logos: allFile(
      filter: {sourceInstanceName: {in: ["image", "default-image"]}, name: {glob: "logo-nav*"}}
      sort: {sourceInstanceName: DESC}
    ) {
      nodes {
        name
        publicURL
      }
    }
    site {
      siteMetadata {
        title
        docSearch {
          apiKey
          indexName
          appId
        }
        navItems {
          title
          url
        }
      }
    }
  }
`

const OuterHeader = styled.header`
  background-color: background;
  border-bottom-style: solid;
  border-bottom-width: base;
  border-bottom-color: layout-border;
  padding: 2 0;
  height: 50;

  ${down(
    'sm',
    css`
      overflow-x: auto;
    `,
  )}
`

const NavSkipLink = styled.a`
  text-decoration: none;
  left: -999px;
  position: absolute;
  top: auto;
  width: 1px;
  height: 1px;
  overflow: hidden;
  z-index: -999;
  color: primary;

  &:focus {
    background-color: background;
    border-radius: base;
    left: auto;
    top: auto;
    height: auto;
    width: max-content;
    overflow: auto;
    padding: 2;
    margin: 2;
    text-align: center;
    z-index: 999;
  }
`

function useLogo(logos: readonly { readonly name: string; readonly publicURL: string | null }[]) {
  const [mode] = useColorMode()
  switch (mode) {
    case 'dark':
      return (
        logos.find((logo) => logo.name === 'logo-nav-dark') ||
        logos.find((logo) => logo.name === 'logo-nav') ||
        ''
      )
    case 'light':
    default:
      return (
        logos.find((logo) => logo.name === 'logo-nav-light') ||
        logos.find((logo) => logo.name === 'logo-nav') ||
        ''
      )
  }
}

export function AppHeader() {
  const data: Queries.AppHeaderQuery = useStaticQuery(AppHeaderQuery)
  const logo = useLogo(data.logos.nodes)

  if (!data.site || !data.site.siteMetadata) return null;
  const docSearch = data.site.siteMetadata.docSearch;
  if (!docSearch) return null;

  return (
    <OuterHeader>
      <ScreenContainer>
        <NavSkipLink tabIndex={0} href="#main">
          Skip to content
        </NavSkipLink>
        <x.div row alignItems="center" flexWrap="nowrap" mx={-2}>
          <x.div col px={2} display="flex">
            <NavLink
              row
              display="inline-flex"
              alignItems="center"
              flexWrap="nowrap"
              mx={-2}
              to="/"
            >
              {logo ? (
                <x.img
                  col="auto"
                  px={2}
                  height={32}
                  src={String(logo.publicURL)}
                  alt={data?.site?.siteMetadata?.title}
                />
              ) : (
                <x.h2
                  col="auto"
                  flex="0 1 auto"
                  px={2}
                  alignItems="center"
                  fontSize={18}
                  m={0}
                >
                  {data?.site?.siteMetadata?.title}
                </x.h2>
              )}
            </NavLink>
          </x.div>
          {data?.site?.siteMetadata?.docSearch ? (
            <x.div col="auto" px={2} display={{ xs: 'none', md: 'block' }}>
              <DocSearch 
                apiKey={docSearch.apiKey}
                indexName={docSearch.indexName}
                appId={docSearch.appId || ''}
              />
            </x.div>
          ) : null}
          <x.div col="auto" px={2}>
            <AppNav />
          </x.div>
        </x.div>
      </ScreenContainer>
    </OuterHeader>
  )
}
