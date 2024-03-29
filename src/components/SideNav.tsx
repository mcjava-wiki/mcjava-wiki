import * as React from 'react'
import { useStaticQuery, graphql, Link, withPrefix } from 'gatsby'
import styled from '@xstyled/styled-components'
// eslint-disable-next-line import/no-unresolved
import { useLocation } from '@reach/router'

const SideNavQuery = graphql`
  query SideNavQuery {
    allMdx(filter: { fields: { pageType: { eq: "doc" }, title: { ne: "" } } }) {
      edges {
        node {
          id
          fields {
            title
            pageType
            section
            order
            slug
          }
        }
      }
    }

    site {
      siteMetadata {
        sections
      }
    }
  }
`

interface Node {
  id: string;
  fields: {
    title: string;
    pageType: string;
    section: string;
    order: number;
    slug: string;
  };
}

const createOrFindGroup = (name: string, groups: { name: string; nodes: Node[] }[]) => {
  const existingGroup = groups.find((group) => group.name === name)
  if (existingGroup) return existingGroup

  const group = { name, nodes: [] }
  groups.push(group)
  return group
}

const DEFAULT_ORDER_VALUE = -9999

const sortNodes = (a: { fields: { order: number; title: string } }, b: { fields: { order: number; title: any } }) => {
  const diff =
    a.fields.order !== DEFAULT_ORDER_VALUE &&
    b.fields.order !== DEFAULT_ORDER_VALUE
      ? a.fields.order - b.fields.order
      : a.fields.order !== DEFAULT_ORDER_VALUE
      ? -1
      : b.fields.order !== DEFAULT_ORDER_VALUE
      ? 1
      : a.fields.title.localeCompare(b.fields.title)
  return diff === 0 ? 0 : diff > 0 ? 1 : -1
}

const groupNodes = (nodes: Node[]) =>
  nodes.reduce((groups, node: Node) => {
    if (!node.fields.title) return groups
    const group = createOrFindGroup(node.fields.section || 'Docs', groups)
    group.nodes.push(node)
    group.nodes.sort(sortNodes)
    return groups
  }, [])

const Nav = styled.nav`
  padding: 4 3 5;
`

const NavGroup = styled.div`
  margin-bottom: 4;
`

const NavGroupTitle = styled.h4`
  font-size: 14;
  font-weight: 500;
  color: on-background-light;
  text-transform: uppercase;
  margin: 0 0 3 0;
`

const NavGroupMenu = styled.ul`
  margin: 0;
  padding: 0;
  border-left: 1;
  border-left-color: layout-border;
`

const NavGroupMenuItem = styled.li`
  list-style-type: none;
  margin: 2 0 0 -2px;
  padding: 0;
  font-size: 14;
  font-weight: 500;

  a {
    color: on-background-light;
    display: block;
    transition: fast;
    transition-property: color, border-color;
    padding: 2px 0 2px 2;
    border-left: 3;
    border-color: transparent;
    text-decoration: none;
    opacity: 0.85;

    &:hover {
      color: on-background;
      opacity: 1;
    }

    &[aria-current='page'] {
      font-weight: 600;
      border-color: primary;
      color: on-background;
      opacity: 1;
    }
  }
`

const sortGroupsWithConfig = (section: readonly string[] | null) => (a: { name: string }, b: { name: string }) => {
  if (!section) return 0;
  const indexA: number = section.indexOf(a.name)
  const indexB: number = section.indexOf(b.name)
  const diff = indexA - indexB
  return diff === 0 ? 0 : diff < 0 ? -1 : 1
}

export function useSideNavState() {
  const data: Queries.SideNavQueryQuery = useStaticQuery(SideNavQuery)
  return React.useMemo(() => {
    const navGroups = groupNodes(data.allMdx.edges.map((edge) => edge.node as Node))
    if ( !data.site ) return;
    const siteMetadata = data.site.siteMetadata;
    if (!siteMetadata) return;
    navGroups.sort(sortGroupsWithConfig(siteMetadata.sections))
    return { navGroups }
  }, [data])
}

export function useSideNavPrevNext({ navGroups }: { navGroups: { name: string; nodes: Node[] }[] }) {
  const { pathname } = useLocation()
  const nodes = navGroups.flatMap((group: { nodes: Node[] }) => group.nodes)
  const nodeIndex = nodes.findIndex(
    (node: Node) => withPrefix(`${node.fields.slug}/`) === pathname,
  )
  return {
    prev: nodeIndex > -1 ? nodes[nodeIndex - 1] : null,
    next: nodeIndex > -1 ? nodes[nodeIndex + 1] : null,
  }
}

export function SideNav({ navGroups }: { navGroups: { name: string; nodes: Node[] }[] }) {
  return (
    <Nav>
      {navGroups.map((navGroup, index) => (
        <NavGroup key={index}>
          <NavGroupTitle>{navGroup.name}</NavGroupTitle>
          <NavGroupMenu>
            {navGroup.nodes.map((page) => (
              <NavGroupMenuItem key={page.id}>
                <Link to={page.fields.slug}>{page.fields.title}</Link>
              </NavGroupMenuItem>
            ))}
          </NavGroupMenu>
        </NavGroup>
      ))}
    </Nav>
  )
}
