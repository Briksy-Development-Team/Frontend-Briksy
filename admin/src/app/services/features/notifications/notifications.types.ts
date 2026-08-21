export type NotificationPriority = "low" | "normal" | "high";

export type PlatformNotification = {
  id: string;
  type: string;
  title: string;
  message: string;
  entity_type?: string | null;
  entity_id?: string | null;
  action_url?: string | null;
  priority: NotificationPriority;
  actor_id?: string | null;
  organisation_id?: string | null;
  created_at?: string | null;
  read_at?: string | null;
};

export type NotificationPreference = {
  id: string;
  user_id: string;
  in_app_enabled: boolean;
  email_enabled: boolean;
  type_preferences: Record<string, boolean>;
  created_at?: string | null;
  updated_at?: string | null;
};
