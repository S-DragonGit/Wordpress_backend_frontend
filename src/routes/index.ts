import { lazy } from 'react';
const Analytics = lazy(() => import('../pages/Analytics/Analytics'));
const EventManagement = lazy(() => import('../pages/EventManagement/EventManagement'));
const NavigatorMng = lazy(() => import('../pages/NavigatorMng/NavigatorMng'));
const Notification = lazy(() => import('../pages/Notification/Notification'));
const CreateNotification = lazy(() => import('../pages/Notification/CreateNotification'));
const NotificationModal = lazy(() => import('../pages/Notification/NotificationModal'));
const CreateEvent = lazy(() => import('../pages/EventManagement/CreateEvent'));
const EventModal = lazy(() => import('../pages/EventManagement/EventModal'));
// const EventReviews = lazy(() => import('../pages/EventManagement/EventReviews'));

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
        title: 'EventCreate',
        component: CreateEvent,
    },
    {
        path: '/notifications/create',
        title: 'NotificationCreate',
        component: CreateNotification,
    },
    {
        path: '/notifications/:id',
        title: 'NotificationModal',
        component: NotificationModal,
    },
    {
        path: '/eventManagement/:id',
        title: 'EventModal',
        component: EventModal,
    },
    // {
    //     path: '/eventManagement/reviews/:id',
    //     title: 'EventReviews',
    //     component: EventReviews,
    // },
];

const routes = [...coreRoutes];
export default routes;