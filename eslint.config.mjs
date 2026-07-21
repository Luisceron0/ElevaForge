import nextCoreWebVitals from 'eslint-config-next/core-web-vitals'

const config = [
  ...nextCoreWebVitals,
  {
    ignores: ['testsprite_tests/**', 'backup/**'],
  },
  {
    rules: {
      'react/no-unescaped-entities': 'off',
      // Widespread, deliberate pattern in app/admin/* and components/admin/*:
      // syncing local editable draft state from an external prop via
      // useEffect. Real, but requires a dedicated behavior-preserving
      // refactor per editor component — tracked in tasks/todo.md, not
      // silently fixed as a side effect of turning lint on. Kept as a
      // warning (not off) so it stays visible.
      'react-hooks/set-state-in-effect': 'warn',
      'react-hooks/immutability': 'warn',
    },
  },
]

export default config
