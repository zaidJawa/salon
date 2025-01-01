// All components mapping with path for internal routes

import {
  lazy
} from 'react'

const Dashboard = lazy(() => import('../pages/protected/Dashboard'))
const Welcome = lazy(() => import('../pages/protected/Welcome'))
const Page404 = lazy(() => import('../pages/protected/404'))
const Services = lazy(() => import('../pages/protected/Services'))
const BookedSessions = lazy(() => import('../pages/protected/BookedSessions'))


const routes = [
  {
    path: '/dashboard',
    component: Dashboard,
  },
  {
    path: '/welcome',
    component: Welcome,
  },
  {
    path: '/services',
    component: Services,
  },

  {
    path: '/bookedSessions',
    component: BookedSessions,
  },

  {
    path: '/404',
    component: Page404,
  },

]

export default routes