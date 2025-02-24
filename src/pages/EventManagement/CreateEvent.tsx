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
import { Pencil, Trash2, Plus, X, Check } from "lucide-react";
import { createZoomLinkApi } from "../../services/events";
import LoadingScreen from "../../components/LoadingScreen";


import { MapContainer, TileLayer, Marker, useMapEvents } from "react-leaflet";
// import { LatLngExpression } from "leaflet";
// const center: LatLngExpression = [51.505, -0.09];
import "leaflet/dist/leaflet.css";
import { TimePicker } from "../../components/TimePicker";
//For Map
interface Location {
  lat: number;
  lng: number;
}

const defaultLocation = {
  lat: 34.0522,
  lng: -118.2437,
  address: "Los Angeles, CA 90012"
};

interface Suggestion {
  place_id: number;
  display_name: string;
  lat: string;
  lon: string;
  address?: {
    house_number?: string;
    road?: string;
    city?: string;
    municipality?: string;
    state?: string;
    postcode?: string;
  };
}

function MapEvents({
  onLocationSelected,
}: {
  onLocationSelected: (location: Location) => void;
}) {
  useMapEvents({
    click(e) {
      onLocationSelected(e.latlng);
    },
  });
  return null;
}


const CreateEvent: React.FC = () => {
  
  //For Map
  const [isMapLoading, setMapLoading] = useState(false);
  // const [center, setCenter] = useState<[number, number]>([defaultLocation.lat, defaultLocation.lng]);
  const initialCenter: [number, number] = [defaultLocation.lat, defaultLocation.lng];
  const [selectedLocation, setSelectedLocation] = useState<Location>({
    lat: defaultLocation.lat,
    lng: defaultLocation.lng
  });
  useEffect(() => {
    handleDefaultLocation();
  }, []);

  const handleDefaultLocation = async (): Promise<void> => {
    setMapLoading(true);
    try {
      const response = await fetch(
        `https://nominatim.openstreetmap.org/reverse?format=json&lat=${defaultLocation.lat}&lon=${defaultLocation.lng}`
      );
      const data = await response.json();
      const formattedAddress = formatAddress(data.address);
      setPlaceName(formattedAddress);
    } catch (error) {
      console.error("Error setting default location:", error);
      setPlaceName(defaultLocation.address);
    }
    setMapLoading(false);
  };
  const handleLocationSelected = async (location: Location) => {
    // console.log(filteredAddresses)
    setSelectedLocation(location);
    setMapLoading(true);
    try {
      const response = await fetch(
        `https://nominatim.openstreetmap.org/reverse?format=json&lat=${location.lat}&lon=${location.lng}&zoom=18&addressdetails=1`
      );
      const data = await response.json();

      const address = data.address;
      const formattedAddress = [
        address.road,
        address.city || address.town || address.village,
        address.postcode,
        address.country,
      ]
        .filter(Boolean)
        .join(", ");

      setPlaceName(formattedAddress || "Unknown location");
      setSuggestions([]);
    } catch (error) {
      console.error("Error fetching place name:", error);
      setPlaceName("Error fetching place name");
    }
    setMapLoading(false);
  };

  const handleMapInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    // setValue(e.target.value);
    setPlaceName(value);

    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }

    timeoutRef.current = setTimeout(async () => {
      if (value.length > 2) {
        try {
          const response = await fetch(
            `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(
              value
            )}`
          );
          const data = await response.json();
          setSuggestions(data);
        } catch (error) {
          console.error("Error fetching suggestions:", error);
        }
      } else {
        setSuggestions([]);
      }
    }, 300);
  };

  const handleSuggestionClick = (suggestion: Suggestion) => {
  
    setPlaceName(suggestion.display_name);
    setSelectedLocation({
      lat: Number.parseFloat(suggestion.lat),
      lng: Number.parseFloat(suggestion.lon),
    });
    setSuggestions([]);
  };

  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, []);


  const formatAddress = (address: Suggestion['address']): string => {
    if (!address) return defaultLocation.address;
    
    const components: string[] = [];
    
    if (address.house_number) components.push(address.house_number);
    if (address.road) components.push(address.road);
    if (address.city || address.municipality) components.push((address.city || address.municipality) as string);
    if (address.state) components.push(address.state);
    if (address.postcode) components.push(address.postcode);
    
    return components.join(", ") || defaultLocation.address;
  };
  
  //For Meeting tags
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null)
  const [selectedSubcategories, setSelectedSubcategories] = useState<string[]>([])
  // const [eventCategorySlugs, setEventCategorySlugs] = useState<string[]>(initialEventCategorySlugs)
  const [eventCategorySlugs, setEventCategorySlugs] = useState<string[]>([])
 
  const handleCategoryChange = (categoryId: string) => {
    if (selectedCategory === categoryId) {
      setSelectedCategory(null)
      setSelectedSubcategories([])
      setEventCategorySlugs([])
    } else {
      setSelectedCategory(categoryId)
      const category = meetingTags.find((cat: any) => cat.id === categoryId)
      if (category) {
        const allSubcategories = category.subcategories.map((sub: any) => sub.id)
        setSelectedSubcategories(allSubcategories)
        setEventCategorySlugs(category.subcategories.map((sub: any) => sub.slug))
      }
    }
  }

  const handleSubcategoryChange = (subcategoryId: string, categoryId: string) => {
    const category = meetingTags.find((cat: any) => cat.id === categoryId)
    if (!category) return

    if (selectedCategory === categoryId) {
      setSelectedSubcategories((prev) => {
        const newSelectedSubcategories = prev.includes(subcategoryId)
          ? prev.filter((id) => id !== subcategoryId)
          : [...prev, subcategoryId]

        const newEventCategorySlugs = category.subcategories
          .filter((sub: any) => newSelectedSubcategories.includes(sub.id))
          .map((sub: any) => sub.slug)

        setEventCategorySlugs(newEventCategorySlugs)
        return newSelectedSubcategories
      })
    } else {
      setSelectedCategory(categoryId)
      setSelectedSubcategories([subcategoryId])
      const subcategory = category.subcategories.find((sub: any) => sub.id === subcategoryId)
      setEventCategorySlugs(subcategory ? [subcategory.slug] : [])
    }
    setFormData(
      (prev) => ({
        ...prev,
        event_category_slugs: eventCategorySlugs
      }));
  }

  const [placeName, setPlaceName] = useState("");
  const [suggestions, setSuggestions] = useState<Suggestion[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);
  // const [value, setValue] = useState("");
  // console.log(value);
  // const [filteredAddresses, setFilteredAddresses] = useState(usAddresses);

  //For Questions
  const [questions, setQuestions] = useState<Question[]>([]);

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
    event_is_virtual: false,
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
    event_category: "",
    event_category_slugs: [],
    post_id: null,
    event_featured: false,
    event_popup: false,
  });

  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const [fileName, setFileName] = useState("No file chosen");
  const [eventTitle, setEventTitle] = useState("");
  const [eventDate, setEventDate] = useState("");
  // const [eventStartTime, setEventStartTime] = useState("");
  // const [eventEndTime, setEventEndTime] = useState("");
  // const [isLoading, setIsLoading] = useState(false);

  const handleFileButtonClick = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  const handleStartTimeChange = (newTime: string) => {
    setFormData((prev) => ({
      ...prev,
      event_start_time:
        newTime
    })); 
  }
  const handleEndTimeChange = (newTime: string) => {
    setFormData((prev) => ({
      ...prev,
      event_end_time:
        newTime
    })); 
  }
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

    if (name === "event_description" && formData.event_description.length <= maxLength) {
      return;
    }
    setFormData((prev) => ({
      ...prev,
      [name]: value, // Update the correct field dynamically
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
    handleZoomLink();
  }, []);

  const createZoomLink = useMutation({
    mutationFn: async (data: any) => createZoomLinkApi(token, data),
    onSuccess: (res: any) => {
      setMapLoading(false);
      const link = res.data.data.response.start_url;
      setFormData((prev) => ({
        ...prev,
        event_meeting_link: link,
      }));
    },
    onError: (error: any) => {
      setMapLoading(false);
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
      // event.target.value = "";
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
      // event.target.value = "";
      setImagePreview(null);
    }
  };

  const navigate = useNavigate();

  const createEventMutation = useMutation({
    mutationFn: async (data: EventFormData) => createEventApi(token, data),
    onSuccess: (data: any) => {
      setIsLoading(false);
      console.log(data.data.message);
      navigate("/eventManagement");
    },
    onError: (error: any) => {
      setIsLoading(false);
      console.error("Submission failed", error);
    },
  });

  const handleSubmit = async (status: "publish" | "draft") => {
    // handleSave();
    setIsLoading(true);
    try {
      if (
        formData.event_title === "" ||
        formData.event_date === "" ||
        formData.event_start_time === "" ||
        formData.event_end_time === ""
      ) {
        if (formData.event_title === "") setEventTitle("Required!");
        // if (formData.event_start_time === "") setEventStartTime("Required!");
        // if (formData.event_end_time === "") setEventEndTime("Required!");
        if (formData.event_date === "") setEventDate("Required!");

        toast("Required fields should be input! Please type.");
        setIsLoading(false);
        console.log(formData);
      } else {
        // Update the formData with the new status directly in the mutation
        await createEventMutation.mutateAsync({
          ...formData,
          event_status: status,
          event_questions: questions,
          event_location: placeName,
          event_category_slugs: eventCategorySlugs,
          event_category: selectedCategory
        });
      }
    } catch (error) {
      console.error("Submission error:", error);
    }
  };

  const maxLength = 200;

  return (
    <>
      {isLoading ? (
        <LoadingScreen />
      ) : (
        <div>
          <h2 className="pl-[30px] pt-[30px] font-bold">Create New Event</h2>
          <div className="grid grid-cols-3 w-full m-auto gap-2">
            <div className="col-span-3 2xl:col-span-2">
              <div className="grid gap-20 gap-sm-5 grid-cols-2 mt-10 px-6 w-xl-2/3 w-sm-full">
                <div className="col-span-2 xl:col-span-1 flex flex-col gap-5">
                  <div className="flex gap-4 justify-between">
                    <label className="text-sm mt-2">
                      <span className="text-red-500" style={{ color: "red" }}>
                        *{" "}
                      </span>
                      Title
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
                  <div className="flex justify-between">
                    <label className="text-sm mt-2">
                      <span className="text-red-500"></span>Description
                    </label>
                    <div>
                    <textarea
                      id="event_description"
                      name="event_description"
                      value={formData.event_description}
                      placeholder="Type here... (Max 200 characters)"
                      maxLength={200}
                      onChange={handleInputChange}
                      required
                      className={`border w-[300px] h-[150px] p-2 rounded border-gray-border`}
                    />
                    {formData.event_description.length < maxLength ?
                    <p style={{color: "gray"}}>{maxLength - formData.event_description.length} characters left</p>
                    : <p style={{ color: "red" }}>Character limit exceeded!</p>}
                    </div>
                  </div>
                  <div className="flex justify-between">
                    <label className="text-sm mt-2">
                      <span className="text-red-500" style={{ color: "red" }}>
                        *{" "}
                      </span>
                      Date
                    </label>
                    <input
                      type="date"
                      id="event_date"
                      name="event_date"
                      value = {formData.event_date ?? ''}
                      onChange={handleInputChange}
                      required
                      className={`border w-[300px] p-2 rounded ${
                        eventDate ? "border-red-600" : "border-gray-border"
                      }`}
                    />
                  </div>
                  <div className="flex justify-between">
                    <label className="text-sm mt-2">
                      <span className="text-red-500" style={{ color: "red" }}>
                        *{" "}
                      </span>
                      Time
                    </label>
                    <div className="flex justify-between items-center">
                      <TimePicker value={formData.event_start_time}
                        onChange={(newTime) => {
                          handleStartTimeChange(newTime);
                        }}></TimePicker>
                      <span className="p-3 text-sm">to</span>
                      <TimePicker value={formData.event_end_time}
                        onChange={(newTime) => {
                          handleEndTimeChange(newTime);
                        }}></TimePicker>
                    </div>
                  </div>
                  <div className="flex justify-between">
                    <label className="text-sm mt-2 w-1/3">
                      <span className="text-red-500"></span>Is this meeting
                      virtual?
                    </label>
                    <div className="flex items-center gap-4">
                      <div className="flex items-center w-1/2 justify-start gap-2">
                        <input
                            type="radio"
                            id="event_is_virtual_yes"
                            name="event_is_virtual"
                            value="true"
                            checked={formData.event_is_virtual == true}
                            onChange={() => setFormData(prev => ({ ...prev, event_is_virtual: true }))}
                            className="w-4 h-4"
                        />
                        <span>Yes</span>
                      </div>
                      <div className="flex items-center w-1/2 justify-start gap-2">
                        <input
                            type="radio"
                            id="event_is_virtual_no"
                            name="event_is_virtual"
                            value="false"
                            checked={formData.event_is_virtual == false}
                            onChange={() => setFormData(prev => ({ ...prev, event_is_virtual: false }))}
                            className="w-4 h-4"
                        />
                        <span>No</span>
                      </div>
                    </div>
                  </div>
                  <div className="flex justify-between">
                    <label className="text-sm mt-2">
                      <span className="text-red-500"></span>Meeting Link
                    </label>
                      <input
                        type="text"
                        id="event_meeting_link"
                        name="event_meeting_link"
                        value={formData.event_is_virtual ? formData.event_meeting_link || '' : ''}
                        disabled={!formData.event_is_virtual}
                        onChange={handleInputChange}
                        className={`border w-[300px] border-gray-border p-2 rounded ${
                            !formData.event_is_virtual ? 'cursor-not-allowed bg-gray-100' : ''
                        }`}
                    />
                  </div>
                </div>
                <div className="col-span-2 xl:col-span-1 flex flex-col gap-5 mt-4 lg:mt-0">
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
              <div className="pt-6 mx-6">
                <div
                  className="input-container mb-6 flex justify-start items-center"
                  style={{ marginTop: "20px", position: "relative" }}
                >
                  <label htmlFor="location-input" className="text-sm mt-2 w-1/6">
                    Event Location:
                  </label>
                  <div className="flex flex-col w-[300px] relative">
                    <input
                      type="text"
                      id="event_location"
                      name="event_location"
                      value={isMapLoading ? "Loading..." : placeName}
                      onChange={handleMapInputChange}
                      placeholder="Type to search or click on the map"
                      className="border border-gray-200 p-2 rounded-md w-full focus:border-blue-400 focus:ring-1 focus:ring-blue-400 outline-none transition-colors duration-200"
                    />
                    
                    {/* Suggestions dropdown */}
                    {suggestions.length > 0 && (
                      <ul
                        className="absolute w-full bg-white mt-[40px] rounded-md shadow-sm border border-gray-100 max-h-[250px] overflow-y-auto z-[1000]"
                      >
                        {suggestions.map((suggestion) => (
                          <li
                            key={suggestion.place_id}
                            onClick={() => handleSuggestionClick(suggestion)}
                            className="border-b border-gray-50 last:border-b-0"
                          >
                            <div className="flex items-start p-3 hover:bg-gray-50 cursor-pointer transition-colors duration-150">
                              <svg 
                                className="w-4 h-4 mt-0.5 mr-2 flex-shrink-0" 
                                fill="none" 
                                strokeLinecap="round" 
                                strokeLinejoin="round" 
                                strokeWidth="2" 
                                viewBox="0 0 24 24" 
                                stroke="currentColor"
                              >
                                <path d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                                <path d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                              </svg>
                              <span className="text-sm truncate">
                                {suggestion.display_name}
                              </span>
                            </div>
                          </li>
                        ))}
                      </ul>
                    )}
                  </div>
                </div>

                {/* Map section */}
                <div className="map-selector">
                  <div
                    className="map-container"
                    style={{ height: "400px", width: "100%" }}
                  >
                    <MapContainer
                      center={initialCenter}
                      zoom={13}
                      style={{ height: "100%", width: "100%" }}
                    >
                      <TileLayer
                        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                      />
                      <MapEvents onLocationSelected={handleLocationSelected} />
                      {selectedLocation && (
                        <Marker
                          position={[
                            selectedLocation.lat,
                            selectedLocation.lng,
                          ]}
                        />
                      )}
                    </MapContainer>
                  </div>
                </div>
              </div>
            </div>
            <div className="col-span-3 mt-8 2xl:mt-0 2xl:col-span-1">
              <div className="w-full">
                <h5 className="font-semibold text-lg mb-4 text-center">
                  Meeting Tags
                </h5>
                <div className=" flex flex-col items-center p-2 bg-primary-light rounded-lg m-auto">
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
                  {/* <div
                    className="grid grid-cols-3 gap-6 w-full max-h-[500px] overflow-y-auto pt-2
                      scrollbar scrollbar-thin scrollbar-thumb-gray-400 scrollbar-track-gray-100
                      hover:scrollbar-thumb-gray-500 px-4"
                  > */}
                  <div
                    className="grid grid-cols-3 gap-6 w-full overflow-y-auto pt-2
                      scrollbar scrollbar-thin scrollbar-thumb-gray-400 scrollbar-track-gray-100
                      hover:scrollbar-thumb-gray-500 px-4"
                  >
                    {meetingTags.map((category: any) => (
                      <div key={category.id} className="col-span-1 2xl:col-span-3 space-y-4 rounded-lg border p-4">
                        <div className="flex items-center space-x-2">
                          <input
                            type="checkbox"
                            id={category.id}
                            checked={selectedCategory === category.id}
                            onChange={() => handleCategoryChange(category.id)}
                          />
                          <label htmlFor={category.id} className="font-medium">
                            {category.label}
                          </label>
                        </div>
                        <div className="ml-6 space-y-3 border-l pl-4">
                          {category.subcategories.map((sub: any) => (
                            <div key={sub.id} className="flex items-center space-x-2">
                              <input 
                                type="checkbox"
                                id={sub.id}
                                checked={selectedSubcategories.includes(sub.id)}
                                onChange={() => handleSubcategoryChange(sub.id, category.id)}
                              />
                              <label htmlFor={sub.id}>{sub.label}</label>
                            </div>
                          ))}
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
          </div>
          <div className="mt-1">
            <RecurringComponent
              isPublished={false}
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

export default CreateEvent;
