import * as React from 'react'
import { x, useColorMode } from '@xstyled/styled-components'
import { RiMoonClearLine, RiSunLine } from 'react-icons/ri'

const modeIcons = {
  light: RiMoonClearLine,
  dark: RiSunLine,
}

function getInverseMode(mode: 'light' | 'dark') {
  return mode === 'light' ? 'dark' : 'light'
}

export const ColorModeSwitcher = React.forwardRef((props, ref: React.Ref<HTMLButtonElement>) => {
  const [mode, setMode] = useColorMode() as ['light' | 'dark', (mode: 'light' | 'dark') => void]
  const Icon = modeIcons[mode]
  return (
    <x.button
      ref={ref}
      type="button"
      onClick={() => setMode(getInverseMode(mode))}
      {...props}
    >
      <Icon style={{ width: 24, height: 24 }} />
    </x.button>
  )
})
