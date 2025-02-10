import { icons } from "../../constants";
import { useRef, useState, useEffect } from "react";
import { useMutation } from "@tanstack/react-query";
import { updateNotificationApi } from "../../services/notifications";
import { useNavigate, useParams } from "react-router-dom";
import { selectCurrentToken } from "../../app/redux/userSlice";
import { NotificationFormData } from "../../types/types";
import { NotificationStatus } from "../../types/types";
import { GeoCategory } from "../../types/types";
import {
  selectNotificationById,
  selectNotificationLoading,
  selectNotificationError,
  setSelectedNotification,
} from "../../app/redux/notificationSlice";
import { useDispatch, useSelector } from "react-redux";
import { NotificationState } from "../../app/redux/notificationSlice";
import toast from "react-hot-toast";

const NotificationModal = () => {
  const { id } = useParams();
  const token = useSelector(selectCurrentToken);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  // Correct ✅
  const notification = useSelector(
    (state: { notification: NotificationState }) =>
      selectNotificationById(state, id as string)
  );
  const [notificationTitle, setNotificationTitle] = useState("");
  const [notificationDesc, setNotificationDesc] = useState("");
  const [isPublished, setIsPublished] = useState(false);

  useEffect(() => {
    if (
      notification?.notification_status === ("sent" as string) ||
      notification?.notification_status === ("scheduled" as string)
    ) {
      setIsPublished(true);
    }
  }, [notification]);

  const defaultFormData: NotificationFormData = {
    user_id: 0,
    // notification_id: null,
    notification_title: "",
    notification_description: "",
    notification_status: "draft",
    notification_send_to_all_users: true,
    notification_event_attendees: [],
    notification_tags: {
      category: "",
      priority: "",
    },
    notification_link: "",
    notification_image: "",
    notification_how_to_send: "0",
    notification_geo_category: {
      miles: 5.65,
      dist_unit: "miles",
    },
    notification_geo_fence_expiration_date: "",
    notification_scheduled_time: "",
    notification_create_at: null,
    post_id: null,
  };

  const [formData, setFormData] = useState<NotificationFormData>(
    notification ?? defaultFormData
  );

  const [scheduleDateTime, setScheduleDateTime] = useState<string>("");
  const [geoExpirationDate, setGeoExpirationDate] = useState<string>("");
  const [imagePreview, setImagePreview] = useState<string | null>(
    formData.notification_image === "" ? "" : formData.notification_image
  );
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const [fileName, setFileName] = useState("No file chosen");
  const [typeNotification, setTypeNotification] = useState(
    Number(formData.notification_how_to_send)
  );

  const isLoading = useSelector(selectNotificationLoading);
  const error = useSelector(selectNotificationError);

  useEffect(() => {
    const now = new Date();
    // Format: YYYY-MM-DDThh:mm
    const formattedDateTime = now.toISOString().slice(0, 16);
    setScheduleDateTime(formattedDateTime);
    const formattedDate = now.toISOString().slice(0, 10);
    setGeoExpirationDate(formattedDate);
  }, []);

  useEffect(() => {
    if (notification) {
      dispatch(setSelectedNotification(notification));
    }
  }, [notification, dispatch]);

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary">
          Loading....
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen">
        <p className="text-lg text-red-600">{error}</p>
        <button
          onClick={() => navigate("/notifications")}
          className="mt-4 bg-primary text-white px-4 py-2 rounded-md hover:bg-primary-light3"
        >
          Back to Notifications
        </button>
      </div>
    );
  }

  if (!notification) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen">
        <p className="text-lg text-gray-600">Notification not found</p>
        <button
          onClick={() => navigate("/notifications")}
          className="mt-4 bg-primary text-white px-4 py-2 rounded-md hover:bg-primary-light3"
        >
          Back to Notifications
        </button>
      </div>
    );
  }

  // Initial state

  // Handle input changes for different field types
  const handleInputChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value, type } = e.target;

    // Handle checkboxes
    if (type === "checkbox") {
      const { checked } = e.target as HTMLInputElement;
      setFormData((prev) => ({
        ...prev,
        [name]: checked,
      }));
      return;
    }

    // Handle notification tags
    if (name.startsWith("notification_tags.")) {
      const [_, field] = name.split(".");
      setFormData((prev) => ({
        ...prev,
        notification_tags: {
          ...prev.notification_tags,
          [field]: value,
        },
      }));
      return;
    }

    // Handle geo category
    if (name.startsWith("notification_geo_category.")) {
      const [_, field] = name.split(".");
      setFormData((prev) => ({
        ...prev,
        notification_geo_category: {
          ...(prev.notification_geo_category || {
            miles: 5.65,
            dist_unit: "miles",
          }), // Default values
          [field]: field === "miles" ? Number(value) : value,
        } as GeoCategory,
      }));
      return;
    }

    // Handle arrays (event attendees)
    if (name === "notification_event_attendees") {
      if (value === "") {
        setFormData((prev) => ({
          ...prev,
          [name]: [], // Wrap the value in an array since we're storing it as an array
        }));
        return;
      }
      setFormData((prev) => ({
        ...prev,
        [name]: [value], // Wrap the value in an array since we're storing it as an array
      }));
      return;
    }

    // Handle all other inputs
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // Handle file input
  interface FileValidationResult {
    isValid: boolean;
    error?: string;
  }

  const validateImageFile = (file: File): FileValidationResult => {
    // Allowed MIME types
    const allowedTypes = ["image/jpeg", "image/jpg", "image/png", "image/bmp"];

    // Allowed extensions (as fallback)
    const allowedExtensions = [".jpg", ".jpeg", ".png", ".bmp"];

    // Check MIME type
    if (!allowedTypes.includes(file.type)) {
      const extension = file.name.toLowerCase().split(".").pop();
      if (!extension || !allowedExtensions.includes(`.${extension}`)) {
        return {
          isValid: false,
          error:
            "Invalid file type. Please upload only jpg, jpeg, png, or bmp files",
        };
      }
    }

    // Check file size (5MB limit)
    const maxSize = 5 * 1024 * 1024;
    if (file.size > maxSize) {
      return {
        isValid: false,
        error: "File size should be less than 5MB",
      };
    }

    return { isValid: true };
  };

  // Optional: Add preview functionality

  const handleFileChange = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = event.target.files?.[0];

    if (!file) return;

    const validationResult = validateImageFile(file);

    if (!validationResult.isValid) {
      toast(validationResult.error ?? "No alert");
      event.target.value = "";
      setImagePreview(null);
      return;
    }

    try {
      const base64String = await new Promise<string>((resolve, reject) => {
        const reader = new FileReader();

        reader.onload = () => {
          if (typeof reader.result === "string") {
            // Set preview
            setImagePreview(reader.result);
            resolve(reader.result);
          } else {
            reject(new Error("Failed to convert file to base64"));
          }
        };

        reader.onerror = () => reject(reader.error);

        reader.readAsDataURL(file);
      });

      console.log("base64String", base64String);

      setFormData((prev) => ({
        ...prev,
        notification_image: base64String,
      }));
      setFileName(
        file.name === "No file chosen" ? formData.notification_image : file.name
      );
    } catch (error) {
      console.error("Error processing file:", error);
      toast("Error processing file. Please try again.");
      event.target.value = "";
      setImagePreview(null);
    }
  };

  // Handle date/time inputs
  const handleDateTimeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedDateTime = new Date(e.target.value);
    const now = new Date();

    // Compare full datetime, not just date
    if (selectedDateTime < now) {
      alert("Please select a future date and time");
      return;
    }

    setScheduleDateTime(e.target.value);
    // If you need to update form data as well
    setFormData((prev) => ({
      ...prev,
      notification_scheduled_time: e.target.value,
    }));
  };

  //Handle date inputs
  const handleDateTime = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedDate = e.target.value;
    const today = new Date().toISOString().split("T")[0];

    // Validate if selected date is not before today
    if (selectedDate < today) {
      alert("Please select a date from today onwards");
      return;
    }

    setScheduleDateTime(e.target.value);
    setFormData((prev) => ({
      ...prev,
      notification_geo_fence_expiration_date: e.target.value,
    }));
  };

  const handleFileButtonClick = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  const handleNotificationClick = (type: number) => {
    setTypeNotification(type);
    setFormData((prev) => ({
      ...prev,
      notification_how_to_send: type.toString(),
    }));
  };

  const updateNotificationMutation = useMutation({
    mutationFn: async (data: NotificationFormData) =>
      updateNotificationApi(token, data),
    onSuccess: (data: any) => {
      console.log(data.data.message);
      navigate("/notifications");
    },
    onError: (error: any) => {
      console.error("Submission failed", error);
    },
  });

  const handleSubmit = async (
    e: React.MouseEvent<HTMLButtonElement> | React.FormEvent<HTMLFormElement>
  ) => {
    e.preventDefault();

    // Get the button that was clicked
    let buttonName: string | undefined;

    if (e.type === "click") {
      // Handle button click
      buttonName = (e.currentTarget as HTMLButtonElement).name;
    }

    const status: NotificationStatus =
      buttonName === "sendButton" ? "sent" : "draft";

    const now = new Date();
    const formattedDate = now.toISOString().slice(0, 16);

    let updatedData: NotificationFormData = {
      ...formData,
      post_id: formData.post_id,
      notification_status: status,
      notification_create_at: formattedDate,
    };

    // Rest of your switch statement and try/catch block remains the same
    switch (updatedData.notification_how_to_send) {
      case "0": // simple
        updatedData = {
          ...updatedData,
          notification_geo_category: null,
          notification_geo_fence_expiration_date: null,
          notification_scheduled_time: null,
        };
        break;

      case "1": // scheduled
        updatedData = {
          ...updatedData,
          notification_geo_category: null,
          notification_geo_fence_expiration_date: null,
        };
        break;

      case "2": // geo-fenced
        updatedData = {
          ...updatedData,
          notification_scheduled_time: null,
        };
        break;
    }

    try {
      if (
        formData.notification_title === "" ||
        formData.notification_description === ""
      ) {
        if (formData.notification_title === "")
          setNotificationTitle("Required!");
        if (formData.notification_description === "")
          setNotificationDesc("Required!");
        toast("Required fields should be input! Please type.");
        console.log(formData);
      } else {
        await updateNotificationMutation.mutate(updatedData);
        console.log(formData);
        console.log(updatedData);
      }
    } catch (error) {
      console.error("Submission error:", error);
    }
  };

  const handleback = () => {
    navigate('/notifications');
  }

  return (
    <div className="grid gap-5 smd:grid-cols-2 grid-cols-1 smd:mt-10 smd:ml-10 position-absolute">
      <div className="flex flex-col gap-5 p-4 max-w-2xl">
        {/* Send To Section */}
        <div className="flex flex-col gap-2">
          <label className="font-medium">
            <span className="text-red-500">*</span>SEND TO:
          </label>
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <input
                type="radio"
                disabled={isPublished}
                id="notification_send_to_all_users"
                name="notification_send_to_users" // Same name for both radio buttons
                value="all"
                checked={formData.notification_send_to_all_users}
                onChange={(e) => {
                  setFormData((prev) => ({
                    ...prev,
                    notification_send_to_all_users: e.target.value === "all",
                  }));
                }}
                className="w-4 h-4"
              />
              <span>All Users</span>
            </div>
            <div className="flex items-center gap-2">
              <input
                type="radio"
                disabled={isPublished}
                id="notification_send_not_to_all_users"
                name="notification_send_to_users" // Same name for both radio buttons
                value="disabled"
                checked={!formData.notification_send_to_all_users}
                onChange={(e) => {
                  setFormData((prev) => ({
                    ...prev,
                    notification_send_to_all_users: e.target.value === "all",
                  }));
                }}
                className="w-4 h-4"
              />
              <span>Disabled</span>
            </div>
          </div>
        </div>

        {/* Event/Attendees Section */}
        <div className="flex items-center gap-2">
          <span className="text-sm">Event(s)/Attendees:</span>
          <select
            disabled={isPublished}
            className="border border-gray-border w-full p-2 rounded-sm"
            id="notification_event_attendees"
            name="notification_event_attendees"
            value={formData.notification_event_attendees[0]} // Since it's single select, use first value
            onChange={handleInputChange}
          >
            <option value=""></option>
            <option value="event1">Event 1</option>
            <option value="event2">Event 2</option>
          </select>
        </div>

        {/* Tags Section */}
        <div className="flex gap-2 align-center">
          <h5>Tags</h5>
          <input type="checkbox" disabled={isPublished} className="w-4 h-4" />

          <div>
            <div className="flex items-center gap-2 ">
              <label>Health Screening</label>
            </div>
          </div>
        </div>

        {/* Notification Title */}
        <div className="flex flex-col gap-2 border-t border-gray-border">
          <h6 className="text-sm text-center">Notification Info</h6>
          <label className="text-sm mt-2">
            <span className="text-red-500">*</span>Notification Title
          </label>
          <input
            type="text"
            disabled={isPublished}
            id="notification_title"
            name="notification_title"
            value={formData.notification_title}
            onChange={handleInputChange}
            required
            className={`border w-[300px] p-2 rounded ${
              notificationTitle ? "border-red-600" : "border-gray-border"
            }`}
          />
        </div>

        {/* Description */}
        <div className="flex flex-col gap-2">
          <label className="text-sm">Description</label>
          <textarea
            id="notification_description"
            name="notification_description"
            disabled={isPublished}
            value={formData.notification_description}
            onChange={handleInputChange}
            className={`border w-[300px] p-2 rounded ${
              notificationDesc ? "border-red-600" : "border-gray-border"
            }`}
          />
        </div>

        {/* Link */}
        <div className="flex flex-col gap-2">
          <label className="text-sm">Link</label>
          <input
            id="notification_link"
            name="notification_link"
            disabled={isPublished}
            value={formData.notification_link}
            onChange={handleInputChange}
            type="text"
            className="border border-gray-border p-2 rounded"
          />
        </div>

        {/* Image Upload */}
        <div className="flex flex-col gap-2">
          <label className="text-sm">Image</label>
          <div className="flex gap-4 items-center">
            <button
              disabled={isPublished}
              className="bg-primary p-1 rounded-md text-white font-semibold px-3"
              onClick={handleFileButtonClick}
            >
              Choose file +
            </button>
            <span>{fileName}</span>
            <input
              type="file"
              disabled={isPublished}
              ref={fileInputRef}
              onChange={handleFileChange}
              className="hidden"
            />
            {imagePreview && (
              <div className="image-preview">
                <img
                  src={imagePreview}
                  alt="Preview"
                  style={{ maxWidth: "200px", maxHeight: "200px" }}
                />
              </div>
            )}
          </div>
        </div>

        {/* Status */}
        <div className="flex items-center gap-2">
          <span className="font-medium">Status:</span>
          <span>Drafts</span>
        </div>
      </div>
      <div className="smd:border-l border-gray-border pl-5">
        {/* <h5 className="text-center font-semibold mb-4" ><span className="text-failed" >*</span>HOW TO SEND:</h5> */}
        <div className="grid smd:grid-cols-3 grid-cols-1 smd:gap-2 gap-6">
          <div
            className="flex flex-col items-center text-center gap-2"
            onClick={() => handleNotificationClick(0)}
          >
            <div
              className={`border flex flex-col gap-3 items-center rounded-lg font-semibold text-sm p-5 ${
                typeNotification === 0 ? "border-black" : "border-gray-border"
              }`}
            >
              <img src={icons.PlayOnce} alt="" />
              <h6>Simple Notifications</h6>
            </div>
            <p className="text-sm">
              A quick and simple option to send a one-off notification right
              away.
            </p>
          </div>
          <div
            className="h-32 flex flex-col items-center text-center gap-2"
            onClick={() => handleNotificationClick(1)}
          >
            <div
              className={`border flex flex-col gap-3 items-center rounded-lg font-semibold text-sm p-5 ${
                typeNotification === 1 ? "border-black" : "border-gray-border"
              }`}
            >
              <img src={icons.CalendarTwo} alt="" />
              <h6>Scheduled Notification</h6>
            </div>
            <p className="text-sm">
              Create a scheduled or recurring message over a chosen period.
            </p>
          </div>
          <div
            className="h-32 flex flex-col items-center text-center gap-2"
            onClick={() => handleNotificationClick(2)}
          >
            <div
              className={`border flex flex-col gap-3 items-center rounded-lg font-semibold text-sm p-5 ${
                typeNotification === 2 ? "border-black" : "border-gray-border"
              }`}
            >
              <img src={icons.GeoIcon} alt="" />
              <h6>Geo-fenced Notification</h6>
            </div>
            <p className="text-sm">
              Create a message that will be sent to customers when they enter or
              leave a location.
            </p>
          </div>
        </div>
        {typeNotification === 1 && (
          <div className="flex items-center gap-4 mt-10">
            <label className="text-sm w-70">Schedule Date & Time</label>

            <input
              disabled={isPublished}
              type="datetime-local"
              min={new Date().toISOString().slice(0, 16)}
              value={scheduleDateTime}
              onChange={(e) => handleDateTimeChange(e)}
              className="border border-gray-border rounded-lg py-2 px-4 text-sm w-1/2"
            />
          </div>
        )}
        {typeNotification === 2 && (
          <>
            <div className="relative mt-10">
              <input
                disabled={isPublished}
                type="text"
                className="border border-gray-border rounded-lg py-2 px-4 pl-10 text-sm w-full"
                placeholder="Search for an event"
              />
              {/* <CiSearch className="absolute top-1/2 left-3 transform -translate-y-1/2" /> */}
            </div>
            <div className="flex gap-3 items-center mt-8 justify-between ml-10">
              <label className="text-sm">Category</label>
              <input
                id="notification_geo_category.miles"
                name="notification_geo_category.miles"
                value={formData.notification_geo_category?.miles ?? 5.65}
                onChange={handleInputChange}
                className="border border-gray-border p-2 rounded "
                placeholder="5.65"
                disabled={isPublished}
              />
              <select
                id="notification_geo_category.dist_unit"
                name="notification_geo_category.dist_unit"
                value={formData.notification_geo_category?.dist_unit ?? "miles"}
                className="border border-gray-border p-2 rounded "
                onChange={handleInputChange}
                disabled={isPublished}
              >
                <option value="mile">mile</option>
                <option value="km">km</option>
              </select>
              <button
                name="saveButton"
                onClick={handleSubmit}
                disabled={isPublished}
                className={`p-2 px-4 rounded-md bg-primary-light border text-sm border-primary text-primary mx-5 mt-10 ${isPublished ? 'hidden' : ''}`}
              >
                Save
              </button>
            </div>

            {/* Map and Geo-fencing Fields */}
            <div className="mt-10">
              {/* Google Map Placeholder */}
              <div className="h-64 w-full border border-gray-border rounded-lg">
                <iframe
                  title="Google Map"
                  src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3153.835434509324!2d-122.47795948468134!3d37.775206979758206!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x80858064e23e3a65%3A0xb5ef5bfa2b3e728e!2sGolden%20Gate%20Bridge!5e0!3m2!1sen!2sus!4v1600901746727!5m2!1sen!2sus"
                  className="w-full h-full"
                  allowFullScreen
                  loading="lazy"
                ></iframe>
              </div>

              {/* Filter Fields */}
              <div className="flex flex-col gap-4 mt-5">
                <div className="flex items-center gap-4">
                  <label className="text-sm ">Filter by location</label>
                  <div className="flex items-center gap-4">
                    <label className="flex items-center gap-2">
                      <input
                        type="radio"
                        disabled={isPublished}
                        name="filterByLocation"
                        value="inAreaAtSend"
                        className="w-4 h-4 text-orange-500 focus:ring-orange-500"
                      />
                      <span className="text-sm">In an area at send</span>
                    </label>
                    <label className="flex items-center gap-2">
                      <input
                        type="radio"
                        disabled={isPublished}
                        name="filterByLocation"
                        value="enteringAreaAfterSend"
                        className="w-4 h-4 text-orange-500 focus:ring-orange-500"
                      />
                      <span className="text-sm">
                        Entering an area after send
                      </span>
                    </label>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <label className="text-sm  w-70">
                    Geo-fence expiration date
                  </label>
                  <input
                    type="date"
                    disabled={isPublished}
                    min={new Date().toISOString().split("T")[0]}
                    value={geoExpirationDate}
                    onChange={handleDateTime}
                    className="border border-gray-border rounded-lg py-2 px-4 text-sm w-full"
                  />
                </div>
              </div>
            </div>
          </>
        )}
        <div className="flex items-center mt-8 justify-end">
          {typeNotification !== 2 && (
            <button
              disabled={isPublished}
              name="saveButton"
              onClick={handleSubmit}
              className="p-2 px-4 rounded-md bg-primary-light border text-sm border-primary text-primary mx-5 mt-10"
            >
              Save
            </button>
          )}
          {isPublished ? (
            <button
              name="sendButton"
              onClick={handleback}
              className={`p-2 px-4 rounded-md bg-primary-light border text-sm border-primary text-primary ${
                typeNotification === 3 ? "m-auto" : "mx-5"
              } mt-10`}
            >
              Back
            </button>
          ) : (
            <button
              disabled={isPublished}
              name="sendButton"
              onClick={handleSubmit}
              className={`p-2 px-4 rounded-md bg-primary-light border text-sm border-primary text-primary ${
                typeNotification === 3 ? "m-auto" : "mx-5"
              } mt-10`}
            >
              Send
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default NotificationModal;
