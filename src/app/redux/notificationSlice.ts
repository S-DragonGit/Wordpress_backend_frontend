import { createSlice } from "@reduxjs/toolkit";
import { NotificationFormData } from "../../types/types";

interface NotificationState {
    notifications: NotificationFormData[];
    selectedNotification: NotificationFormData | null;
    isLoading: boolean;
    error: string | null;
}

export const notificationSlice = createSlice({
    name: "notification",
    initialState: {
        notifications: [],
        selectedNotification: null,
        isLoading: false,
        error: null,
    } as NotificationState,
    reducers: {
        setLoading(state, action) {
            state.isLoading = action.payload;
        },
        setError(state, action) {
            state.error = action.payload;
        },
        // Get all notifications
        setNotifications(state, action) {
            state.notifications = action.payload;
            state.isLoading = false;
            state.error = null;
        },
        // Add new notification
        addNotification(state, action) {
            state.notifications.push(action.payload);
            state.isLoading = false;
            state.error = null;
        },
        // Update existing notification
        updateNotification(state, action) {
            const index = state.notifications.findIndex(
                (notification) => notification.user_id === action.payload.user_id
            );
            if (index !== -1) {
                state.notifications[index] = action.payload;
            }
            state.isLoading = false;
            state.error = null;
        },
        // Delete notification
        deleteNotification(state, action) {
            state.notifications = state.notifications.filter(
                (notification) => notification.user_id !== action.payload
            );
            state.isLoading = false;
            state.error = null;
        },
        // Set selected notification
        setSelectedNotification(state, action) {
            state.selectedNotification = action.payload;
        },
        // Clear notifications
        clearNotifications(state) {
            state.notifications = [];
            state.selectedNotification = null;
            state.isLoading = false;
            state.error = null;
        },
    },
});

export const {
    setLoading,
    setError,
    setNotifications,
    addNotification,
    updateNotification,
    deleteNotification,
    setSelectedNotification,
    clearNotifications,
} = notificationSlice.actions;

// Selectors
export const selectAllNotifications = (state: { notification: NotificationState }) =>
    state.notification.notifications;

export const selectSelectedNotification = (state: { notification: NotificationState }) =>
    state.notification.selectedNotification;

export const selectNotificationLoading = (state: { notification: NotificationState }) =>
    state.notification.isLoading;

export const selectNotificationError = (state: { notification: NotificationState }) =>
    state.notification.error;

export default notificationSlice.reducer;