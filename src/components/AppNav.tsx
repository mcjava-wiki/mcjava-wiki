import React from 'react'
import { RiGithubFill, RiDiscordFill } from 'react-icons/ri'
import { Nav, NavList, NavListItem, NavLink } from './Nav'
import { ColorModeSwitcher } from './ColorModeSwitcher'

export function AppNav() {
  return (
    <Nav>
      <NavList>
        <NavListItem>
          <NavLink to="/docs/about/introduction/">Docs</NavLink>
        </NavListItem>
        <NavListItem>
            <NavLink
              as="a"
              href="https://github.com/mcjava-wiki/mcjava-wiki"
              target="_blank"
              rel="noopener noreferrer"
            >
              <RiGithubFill style={{ width: 24, height: 24 }} />
            </NavLink>
        </NavListItem>
        <NavListItem>
            <NavLink
              as="a"
              href="https://discord.gg/rqsKmmh89J"
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
