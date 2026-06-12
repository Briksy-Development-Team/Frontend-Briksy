export type SettingType = "string" | "number" | "boolean" | "json";

export type SettingItem = {
  id?: string;
  key: string;
  value: string;
  type: SettingType;
  group?: string | null;
  label?: string | null;
  is_public?: boolean;
};
