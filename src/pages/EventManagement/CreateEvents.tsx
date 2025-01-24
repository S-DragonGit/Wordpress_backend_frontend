import { useState } from "react";
import { formFields, formFieldsTwo, meetingTags } from "../../app/list";
import FormOne, { FormOneProps } from "../../components/FormOne";
import RecurringComponent from "../../components/RecurringComponent";
import { useSelector } from "react-redux";
import { selectCurrentId, selectCurrentToken } from "../../app/redux/userSlice";
import { createsEvents } from "../../services/events";
import { toast, Toaster } from 'react-hot-toast';

// import RecurringComponent from "../../components/Recurring";

const CreateEvents: React.FC = () => {
    const userId = useSelector(selectCurrentId);
    const token = useSelector(selectCurrentToken);
    // State to store all form values
    const [formValues, setFormValues] = useState<{ [key: string]: any }>({});


    const handleFormValueChange = (name: string, value: any) => {
  
        setFormValues((prevValues) => ({
            ...prevValues,
            [name]: value instanceof File ? value : // Directly store the File object for file inputs
                     name === 'permission' // Apply array logic only for the 'permission' field
                        ? Array.isArray(prevValues[name])
                            ? prevValues[name].includes(value)
                                ? prevValues[name].filter((item) => item !== value) // Uncheck
                                : [...prevValues[name], value] // Check
                            : [value] // Initialize array if it's the first selection
                        : value, // For other fields, store the value directly
        }));
    };
    
    

    const [recurringState, setRecurringState] = useState({
        isRecurring: false,
        repeatEvery: 1,
        selectedDays: [],
        time: { hour: 10, period: "am" },
        endOption: "never",
        endDate: "",
        occurrences: 4,
    });

    const handleRecurringStateChange = (updatedState: Partial<typeof recurringState>) => {
        setRecurringState((prevState) => ({
            ...prevState,
            ...updatedState,
        }));
    };
    // const createDraftMode = async () => {
    //     console.log("Draft Mode Clicked with form values:", formValues, recurringState);
    //     // Use formValues as required
    //     console.log("user id is", userId);
    //     try {
    //         // Construct the API body dynamically

    //         const body = {
    //             user_id: userId,
    //             status: "draft", // Draft mode
    //             event_title: formValues?.eventTitle || "",
    //             description: formValues?.description || "",
    //             start_date: formValues?.eventDate || "",
    //             start_time: formValues?.startTime || "",
    //             end_date: formValues?.endDate || "",
    //             end_time: formValues?.endTime || "",
    //             is_virtual: formValues?.meeting || "No",
    //             meeting_link: formValues?.meetingLink || "",
    //             // recurring: recurringState?.isRecurring ? "true" : "false",
    //             // repeat_every: recurringState?.repeatEvery || "",
    //             // repeat_on: recurringState?.selectedDays.join(",") || "",
    //             // time: `${recurringState?.time.hour} ${recurringState?.time.period}`,
    //             // never: recurringState?.endOption === "never" ? "true" : "false",
    //             // on: formValues?.on || "",
    //             // after: recurringState?.endOption === "after" ? recurringState?.occurrences : "",

    //             // Include recurring fields only if `isRecurring` is true
    //             ...(recurringState?.isRecurring
    //                 ? {
    //                     recurring: "true",
    //                     repeat_every: recurringState?.repeatEvery || "",
    //                     repeat_on: recurringState?.selectedDays?.join(",") || "",
    //                     time: `${recurringState?.time.hour} ${recurringState?.time.period}`,
    //                     never: recurringState?.endOption === "never" ? "true" : "false",
    //                     on: recurringState?.endOption === "on" ? formValues?.on || "" : "",
    //                     after: recurringState?.endOption === "after" ? recurringState?.occurrences || "" : "",
    //                 }
    //                 : {
    //                     recurring: "false", // If not recurring, explicitly set it to "false"
    //                 }),
    //             members: formValues?.members || [],
    //             // modify_event: formValues?.modifyEvent || "No",
    //             // invite_others: formValues?.inviteOthers || "No",
    //             // view_member_list: formValues?.viewMemberList || "No",
    //             modify_event: formValues.permissions?.includes("Modify event") ? "Modify event" : "",
    //             invite_others: formValues.permissions?.includes("Invite others") ? "Invite others" : "",
    //             view_member_list: formValues.permissions?.includes("View members list") ? "View members list" : "",
    //             category_slugs: formValues?.categories || [],
    //             Organizer: formValues?.organizer || "",
    //             event_location: formValues?.EventLocation || "",
    //         };

    //         // Ensure that meeting_link is provided if the event is virtual
    //         // if (body.is_virtual === "Yes" && !body.meeting_link) {
    //         //   alert("Please provide a meeting link for virtual events.");
    //         //   return;
    //         // }

    //         // Call the API
    //         const response = await createsEvents(token, body);
    //         console.log("API Response:", response);

    //         // Additional handling (e.g., success message)
    //         alert("Draft saved successfully!");
    //     } catch (err) {
    //         console.error("Error creating draft:", err);
    //         alert("Failed to save draft. Please try again.");
    //     }

    // };
   
     const createNewEvent = async (eventStatus:string) => {
        // try {
        //     // Create a FormData object
        //     const formData = new FormData();
    
        //     // Append the necessary fields to the FormData object
        //     formData.append("user_id", userId);
        //     formData.append("status", eventStatus||"draft");
        //     formData.append("event_title", formValues?.eventTitle || "");
        //     formData.append("description", formValues?.description || "");
        //     formData.append("start_date", formValues?.eventDate || "");
        //     formData.append("start_time", formValues?.startTime || "");
        //     formData.append("end_date", formValues?.endDate || "");
        //     formData.append("end_time", formValues?.endTime || "");
        //     formData.append("is_virtual", formValues?.meeting || "No");
        //     formData.append("meeting_link", formValues?.meetingLink || "");
    
        //     // Include recurring fields only if `isRecurring` is true
        //     if (recurringState?.isRecurring) {
        //         formData.append("recurring", "true");
        //         formData.append("repeat_every", recurringState?.repeatEvery || "");
        //         formData.append("repeat_on", recurringState?.selectedDays?.join(",") || "");
        //         formData.append("time", `${recurringState?.time.hour} ${recurringState?.time.period}`);
        //         formData.append("never", recurringState?.endOption === "never" ? "true" : "false");
        //         if (recurringState?.endOption === "on") {
        //             formData.append("on", formValues?.on || "");
        //         }
        //         if (recurringState?.endOption === "after") {
        //             formData.append("after", recurringState?.occurrences || "");
        //         }
        //     } else {
        //         formData.append("recurring", "false"); // If not recurring, explicitly set it to "false"
        //     }
    
        //     // Append permissions based on their presence
        //     if (formValues.permissions) {
        //         if (formValues.permissions.includes("Modify event")) {
        //             formData.append("modify_event", "Modify event");
        //         }
        //         if (formValues.permissions.includes("Invite others")) {
        //             formData.append("invite_others", "Invite others");
        //         }
        //         if (formValues.permissions.includes("View members list")) {
        //             formData.append("view_member_list", "View members list");
        //         }
        //     }
    
        //     // Append other fields
        //     if (formValues.members) {
        //         for (const member of formValues.members) {
        //             formData.append('members[]', member); // Using [] for array-like behavior
        //         }
        //     }
    
        //     // Append categories
        //     if (formValues.categories) {
        //         for (const category of formValues.categories) {
        //             formData.append('category_slugs[]', category);
        //         }
        //     }
    
        //     // Append additional fields
        //     formData.append("Organizer", formValues?.organizer || "");
        //     formData.append("event_location", formValues?.EventLocation || "");
        //     formData.append("image", formValues?.coverImage || "");
        //     // Ensure that meeting_link is provided if the event is virtual
        //     // if (formValues.meeting === "Yes" && !formValues.meetingLink) {
        //     //   alert("Please provide a meeting link for virtual events.");
        //     //   return;
        //     // }
    
        //     // Call the API with FormData
        //     const response = await createsEvents(token, formData);
        //     console.log("API Response:", response);
    
        //     if (response.success) {
        //         toast.success(response.message || "Event created successfully.");
        //     } else {
        //         toast.error(response.message || "Failed to create event. Please try again.");
        //     }
        // } catch (err) {
        //     console.error("Error creating draft:", err);
        //     toast.error("An error occurred. Please try again.");
        // }
        toast.promise(
            (async () => {
                try {
                    // Create a FormData object
                    const formData = new FormData();
        
                    // Append the necessary fields to the FormData object
                    formData.append("user_id", userId);
                    formData.append("status", eventStatus);
                    formData.append("event_title", formValues?.eventTitle || "");
                    formData.append("description", formValues?.description || "");
                    formData.append("start_date", formValues?.eventDate || "");
                    formData.append("start_time", formValues?.startTime || "");
                    formData.append("end_date", formValues?.endDate || "");
                    formData.append("end_time", formValues?.endTime || "");
                    formData.append("is_virtual", formValues?.meeting || "No");
                    formData.append("meeting_link", formValues?.meetingLink || "");
        
                    // Include recurring fields only if `isRecurring` is true
                    if (recurringState?.isRecurring) {
                        formData.append("recurring", "true");
                        formData.append("repeat_every", recurringState?.repeatEvery || "");
                        formData.append("repeat_on", recurringState?.selectedDays?.join(",") || "");
                        formData.append("time", `${recurringState?.time.hour} ${recurringState?.time.period}`);
                        formData.append("never", recurringState?.endOption === "never" ? "true" : "false");
                        if (recurringState?.endOption === "on") {
                            formData.append("on", formValues?.on || "");
                        }
                        if (recurringState?.endOption === "after") {
                            formData.append("after", recurringState?.occurrences || "");
                        }
                    } else {
                        formData.append("recurring", "false"); // If not recurring, explicitly set it to "false"
                    }
        
                    // Append permissions based on their presence
                    if (formValues.permissions) {
                        if (formValues.permissions.includes("Modify event")) {
                            formData.append("modify_event", "Modify event");
                        }
                        if (formValues.permissions.includes("Invite others")) {
                            formData.append("invite_others", "Invite others");
                        }
                        if (formValues.permissions.includes("View members list")) {
                            formData.append("view_member_list", "View members list");
                        }
                    }
        
                    // Append other fields
                    if (formValues.members) {
                        for (const member of formValues.members) {
                            formData.append('members[]', member); // Using [] for array-like behavior
                        }
                    }
        
                    // Append categories
                    if (formValues.categories) {
                        for (const category of formValues.categories) {
                            formData.append('category_slugs[]', category);
                        }
                    }
        
                    // Append additional fields
                    formData.append("Organizer", formValues?.organizer || "");
                    formData.append("event_location", formValues?.EventLocation || "");
                    formData.append("image", formValues?.coverImage || "");
        
                    // Call the API with FormData
                    const response = await createsEvents(token, formData);
                    console.log("API Response:", response);
        
                    // Check the response for success
                    if (response.success) {
                        // Redirect after showing success message
                        setTimeout(() => {
                            navigate("/eventmanagement");
                        }, 1000);
                        return response.message || "Event created successfully.";
                    } else {
                        throw new Error(response.message || "Failed to create event.");
                    }
                } catch (err) {
                    console.error("Error creating event:", err);
                    throw new Error(err.message || "An error occurred while creating the event.");
                }
            })(),
            {
                loading: "Creating new event...",
                success: (message) => message ,
                error: (error) => error.message || "Failed to create event.",
            }
        );
    };
    
    return (
        <div className="flex smd:flex-row flex-col items-center  w-full gap-2">
             <Toaster/>
            <div className="smd:grid gap-5 grid-cols-2 mt-10 smd:ml-10">
                <div className="flex flex-col gap-5">
                    {formFields.map((field, index) => (
                        <FormOne
                            key={index}
                            {...field}
                            value={formValues[field.name] || ""}
                            onChange={(e) =>
                                handleFormValueChange(field.name, e.target.value)
                            }
                        />
                    ))}
                </div>
                <div className="flex flex-col gap-5">
                    {formFieldsTwo.map((field, index) => (
                        <FormOne key={index} {...field} value={formValues[field.name] || (field.type === 'checkbox' ? [] : '')}
                            onChange={(e) =>
                            
                                handleFormValueChange(field.name, e.target.value || e.target.checked,e.target.files)}
                             />
                    ))}
                </div>
                <div className="col-span-2" >
                    {/* <RecurringComponent  /> */}
                    <RecurringComponent
                        recurringState={recurringState}
                        setRecurringState={handleRecurringStateChange}
                    />
                </div>
            </div>
            <div>
                <div className="flex flex-col items-center w-80 p-2 bg-primary-light rounded-lg">
                    <h5 className="font-semibold text-lg mb-4">Meeting Tags</h5>
                    {meetingTags.map((tag, index) => (
                        <div key={index} className="w-full flex flex-col items-center mb-4">
                            {/* Category Checkbox */}
                            <label className="flex items-center gap-2 mb-2">
                                <input type="checkbox" className="w-4 h-4" />
                                <span className="text-sm">{tag.category}</span>
                            </label>

                            {/* Sub-items inside the colored background */}
                            <div className="bg-primary-light3 p-4 rounded-md w-full flex flex-col items-center border border-gray-border">
                                <div
                                    className={
                                        index === 0
                                            ? "grid grid-cols-2 gap-2" // Two columns for the first category
                                            : "flex flex-col gap-2  w-full"    // Default layout for others
                                    }
                                >
                                    {tag.items.map((item, idx) => (
                                        <label key={idx} className="flex items-center gap-1">
                                            <input type="checkbox" className="w-4 h-4" />
                                            <span className="text-sm">{item}</span>
                                        </label>
                                    ))}
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
                <div className="flex w-full justify-between mt-4" >
                    <button className="p-2 px-4 rounded-md bg-primary-light border text-sm border-primary text-primary" onClick={() => createNewEvent("publish")}>Create and Publish</button>
                    <button className="p-2 px-4 rounded-md bg-primary text-white text-sm" onClick={() => createNewEvent("draft")}>Create in Drafts</button>
                </div>
            </div>

        </div>
    );
};

export default CreateEvents;
