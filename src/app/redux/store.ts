import { configureStore } from "@reduxjs/toolkit";
import { persistStore, persistReducer } from "redux-persist";
import storage from "redux-persist/lib/storage";

import { userSlice } from "./userSlice";
import { eventSlice } from "./eventSlice";
import { notificationSlice } from "./notificationSlice";

const userPersistConfig = { key: "user", storage, version: 1 };
const notificationPersistConfig = { key: "notification", storage, version: 1 };
const eventPersistConfig = { key: "event", storage, version: 1 };

// Persist configuration for user state
const userPersistReducer = persistReducer(userPersistConfig, userSlice.reducer);

const notificationPersistReducer = persistReducer(
  notificationPersistConfig,
  notificationSlice.reducer
);

const eventPersistReducer = persistReducer(
  eventPersistConfig,
  eventSlice.reducer
);

export const Store = configureStore({
  reducer: {
    user: userPersistReducer,
    notification: notificationPersistReducer,
    event: eventPersistReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false,
    }),
});

export const persistor = persistStore(Store);

export type RootState = ReturnType<typeof Store.getState>;
