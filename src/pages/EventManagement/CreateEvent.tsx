import type React from "react";
import { useState, useEffect } from "react";
import { meetingTags } from "../../app/list";
import RecurringComponent from "../../components/Recurring"; // Import RecurringComponent
import { useSelector } from "react-redux";
import { selectCurrentId, selectCurrentToken } from "../../app/redux/userSlice";
import { useRef } from "react";
import { useMutation } from "@tanstack/react-query";
import { createEventApi } from "../../services/events";
import { useNavigate } from "react-router-dom";
import { EventFormData, Question } from "../../types/types";
import toast from "react-hot-toast";
import { createZoomLinkApi } from "../../services/events";
import { Pencil, Trash2, Plus, X, Check } from "lucide-react";

const usAddresses = [
  "123 Main St, New York, NY 10001",
  "456 Oak Ave, Los Angeles, CA 90001",
  "789 Elm St, Chicago, IL 60601",
  "321 Pine Rd, Houston, TX 77001",
  "654 Maple Dr, Miami, FL 33101",
  "987 Cedar Ln, Seattle, WA 98101",
  "246 Birch Ct, Boston, MA 02101",
  "135 Willow Way, San Francisco, CA 94101",
  "864 Spruce St, Denver, CO 80201",
  "753 Ash Ave, Atlanta, GA 30301",
  "951 Oakwood Blvd, Dallas, TX 75201",
  "357 Pinecrest Rd, Phoenix, AZ 85001",
  "159 Elmwood Ave, Philadelphia, PA 19101",
  "753 Maplewood Dr, San Diego, CA 92101",
  "852 Cedarwood Ln, Austin, TX 78701",
  "741 Birchwood Ct, Portland, OR 97201",
  "963 Willowbrook Rd, Las Vegas, NV 89101",
  "852 Sprucewood Ave, Nashville, TN 37201",
  "147 Oakridge Dr, San Antonio, TX 78201",
  "369 Mapleleaf Ln, Charlotte, NC 28201",
  "258 Pinegrove Rd, Columbus, OH 43201",
  "741 Cedargrove Ave, Indianapolis, IN 46201",
  "963 Birchgrove Ct, Fort Worth, TX 76101",
  "852 Willowgrove Dr, Detroit, MI 48201",
  "147 Ashwood Rd, El Paso, TX 79901",
  "369 Oakleaf Ave, Memphis, TN 38101",
  "258 Maplegrove Ln, Baltimore, MD 21201",
  "741 Cedarleaf Rd, Boston, MA 02201",
  "963 Pineleaf Ave, Seattle, WA 98201",
  "852 Birchleaf Dr, Washington, DC 20001",
  "147 Willowleaf Ct, Denver, CO 80301",
  "369 Ashleaf Rd, Nashville, TN 37301",
  "258 Oakgrove Ave, Louisville, KY 40201",
  "741 Maplewood Ln, Milwaukee, WI 53201",
  "963 Cedarwood Rd, Albuquerque, NM 87101",
  "852 Pinewood Ave, Tucson, AZ 85701",
  "147 Birchwood Ln, Fresno, CA 93701",
  "369 Willowwood Rd, Sacramento, CA 95801",
  "258 Ashwood Ave, Long Beach, CA 90801",
  "741 Oakwood Ln, Kansas City, MO 64101",
  "963 Mapleleaf Rd, Mesa, AZ 85201",
  "852 Cedarleaf Ave, Atlanta, GA 30301",
  "147 Pineleaf Ln, Virginia Beach, VA 23451",
  "369 Birchleaf Rd, Omaha, NE 68101",
  "258 Willowleaf Ave, Colorado Springs, CO 80901",
  "741 Ashleaf Ln, Raleigh, NC 27601",
  "963 Oakgrove Rd, Miami, FL 33101",
  "852 Maplegrove Ave, Oakland, CA 94601",
  "147 Cedargrove Ln, Minneapolis, MN 55401",
  "369 Pinegrove Rd, Tulsa, OK 74101",
];

