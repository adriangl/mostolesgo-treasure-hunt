import { createBrowserRouter } from 'react-router'
import App from './App'

export const router = createBrowserRouter([
  {
    path: '/',
    Component: App,
    children: [
      { index: true, lazy: async () => ({ Component: (await import('./pages/HomePage')).default }) },
      { path: 'missions', lazy: async () => ({ Component: (await import('./pages/MissionsPage')).default }) },
      { path: 'rules', lazy: async () => ({ Component: (await import('./pages/RulesPage')).default }) },
      { path: 'tools', lazy: async () => ({ Component: (await import('./pages/ToolsPage')).default }) },
    ],
  },
], { basename: import.meta.env.BASE_URL })
