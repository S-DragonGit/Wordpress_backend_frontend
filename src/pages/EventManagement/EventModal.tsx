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
import { Pencil, Trash2, Plus, X, Check } from "lucide-react";
import { createZoomLinkApi } from "../../services/events";
import { usAddresses } from "./CreateEvent";
import LoadingScreen from "../../components/LoadingScreen";
import { MapContainer, TileLayer, Marker, useMapEvents } from "react-leaflet"
import { LatLngExpression } from 'leaflet';
const center: LatLngExpression = [51.505, -0.09];
import "leaflet/dist/leaflet.css"

interface Location {
  lat: number
  lng: number
}

interface Suggestion {
  place_id: number
  display_name: string
  lat: string
  lon: string
}

function MapEvents({ onLocationSelected }: { onLocationSelected: (location: Location) => void }) {
  useMapEvents({
    click(e) {
      onLocationSelected(e.latlng)
    },
  })
  return null
}

export function parsePHPSerialized(input: string | Question[]): Question[] {
  if (Array.isArray(input)) {
    return input;
  }

  const questions: Question[] = [];
  const regex =
    /i:\d+;a:4:\{s:2:"id";i:(\d+);s:4:"text";s:\d+:"([^"]*)";s:4:"type";s:\d+:"([^"]*)";s:6:"answer";s:\d+:"([^"]*)";}/g;
  let match;

  while ((match = regex.exec(input)) !== null) {
    const [, id, text, type] = match;
    questions.push({
      id: Number.parseInt(id),
      text,
      type: type as "yesno" | "review",
    });
  }

  if (questions.length === 0) {
    console.error("Failed to parse any questions from the input");
  }

  return questions;
}

