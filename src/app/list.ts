import { FormOneProps } from "../components/FormOne";

const date = new Date();
const nextDay = new Date(new Date().getTime() + 24 * 60 * 60 * 1000);

export const eventPublished = [
  {
    Title: 'Healthy Heart Cardio Dance w/ Bonnie',
    Date: '2022-01-01',
    Category: 'Dance',
    EventDate: '2022-01-01',
    Type: 'In-person',
    Members: ["Bonnie", "John", "Doe"],
  },
  {
    Title: 'Healthy Heart Cardio Dance w/ Bonnie',
    Date: '2022-01-01',
    Category: 'Dance',
    EventDate: '2022-01-01',
    Type: 'In-person',
    Members: ["Bonnie", "John", "Doe"],
  },
  {
    Title: 'Healthy Heart Cardio Dance w/ Bonnie',
    Date: '2022-01-01',
    Category: 'Dance',
    EventDate: '2022-01-01',
    Type: 'In-person',
    Members: ["Bonnie", "John", "Doe"],
  },
  {
    Title: 'Healthy Heart Cardio Dance w/ Bonnie',
    Date: '2022-01-01',
    Category: 'Dance',
    EventDate: '2022-01-01',
    Type: 'In-person',
    Members: ["Bonnie", "John", "Doe"],
  },
  {
    Title: 'Healthy Heart Cardio Dance w/ Bonnie',
    Date: '2022-01-01',
    Category: 'Dance',
    EventDate: '2022-01-01',
    Type: 'In-person',
    Members: ["Bonnie", "John", "Doe"],
  },
  {
    Title: 'Healthy Heart Cardio Dance w/ Bonnie',
    Date: '2022-01-01',
    Category: 'Dance',
    EventDate: '2022-01-01',
    Type: 'In-person',
    Members: ["Bonnie", "John", "Doe"],
  },
  {
    Title: 'Healthy Heart Cardio Dance w/ Bonnie',
    Date: '2022-01-01',
    Category: 'Dance',
    EventDate: '2022-01-01',
    Type: 'In-person',
    Members: ["Bonnie", "John", "Doe"],
  },
  {
    Title: 'Healthy Heart Cardio Dance w/ Bonnie',
    Date: '2022-01-01',
    Category: 'Dance',
    EventDate: '2022-01-01',
    Type: 'In-person',
    Members: ["Bonnie", "John", "Doe"],
  },
  {
    Title: 'Healthy Heart Cardio Dance w/ Bonnie',
    Date: '2022-01-01',
    Category: 'Dance',
    EventDate: '2022-01-01',
    Type: 'In-person',
    Members: ["Bonnie", "John", "Doe"],
  },
]

const nextMonth = date.getMonth() === 11 ? new Date(date.getFullYear() + 1, 0, 1) : new Date(date.getFullYear(), date.getMonth() + 1, 1)

export const calendarEvents = [
  {
    id: "1",
    title: "All Day Event",
    start: date,
    end: nextDay,
    allDay: false,
    //className: "warning",
    extendedProps: {
      calendar: "business",
    },
  },
  {
    id: "2",
    title: "Meeting With Client",
    start: new Date(date.getFullYear(), date.getMonth() + 1, -11),
    end: new Date(date.getFullYear(), date.getMonth() + 1, -10),
    allDay: true,
    //className: "success",
    extendedProps: {
      calendar: "personal",
    },
  },
  {
    id: "3",
    title: "Lunch",
    allDay: true,
    start: new Date(date.getFullYear(), date.getMonth() + 1, -9),
    end: new Date(date.getFullYear(), date.getMonth() + 1, -7),
    // className: "info",
    extendedProps: {
      calendar: "family",
    },
  },
  {
    id: "4",
    title: "Birthday Party",
    start: new Date(date.getFullYear(), date.getMonth() + 1, -11),
    end: new Date(date.getFullYear(), date.getMonth() + 1, -10),
    allDay: true,
    //className: "primary",
    extendedProps: {
      calendar: "meeting",
    },
  },
  {
    id: "5",
    title: "Birthday Party",
    start: new Date(date.getFullYear(), date.getMonth() + 1, -13),
    end: new Date(date.getFullYear(), date.getMonth() + 1, -12),
    allDay: true,
    // className: "danger",
    extendedProps: {
      calendar: "holiday",
    },
  },
  {
    id: "6",
    title: "Monthly Meeting",
    start: nextMonth,
    end: nextMonth,
    allDay: true,
    //className: "primary",
    extendedProps: {
      calendar: "business",
    },
  },
];

