import { useState } from "react";
import { useNotifications } from "./useNotifications";
import type { NotificationPreference } from "./notifications.types";

const NotificationPreferences = () => {
  const { preferences, updatePreferences, loading } = useNotifications();
  const [typeKey, setTypeKey] = useState("");
  const [typeValue, setTypeValue] = useState(true);

  const saveTypePreference = async () => {
    if (!preferences) {
      return;
    }

    await updatePreferences({
      type_preferences: {
        ...(preferences.type_preferences ?? {}),
        [typeKey]: typeValue,
      },
    } as Partial<NotificationPreference>);
    setTypeKey("");
    setTypeValue(true);
  };

  return (
    <div className="card border">
      <div className="card-body">
        <h4 className="fw-bold mb-4">Notification Preferences</h4>
        {loading && !preferences ? <div className="alert alert-light">Loading preferences...</div> : null}

        {preferences ? (
          <div className="d-flex flex-column gap-4">
            <div>
              <label className="form-label">In-app notifications</label>
              <select
                className="form-select form-select-solid"
                value={String(preferences.in_app_enabled)}
                onChange={(event) => void updatePreferences({ in_app_enabled: event.target.value === "true" })}
              >
                <option value="true">Enabled</option>
                <option value="false">Disabled</option>
              </select>
            </div>
            <div>
              <label className="form-label">Email notifications</label>
              <select
                className="form-select form-select-solid"
                value={String(preferences.email_enabled)}
                onChange={(event) => void updatePreferences({ email_enabled: event.target.value === "true" })}
              >
                <option value="true">Enabled</option>
                <option value="false">Disabled</option>
              </select>
            </div>

            <div className="border-top pt-4">
              <label className="form-label">Type preference override</label>
              <div className="row g-3">
                <div className="col-md-6">
                  <input
                    className="form-control form-control-solid"
                    value={typeKey}
                    onChange={(event) => setTypeKey(event.target.value)}
                    placeholder="e.g. property_created"
                  />
                </div>
                <div className="col-md-3">
                  <select
                    className="form-select form-select-solid"
                    value={String(typeValue)}
                    onChange={(event) => setTypeValue(event.target.value === "true")}
                  >
                    <option value="true">Enable</option>
                    <option value="false">Disable</option>
                  </select>
                </div>
                <div className="col-md-3">
                  <button type="button" className="btn btn-primary w-100" onClick={saveTypePreference} disabled={!typeKey}>
                    Save override
                  </button>
                </div>
              </div>
            </div>
          </div>
        ) : null}
      </div>
    </div>
  );
};

export { NotificationPreferences };
