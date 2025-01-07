import { calendarEvents, calendarCategories } from "../app/list";

export type CalendarEvent = (typeof calendarEvents)[number]
export type CalendarCategory = (typeof calendarCategories)[number]