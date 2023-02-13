import * as React from 'react'
import { Button as AriakitButton } from 'ariakit/button'
import styled, { css } from '@xstyled/styled-components'

const variant =
  ({ background, backgroundHover, on }) =>
  () => {
    return css`
      background-color: ${background};
      color: ${on};
      &:hover:not(:disabled) {
        background-color: ${backgroundHover};
        color: ${on};
      }
      &:active:not(:disabled) {
        background-color: ${backgroundHover};
        color: ${on};
      }
    `
  }

const InnerButton = styled.buttonBox`
  appearance: none;
  border-radius: base;
  transition: base;
  font-weight: 500;
  border: 0;
  display: inline-flex;
  align-items: center;
  cursor: pointer;
  font-size: 16;
  padding: 2 3;
  text-decoration: none !important;
  &:disabled {
    opacity: 0.5;
    cursor: default;
  }
  &[data-variant='primary'] {
    ${variant({
      background: 'primary-600',
      backgroundHover: 'primary-700',
      on: 'white',
    })}
  }
  &[data-variant='success'] {
    ${variant({
      background: 'green-600',
      backgroundHover: 'green-700',
      on: 'white',
    })}
  }
  &[data-variant='danger'] {
    ${variant({
      background: 'red-600',
      backgroundHover: 'red-700',
      on: 'white',
    })}
  }
  &[data-variant='neutral'] {
    ${variant({
      background: 'gray-300',
      backgroundHover: 'gray-400',
      on: 'black',
    })}
  }
`

interface ButtonProps {
  variant?: 'primary' | 'secondary';
  children: React.ReactNode;
}

export const Button = React.forwardRef(
  ({ variant = 'primary', children, ...props }: ButtonProps, ref: any) => {
    return (
      <AriakitButton ref={ref} data-variant={variant}>
        {(buttonProps) => (
          <InnerButton {...buttonProps} {...props}>
            {children}
          </InnerButton>
        )}
      </AriakitButton>
    )
  },
)