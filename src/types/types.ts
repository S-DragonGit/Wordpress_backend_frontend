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
  notification_id: number | null,
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


