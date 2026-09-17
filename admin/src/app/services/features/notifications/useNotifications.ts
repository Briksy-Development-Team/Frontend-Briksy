import { useEffect, useMemo, useRef, useState } from "react";
import { useAuth, useRoleAccess } from "../../../modules/auth";
import {
  deleteNotificationApi,
  fetchNotificationPreferencesApi,
  fetchNotificationsApi,
  fetchUnreadCountApi,
  markAllNotificationsReadApi,
  markNotificationReadApi,
  updateNotificationPreferencesApi,
} from "./notifications.api";
import type { NotificationPreference, PlatformNotification } from "./notifications.types";
import { useToast } from "../../ui/toast/ToastProvider";

type NotificationFilter = "all" | "unread" | "high";

export const useNotifications = () => {
  const { isSuperAdmin } = useRoleAccess();
  const { auth, currentUser } = useAuth();
  const toast = useToast();
  const scope = isSuperAdmin ? "super-admin" : "admin";
  const subscriptionStatus = currentUser?.subscription?.status ?? auth?.user?.subscription?.status;
  const subscriptionBlocked = !isSuperAdmin && Boolean(subscriptionStatus && !["active", "trialing"].includes(subscriptionStatus));

  const [items, setItems] = useState<PlatformNotification[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [preferences, setPreferences] = useState<NotificationPreference | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [filter, setFilter] = useState<NotificationFilter>("all");
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const [lastPage, setLastPage] = useState(1);
  const requestVersion = useRef(0);

  const load = async (nextFilter = filter, nextSearch = search, nextPage = page) => {
    if (subscriptionBlocked) {
      setItems([]);
      setUnreadCount(0);
      setPreferences(null);
      setError(null);
      return;
    }

    setLoading(true);
    setError(null);
    const version = ++requestVersion.current;

    try {
      const [notificationsRes, unreadRes, preferencesRes] = await Promise.all([
        fetchNotificationsApi(scope, {
          page: nextPage,
          per_page: 15,
          search: nextSearch || undefined,
          ...(nextFilter === "unread" ? { "filter.unread": true } : {}),
          ...(nextFilter === "high" ? { "filter.priority": "high" } : {}),
        }),
        fetchUnreadCountApi(scope),
        fetchNotificationPreferencesApi(scope),
      ]);

      if (version !== requestVersion.current) return;
      setItems(notificationsRes.items);
      setUnreadCount(unreadRes);
      setPreferences(preferencesRes);
      setTotal(notificationsRes.total);
      setLastPage(notificationsRes.lastPage);
    } catch (error_: unknown) {
      setError(error_ instanceof Error ? error_.message : "Failed to load notifications");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (subscriptionBlocked) {
      void load();
      return;
    }
    void load();
    const interval = window.setInterval(() => void fetchUnreadCountApi(scope).then(setUnreadCount).catch(() => undefined), 60000);
    return () => window.clearInterval(interval);
  }, [scope, subscriptionBlocked]);

  const refresh = () => void load(filter, search, page);

  const markRead = async (id: string) => {
    await markNotificationReadApi(scope, id);
    toast.success("Notification marked as read.");
    await load(filter, search, page);
  };

  const markAllRead = async () => {
    await markAllNotificationsReadApi(scope);
    toast.success("All notifications marked as read.");
    await load(filter, search, page);
  };

  const remove = async (id: string) => {
    await deleteNotificationApi(scope, id);
    toast.success("Notification deleted.");
    await load(filter, search, page);
  };

  const updatePreferences = async (payload: Partial<NotificationPreference>) => {
    const next = await updateNotificationPreferencesApi(scope, payload);
    setPreferences(next);
    toast.success("Notification preferences updated.");
    return next;
  };

  const filteredItems = useMemo(() => items, [items]);

  return {
    scope,
    items: filteredItems,
    unreadCount,
    preferences,
    loading,
    error,
    filter,
    search,
    page,
    total,
    lastPage,
    setFilter: (next: NotificationFilter) => {
      setFilter(next);
      void load(next, search, 1);
      setPage(1);
    },
    setSearch: (next: string) => {
      setSearch(next);
      void load(filter, next, 1);
      setPage(1);
    },
    setPage: (next: number) => {
      setPage(next);
      void load(filter, search, next);
    },
    refresh,
    markRead,
    markAllRead,
    remove,
    updatePreferences,
  };
};
