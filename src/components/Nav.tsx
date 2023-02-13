import React from 'react'
import { Link } from 'gatsby'
import styled, { x, th, down, css } from '@xstyled/styled-components'
import internal from 'stream'

export const Nav = styled.navBox`
  ${down(
    'md',
    css`
      overflow-x: auto;
      max-width: calc(100vw - ${th.px(72)}) !important;
    `,
  )}
`

const InnerNavLink = styled.aBox`
  display: inline-flex;
  color: on-background;
  transition: base;
  transition-property: color;
  text-decoration: none;
  cursor: pointer;

  &:hover,
  &:focus {
    color: on-background-light;
  }

  /* Reset button */
  appearance: none;
  border: 0;
  background: transparent;
  padding: 0;
`

type NavLinkProps = {
  children?: React.ReactNode;
  display?: string;
  alignItems?: string;
  flexWrap?: string;
  mx?: number;
  row?: boolean;
  to?: string;
  as?: string | React.ComponentType;
  href?: string;
  target?: string;
  rel?: string;
};

export const NavLink = React.forwardRef((props: NavLinkProps, ref: any) => {
  return <InnerNavLink ref={ref} as={Link} {...props} />
})

export const NavListItem = styled.liBox`
  list-style-type: none;
  white-space: nowrap;
  margin: 0;
  padding: 0 2;
  display: flex;
  align-items: center;
`

type NavListProps = {
  children: React.ReactNode;
};

export const NavList = React.forwardRef((props: NavListProps, ref: any) => {
  return (
    <x.ul
      ref={ref}
      m={0}
      p={0}
      row
      alignItems="center"
      flexWrap="nowrap"
      {...props}
    />
  )
})
