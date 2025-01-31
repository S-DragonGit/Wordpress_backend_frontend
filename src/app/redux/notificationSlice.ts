import { createSlice } from "@reduxjs/toolkit";
import { NotificationFormData } from "../../types/types";

export interface NotificationState {
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
        // Set selected notification
        setSelectedNotification(state, action) {
            state.selectedNotification = action.payload;
        },
    },
});

export const {
    setLoading,
    setError,
    setNotifications,
    setSelectedNotification,
} = notificationSlice.actions;

// Selectors
export const selectAllNotifications = (state: { notification: NotificationState }) =>
    state.notification.notifications;

export const selectNotificationById = (state: { notification: NotificationState }, id: string) =>
    state.notification.notifications.find(notification => notification.post_id?.toString() === id);

export const selectSelectedNotification = (state: { notification: NotificationState }) =>
    state.notification.selectedNotification;

export const selectNotificationLoading = (state: { notification: NotificationState }) =>
    state.notification.isLoading;

export const selectNotificationError = (state: { notification: NotificationState }) =>
    state.notification.error;

export default notificationSlice.reducer;
