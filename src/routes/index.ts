import { lazy } from 'react';
const Analytics = lazy(() => import('../pages/Analytics/Analytics'));
const EventManagement = lazy(() => import('../pages/EventManagement/EventManagement'));
const NavigatorMng = lazy(() => import('../pages/NavigatorMng/NavigatorMng'));
const Notification = lazy(() => import('../pages/Notification/Notification'));
const CreateNotification = lazy(() => import('../pages/Notification/CreateNotification'));
const CreateEvents = lazy(() => import('../pages/EventManagement/CreateEvents'));

const coreRoutes = [
    {
        path: '/analytics',
        title: 'Analytics',
        component: Analytics,
    },
    {
        path: '/eventManagement',
        title: 'EventManagement',
        component: EventManagement,
    },
    {
        path: '/navigatorManagement',
        title: 'NavigatorMng',
        component: NavigatorMng,
    },
    {
        path: '/notifications',
        title: 'Notification',
        component: Notification,
    },
    {
        path: '/eventManagement/create',
        title: 'EventManagement',
        component: CreateEvents,
    },
    {
        path: '/notifications/create',
        title: 'Notification',
        component: CreateNotification,
    },
];

const routes = [...coreRoutes];
export default routes;