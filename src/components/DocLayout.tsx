import React from 'react'
import { graphql, useStaticQuery } from 'gatsby'
import styled, { x, css, up, down, th, useUp } from '@xstyled/styled-components'
import { useDialogState, Dialog, DialogDisclosure } from 'ariakit/dialog'
import { Portal } from 'ariakit/portal'
import { FaBars } from 'react-icons/fa'
import { RiEditCircleFill, RiGithubFill } from 'react-icons/ri'
import { ScreenContainer } from './ScreenContainer'
import { SideNav, useSideNavState, useSideNavPrevNext } from './SideNav'
import { PageLayout } from './PageLayout'
import { SiblingNav, SiblingNavLink } from './SiblingNav'
import { Article } from './Article'
import { TableOfContents } from './TableOfContents'
import { Contributors } from './Contributors'
import { DocSearch } from './DocSearch'

const SidebarDialog = styled.div`
  background-color: background-light-a50;
  backdrop-filter: blur(3px);
  position: fixed;
  top: 50;
  right: 0;
  bottom: 0;
  left: 0;
  z-index: 20;
  overflow: auto;
  transition: base;
  opacity: 0;
  transition: opacity 250ms ease-in-out, transform 250ms ease-in-out;
  transform: translate3d(0, 10vh, 0);

  &[data-enter] {
    opacity: 1;
    transform: translate3d(0, 0, 0);
  }

  &:focus {
    outline: none;
  }
`

const Container = styled.div`
  z-index: 0;
  position: relative;

  ${up(
  'md',
  css`
      display: grid;
      grid-template-columns: 288px minmax(0, 1fr);
      grid-gap: ${th.space(5)};

      .sidebar-container {
        display: none;
      }
    `,
)}

  ${up(
  'xl',
  css`
      grid-template-columns: 288px minmax(0, 1fr) 288px;

      .sidebar-container {
        display: none;
      }
    `,
)}
`

const TocContainer = styled.div`
  ${down(
  'xl',
  css`
      display: none;
    `,
)}
`

const SidebarSticky = styled.aside`
  position: sticky;
  top: ${th.px(50)};
  padding: 4 0;
  overflow-y: auto;
  height: calc(100vh - 50px);
  width: 288px;

  ${down(
  'md',
  css`
      display: none;
    `,
)}
`

const MenuButton = styled.button`
  appearance: none;
  border: 0;
  border-radius: 20%;
  width: 60;
  height: 60;
  position: fixed;
  right: ${th.size(8)};
  top: ${th.size(55)};
  z-index: 25;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  color: background;
  background-color: on-background;
  transition: base;
  transition-property: color;

  &:focus {
    color: background;
  }

  > svg {
    width: 30;
    height: 30;
    transition: transform 200ms ease-in-out;
  }

  &[aria-expanded='true'] {
    > svg:last-child {
      transform: rotate(90deg);
    }
  }
`

const DocSearchQuery = graphql`
  query DocSearch {
    site {
      siteMetadata {
        docSearch {
          apiKey
          indexName
          appId
        }
      }
    }
  }
`

function MobileSidebar({ children }) {
  const dialog = useDialogState({ animated: true })
  const data = useStaticQuery(DocSearchQuery)
  return (
    <>
      <Dialog state={dialog} as={SidebarDialog}>
        <div style={{paddingLeft: 20, paddingTop: 20}}>
        <DocSearch {...data.site.siteMetadata.docSearch} />
        </div>
        {children}
      </Dialog>
      <Portal>
        <DialogDisclosure state={dialog} as={MenuButton}>
          <FaBars />
        </DialogDisclosure>
      </Portal>
    </>
  )
}

function PrevNextLinks({editLink, ...props}) {
  const { prev, next } = useSideNavPrevNext(props)
  if (!prev && !next) return null
  console.log('PrevNextLinks editLink', editLink)
  return (
    <SiblingNav>
      {prev && (
        <SiblingNavLink type="previous" to={prev.fields.slug}>
          {prev.fields.title}
        </SiblingNavLink>
      )}
      <div style={{gridArea: "edit", fontSize: 32}}>
      {editLink && (
        <x.a
          mt={0}
          display="grid"
          gridTemplateColumns="min-content max-content"
          href={editLink}
        >
        <RiEditCircleFill/><RiGithubFill/>
        </x.a>
      )}
      </div>
      {next && (
        <SiblingNavLink type="next" to={next.fields.slug}>
          {next.fields.title}
        </SiblingNavLink>
      )}
    </SiblingNav>
    
  )
}

export function DocLayout({ children, tableOfContents, editLink, contributors, ...props }) {
  console.log('DocLayout editLink', editLink)
  const upMd = useUp('md')
  const sideNav = useSideNavState()
  return (
    <PageLayout {...props}>
      <ScreenContainer px={0}>
        <Container>
          <SidebarSticky>
            <SideNav {...sideNav} />
          </SidebarSticky>
          <div className="sidebar-container">
            {!upMd && (
              <MobileSidebar>
                <SideNav {...sideNav} />
              </MobileSidebar>
            )}
          </div>
          <x.div pb={6} px={3}>
            <Article>
              {children}
              <Contributors contributors={contributors} />
              <PrevNextLinks {...sideNav} editLink={editLink}/>
            </Article>
          </x.div>
          <TocContainer>
            <TableOfContents />
          </TocContainer>
        </Container>
      </ScreenContainer>
    </PageLayout>
  )
}
