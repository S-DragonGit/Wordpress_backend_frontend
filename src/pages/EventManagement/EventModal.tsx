import type React from "react";
import { useEffect, useState } from "react";
import { meetingTags } from "../../app/list";
import RecurringComponent from "../../components/Recurring"; // Import RecurringComponent
import { useSelector } from "react-redux";
import { selectCurrentId, selectCurrentToken } from "../../app/redux/userSlice";
import { useRef } from "react";
import { useMutation } from "@tanstack/react-query";
import { updateEventApi } from "../../services/events";
import { useNavigate } from "react-router-dom";
import { EventFormData, Question, EventStatus } from "../../types/types";
import { EventState, selectCurrentEvent } from "../../app/redux/eventSlice";
import toast from "react-hot-toast";
import { Pencil, Trash2, Plus, X, Check } from 'lucide-react';
// import { getEventById } from "../../services/events"
// import { useDispatch } from "react-redux";

const EventModal: React.FC = () => {
  const token = useSelector(selectCurrentToken);
  // const data = useSelector(selectCurrentId);
  // const dispatch = useDispatch();
  const navigate = useNavigate();

  const defaultFormData: EventFormData = {
    event_title: "",
    event_description: "",
    event_start_date: "",
    event_questions: [],
    event_end_date: "",
    event_is_virtual: true,
    event_meeting_link: "",
    event_organizer: "",
    event_location: "",
    event_image: "",
    user_id: 0,
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
    event_popup: false
  };


  const event = useSelector((state: { event: EventState }) =>
    selectCurrentEvent(state)
  );

  useEffect(() => {
    console.log("hello");
    setFormData(event ?? defaultFormData);
  }, [event]);

  const [isDraft, setIsDraft] = useState<string | undefined>("");
  const [eventTitle, setEventTitle] = useState("");
  const [eventDate, setEventDate] = useState("");
  const [eventStartDate, setEventStartDate] = useState("");
  const [eventEndDate, setEventEndDate] = useState('');
  const [eventDesc, setEventDesc] = useState("");

  const [formData, setFormData] = useState<EventFormData>(
    event ?? defaultFormData
  );

  const [questions, setQuestions] = useState<Question[]>(formData.event_questions);
  
    const [newQuestion, setNewQuestion] = useState({
      text: '',
      type: 'yesno' as 'yesno' | 'review'
    });
  
    const [editingId, setEditingId] = useState<number | null>(null);
    const [editText, setEditText] = useState('');
  
    const sortQuestions = (questions: Question[]): Question[] => {
      return [...questions].sort((a, b) => {
        // First sort by type (yesno comes first)
        if (a.type !== b.type) {
          return a.type === 'yesno' ? -1 : 1;
        }
        // Then sort by ID within each type
        return a.id - b.id;
      }).map((q, index) => ({ ...q, id: index + 1 }));
    };
  
    const handleAddQuestion = (e: React.FormEvent) => {
      e.preventDefault();
      if (newQuestion.text.trim()) {
        const newQuestions = [...questions, {
          id: questions.length + 1,
          text: newQuestion.text,
          type: newQuestion.type,
          answer: ''
        }];
        setQuestions(sortQuestions(newQuestions));
        setNewQuestion({ text: '', type: 'yesno' });
      }
    };
  
    const handleDeleteQuestion = (id: number) => {
      const filteredQuestions = questions.filter(q => q.id !== id);
      setQuestions(sortQuestions(filteredQuestions));
    };
  
    const startEditing = (question: Question) => {
      setEditingId(question.id);
      setEditText(question.text);
    };
  
    const saveEdit = (id: number) => {
      if (editText.trim()) {
        const updatedQuestions = questions.map(q =>
          q.id === id ? { ...q, text: editText } : q
        );
        setQuestions(sortQuestions(updatedQuestions));
        setEditingId(null);
      }
    };
  
    // Group questions by type
    const yesNoQuestions = questions.filter(q => q.type === 'yesno');
    const reviewQuestions = questions.filter(q => q.type === 'review');

  useEffect(() => {
    setIsDraft(event?.event_status);
  }, [event]);

  const fileInputRef = useRef<HTMLInputElement | null>(null);
  // const [fileName, setFileName] = useState("No file chosen");

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

  // Function to parse PHP serialized string to array
  const phpUnserialize = (serializedString: string): string[] => {
    try {
      // Basic parsing for this specific format
      // Remove the "a:2:{" from start and "}" from end
      const content = serializedString
        .replace(/^a:\d+:{/, "") // Remove prefix
        .replace(/}$/, ""); // Remove suffix

      // Split into pairs and extract only the string values
      const pairs = content.split(";");
      const result: string[] = [];

      for (let i = 0; i < pairs.length - 1; i += 2) {
        // Skip the index part (i:0) and get only the string value
        const value = pairs[i + 1]
          .replace(/^s:\d+:"/, "") // Remove string prefix
          .replace(/"$/, ""); // Remove trailing quote

        if (value) {
          result.push(value);
        }
      }
      console.log(result)

      return result;
    } catch (error) {
      console.error("Error parsing PHP serialized string:", error);
      return [];
    }
  };
  

  // Modify your handleCategoryChange function
  const handleCategoryChange = (category: string, checked: boolean) => {
    setFormData((prev) => {
      // Convert the serialized string to array if it's a string
      const currentSlugs =
        typeof prev.event_category_slugs === "string"
          ? phpUnserialize(prev.event_category_slugs)
          : Array.isArray(prev.event_category_slugs)
          ? prev.event_category_slugs
          : [];

      return {
        ...prev,
        event_category_slugs: checked
          ? [...currentSlugs, category]
          : currentSlugs.filter((c) => c !== category),
      };
    });
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
  const [imagePreview, setImagePreview] = useState<string | null>(
    formData.event_image || null
  );

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
      // setFileName(file.name);
    } catch (error) {
      console.error("Error processing file:", error);
      alert("Error processing file. Please try again.");
      event.target.value = "";
      setImagePreview(null);
    }
  };

  const updateEventMutation = useMutation({
    mutationFn: async (data: EventFormData) => updateEventApi(token, data),
    onSuccess: (data) => {
      navigate("/eventManagement");
      toast(data.data.message);
    },
    onError: (error: any) => {
      console.error("Submission failed", error);
    },
  });

  const id = useSelector(selectCurrentId);

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

    console.log(formData);

    const status: EventStatus =
      buttonName === "updateandpublish" ? "publish" : "draft";
    console.log(status);
    const updatedData: EventFormData = {
      ...formData,
      post_id: Number(formData.post_id) - 1,
      event_status: status,
      user_id: id,
    };
    console.log(formData.post_id);

    try {
      if (
        formData.event_title === "" ||
        formData.event_start_date === "" ||
        formData.event_date === "" ||
        formData.event_description === "" ||
        formData.event_end_date === ""
      ) {
        if (formData.event_title === "") setEventTitle("Required!");
        if (formData.event_start_date === "") setEventStartDate("Required!");
        if (formData.event_date === "") setEventDate("Required!");
        if (formData.event_description === "") setEventDesc("Required!");
        if (formData.event_end_date === "") setEventEndDate("Required!");
        toast("Required fields should be input! Please type.");
        console.log(formData);
      } else {
        await updateEventMutation.mutate(updatedData);
        console.log(formData);
        console.log(updatedData);
      }
    } catch (error) {
      console.error("Submission error:", error);
    }
  };

  const backSubmit = () => {
    navigate("/eventManagement");
  };

  useEffect(() => {
    setFormData(formData);
  }, [formData]);

  return (
    <>
      <h2 className="pl-[30px] pt-[30px] font-bold">Create New Event</h2>
      <div className="flex 2xl:flex-row flex-col justify-between items-center w-full m-auto gap-2">
        <div className="smd:grid gap-20 gap-sm-5 grid-cols-2 mt-10 px-6 w-full">
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
                <span className="text-red-500"></span>Event Time
              </label>
              <div className="flex w-[300px] justify-between">
                <input
                  type="date"
                  id="event_start_date"
                  name="event_start_date"
                  value={formData.event_start_date ?? ""}
                  onChange={(e) => {
                    const { name, value } = e.target;
                    setFormData((prev) => ({
                      ...prev,
                      [name]: value,
                    }));
                  }}
                  required
                  className={`border p-2 rounded ${
                    eventStartDate ? "border-red-600" : "border-gray-border"
                  }`}
                />
                <span className="p-3">to</span>
                <input
                  type="date"
                  id="event_end_date"
                  name="event_end_date"
                  value={formData.event_end_date ?? ""}
                  onChange={handleInputChange}
                  required
                  className={`border p-2 rounded ${
                    eventEndDate ? "border-red-600" : "border-gray-border"
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
                  {/* <p>{fileName}</p> */}
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
      </div>
      <div className="mt-4">
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

      <div className="grid grid-cols-6 gap-2">
        <div className="col-span-4 bg-gray-50 m-auto">
          <div className="text-center mb-8">
            <h1 className="mt-4 text-3xl font-bold tracking-tight text-gray-900">
              Weekly Review Questions
            </h1>
            <p className="mt-2 text-lg text-gray-600">
              Question Management System
            </p>
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
                  onChange={(e) => setNewQuestion({ ...newQuestion, text: e.target.value })}
                  className="w-full p-2 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
                  placeholder="Enter your question..."
                />
              </div>
              <div className="flex gap-4">
                <label className="flex items-center">
                  <input
                    type="radio"
                    checked={newQuestion.type === 'yesno'}
                    onChange={() => setNewQuestion({ ...newQuestion, type: 'yesno' })}
                    className="mr-2"
                  />
                  Yes/No Question
                </label>
                <label className="flex items-center">
                  <input
                    type="radio"
                    checked={newQuestion.type === 'review'}
                    onChange={() => setNewQuestion({ ...newQuestion, type: 'review' })}
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
                <h2 className="text-xl font-semibold mb-4 text-blue-800">Yes/No Questions</h2>
                <div className="space-y-4">
                  {yesNoQuestions.map((question, index) => (
                    <div key={question.id} className="bg-primary-light shadow rounded-lg p-6 border-l-4 border-blue-500">
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
                <h2 className="text-xl font-semibold mb-4 text-purple-800">Review Questions</h2>
                <div className="space-y-4">
                  {reviewQuestions.map((question, index) => (
                    <div key={question.id} className="bg-primary-light shadow rounded-lg p-6 border-l-4 border-purple-500">
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
        <div className="col-span-2">
          <div className="w-full flex justify-center items-center p-2 mt-12 rounded-l">
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
          <div className="w-5/6 flex flex-col items-center p-2 bg-primary-light rounded-lg m-auto">
            <h5 className="font-semibold text-lg mb-4">Meeting Tags</h5>
            <div className="w-full">
              {meetingTags.map((tag, index) => (
                <div
                  key={index}
                  className="flex flex-col items-center mb-4 mx-2"
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
            <div className="flex gap-4 justify-between mt-4 m-auto">
              {isDraft === "draft" ?
              <><button
                name="updateandpublish"
                className="p-2 px-4 rounded-md bg-primary-light border text-sm border-primary text-primary"
                onClick={handleSubmit}
              >
                Create and Publish
              </button>
              <button
                className="p-2 px-4 rounded-md bg-primary text-white text-sm"
                onClick={handleSubmit}
              >
                Create in Drafts
              </button></> :
              <button
              className="p-2 px-4 rounded-md bg-primary text-white text-sm"
              onClick={backSubmit}
            >
              Back
            </button>}
            </div>
          </div>
        </div>            
      </div>
    </>
  );
};

export default EventModal;
