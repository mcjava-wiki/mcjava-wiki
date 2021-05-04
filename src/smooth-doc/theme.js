import { theme as baseTheme } from 'smooth-doc/src/theme'
import customTheme from 'prism-react-renderer/themes/nightOwl'

export const theme = {
  ...baseTheme,
  'prism-theme': customTheme,
}