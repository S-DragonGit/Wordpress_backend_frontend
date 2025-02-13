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
import { setNotifications, setLoading } from "./redux/notificationSlice";
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
      dispatch(setLoading(true));
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
      dispatch(setLoading(true));
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
        <span className="text-sm w-[120px] inline-block overflow-hidden text-ellipsis whitespace-nowrap text-center">
          {value
            ? "All Users"
            : `${row.notification_event_attendees.length} Selected Users`}
        </span>
      ),
    },
    {
      header: "Date",
      accessor: "notification_create_at",
      Cell: ({ value }: { value: string }) => {
        if (!value) return "-";
        const date = new Date(value);
        return (
          <div className="w-[120px] overflow-hidden text-ellipsis whitespace-nowrap  text-center w-full">
            {date.toLocaleString("en-US", {
              year: "numeric",
              month: "long",
              day: "numeric",
              hour: "numeric",
              minute: "2-digit",
              hour12: true,
            })}
          </div>
        );
      },
    },
    {
      header: "Type",
      accessor: "notification_how_to_send",
      Cell: ({ value }: { value: string }) => (
        <div className="w-[150px] overflow-hidden text-ellipsis whitespace-nowrap text-center w-full">
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
        <div className="w-[180px] h-[60px] overflow-hidden flex items-center justify-center text-center  w-full">
          <p className="line-clamp-3">{value}</p>
        </div>
      ),
    },
    {
      header: "Image",
      accessor: "notification_image",
      Cell: ({ value }: { value: string }) => (
        <div className="w-[120px] h-[60px] flex items-center justify-center text-center w-full">
          {value ? (
            <img
              src={value}
              alt="Notification"
              className="object-cover w-full h-full text-center"
              style={{
                maxWidth: "120px",
                maxHeight: "120px",
                objectFit: "cover",
              }}
            />
          ) : (
            <span className="text-gray-400">No image</span>
          )}
        </div>
      ),
    },
    {
      header: "Status",
      accessor: "notification_status",
      Cell: ({ value }: { value: string }) => (
        <div className="w-[100px] overflow-hidden text-ellipsis whitespace-nowrap text-center w-full">
          {value}
        </div>
      ),
    },
  ];
};
