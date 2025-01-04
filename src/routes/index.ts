import { lazy } from 'react';
const Dashboard = lazy(() => import('../pages/Dashboard/Dashboard'));

const coreRoutes = [
    {
        path: '/',
        title: 'Dashboard',
        component: Dashboard,
    },
];

const routes = [...coreRoutes];
export default routes;