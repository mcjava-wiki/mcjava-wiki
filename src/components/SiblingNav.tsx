import React, { Ref } from 'react'
import { Link } from 'gatsby'
import styled from '@xstyled/styled-components'

export const InnerSiblingNavLink = styled.aBox`
  font-size: 18;
  transition: fast;
  color: on-background-primary;

  &:link { text-decoration: none; }

  &:hover {
    color: on-background-primary-dark;
  }

  &[data-type='next']:hover {
    transform: translateX(2px);
  }

  &[data-type='previous']:hover {
    transform: translateX(-2px);
  }
`

interface SiblingNavLinkProps {
  type: string;
  children: React.ReactNode;
  to: string;
}

export const SiblingNavLink = React.forwardRef(
  ({ type, children, to, ...props }: SiblingNavLinkProps, ref: React.Ref<HTMLAnchorElement>) => {
    return (
      <InnerSiblingNavLink
        innerRef={ref}
        as={Link}
        to={to}
        data-type={type}
        gridArea={type}
        {...props}
      >
        {type === 'previous' && '← '}
        {children}
        {type === 'next' && ' →'}
      </InnerSiblingNavLink>
    );
  }
);

export const SiblingNav = styled.navBox`
  display: grid;
  grid-template-areas: 'previous edit next';
  grid-template-columns: 1fr 1fr 1fr;
  justify-items: center;
  justify-content: space-between;
  align-content: space-between;
  margin: 5 0;
  & > *[data-type='previous'] {
    justify-self: start;
  }
  & > *[data-type='next'] {
    justify-self: end;
  }
`
