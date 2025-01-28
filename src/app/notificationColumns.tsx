import {
  getAllNotificationApi,
  getDraftNotificationApi,
  getScheduledNotificationApi,
  getSentNotificationApi,
} from "../services/notifications";
import { useSelector } from "react-redux";
import { selectCurrentId, selectCurrentToken } from "../app/redux/userSlice";
import { NotificationFormData } from "../types/types";
import { useDispatch } from "react-redux";
import { setNotifications } from "./redux/notificationSlice";
import { useMutation } from "@tanstack/react-query";

export const useAllNotificationData = () => {
  const dispatch = useDispatch();
  const id = useSelector(selectCurrentId);
  const token = useSelector(selectCurrentToken);
  const data = {
    user_id: id,
  };

  return useMutation({
    mutationFn: async () => {
      const response = await getAllNotificationApi(token, data);
      // The data structure you showed is in response.data
      return response.data.notifications;
    },
    onSuccess: (data) => {
      // Save notifications to Redux store
      dispatch(setNotifications(data));
      console.log("Notifications:", data);
    },
    onError: (error: Error) => {
      console.error("Error fetching notifications:", error);
    },
  });
};

export const useDraftNotificationData = () => {
  const dispatch = useDispatch();
  const id = useSelector(selectCurrentId);
  const token = useSelector(selectCurrentToken);
  const data = {
    user_id: id,
  };

  return useMutation({
    mutationFn: async () => {
      const response = await getDraftNotificationApi(token, data);
      // The data structure you showed is in response.data
      return response.data.notifications;
    },
    onSuccess: (data) => {
      // Save notifications to Redux store
      dispatch(setNotifications(data));
      console.log("Notifications:", data);
    },
    onError: (error: Error) => {
      console.error("Error fetching notifications:", error);
    },
  });
};

export const useSentNotificationData = () => {
  const dispatch = useDispatch();
  const id = useSelector(selectCurrentId);
  const token = useSelector(selectCurrentToken);
  const data = {
    user_id: id,
  };

  return useMutation({
    mutationFn: async () => {
      const response = await getSentNotificationApi(token, data);
      // The data structure you showed is in response.data
      return response.data.notifications;
    },
    onSuccess: (data) => {
      // Save notifications to Redux store
      dispatch(setNotifications(data));
      console.log("Notifications:", data);
    },
    onError: (error: Error) => {
      console.error("Error fetching notifications:", error);
    },
  });
};

export const useSecheduledNotificationData = () => {
  const dispatch = useDispatch();
  const id = useSelector(selectCurrentId);
  const token = useSelector(selectCurrentToken);
  const data = {
    user_id: id,
  };

  return useMutation({
    mutationFn: async () => {
      const response = await getScheduledNotificationApi(token, data);
      // The data structure you showed is in response.data
      return response.data.notifications;
    },
    onSuccess: (data) => {
      // Save notifications to Redux store
      dispatch(setNotifications(data));
      console.log("Notifications:", data);
    },
    onError: (error: Error) => {
      console.error("Error fetching notifications:", error);
    },
  });
};

export const getNotificationColumns = () => {
  return [
    {
      header: "Audience",
      accessor: "notification_send_to_all_users",
      Cell: ({ value, row }: { value: boolean; row: NotificationFormData }) => (
        <span className="text-sm">
          {value
            ? "All Users"
            : `${row.notification_event_attendees.length} Selected Users`}
        </span>
      ),
    },
    {
      header: "Date",
      accessor: "notification_scheduled_time",
      Cell: ({ value }: { value: string }) => {
        if (!value) return "-";
        const date = new Date(value);
        return date.toLocaleString("en-US", {
          year: "numeric",
          month: "long",
          day: "numeric",
          hour: "numeric",
          minute: "2-digit",
          hour12: true,
        });
      },
    },
    {
      header: "Type",
      accessor: "notification_how_to_send",
      Cell: ({ value }: { value: string }) => (
        <div className="max-w-[300px] truncate">
          {`${
            value === "0"
              ? "Simple"
              : value === "1"
              ? "Scheduled"
              : "Geo-Fenced"
          }`}
        </div>
      ),
    },

    {
      header: "Description",
      accessor: "notification_description",
      Cell: ({ value }: { value: string }) => (
        <div className="max-w-[300px] truncate">{value}</div>
      ),
    },
    {
      header: "Image",
      accessor: "notification_image",
      Cell: ({ value }: { value: string }) => (
        <div className="max-w-[300px]">
          {value ? (
            <img
              src={`data:image/jpeg;base64,${value}`}
              alt="Notification"
              className="max-w-full h-auto"
            />
          ) : (
            <span>No image</span>
          )}
        </div>
      ),
    },

    {
      header: "Status",
      accessor: "notification_status",
      Cell: ({ value }: { value: string }) => (
        <div className="max-w-[300px] truncate">{value}</div>
      ),
    },
  ];
};
