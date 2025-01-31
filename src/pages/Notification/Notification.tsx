import { useState, useEffect } from "react";
import SwitcherTwo from "../../components/SwitcherTwo";
import { CiSearch } from "react-icons/ci";
import { Link } from "react-router-dom";
import {
  useDraftNotificationData,
  useSecheduledNotificationData,
  useSentNotificationData,
} from "../../app/notificationColumns";
import { getNotificationColumns } from "../../app/notificationColumns";
import { NotificationFormData } from "../../types/types";
import { useNavigate } from "react-router-dom";
import TableNotification from "../../components/TableNotification";

const Notification = () => {
  const switchList = ["Sent", "Scheduled", "Draft"];
  const [switchTwo, setSwitchTwo] = useState("Sent");
    useState<NotificationFormData | null>(null);

  const { mutate: mutateSent, data: dataSent } = useSentNotificationData();
  const { mutate: mutateDraft, data: dataDraft } = useDraftNotificationData();
  const { mutate: mutateScheduled, data: dataScheduled } =
    useSecheduledNotificationData();

  // Function to get current data based on switch value
  const getCurrentData = () => {
    switch (switchTwo) {
      case "Sent":
        return dataSent;
      case "Scheduled":
        return dataScheduled;
      case "Draft":
        return dataDraft;
      default:
        return [];
    }
  };

  const handleSwitchChange = (value: string) => {
    setSwitchTwo(value);

    switch (value) {
      case "Sent":
        mutateSent();
        break;
      case "Scheduled":
        mutateScheduled();
        break;
      case "Draft":
        mutateDraft();
        break;
      default:
        break;
    }
  };

  useEffect(() => {
    handleSwitchChange(switchTwo);
  }, []);

  const columns = getNotificationColumns();
  const navigate = useNavigate();

  const handleViewDetails = (notification: NotificationFormData) => {
    console.log("View details for notification:", notification);
    navigate(`/notifications/${notification.post_id}`);
  };

  return (
    <>
      <div className="flex flex-col items-center w-full gap-5">
        <div className="flex items-center gap-4  w-full">
          <Link to={"/notifications/create"}>
            <button className="bg-primary px-3 rounded-lg py-2 flex items-center gap-2 text-white hover:bg-primary-light3 hover:text-primary">
              Create new <span className="font-bold">+</span>
            </button>
          </Link>
          <div className="relative w-2/3">
            <input
              type="text"
              className="border border-gray-border rounded-lg py-2 px-4 pl-10 text-sm outline-none w-full"
              placeholder="Search for an event"
            />
            <CiSearch className="absolute top-1/2 left-3 transform -translate-y-1/2 " />
          </div>
        </div>
        <div className="mt-2 w-[90%]">
          <SwitcherTwo
            list={switchList}
            activeSwitch={switchTwo}
            setActiveSwitch={handleSwitchChange} // Update this to use handleSwitchChange
          />
        </div>
        <div className="w-full">
          <TableNotification
            columns={columns}
            data={getCurrentData() || []} // Use getCurrentData and provide fallback empty array
            onViewDetails={handleViewDetails}
          />
        </div>
      </div>
    </>
  );
};

export default Notification;
