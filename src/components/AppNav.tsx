import * as React from 'react'
import { graphql, useStaticQuery } from 'gatsby'
import { RiGithubFill, RiDiscordFill } from 'react-icons/ri'
import { Nav, NavList, NavListItem, NavLink } from './Nav'
import { ColorModeSwitcher } from './ColorModeSwitcher'
import { tlds, sites } from '../util/constants'

const AppNavQuery = graphql`
  query AppNav {
    site {
      siteMetadata {
        githubRepository
        discordInviteCode
      }
    }
  }
`

export function AppNav() {
  const data: Queries.AppNavQuery = useStaticQuery(AppNavQuery)
  return (
    <Nav>
      <NavList>
        <NavListItem>
          <NavLink to="/docs/about/introduction/">Docs</NavLink>
        </NavListItem>
        <NavListItem>
            <NavLink
              as="a"
              href={`https://${sites.GITHUB}.${tlds.COM}/${data?.site?.siteMetadata?.githubRepository}`}
              target="_blank"
              rel="noopener noreferrer"
            >
              <RiGithubFill style={{ width: 24, height: 24 }} />
            </NavLink>
        </NavListItem>
        <NavListItem>
            <NavLink
              as="a"
              href={`https://${sites.DISCORD}.${tlds.GG}/${data?.site?.siteMetadata?.discordInviteCode}`}
              target="_blank"
              rel="noopener noreferrer"
            >
              <RiDiscordFill style={{ width: 24, height: 24 }} />
            </NavLink>
        </NavListItem>
        <NavListItem>
          <NavLink 
            as={ColorModeSwitcher} 
          />
        </NavListItem>
      </NavList>
    </Nav>
  )
}
