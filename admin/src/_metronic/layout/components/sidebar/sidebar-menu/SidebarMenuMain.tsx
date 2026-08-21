import { useIntl } from "react-intl";
import {
  usePermissionAccess,
  useRoleAccess,
  useModuleAccess,
} from "../../../../../app/modules/auth";
import { SidebarMenuItemWithSub } from "./SidebarMenuItemWithSub";
import { SidebarMenuItem } from "./SidebarMenuItem";
import { getRolePortalBaseRoute } from "../../../../../app/modules/auth/core/roleRoutes";

const SidebarMenuMain = () => {
  const intl = useIntl();
  const { isSuperAdmin, isAdmin } = useRoleAccess();
  const { hasPermission } = usePermissionAccess();
  const { hasModule } = useModuleAccess();
  const portalBase = getRolePortalBaseRoute(
    isSuperAdmin ? ["super_admin"] : isAdmin ? ["admin"] : [],
  );

  return (
    <>
      {hasPermission("dashboard.view") && (
        <SidebarMenuItem
          to={`${portalBase}/dashboard`}
          icon="element-11"
          title={intl.formatMessage({ id: "MENU.DASHBOARD" })}
          fontIcon="bi-app-indicator"
        />
      )}

      {isSuperAdmin && hasPermission("user.view") && (
        <>
          <SidebarMenuItemWithSub
            to={`${portalBase}/users`}
            title="User Management"
            fontIcon="bi-archive"
            icon="element-plus"
            activePaths={[`${portalBase}/endusers`]}
          >
            <SidebarMenuItem
              to={`${portalBase}/endusers`}
              icon="abstract-28"
              title="End Users"
              fontIcon="bi-layers"
            />
          </SidebarMenuItemWithSub>

          <SidebarMenuItemWithSub
            to={`${portalBase}/superadmin-staff-menu`}
            title="Superadmin Staff"
            fontIcon="bi-shield-check"
            icon="element-plus"
            activePaths={[`${portalBase}/staff`]}
          >
            <SidebarMenuItem
              to={`${portalBase}/staff`}
              icon="abstract-28"
              title="Platform Staff"
              fontIcon="bi-layers"
            />
          </SidebarMenuItemWithSub>
        </>
      )}

      {isSuperAdmin && hasPermission("company.view") && (
        <SidebarMenuItemWithSub
          to={`${portalBase}/companies`}
          title="Organisations"
          fontIcon="bi-archive"
          icon="element-plus"
          activePaths={[`${portalBase}/companies/sole-traders`]}
        >
          <SidebarMenuItem
            to={`${portalBase}/companies`}
            icon="abstract-28"
            title="Organisations"
            fontIcon="bi-layers"
            excludePaths={[`${portalBase}/companies/sole-traders`]}
          />
          <SidebarMenuItem
            to={`${portalBase}/companies/sole-traders`}
            icon="abstract-28"
            title="Sole traders"
            fontIcon="bi-layers"
          />
        </SidebarMenuItemWithSub>
      )}

      {isSuperAdmin && (
        <>
          {(hasPermission("addon.view") ||
            hasPermission("plan.view") ||
            hasPermission("subscription.view")) && (
            <SidebarMenuItemWithSub
              to={`${portalBase}/addons`}
              title="Billing & IDs"
              fontIcon="bi-archive"
              icon="element-plus"
              activePaths={[
                `${portalBase}/addons`,
                `${portalBase}/plans`,
                `${portalBase}/invoices`,
                `${portalBase}/subscriptions`,
              ]}
            >
              {hasPermission("addon.view") && (
                <SidebarMenuItem
                  to={`${portalBase}/addons`}
                  icon="abstract-28"
                  title="Add-ons"
                  fontIcon="bi-layers"
                />
              )}

              {hasPermission("plan.view") && (
                <SidebarMenuItem
                  to={`${portalBase}/plans`}
                  icon="abstract-28"
                  title="Plans"
                  fontIcon="bi-layers"
                />
              )}

              {hasPermission("subscription.view") && (
                <SidebarMenuItem
                  to={`${portalBase}/subscriptions`}
                  icon="abstract-28"
                  title="Subscriptions"
                  fontIcon="bi-layers"
                />
              )}

              <SidebarMenuItem
                to={`${portalBase}/invoices`}
                icon="abstract-28"
                title="Invoices"
                fontIcon="bi-layers"
              />
            </SidebarMenuItemWithSub>
          )}

          {isSuperAdmin && (
            <SidebarMenuItem
              to={`${portalBase}/property-map`}
              title="Property Map"
              fontIcon="bi-archive"
              icon="element-plus"
            />
          )}

          {(hasPermission("email_template.view") || hasPermission("activity_logs.view")) && (
            <SidebarMenuItemWithSub
              to={`${portalBase}/email-templates`}
              title="Communications"
              fontIcon="bi-archive"
              icon="element-plus"
              activePaths={[`${portalBase}/activity-logs`]}
            >
              {hasPermission("email_template.view") && (
                <SidebarMenuItem
                  to={`${portalBase}/email-templates`}
                  icon="abstract-28"
                  title="Email Templates"
                  fontIcon="bi-layers"
                />
              )}

              {hasPermission("activity_logs.view") && (
                <SidebarMenuItem
                  to={`${portalBase}/activity-logs`}
                  icon="clock"
                  title="Activity Logs"
                  fontIcon="bi-layers"
                />
              )}
            </SidebarMenuItemWithSub>
          )}

          {hasPermission("plan_request.view") && (
            <SidebarMenuItem
              to={`${portalBase}/plan-requests`}
              title="Plan Requests"
              fontIcon="bi-archive"
              icon="element-plus"
            />
          )}

          {hasPermission("referral.view") && (
            <SidebarMenuItem
              to={`${portalBase}/referral-programs`}
              title="Referral Programs"
              fontIcon="bi-archive"
              icon="element-plus"
            />
          )}

          {hasPermission("coupon.view") && (
            <SidebarMenuItem
              to={`${portalBase}/coupons`}
              title="Coupons"
              fontIcon="bi-archive"
              icon="element-plus"
            />
          )}

          {hasModule("service_management") && (
            <SidebarMenuItem
              to={`${portalBase}/services`}
              title="Services Management"
              fontIcon="bi-archive"
              icon="element-plus"
            />
          )}

          {hasPermission("permission.view") && (
            <SidebarMenuItem
              to={`${portalBase}/permissions`}
              title="Permissions"
              fontIcon="bi-archive"
              icon="element-plus"
            />
          )}
        </>
      )}

      {isAdmin && (
        <>
          {hasPermission("company.view") && (
            <SidebarMenuItem
              to={`${portalBase}/businesses`}
              title="Business Details"
              fontIcon="bi-archive"
              icon="element-plus"
            />
          )}

          {hasModule("property_management") && (
            <>
              <SidebarMenuItem
                to={`${portalBase}/property-management`}
                title="Property Management"
                fontIcon="bi-archive"
                icon="element-plus"
              />
              <SidebarMenuItem
                to={`${portalBase}/property-offers`}
                title="Property Offers"
                fontIcon="bi-archive"
                icon="element-plus"
              />
            </>
          )}

          {hasModule("service_management") && (
            <SidebarMenuItem
              to={`${portalBase}/services`}
              title="Services Management"
              fontIcon="bi-archive"
              icon="element-plus"
            />
          )}

          {hasPermission("user.view") && (
            <SidebarMenuItem
              to={`${portalBase}/users`}
              title="User Management"
              fontIcon="bi-archive"
              icon="element-plus"
            />
          )}

          {hasPermission("referral.view") && (
            <SidebarMenuItem
              to={`${portalBase}/referrals`}
              title="Referrals"
              fontIcon="bi-archive"
              icon="element-plus"
            />
          )}

          {hasModule("inquiry_management") && (
            <SidebarMenuItem
              to={`${portalBase}/inquiry`}
              title="Inquirys Management"
              fontIcon="bi-archive"
              icon="element-plus"
            />
          )}

          {hasPermission("activity_logs.view") && (
            <SidebarMenuItem
              to={`${portalBase}/activity-logs`}
              title="Activity Logs"
              fontIcon="bi-archive"
              icon="clock"
            />
          )}
        </>
      )}

      {(isSuperAdmin || isAdmin) && hasPermission("settings.view") && (
        <>
          <SidebarMenuItem
            to={`${portalBase}/notifications`}
            title="Notifications"
            fontIcon="bi-bell"
            icon="notification-bing"
          />
          <SidebarMenuItem
            to={`${portalBase}/settings`}
            title="Settings"
            fontIcon="bi-archive"
            icon="element-plus"
          />
          {isAdmin && hasPermission("webhook.view") && (
            <SidebarMenuItem
              to={`${portalBase}/webhooks`}
              title="Webhooks"
              fontIcon="bi-archive"
              icon="diagram-3"
            />
          )}
        </>
      )}
    </>
  );
};

export { SidebarMenuMain };