const CreateEvent: React.FC = () => {
  const [value, setValue] = useState("");
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [filteredAddresses, setFilteredAddresses] = useState(usAddresses);

  useEffect(() => {
    if (value) {
      setFilteredAddresses(
        usAddresses.filter((address) =>
          address.toLowerCase().includes(value.toLowerCase())
        )
      );
    } else {
      setFilteredAddresses(usAddresses);
    }
  }, [value]);

  const [questions, setQuestions] = useState<Question[]>([
    {
      id: 1,
      text: "Did you meet your project deadlines this week?",
      type: "yesno",
      answer: "",
    },
    {
      id: 2,
      text: "Have you completed all assigned tasks?",
      type: "yesno",
      answer: "",
    },
    {
      id: 3,
      text: "Are you satisfied with your work-life balance?",
      type: "yesno",
      answer: "",
    },
    {
      id: 4,
      text: "What were your main achievements this week?",
      type: "review",
      answer: "",
    },
    {
      id: 5,
      text: "What challenges did you face and how did you overcome them?",
      type: "review",
      answer: "",
    },
    {
      id: 6,
      text: "What areas do you think need improvement?",
      type: "review",
      answer: "",
    },
  ]);

  const [newQuestion, setNewQuestion] = useState({
    text: "",
    type: "yesno" as "yesno" | "review",
  });

  const [editingId, setEditingId] = useState<number | null>(null);
  const [editText, setEditText] = useState("");

  const sortQuestions = (questions: Question[]): Question[] => {
    return [...questions]
      .sort((a, b) => {
        // First sort by type (yesno comes first)
        if (a.type !== b.type) {
          return a.type === "yesno" ? -1 : 1;
        }
        // Then sort by ID within each type
        return a.id - b.id;
      })
      .map((q, index) => ({ ...q, id: index + 1 }));
  };

  const handleAddQuestion = (e: React.FormEvent) => {
    e.preventDefault();
    if (newQuestion.text.trim()) {
      const newQuestions = [
        ...questions,
        {
          id: questions.length + 1,
          text: newQuestion.text,
          type: newQuestion.type,
          answer: "",
        },
      ];
      setQuestions(sortQuestions(newQuestions));
      setNewQuestion({ text: "", type: "yesno" });
    }
  };

  const handleDeleteQuestion = (id: number) => {
    const filteredQuestions = questions.filter((q) => q.id !== id);
    setQuestions(sortQuestions(filteredQuestions));
  };

  const startEditing = (question: Question) => {
    setEditingId(question.id);
    setEditText(question.text);
  };

  const saveEdit = (id: number) => {
    if (editText.trim()) {
      const updatedQuestions = questions.map((q) =>
        q.id === id ? { ...q, text: editText } : q
      );
      setQuestions(sortQuestions(updatedQuestions));
      setEditingId(null);
    }
  };

  // Group questions by type
  const yesNoQuestions = questions.filter((q) => q.type === "yesno");
  const reviewQuestions = questions.filter((q) => q.type === "review");

  const id = useSelector(selectCurrentId);
  const token = useSelector(selectCurrentToken);
  const [formData, setFormData] = useState<EventFormData>({
    event_title: "",
    event_description: "",
    event_questions: [],
    event_start_time: "",
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
    event_date: "",
    event_never: true,
    event_on: "",
    event_after: 4,
    event_members: [],
    event_modify_event: false,
    event_invite_others: false,
    event_view_member_list: false,
    event_category_slugs: [],
    post_id: null,
    event_featured: false,
    event_popup: false,
  });

  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const [fileName, setFileName] = useState("No file chosen");
  const [eventTitle, setEventTitle] = useState("");
  const [eventDate, setEventDate] = useState("");
  const [eventStartTime, setEventStartTime] = useState("");
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

  useEffect(() => {
    if (formData.event_is_virtual === true) {
      handleZoomLink();
    }
  }, [formData.event_is_virtual]);

  const createZoomLink = useMutation({
    mutationFn: async (data: any) => createZoomLinkApi(token, data),
    onSuccess: (res: any) => {
      const link = res.data.data.response.start_url;
      setFormData((prev) => ({
        ...prev,
        event_meeting_link: link,
      }));
    },
    onError: (error: any) => {
      console.error("Submission failed", error);
    },
  });

  const handleZoomLink = async () => {
    try {
      const data = {
        user_id: id,
        email: "adnaj@gmail.com",
        first_name: "Rolesh",
        last_name: "A",
      };
      await createZoomLink.mutateAsync(data);
    } catch (error) {
      console.error("Submission error:", error);
    }
  };

  const handleCategoryChange = (category: string, checked: boolean) => {
    const tag = meetingTags.find((t) => t.category === category);

    if (tag) {
      setFormData((prev) => {
        const newSlugs = [...prev.event_category_slugs];

        if (checked) {
          // Add category and all its items
          const itemsToAdd = [category, ...tag.items].filter(
            (item) => !newSlugs.includes(item)
          );
          return {
            ...prev,
            event_category_slugs: [...newSlugs, ...itemsToAdd],
          };
        } else {
          // Remove category and all its items
          return {
            ...prev,
            event_category_slugs: newSlugs.filter(
              (slug) => slug !== category && !tag.items.includes(slug)
            ),
          };
        }
      });
    } else {
      // Handle individual item
      setFormData((prev) => {
        if (checked && !prev.event_category_slugs.includes(category)) {
          return {
            ...prev,
            event_category_slugs: [...prev.event_category_slugs, category],
          };
        } else if (!checked) {
          return {
            ...prev,
            event_category_slugs: prev.event_category_slugs.filter(
              (slug) => slug !== category
            ),
          };
        }
        return prev;
      });
    }
  };

  const isParentChecked = (tag: any): boolean => {
    return tag.items.every((item: any) =>
      formData.event_category_slugs.includes(item)
    );
  };

  const isParentIndeterminate = (tag: any): boolean => {
    const checkedItems = tag.items.filter((item: any) =>
      formData.event_category_slugs.includes(item)
    );
    return checkedItems.length > 0 && checkedItems.length < tag.items.length;
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
        formData.event_date === "" ||
        formData.event_start_time === "" ||
        formData.event_end_time === ""
      ) {
        if (formData.event_title === "") setEventTitle("Required!");
        if (formData.event_start_time === "") setEventStartTime("Required!");
        if (formData.event_end_time === "") setEventEndTime("Required!");
        if (formData.event_date === "") setEventDate("Required!");

        toast("Required fields should be input! Please type.");
        console.log(formData);
      } else {
        // Update the formData with the new status directly in the mutation
        await createEventMutation.mutateAsync({
          ...formData,
          event_status: status,
          event_questions: questions,
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
      <div className="flex 2xl:flex-row flex-col justify-between items-center w-full m-auto gap-2">
        <div className="smd:grid gap-20 gap-sm-5 grid-cols-2 mt-10 px-6 w-xl-2/3 w-sm-full">
          <div className="flex flex-col gap-5">
            <div className="flex gap-4 justify-between">
              <label className="text-sm mt-2">
                <span className="text-red-500"></span>*Event Title
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
                className={`border w-[300px] p-2 rounded border-gray-border`}
              />
            </div>
            <div className="flex gap-15 justify-between">
              <label className="text-sm mt-2">
                <span className="text-red-500"></span>*Event Date
              </label>
              <input
                type="date"
                id="event_date"
                name="event_date"
                value={formData.event_date ?? ""}
                onChange={handleInputChange}
                required
                className={`border w-[300px] p-2 rounded ${
                  eventDate ? "border-red-600" : "border-gray-border"
                }`}
              />
            </div>
            <div className="flex gap-15 justify-between">
              <label className="text-sm mt-2">
                <span className="text-red-500"></span>*Event Time
              </label>
              <div className="flex justify-between">
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
                  } w-[130px]`}
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
                  } w-[130px]`}
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
                <span className="text-red-500"></span>Meeting Link
              </label>
              <input
                type="text"
                id="event_meeting_link"
                name="event_meeting_link"
                value={formData.event_meeting_link}
                disabled={!formData.event_is_virtual}
                onChange={handleInputChange}
                required
                className={`border w-[300px] border-gray-border p-2 rounded ${
                  formData.event_is_virtual ? "" : "disabled:cursor-not-allowed"
                }`}
              />
            </div>
            <div className="flex gap-15 justify-between">
              <label className="text-sm mt-2">
                <span className="text-red-500"></span>Event Location
              </label>
              <div style={{ position: "relative", width: "300px" }}>
                <input
                  type="text"
                  id="event_location"
                  name="event_location"
                  value={value}
                  onChange={(e) => setValue(e.target.value)}
                  onFocus={() => setShowSuggestions(true)}
                  onBlur={() =>
                    setTimeout(() => setShowSuggestions(false), 200)
                  }
                  required
                  style={{
                    width: "100%",
                    padding: "8px",
                    border: "1px solid #ccc",
                    borderRadius: "4px",
                  }}
                  placeholder="Enter event location"
                />
                {showSuggestions && (
                  <ul
                    style={{
                      position: "absolute",
                      top: "100%",
                      left: 0,
                      right: 0,
                      maxHeight: "200px",
                      overflowY: "auto",
                      border: "1px solid #ccc",
                      borderTop: "none",
                      borderRadius: "0 0 4px 4px",
                      backgroundColor: "white",
                      listStyle: "none",
                      margin: 0,
                      padding: 0,
                      zIndex: 1,
                    }}
                  >
                    {filteredAddresses.map((address) => (
                      <li
                        key={address}
                        onClick={() => {
                          setValue(address);
                          setShowSuggestions(false);
                        }}
                        style={{
                          padding: "8px",
                          cursor: "pointer",
                        }}
                        onMouseDown={(e) => e.preventDefault()}
                      >
                        {address}
                      </li>
                    ))}
                  </ul>
                )}
              </div>
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
            <div className="flex gap-15 justify-between">
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
        </div>
        <div className="w-lg-1/3 w-sm-full">
          <h5 className="font-semibold text-lg mb-4 text-center">
            Meeting Tags
          </h5>
          <div className="w-5/6 flex flex-col items-center p-2 bg-primary-light rounded-lg m-auto">
            <div className="w-full flex justify-center items-center p-2 border-b-[1px] pb-0">
              <div className="flex w-1/2 justify-center">
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
                <span className="p-3 font-bold text-shadow-md">
                  Featured Event
                </span>
              </div>
              <div className="flex w-1/2 justify-center">
                <input
                  type="checkbox"
                  checked={formData.event_popup}
                  onChange={(e) => {
                    setFormData((prev) => ({
                      ...prev,
                      event_popup: e.target.checked === true,
                    }));
                  }}
                />
                <span className="p-3 font-bold text-shadow-md">
                  Pop Up Event
                </span>
              </div>
            </div>
            <div
              className="w-full max-h-[500px] overflow-y-auto pt-2
    scrollbar scrollbar-thin scrollbar-thumb-gray-400 scrollbar-track-gray-100
    hover:scrollbar-thumb-gray-500"
            >
              {meetingTags.map((tag, index) => (
                <div
                  key={index}
                  className="bg-white rounded-lg shadow-sm mb-4 p-4"
                >
                  <div className="flex flex-col">
                    <label className="flex items-center gap-2 mb-3 cursor-pointer hover:bg-gray-50 p-2 rounded-md">
                      <input
                        type="checkbox"
                        className="w-5 h-5 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                        checked={isParentChecked(tag)}
                        ref={(input) => {
                          if (input) {
                            input.indeterminate = isParentIndeterminate(tag);
                          }
                        }}
                        onChange={(e) =>
                          handleCategoryChange(tag.category, e.target.checked)
                        }
                        aria-label={
                          isParentChecked(tag) ? "Uncheck all" : "Check all"
                        }
                      />
                      <span className="text-sm font-medium text-gray-700">
                        {tag.category}
                      </span>
                    </label>

                    <div className="ml-6 border-l-2 border-gray-100 pl-4">
                      <div
                        className={
                          index === 0
                            ? "grid grid-cols-2 gap-3"
                            : "flex flex-col gap-2"
                        }
                      >
                        {tag.items.map((item, idx) => (
                          <label
                            key={idx}
                            className="flex items-center gap-2 cursor-pointer hover:bg-gray-50 p-2 rounded-md"
                          >
                            <input
                              type="checkbox"
                              className="w-4 h-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                              checked={formData.event_category_slugs.includes(
                                item
                              )}
                              onChange={(e) =>
                                handleCategoryChange(item, e.target.checked)
                              }
                              aria-label={
                                formData.event_category_slugs.includes(item)
                                  ? `Uncheck ${item}`
                                  : `Check ${item}`
                              }
                            />
                            <span className="text-sm text-gray-600">
                              {item}
                            </span>
                          </label>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
          <div className="flex gap-2 justify-around mt-8 m-auto px-8">
            <button
              className="px-4 py-2 rounded-md hover:bg-primary hover:text-white focus:outline-none border duration-300 ease-in-out"
              onClick={() => handleSubmit("publish")}
            >
              Create and Publish
            </button>
            <button
              className="px-4 py-2 rounded-md hover:bg-primary hover:text-white focus:outline-none border duration-300 ease-in-out"
              onClick={() => handleSubmit("draft")}
            >
              Create in Drafts
            </button>
          </div>
        </div>
      </div>
      <div className="mt-1">
        <RecurringComponent
          isRecurring={formData.event_recurring}
          setIsRecurring={handleRecurringChange}
          repeatEvery={formData.event_repeat_every}
          setRepeatEvery={(value) =>
            setFormData((prev) => ({ ...prev, event_repeat_every: value }))
          }
          selectedDays={formData.event_repeat_on.split(",")}
          toggleDay={handleRepeatOnChange}
          endOption={
            formData.event_never ? "never" : formData.event_on ? "on" : "after"
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

      <div className="flex justify-center">
        <div className="col-span-4 bg-gray-50 m-auto">
          <div className="text-center mb-8">
            <h1 className="mt-4 text-3xl font-bold tracking-tight text-gray-900">
              Survey Questions
            </h1>
          </div>
          {/* Add New Question Form */}
          <div className="shadow rounded-lg p-6 mb-8 bg-primary-light">
            <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
              <Plus className="h-5 w-5" />
              Add New Question
            </h2>
            <form onSubmit={handleAddQuestion} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Question Text
                </label>
                <input
                  type="text"
                  value={newQuestion.text}
                  onChange={(e) =>
                    setNewQuestion({ ...newQuestion, text: e.target.value })
                  }
                  className="w-full p-2 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
                  placeholder="Enter your question..."
                />
              </div>
              <div className="flex gap-4">
                <label className="flex items-center">
                  <input
                    type="radio"
                    checked={newQuestion.type === "yesno"}
                    onChange={() =>
                      setNewQuestion({ ...newQuestion, type: "yesno" })
                    }
                    className="mr-2"
                  />
                  Yes/No Question
                </label>
                <label className="flex items-center">
                  <input
                    type="radio"
                    checked={newQuestion.type === "review"}
                    onChange={() =>
                      setNewQuestion({ ...newQuestion, type: "review" })
                    }
                    className="mr-2"
                  />
                  Review Question
                </label>
              </div>
              <button
                type="submit"
                className="px-4 py-2 rounded-md hover:bg-primary hover:text-white focus:outline-none border duration-300 ease-in-out"
              >
                Add Question
              </button>
            </form>
          </div>

          <div className="flex p-6 gap-8 xl:flex-row flex-col justify-between">
            {/* Yes/No Questions Section */}
            {yesNoQuestions.length > 0 && (
              <div className="w-full xl:w-1/2">
                <h2 className="text-xl font-semibold mb-4 text-blue-800">
                  Yes/No Questions
                </h2>
                <div className="space-y-4">
                  {yesNoQuestions.map((question, index) => (
                    <div
                      key={question.id}
                      className="bg-primary-light shadow rounded-lg p-6 border-l-4 border-blue-500"
                    >
                      <div className="flex justify-between items-start">
                        {editingId === question.id ? (
                          <div className="flex-1 mr-4">
                            <input
                              type="text"
                              value={editText}
                              onChange={(e) => setEditText(e.target.value)}
                              className="w-full p-2 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
                            />
                            <div className="mt-2 flex gap-2">
                              <button
                                onClick={() => saveEdit(question.id)}
                                className="text-green-600 hover:text-green-700"
                              >
                                <Check className="h-5 w-5" />
                              </button>
                              <button
                                onClick={() => setEditingId(null)}
                                className="text-red-600 hover:text-red-700"
                              >
                                <X className="h-5 w-5" />
                              </button>
                            </div>
                          </div>
                        ) : (
                          <div className="flex-1">
                            <h3 className="text-lg font-medium text-gray-900">
                              {index + 1}. {question.text}
                            </h3>
                            <span className="inline-block mt-2 px-3 py-1 text-sm font-medium rounded-full bg-blue-100 text-blue-800">
                              Yes/No Question
                            </span>
                          </div>
                        )}
                        {editingId !== question.id && (
                          <div className="flex gap-2 ml-4">
                            <button
                              onClick={() => startEditing(question)}
                              className="text-gray-600 hover:text-gray-700"
                            >
                              <Pencil className="h-5 w-5" />
                            </button>
                            <button
                              onClick={() => handleDeleteQuestion(question.id)}
                              className="text-red-600 hover:text-red-700"
                            >
                              <Trash2 className="h-5 w-5" />
                            </button>
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Review Questions Section */}
            {reviewQuestions.length > 0 && (
              <div className="w-full xl:w-1/2">
                <h2 className="text-xl font-semibold mb-4 text-purple-800">
                  Review Questions
                </h2>
                <div className="space-y-4">
                  {reviewQuestions.map((question, index) => (
                    <div
                      key={question.id}
                      className="bg-primary-light shadow rounded-lg p-6 border-l-4 border-purple-500"
                    >
                      <div className="flex justify-between items-start">
                        {editingId === question.id ? (
                          <div className="flex-1 mr-4">
                            <input
                              type="text"
                              value={editText}
                              onChange={(e) => setEditText(e.target.value)}
                              className="w-full p-2 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
                            />
                            <div className="mt-2 flex gap-2">
                              <button
                                onClick={() => saveEdit(question.id)}
                                className="text-green-600 hover:text-green-700"
                              >
                                <Check className="h-5 w-5" />
                              </button>
                              <button
                                onClick={() => setEditingId(null)}
                                className="text-red-600 hover:text-red-700"
                              >
                                <X className="h-5 w-5" />
                              </button>
                            </div>
                          </div>
                        ) : (
                          <div className="flex-1">
                            <h3 className="text-lg font-medium text-gray-900">
                              {index + 1}. {question.text}
                            </h3>
                            <span className="inline-block mt-2 px-3 py-1 text-sm font-medium rounded-full bg-purple-100 text-purple-800">
                              Review Question
                            </span>
                          </div>
                        )}
                        {editingId !== question.id && (
                          <div className="flex gap-2 ml-4">
                            <button
                              onClick={() => startEditing(question)}
                              className="text-gray-600 hover:text-gray-700"
                            >
                              <Pencil className="h-5 w-5" />
                            </button>
                            <button
                              onClick={() => handleDeleteQuestion(question.id)}
                              className="text-red-600 hover:text-red-700"
                            >
                              <Trash2 className="h-5 w-5" />
                            </button>
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default CreateEvent;
