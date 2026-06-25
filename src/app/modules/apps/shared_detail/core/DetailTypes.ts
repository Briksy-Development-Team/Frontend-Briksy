import type { ReactNode } from "react";
import type { QueryParams, Column, RowAction } from "../../shared_table/entity-list/EntityList";

export type SectionType = "info" | "table" | "timeline" | "emails" | "gallery" | "map" | "notes" | "custom";

// Base config for all sections
export interface BaseSectionConfig {
  id: string;
  title: string;
  type: SectionType;
  gridColumnSpan?: number; // e.g. 6 or 12 for half/full width
}

// Config for "info" sections (Key-Value cards)
export interface InfoSectionConfig<T> extends BaseSectionConfig {
  type: "info";
  fields: Array<{
    label: string;
    accessor: Extract<keyof T, string> | ((data: T) => ReactNode);
    colSpan?: number; // For layout inside the card
  }>;
}

// Config for "table" sections (Embedded dynamic tables)
export interface TableSectionConfig<T> extends BaseSectionConfig {
  type: "table";
  // The fetch function for the related table
  fetchFn: (params: QueryParams) => void;
  // Selector to get data and total from Redux store
  dataSelector: (state: any) => any[];
  totalSelector: (state: any) => number;
  columns: Column<any>[];
  filtersConfig?: any;
  enableRowClick?: boolean;
  getRowLink?: (row: any) => string;
  rowActions?: RowAction<any>[];
}

// Config for "timeline" sections
export interface TimelineSectionConfig extends BaseSectionConfig {
  type: "timeline";
  // API specific things will go here later
}

// Config for "emails" sections
export interface EmailsSectionConfig extends BaseSectionConfig {
  type: "emails";
}

// Config for "gallery" sections
export interface GallerySectionConfig<T> extends BaseSectionConfig {
  type: "gallery";
  imagesAccessor: Extract<keyof T, string> | ((data: T) => string[]);
}

// Config for "map" sections
export interface MapSectionConfig<T> extends BaseSectionConfig {
  type: "map";
  latAccessor: Extract<keyof T, string> | ((data: T) => number);
  lngAccessor: Extract<keyof T, string> | ((data: T) => number);
}

// Config for "notes" sections
export interface NotesSectionConfig extends BaseSectionConfig {
  type: "notes";
}

// Config for "custom" sections
export interface CustomSectionConfig<T> extends BaseSectionConfig {
  type: "custom";
  component: (props: { data: T }) => ReactNode;
}

export type SectionConfig<T> =
  | InfoSectionConfig<T>
  | TableSectionConfig<T>
  | TimelineSectionConfig
  | EmailsSectionConfig
  | GallerySectionConfig<T>
  | MapSectionConfig<T>
  | NotesSectionConfig
  | CustomSectionConfig<T>;

export type DetailConfig<T> = {
  header: {
    titleAccessor: Extract<keyof T, string> | ((data: T) => ReactNode);
    subtitleAccessor?: Extract<keyof T, string> | ((data: T) => ReactNode);
    avatarAccessor?: Extract<keyof T, string> | ((data: T) => string | undefined);
    badges?: Array<{
      label: Extract<keyof T, string> | ((data: T) => string);
      color: "primary" | "success" | "warning" | "danger" | "info" | ((data: T) => string);
      showIf?: (data: T) => boolean;
    }>;
    metrics?: Array<{
      label: string;
      valueAccessor: Extract<keyof T, string> | ((data: T) => ReactNode);
    }>;
  };
  tabs: Array<{
    id: string;
    label: string;
    sections: string[]; // Section IDs mapping
  }>;
  sections: SectionConfig<T>[];
};