const EventModal: React.FC = () => {
  const [selectedLocation, setSelectedLocation] = useState<Location | null>(null)
  const [suggestions, setSuggestions] = useState<Suggestion[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [isMapLoading, setMapLoading] = useState(false)
  const timeoutRef = useRef<NodeJS.Timeout | null>(null)
  const [value, setValue] = useState("");
  const [filteredAddresses, setFilteredAddresses] = useState(usAddresses);

  const handleLocationSelected = async (location: Location) => {
    console.log(filteredAddresses)
      setSelectedLocation(location)
      setMapLoading(true)
      try {
        const response = await fetch(
          `https://nominatim.openstreetmap.org/reverse?format=json&lat=${location.lat}&lon=${location.lng}&zoom=18&addressdetails=1`,
        )
        const data = await response.json()
  
        const address = data.address
        const formattedAddress = [
          address.road,
          address.city || address.town || address.village,
          address.postcode,
          address.country,
        ]
          .filter(Boolean)
          .join(", ")
  
        setPlaceName(formattedAddress || "Unknown location")
        setSuggestions([])
      } catch (error) {
        console.error("Error fetching place name:", error)
        setPlaceName("Error fetching place name")
      }
      setMapLoading(false)
    }
  
    const handleMapInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const value = e.target.value
      setValue(e.target.value);
      setPlaceName(value)
  
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current)
      }
  
      timeoutRef.current = setTimeout(async () => {
        if (value.length > 2) {
          try {
            const response = await fetch(
              `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(value)}`,
            )
            const data = await response.json()
            setSuggestions(data)
          } catch (error) {
            console.error("Error fetching suggestions:", error)
          }
        } else {
          setSuggestions([])
        }
      }, 300)
    }
  
    const handleSuggestionClick = (suggestion: Suggestion) => {
      // setValue(suggestion);
      // alert(suggestion);
      setPlaceName(suggestion.display_name)
      setSelectedLocation({ lat: Number.parseFloat(suggestion.lat), lng: Number.parseFloat(suggestion.lon) })
      setSuggestions([])
    }
  
    useEffect(() => {
      return () => {
        if (timeoutRef.current) {
          clearTimeout(timeoutRef.current)
        }
      }
    }, [])

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

  const token = useSelector(selectCurrentToken);
  // const data = useSelector(selectCurrentId);
  // const dispatch = useDispatch();
  const navigate = useNavigate();

  const defaultFormData: EventFormData = {
    event_title: "",
    event_description: "",
    event_start_time: "",
    event_questions: [],
    event_end_time: "",
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
    event_popup: false,
  };

  const event = useSelector((state: { event: EventState }) =>
    selectCurrentEvent(state)
  );

  const [isDraft, setIsDraft] = useState<string | undefined>("");
  const [eventTitle, setEventTitle] = useState("");
  const [eventDate, setEventDate] = useState("");
  const [eventStartTime, setEventStartTime] = useState("");
  const [eventEndTime, setEventEndTime] = useState("");
  const [isPublished, setIsPublished] = useState(false);
  const [placeName, setPlaceName] = useState(event?.event_location);
  // const [selected, setSelected] = useState(event?.event_is_virtual);
  const [selected, setSelected] = useState(event?.event_is_virtual);
  // const [isLoading, setIsLoading] = useState(false);

  const [formData, setFormData] = useState<EventFormData>(
    event ?? defaultFormData
  );

  console.log("first: ", isLoading)

  useEffect(() => {
    setFormData(event ?? defaultFormData);
    setValue(event?.event_location || "");
    console.log("new data from redux ", formData);
    setIsLoading(!isLoading);
  }, [event]);

  useEffect(() => {
    console.log(event?.event_status);
    if (event?.event_status === "publish") setIsPublished(true);
    else setIsPublished(false);
  });

  const [questions, setQuestions] = useState<Question[]>([]);

  useEffect(() => {
    if (event?.event_questions) {
      const parsedQuestions = parsePHPSerialized(event.event_questions);
      console.log("parsedQuestions", parsedQuestions);
      setQuestions(parsedQuestions);
    }
  }, [event]);

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
      setIsLoading(false);
      navigate("/eventManagement");
      toast(data.data.message);
    },
    onError: (error: any) => {
      setIsLoading(false);
      console.error("Submission failed", error);
    },
  });

  const id = useSelector(selectCurrentId);

  const handleSubmit = async (
    e: React.MouseEvent<HTMLButtonElement> | React.FormEvent<HTMLFormElement>
  ) => {
    e.preventDefault();
    setIsLoading(true);

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
        formData.event_date === "" ||
        formData.event_start_time === "" ||
        formData.event_end_time === ""
      ) {
        if (formData.event_title === "") setEventTitle("Required!");
        if (formData.event_start_time === "") setEventStartTime("Required!");
        if (formData.event_end_time === "") setEventEndTime("Required!");
        if (formData.event_date === "") setEventDate("Required!");
        setIsLoading(false);
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

  useEffect(() => {
    // if (formData.event_is_virtual === true) {
    //   setIsLoading(true);
      handleZoomLink();
    // }
  }, []);

  const createZoomLink = useMutation({
    mutationFn: async (data: any) => createZoomLinkApi(token, data),
    onSuccess: (res: any) => {
      setIsLoading(false);
      const link = res.data.data.response.start_url;
      setFormData((prev) => ({
        ...prev,
        event_meeting_link: link,
      }));
    },
    onError: (error: any) => {
      setIsLoading(false);
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

  const backSubmit = () => {
    navigate("/eventManagement");
  };

  useEffect(() => {
    setFormData(formData);
  }, [formData]);

  return (
    <>
      {isLoading ? (
        <LoadingScreen />
      ) : (
        <div>
          <h2 className="pl-[30px] pt-[30px] font-bold">Event Details</h2>
          <div className="grid grid-cols-3 w-full m-auto gap-2">
            <div className="col-span-3 2xl:col-span-2">
              <div className="smd:grid gap-20 gap-sm-5 grid-cols-2 mt-10 px-6 w-xl-2/3 w-sm-full">
                <div className="flex flex-col gap-5">
                  <div className="flex gap-4 justify-between">
                    <label className="text-sm mt-2">
                    <span className="text-red-500" style={{color: "red"}}>* </span>Title
                    </label>
                    <input
                      type="text"
                      id="event_title"
                      name="event_title"
                      disabled={isPublished}
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
                      disabled={isPublished}
                      value={formData.event_description}
                      onChange={handleInputChange}
                      required
                      className={`border w-[300px] p-2 rounded border-gray-border`}
                    />
                  </div>
                  <div className="flex gap-15 justify-between">
                    <label className="text-sm mt-2">
                    <span className="text-red-500" style={{color: "red"}}>* </span>Date
                    </label>
                    <input
                      type="date"
                      id="event_date"
                      name="event_date"
                      disabled={isPublished}
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
                    <span className="text-red-500" style={{color: "red"}}>* </span>Time
                    </label>
                    <div className="flex justify-between">
                      <input
                        type="time"
                        id="event_start_time"
                        name="event_start_time"
                        disabled={isPublished}
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
                        disabled={isPublished}
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
                      <span className="text-red-500"></span>Is this meeting
                      virtual?
                    </label>
                    <div className="flex items-center w-full gap-4">
                      <div className="flex items-center w-1/2 justify-start gap-2">
                        <input
                          type="radio"
                          id="event_is_virtual"
                          disabled={isPublished}
                          name="event_is_virtual" // Same name for both radio buttons
                          // checked={formData.event_is_virtual}
                          checked={selected === true}
                          onChange={() => {
                            // setFormData((prev) => ({
                            //   ...prev,
                            //   event_is_virtual: e.target.checked === true,
                            // }));
                            setSelected(true);
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
                          // checked={!formData.event_is_virtual}
                          checked={selected === false}
                          disabled={isPublished}
                          onChange={() => {
                            setSelected(false);
                            // setFormData((prev) => ({
                            //   ...prev,
                            //   event_is_virtual: e.target.checked === false,
                            // }));
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
                      value={selected === true ? formData.event_meeting_link : ""}
                      disabled={isPublished}
                      onChange={handleInputChange}
                      required
                      readOnly
                      className={`border w-[300px] border-gray-border p-2 rounded ${
                        formData.event_is_virtual
                          ? ""
                          : "disabled:cursor-not-allowed"
                      }`}
                    />
                  </div>
                  {/* <div className="flex gap-15 justify-between">
                    <label className="text-sm mt-2">
                      <span className="text-red-500"></span>Event Location
                    </label>
                    <div style={{ position: "relative", width: "300px" }}>
                      <input
                        type="text"
                        id="event_location"
                        name="event_location"
                        disabled={isPublished}
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
                                setFormData((prev) => ({
                                  ...prev,
                                  event_location: address,
                                }));
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
                  </div> */}
                </div>
                <div className="flex flex-col gap-5 mt-4 lg:mt-0">
                  <div className="flex gap-15 justify-between">
                    <label className="text-sm mt-2">
                      <span className="text-red-500"></span>Member(s)
                    </label>
                    <input
                      type="text"
                      id="event_members"
                      name="event_members"
                      disabled={isPublished}
                      // value={formData.event_members.join(",")}
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
                          disabled={isPublished}
                          type="checkbox"
                          className="border border-gray-border p-2 rounded"
                        />
                        <label className="p-3">Modify event</label>
                      </div>
                      <div className="flex item-center justify-start">
                        <input
                          disabled={isPublished}
                          type="checkbox"
                          className="border border-gray-border p-2 rounded"
                        />
                        <label className="p-3">Invite others</label>
                      </div>
                      <div className="flex item-center justify-start">
                        <input
                          disabled={isPublished}
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
                          disabled={isPublished}
                          className="bg-primary p-1 rounded-md text-white font-semibold px-3"
                          onClick={handleFileButtonClick}
                        >
                          Choose file +
                        </button>
                        {/* <p>{fileName}</p> */}
                        <input
                          disabled={isPublished}
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
              <div className="pt-6 mx-6 ">
                <div className="input-container mb-6  flex justify-start items-center" style={{ marginTop: "20px", position: "relative" }}>
                  <label htmlFor="location-input"  className="text-sm mt-2 w-1/6">Event Location:</label>
                  <input
                    disabled={isPublished}
                    type="text"
                    id="event_location"
                    name="event_location"
                    // value={value}
                    // onChange={(e) => {
                    //   setValue(e.target.value);
                    // }}
                    value={isMapLoading ? "Loading...": placeName}
                    onChange={handleMapInputChange}
                    placeholder="Type to search or click on the map"
                    className="border w-[300px] border-gray-border p-2 rounded"
                  />
                  {suggestions.length > 0 && (
                    <ul
                      className="suggestions"
                      style={{
                        position: "absolute",
                        top: "100%",
                        left: 0,
                        right: 0,
                        backgroundColor: "white",
                        border: "1px solid #ccc",
                        borderTop: "none",
                        maxHeight: "200px",
                        overflowY: "auto",
                        zIndex: 1000,
                        listStyle: "none",
                        padding: 0,
                        margin: 0,
                      }}
                    >
                      {suggestions.map((suggestion) => (
                        <li
                          key={suggestion.place_id}
                          onClick={() => handleSuggestionClick(suggestion)}
                          style={{
                            padding: "5px",
                            cursor: "pointer",
                            borderBottom: "1px solid #eee",
                          }}
                        >
                          {suggestion.display_name}
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
                <div className="map-selector">
                  <div className="map-container"  style={{ height: "400px", width: "100%" }}>
                    <MapContainer 
                    center={center} zoom={13}
                    style={{ height: "100%", width: "100%" }}>
                      <TileLayer
                        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                      />
                      <MapEvents onLocationSelected={handleLocationSelected} />
                      {selectedLocation && <Marker position={[selectedLocation.lat, selectedLocation.lng]} />}
                    </MapContainer>
                  </div>
                </div>
              </div>
            </div>
            <div className="col-span-3 2xl:col-span-1">
              <div className="w-full">
                <h5 className="font-semibold text-lg mb-4 text-center">
                  Meeting Tags
                </h5>
                <div className="flex flex-col items-center p-2 bg-primary-light rounded-lg m-auto">
                  <div className="w-full flex justify-center items-center p-2 border-b-[1px] pb-0">
                    <div className="flex w-1/2 justify-center">
                      <input
                        type="checkbox"
                        checked={formData.event_featured}
                        disabled={isPublished}
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
                        disabled={isPublished}
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
                    className="grid grid-cols-3 gap-6 w-full max-h-[500px] overflow-y-auto pt-2
      scrollbar scrollbar-thin scrollbar-thumb-gray-400 scrollbar-track-gray-100
      hover:scrollbar-thumb-gray-500 px-4"
                  >
                    {meetingTags.map((tag, index) => (
                      <div
                        key={index}
                        className="col-span-1 2xl:col-span-3 bg-white rounded-lg shadow-sm mb-4 p-4"
                      >
                        <div className="flex flex-col">
                          <label className="flex items-center gap-2 mb-3 cursor-pointer hover:bg-gray-50 p-2 rounded-md">
                            <input
                              type="checkbox"
                              disabled={isPublished}
                              className="w-5 h-5 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                              checked={isParentChecked(tag)}
                              ref={(input) => {
                                if (input) {
                                  input.indeterminate =
                                    isParentIndeterminate(tag);
                                }
                              }}
                              onChange={(e) =>
                                handleCategoryChange(
                                  tag.category,
                                  e.target.checked
                                )
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
                                  ? "grid grid-cols-1 xl:grid-cols-2 gap-3 "
                                  : "flex flex-col gap-2"
                              }
                            >
                              {tag.items.map((item, idx) => (
                                <label
                                  key={idx}
                                  className="flex items-center gap-2 cursor-pointer hover:bg-gray-50 p-2 rounded-md"
                                >
                                  <input
                                    disabled={isPublished}
                                    type="checkbox"
                                    className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
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
                  {isDraft === "draft" ? (
                    <>
                      <button
                        name="updateandpublish"
                        className="w-2/5 px-4 py-2 rounded-md hover:bg-primary hover:text-white focus:outline-none border duration-300 ease-in-out"
                        onClick={handleSubmit}
                      >
                        Publish
                      </button>
                      <button
                        className="w-2/5 px-4 py-2 rounded-md hover:bg-primary hover:text-white focus:outline-none border duration-300 ease-in-out"
                        onClick={handleSubmit}
                      >
                        Save in Drafts
                      </button>
                    </>
                  ) : (
                    <button
                      className="p-2 px-4 rounded-md bg-primary text-white text-sm m-auto w-1/2"
                      onClick={backSubmit}
                    >
                      Back
                    </button>
                  )}
                </div>
              </div>
            </div>
          </div>
          
          <div className="mt-1">
            <RecurringComponent
              isPublished={isPublished}
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

          <div className="flex justify-center">
            <div className="col-span-4 bg-gray-50 m-auto w-full">
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
                      disabled={isPublished}
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
                        disabled={isPublished}
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
                        disabled={isPublished}
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
                    disabled={isPublished}
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
                                  disabled={isPublished}
                                  type="text"
                                  value={editText}
                                  onChange={(e) => setEditText(e.target.value)}
                                  className="w-full p-2 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
                                />
                                <div className="mt-2 flex gap-2">
                                  <button
                                    disabled={isPublished}
                                    onClick={() => saveEdit(question.id)}
                                    className="text-green-600 hover:text-green-700"
                                  >
                                    <Check className="h-5 w-5" />
                                  </button>
                                  <button
                                    disabled={isPublished}
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
                                  disabled={isPublished}
                                  onClick={() => startEditing(question)}
                                  className="text-gray-600 hover:text-gray-700"
                                >
                                  <Pencil className="h-5 w-5" />
                                </button>
                                <button
                                  disabled={isPublished}
                                  onClick={() =>
                                    handleDeleteQuestion(question.id)
                                  }
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
                                  disabled={isPublished}
                                  type="text"
                                  value={editText}
                                  onChange={(e) => setEditText(e.target.value)}
                                  className="w-full p-2 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
                                />
                                <div className="mt-2 flex gap-2">
                                  <button
                                    disabled={isPublished}
                                    onClick={() => saveEdit(question.id)}
                                    className="text-green-600 hover:text-green-700"
                                  >
                                    <Check className="h-5 w-5" />
                                  </button>
                                  <button
                                    disabled={isPublished}
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
                                  disabled={isPublished}
                                  onClick={() => startEditing(question)}
                                  className="text-gray-600 hover:text-gray-700"
                                >
                                  <Pencil className="h-5 w-5" />
                                </button>
                                <button
                                  disabled={isPublished}
                                  onClick={() =>
                                    handleDeleteQuestion(question.id)
                                  }
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
        </div>
      )}
    </>
  );
};

export default EventModal;
