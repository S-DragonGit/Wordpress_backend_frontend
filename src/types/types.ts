import { calendarEvents, calendarCategories } from "../app/list";

export type CalendarEvent = (typeof calendarEvents)[number];
export type CalendarCategory = (typeof calendarCategories)[number];

export interface GeoCategory {
  miles: number;
  dist_unit: string;
}

export interface NotificationTags {
  category: string;
  priority: string;
}

export type NotificationStatus = "draft" | "scheduled" | "sent";

// Main interface for the notification data
export interface NotificationFormData {
  user_id: number;
  // notification_id: number | null,
  notification_title: string;
  notification_description: string;
  notification_status: NotificationStatus;
  notification_send_to_all_users: boolean;
  notification_event_attendees: string[];
  notification_tags: NotificationTags;
  notification_link: string;
  notification_image: string;
  notification_how_to_send: string; // 0: simple, 1: scheduled, 2: geo-fenced
  notification_geo_category: GeoCategory | null;
  notification_geo_fence_expiration_date: string | null;
  notification_scheduled_time: string | null;
  notification_create_at: string | null;
  post_id: number | null;
}

export type EventStatus = "publish" | "draft";
export interface EventFormData {
  event_title: string;
  event_description: string;
  event_start_date: string | null;
  event_start_time: string | null;
  event_end_date: string | null;
  event_end_time: string | null;
  event_is_virtual: boolean;
  event_meeting_link: string;
  event_organizer: string;
  event_location: string;
  event_image: string;
  user_id: number | null;
  event_status: EventStatus;
  event_recurring: boolean;
  event_repeat_every: string;
  event_repeat_on: string;
  event_time: string | null;
  event_never: boolean;
  event_on: string;
  event_after: number;
  event_members: number[];
  event_modify_event: boolean;
  event_invite_others: boolean;
  event_view_member_list: boolean;
  event_category_slugs: string[];
  post_id: number | null;
}
