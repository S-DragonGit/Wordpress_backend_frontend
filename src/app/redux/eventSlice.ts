import { createSlice } from "@reduxjs/toolkit";
import { EventFormData } from "../../types/types";

export interface EventState {
    events: EventFormData[];
    selectedEvent: EventFormData | null;
    isLoading: boolean;
    error: string | null;
    currentEvent: EventFormData | null;
}

export const eventSlice = createSlice({
    name: "event",
    initialState: {
        events: [],
        selectedEvent: null,
        isLoading: false,
        error: null,
        currentEvent: null,
    } as EventState,
    reducers: {
        setLoading(state, action) {
            state.isLoading = action.payload;
        },
        setError(state, action) {
            state.error = action.payload;
        },
        // Get all events
        setEvents(state, action) {
            state.events = action.payload;
            state.isLoading = false;
            state.error = null;
        },
        // Set selected event
        setSelectedEvent(state, action) {
            state.selectedEvent = action.payload;
        },
        setCurrentEvent(state, action) {
            state.currentEvent = action.payload;
        },
    },
});

export const {
    setLoading,
    setError,
    setEvents,
    setSelectedEvent,
    setCurrentEvent
} = eventSlice.actions;

// Selectors
export const selectAllEvents = (state: { event: EventState }) =>
    state.event.events;

export const selectCurrentEvent = (state: { event: EventState }) =>
    state.event.currentEvent;

export const selectEventById = (state: { event: EventState }, id: string) =>
    state.event.events.find(event => event.post_id?.toString() === id);

export const selectSelectedEvent = (state: { event: EventState }) =>
    state.event.selectedEvent;

export const selectEventLoading = (state: { event: EventState }) =>
    state.event.isLoading;

export const selectEventError = (state: { event: EventState }) =>
    state.event.error;

export default eventSlice.reducer;
