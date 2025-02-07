import type React from "react";
import { useState } from "react";
import { meetingTags } from "../../app/list";
import RecurringComponent from "../../components/Recurring"; // Import RecurringComponent
import { useSelector } from "react-redux";
import { selectCurrentId, selectCurrentToken } from "../../app/redux/userSlice";
import { useRef } from "react";
import { useMutation } from "@tanstack/react-query";
import { createEventApi } from "../../services/events";
import { useNavigate } from "react-router-dom";
import { EventFormData } from "../../types/types";
import toast from "react-hot-toast";

const CreateEvent: React.FC = () => {
  const id = useSelector(selectCurrentId);
  const token = useSelector(selectCurrentToken);
  const [formData, setFormData] = useState<EventFormData>({
    event_title: "",
    event_description: "",
    event_start_date: "",
    event_start_time: "",
    event_end_date: "",
    event_end_time: "",
    event_is_virtual: true,
    event_meeting_link: "",
    event_organizer: "",
    event_location: "",
    event_image: "",
    user_id: id,
    event_status: "draft",
    event_recurring: false,
    event_repeat_every: "1",
    event_repeat_on: "",
    event_time: "",
    event_never: true,
    event_on: "",
    event_after: 4,
    event_members: [],
    event_modify_event: false,
    event_invite_others: false,
    event_view_member_list: false,
    event_category_slugs: [],
    post_id: null,
    event_featured: false
  });

  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const [fileName, setFileName] = useState("No file chosen");
  const [eventTitle, setEventTitle] = useState("");
  const [eventDesc, setEventDesc] = useState("");
  const [eventStartDate, setEventStartDate] = useState("");
  const [eventStartTime, setEventStartTime] = useState("");
  // const [eventEndDate, setEventEndDate] = useState('');
  const [eventEndTime, setEventEndTime] = useState("");

  const handleFileButtonClick = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  const handleInputChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value, type } = e.target;
    // console.log(name, value, type);
    setFormData((prev) => ({
      ...prev,
      [name]:
        type === "checkbox" ? (e.target as HTMLInputElement).checked : value,
    }));
  };

  const handleRecurringChange = (isRecurring: boolean) => {
    setFormData((prev) => ({ ...prev, event_recurring: isRecurring }));
  };

  const handleRepeatOnChange = (day: string) => {
    const currentRepeatOn = formData.event_repeat_on
      .split(",")
      .filter((d) => d !== "");
    const newRepeatOn = currentRepeatOn.includes(day)
      ? currentRepeatOn.filter((d) => d !== day)
      : [...currentRepeatOn, day];
    setFormData((prev) => ({
      ...prev,
      event_repeat_on: newRepeatOn.join(","),
    }));
  };

  const handleCategoryChange = (category: string, checked: boolean) => {
    setFormData((prev) => ({
      ...prev,
      event_category_slugs: checked
        ? [...prev.event_category_slugs, category]
        : prev.event_category_slugs.filter((c) => c !== category),
    }));
  };

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
  const [imagePreview, setImagePreview] = useState<string | null>(null);

  const handleFileChange = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = event.target.files?.[0];

    if (!file) return;

    const validationResult = validateImageFile(file);

    if (!validationResult.isValid) {
      toast(validationResult.error ?? "An error occurred");
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
        event_image: base64String,
      }));
      setFileName(file.name);
    } catch (error) {
      console.error("Error processing file:", error);
      alert("Error processing file. Please try again.");
      event.target.value = "";
      setImagePreview(null);
    }
  };

  const navigate = useNavigate();

  const createEventMutation = useMutation({
    mutationFn: async (data: EventFormData) => createEventApi(token, data),
    onSuccess: (data: any) => {
      console.log(data.data.message);
      navigate("/eventManagement");
    },
    onError: (error: any) => {
      console.error("Submission failed", error);
    },
  });

  const handleSubmit = async (status: "publish" | "draft") => {
    try {
      if (
        formData.event_title === "" ||
        formData.event_start_date === "" ||
        formData.event_start_time === "" ||
        formData.event_description === "" ||
        formData.event_end_time === ""
      ) {
        if (formData.event_title === "") setEventTitle("Required!");
        if (formData.event_start_date === "") setEventStartDate("Required!");
        if (formData.event_start_time === "") setEventStartTime("Required!");
        // if(!formData.event_end_date) setEventEndDate("Required!")
        if (formData.event_end_date === "") setEventEndTime("Required!");
        if (formData.event_description === "") setEventDesc("Required!");
        toast("Required fields should be input! Please type.");
        console.log(formData);
      } else {
        // Update the formData with the new status directly in the mutation
        await createEventMutation.mutateAsync({
          ...formData,
          event_status: status,
        });
        navigate("/eventManagement");
      }
    } catch (error) {
      console.error("Submission error:", error);
    }
  };

  return (
    <>
      <h2 className="pl-[30px] pt-[30px] font-bold">Create New Event</h2>
      <div className="flex 2xl:flex-row flex-col justify-between items-center w-full gap-2">
        <div className="smd:grid gap-25 gap-sm-5 grid-cols-2 mt-10 smd:ml-10">
          <div className="flex flex-col gap-5">
            <div className="flex gap-4 justify-between">
              <label className="text-sm mt-2">
                <span className="text-red-500"></span>Event Title
              </label>
              <input
                type="text"
                id="event_title"
                name="event_title"
                value={formData.event_title}
                onChange={handleInputChange}
                required
                className={`border w-[300px] p-2 rounded ${
                  eventTitle ? "border-red-600" : "border-gray-border"
                }`}
              />
            </div>
            <div className="flex gap-15 justify-between">
              <label className="text-sm mt-2">
                <span className="text-red-500"></span>Description
              </label>
              <textarea
                id="event_description"
                name="event_description"
                value={formData.event_description}
                onChange={handleInputChange}
                required
                className={`border w-[300px] p-2 rounded ${
                  eventDesc ? "border-red-600" : "border-gray-border"
                }`}
              />
            </div>
            <div className="flex gap-15 justify-between">
              <label className="text-sm mt-2">
                <span className="text-red-500"></span>Event Date
              </label>
              <input
                type="date"
                id="event_start_date"
                name="event_start_date"
                value={formData.event_start_date ?? ""}
                onChange={handleInputChange}
                required
                className={`border w-[300px] p-2 rounded ${
                  eventStartDate ? "border-red-600" : "border-gray-border"
                }`}
              />
            </div>
            <div className="flex gap-15 justify-between">
              <label className="text-sm mt-2">
                <span className="text-red-500"></span>Event Time
              </label>
              <div className="flex w-[300px] justify-between">
                <input
                  type="time"
                  id="event_start_time"
                  name="event_start_time"
                  value={formData.event_start_time ?? ""}
                  onChange={(e) => {
                    const { name, value } = e.target;
                    setFormData((prev) => ({
                      ...prev,
                      [name]: value,
                    }));
                  }}
                  required
                  className={`border p-2 rounded ${
                    eventStartTime ? "border-red-600" : "border-gray-border"
                  }`}
                />
                <span className="p-3">to</span>
                <input
                  type="time"
                  id="event_end_time"
                  name="event_end_time"
                  value={formData.event_end_time ?? ""}
                  onChange={handleInputChange}
                  required
                  className={`border p-2 rounded ${
                    eventEndTime ? "border-red-600" : "border-gray-border"
                  }`}
                />
              </div>
            </div>
            <div className="flex gap-15 justify-between">
              <label className="text-sm mt-2 w-1/3">
                <span className="text-red-500"></span>Is this meeting virtual?
              </label>
              <div className="flex items-center w-full gap-4">
                <div className="flex items-center w-1/2 justify-start gap-2">
                  <input
                    type="radio"
                    id="event_is_virtual"
                    name="event_is_virtual" // Same name for both radio buttons
                    checked={formData.event_is_virtual}
                    onChange={(e) => {
                      setFormData((prev) => ({
                        ...prev,
                        event_is_virtual: e.target.checked === true,
                      }));
                    }}
                    className="w-4 h-4"
                  />
                  <span>Yes</span>
                </div>
                <div className="flex items-center w-1/2 justify-start gap-2">
                  <input
                    type="radio"
                    id="event_is_virtual"
                    name="event_is_virtual" // Same name for both radio buttons
                    value="disabled"
                    checked={!formData.event_is_virtual}
                    onChange={(e) => {
                      setFormData((prev) => ({
                        ...prev,
                        event_is_virtual: e.target.checked === false,
                      }));
                    }}
                    className="w-4 h-4"
                  />
                  <span>No</span>
                </div>
              </div>
            </div>
            <div className="flex gap-15 justify-between">
              <label className="text-sm mt-2">
                <span className="text-red-500"></span>Meeting link
              </label>
              <input
                type="text"
                id="event_meeting_link"
                name="event_meeting_link"
                value={formData.event_meeting_link}
                onChange={handleInputChange}
                required
                className="border w-[300px] border-gray-border p-2 rounded"
              />
            </div>
            <div className="flex gap-15 justify-between">
              <label className="text-sm mt-2">
                <span className="text-red-500"></span>Event Location
              </label>
              <input
                type="text"
                id="event_location"
                name="event_location"
                value={formData.event_location}
                onChange={handleInputChange}
                required
                className="border w-[300px] border-gray-border p-2 rounded"
              />
            </div>
          </div>
          <div className="flex flex-col gap-5">
            <div className="flex gap-15 justify-between">
              <label className="text-sm mt-2">
                <span className="text-red-500"></span>Member(s)
              </label>
              <input
                type="text"
                id="event_members"
                name="event_members"
                value={formData.event_members.join(",")}
                onChange={(e) => {
                  // Convert back to number array when handling changes
                  const numbers = e.target.value
                    .split(",")
                    .map((num) => Number(num.trim()));
                  setFormData((prev) => ({
                    ...prev,
                    event_members: numbers,
                  }));
                }}
                required
                className="border w-[300px] border-gray-border p-2 rounded"
              />
            </div>
            <div className="flex gap-15 justify-start">
              <label className="text-sm mt-2">
                <span className="text-red-500"></span>Member permmisions
              </label>
              <div className="flex flex-col gap-2">
                <div className="flex item-center justify-start">
                  <input
                    type="checkbox"
                    className="border border-gray-border p-2 rounded"
                  />
                  <label className="p-3">Modify event</label>
                </div>
                <div className="flex item-center justify-start">
                  <input
                    type="checkbox"
                    className="border border-gray-border p-2 rounded"
                  />
                  <label className="p-3">Invite others</label>
                </div>
                <div className="flex item-center justify-start">
                  <input
                    type="checkbox"
                    className="border border-gray-border p-2 rounded"
                  />
                  <label className="p-3">View member list</label>
                </div>
              </div>
            </div>
            <div className="flex">
              <label className="text-sm w-1/2">Cover Image</label>
              <div className="flex flex-col gap-2">
                <div className="gap-4 items-center">
                  <button
                    className="bg-primary p-1 rounded-md text-white font-semibold px-3"
                    onClick={handleFileButtonClick}
                  >
                    Choose file +
                  </button>
                  <p>{fileName}</p>
                  <input
                    type="file"
                    ref={fileInputRef}
                    onChange={handleFileChange}
                    className="hidden"
                  />
                  {imagePreview && (
                    <div className="image-preview p-5">
                      <img
                        src={imagePreview}
                        alt="Preview"
                        style={{ maxWidth: "200px", maxHeight: "200px" }}
                      />
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>

          <div className="col-span-2">
            <RecurringComponent
              isRecurring={formData.event_recurring}
              setIsRecurring={handleRecurringChange}
              repeatEvery={formData.event_repeat_every}
              setRepeatEvery={(value) =>
                setFormData((prev) => ({ ...prev, event_repeat_every: value }))
              }
              selectedDays={formData.event_repeat_on.split(",")}
              toggleDay={handleRepeatOnChange}
              time={formData.event_time ?? ""}
              setTime={(value) =>
                setFormData((prev) => ({ ...prev, event_time: value }))
              }
              endOption={
                formData.event_never
                  ? "never"
                  : formData.event_on
                  ? "on"
                  : "after"
              }
              setEndOption={(option) => {
                if (option === "never")
                  setFormData((prev) => ({
                    ...prev,
                    event_never: true,
                    event_on: "",
                    event_after: 4,
                  }));
                else if (option === "on")
                  setFormData((prev) => ({
                    ...prev,
                    event_never: false,
                    event_on: new Date().toISOString().split("T")[0],
                    event_after: 4,
                  }));
                else
                  setFormData((prev) => ({
                    ...prev,
                    event_never: false,
                    event_on: "",
                    event_after: 4,
                  }));
              }}
              endDate={formData.event_on}
              setEndDate={(value) =>
                setFormData((prev) => ({ ...prev, event_on: value }))
              }
              occurrences={formData.event_after}
              setOccurrences={(value) =>
                setFormData((prev) => ({ ...prev, event_after: value }))
              }
            />
          </div>
        </div>
        <div>
          <div className="flex justify-center items-center w-80 p-2 rounded-l">
            <input
              type="checkbox"
              checked={formData.event_featured}
              onChange={(e) => {
                setFormData((prev) => ({
                  ...prev,
                  event_featured: e.target.checked === true,
                }));
              }}
            />
            <span className="p-3">Feature Event</span>
          </div>
          <div className="flex flex-col items-center w-80 p-2 bg-primary-light rounded-lg">
            <h5 className="font-semibold text-lg mb-4">Meeting Tags</h5>
            {meetingTags.map((tag, index) => (
              <div
                key={index}
                className="w-full flex flex-col items-center mb-4"
              >
                <label className="flex items-center gap-2 mb-2">
                  <input
                    type="checkbox"
                    className="w-4 h-4"
                    checked={formData.event_category_slugs.includes(
                      tag.category
                    )}
                    onChange={(e) =>
                      handleCategoryChange(tag.category, e.target.checked)
                    }
                  />
                  <span className="text-sm">{tag.category}</span>
                </label>
                <div className="bg-primary-light3 p-4 rounded-md w-full flex flex-col items-center border border-gray-border">
                  <div
                    className={
                      index === 0
                        ? "grid grid-cols-2 gap-2"
                        : "flex flex-col gap-2 w-full"
                    }
                  >
                    {tag.items.map((item, idx) => (
                      <label key={idx} className="flex items-center gap-1">
                        <input
                          type="checkbox"
                          className="w-4 h-4"
                          checked={formData.event_category_slugs.includes(item)}
                          onChange={(e) =>
                            handleCategoryChange(item, e.target.checked)
                          }
                        />
                        <span className="text-sm">{item}</span>
                      </label>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
          <div className="flex w-full justify-between mt-4">
            <button
              className="p-2 px-4 rounded-md bg-primary-light border text-sm border-primary text-primary"
              onClick={() => handleSubmit("publish")}
            >
              Create and Publish
            </button>
            <button
              className="p-2 px-4 rounded-md bg-primary text-white text-sm"
              onClick={() => handleSubmit("draft")}
            >
              Create in Drafts
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default CreateEvent;