export const calendarCategories = [
  {
    label: "Business",
    value: "business",
    activeClass: "ring-primary-500 bg-primary-500",
    className: "group-hover:border-blue-500",
  },
  {
    label: "Personal",
    value: "personal",
    activeClass: "ring-success-500 bg-success-500",
    className: " group-hover:border-green-500",
  },
  {
    label: "Holiday",
    value: "holiday",
    activeClass: "ring-danger-500 bg-danger-500",
    className: " group-hover:border-red-500",
  },
  {
    label: "Family",
    value: "family",
    activeClass: "ring-info-500 bg-info-500",
    className: " group-hover:border-cyan-500",
  },
  {
    label: "Meeting",
    value: "meeting",
    activeClass: "ring-warning-500 bg-warning-500",
    className: " group-hover:border-yellow-500",
  },
  {
    label: "Etc",
    value: "etc",
    activeClass: "ring-info-500 bg-info-500",
    className: " group-hover:border-cyan-500",
  }
];

export const formFields: FormOneProps[] = [
  { label: 'Event Title', type: 'text', name: 'event_title', isRequired: true },
  { label: 'Description', type: 'textarea', name: 'description' },
  { label: 'Event Date', type: 'text', name: 'event_date' },
  {
    label: 'Is this meeting virtual?',
    type: 'radio',
    name: 'is_virtual',
    options: [
      { label: 'Yes', value: 'yes', defaultChecked: true },
      { label: 'No', value: 'no' },
    ],
  },
  { label: 'Meeting Link', type: 'text', name: 'meeting_link' },
  { label: 'Event Location', type: 'text', name: 'event_location' },
];

export const formFieldsTwo: FormOneProps[] = [
  { label: 'Members', type: 'text', name: 'members', isRequired: true },
  {
    label: 'Member Permission',
    type: 'checkbox',
    name: 'permission',
    options: [
      { label: 'Modify event', value: 'Modify event', defaultChecked: true },
      { label: 'Invite others', value: 'Invite others' },
      { label: 'View members list', value: 'View members list' },
    ],
  },
];

export const formFieldsLogin: FormOneProps[] = [
  { label: 'Username', type: 'text', name: 'username', isRequired: true },
  { label: 'Password', type: 'password', name: 'password', isRequired: true },

];
export const formFieldNotification: FormOneProps[] = [
  { label: 'Audience', type: 'text', name: 'audience', isRequired: true },
  { label: 'Notification Title', type: 'text', name: 'title', isRequired: true },
  { label: 'Description', type: 'textarea', name: 'description', isRequired: true },
  { label: 'Link', type: 'text', name: 'link', isRequired: true },
  { label: 'File', type: 'file', name: 'file', isRequired: true },
  {
    label: 'Is this meeting virtual?',
    type: 'radio',
    name: 'meeting',
    options: [
      { label: 'Enabled', value: 'yes', defaultChecked: true },
      { label: 'Desabled', value: 'no' },
    ],
  },
];

interface Meetingtag {
  id: string
  label: string
  slug: string
}

interface MeetingTags {
  id: string
  label: string
  slug: string
  subcategories: Meetingtag[]
}
export const meetingTags: MeetingTags[] = [
  {
    id: "therapy",
    label: "Therapy",
    slug: "therapy",
    subcategories: [
      { id: "individual", label: "Individual", slug: "individual-therapy" },
      { id: "family", label: "Family", slug: "family-therapy" },
      { id: "trauma", label: "Trauma", slug: "trauma-therapy" },
      { id: "support-groups", label: "Support Groups", slug: "support-groups" },
      { id: "grief-counseling", label: "Grief Counseling", slug: "grief-counseling" },
      { id: "depression-anxiety", label: "Depression / Anxiety", slug: "depression-anxiety-therapy" },
    ],
  },
  {
    id: "health-screening",
    label: "Health Screening",
    slug: "health-screening",
    subcategories: [
      { id: "cancer-screening", label: "Cancer Screening", slug: "cancer-screening" },
      { id: "high-blood-pressure", label: "High Blood Pressure", slug: "high-blood-pressure-screening" },
      { id: "heart-disease", label: "Heart Disease", slug: "heart-disease-screening" },
      { id: "diabetes", label: "Diabetes/Blood Sugar", slug: "diabetes-screening" },
      { id: "vaccine", label: "Vaccine", slug: "vaccine" },
      { id: "stds", label: "STDs", slug: "std-screening" },
    ],
  },
  {
    id: "cam-clinic",
    label: "CAM Clinic",
    slug: "cam-clinic",
    subcategories: [
      { id: "acupuncture", label: "Acupuncture", slug: "acupuncture" },
      { id: "chiropractic", label: "Chiropractic Care", slug: "chiropractic-care" },
      { id: "massage", label: "Massage Therapy", slug: "massage-therapy" },
      { id: "yoga", label: "Yoga", slug: "yoga" },
    ],
  },
]
// export const meetingTags = [
//   {
//     category: "Therapy",
//     items: ["Individual", "Family", "Trauma", "Support Groups", "Grief Counseling", "Depression / Anxiety"],
//   },
//   {
//     category: "Health Screening",
//     items: ["Cancer Screening", "High Blood Pressure", "Heart Disease", "Diabetes/Blood Sugar", "Vaccine", "STDs"],
//   },
//   {
//     category: "CAM Clinic",
//     items: ["Acupuncture", "Chiropractic Care", "Massage Therapy", "Yoga"],
//   },
// ];