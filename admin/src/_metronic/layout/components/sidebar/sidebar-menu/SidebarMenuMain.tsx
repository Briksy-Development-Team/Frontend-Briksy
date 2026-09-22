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
          icon="/media/icons/duotune/general/gen025.svg"
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
            icon="/media/icons/duotune/iconsnew/user.svg"
            activePaths={[`${portalBase}/endusers`]}
          >
            <SidebarMenuItem
              to={`${portalBase}/endusers`}
              icon="/media/icons/duotune/iconsnew/arrowside.svg"
              title="End Users"
              fontIcon="bi-layers"
            />
          </SidebarMenuItemWithSub>

          <SidebarMenuItemWithSub
            to={`${portalBase}/superadmin-staff-menu`}
            title="Superadmin Staff"
            fontIcon="bi-shield-check"
            icon="/media/icons/duotune/iconsnew/superstaff.svg"
            activePaths={[`${portalBase}/staff`]}
          >
            <SidebarMenuItem
              to={`${portalBase}/staff`}
              icon="/media/icons/duotune/iconsnew/arrowside.svg"
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
          icon="/media/icons/duotune/iconsnew/org.svg"
          activePaths={[
            `${portalBase}/companies/organization/real-estate`,
            `${portalBase}/companies/organization/buyers-agent`,
            `${portalBase}/companies/organization/builders`,
            `${portalBase}/companies/organization/trades-professionals`,
          ]}
        >
          <SidebarMenuItem
            to={`${portalBase}/companies/organization/real-estate`}
            icon="/media/icons/duotune/iconsnew/arrowside.svg"
            title="Real Estate"
            fontIcon="bi-layers"
          />
          <SidebarMenuItem
            to={`${portalBase}/companies/organization/buyers-agent`}
            icon="/media/icons/duotune/iconsnew/arrowside.svg"
            title="Buyers Agent"
            fontIcon="bi-layers"
          />
          <SidebarMenuItem
            to={`${portalBase}/companies/organization/builders`}
            icon="/media/icons/duotune/iconsnew/arrowside.svg"
            title="Builders"
            fontIcon="bi-layers"
          />
          <SidebarMenuItem
            to={`${portalBase}/companies/organization/trades-professionals`}
            icon="/media/icons/duotune/iconsnew/arrowside.svg"

            title="Trades & Professionals"
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
                icon="/media/icons/duotune/iconsnew/bill.svg"
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
              icon="/media/icons/duotune/iconsnew/arrowside.svg"
                    title="Add-ons"
                    fontIcon="bi-layers"
                  />
                )}

                {hasPermission("plan.view") && (
                  <SidebarMenuItem
                    to={`${portalBase}/plans`}
              icon="/media/icons/duotune/iconsnew/arrowside.svg"
                    title="Plans"
                    fontIcon="bi-layers"
                  />
                )}

                {hasPermission("subscription.view") && (
                  <SidebarMenuItem
                    to={`${portalBase}/subscriptions`}
              icon="/media/icons/duotune/iconsnew/arrowside.svg"
                    title="Subscriptions"
                    fontIcon="bi-layers"
                  />
                )}

                <SidebarMenuItem
                  to={`${portalBase}/invoices`}
              icon="/media/icons/duotune/iconsnew/arrowside.svg"
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
              icon="/media/icons/duotune/maps/map002.svg"
            />
          )}

          {(hasPermission("email_template.view") || hasPermission("activity_logs.view")) && (
            <SidebarMenuItemWithSub
              to={`${portalBase}/email-templates`}
              title="Communications"
              fontIcon="bi-archive"
              icon="/media/icons/duotune/iconsnew/com.svg"
              activePaths={[`${portalBase}/activity-logs`]}
            >
              {hasPermission("email_template.view") && (
                <SidebarMenuItem
                  to={`${portalBase}/email-templates`}
              icon="/media/icons/duotune/iconsnew/arrowside.svg"

                  title="Email Templates"
                  fontIcon="bi-layers"
                />
              )}

              {hasPermission("activity_logs.view") && (
                <SidebarMenuItem
                  to={`${portalBase}/activity-logs`}
              icon="/media/icons/duotune/iconsnew/arrowside.svg"
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
              icon="/media/icons/duotune/iconsnew/plan.svg"
            />
          )}

          {hasPermission("referral.view") && (
            <SidebarMenuItem
              to={`${portalBase}/referral-programs`}
              title="Referral Programs"
              fontIcon="bi-archive"
              icon="/media/icons/duotune/iconsnew/ref.svg"
            />
          )}

          {hasPermission("coupon.view") && (
            <SidebarMenuItem
              to={`${portalBase}/coupons`}
              title="Coupons"
              fontIcon="bi-archive"
              icon="/media/icons/duotune/iconsnew/coupon.svg"
            />
          )}

          {hasModule("service_management") && hasPermission("service.view") && (
            <SidebarMenuItem
              to={`${portalBase}/services`}
              title="Services Management"
              fontIcon="bi-archive"
              icon="/media/icons/duotune/iconsnew/service.svg"
            />
          )}

          {hasPermission("permission.view") && (
            <SidebarMenuItem
              to={`${portalBase}/permissions`}
              title="Permissions"
              fontIcon="bi-archive"
              icon="/media/icons/duotune/iconsnew/permission.svg"
            />
          )}
        </>
      )}

      {isAdmin && (
        <>
          {hasModule("inquiry_management") && (
            <SidebarMenuItem
              to={`${portalBase}/inquiry`}
              title={hasModule("builder_management") ? "Enquiries" : hasModule("service_management") ? "Service Enquiries" : "Property Enquiries"}
              fontIcon="bi-archive"
              icon="/media/icons/duotune/iconsnew/"
            />
          )}

          {hasPermission("company.view") && (
            <SidebarMenuItem
              to={`${portalBase}/businesses`}
              title="Business Details"
              fontIcon="bi-archive"
              icon="/media/icons/duotune/iconsnew/"
            />
          )}

          {hasModule("property_management") && hasPermission("property.view") && (
            <>
              <SidebarMenuItem
                to={`${portalBase}/property-management`}
                title="Property Management"
                fontIcon="bi-archive"
                icon="/media/icons/duotune/iconsnew/"
              />
              <SidebarMenuItem
                to={`${portalBase}/property-offers`}
                title="Property Offers"
                fontIcon="bi-archive"
                icon="/media/icons/duotune/iconsnew/"
              />
            </>
          )}

          {hasModule("service_management") && hasPermission("service.view") && (
            <SidebarMenuItem
              to={`${portalBase}/services`}
              title="Services Management"
              fontIcon="bi-archive"
              icon="/media/icons/duotune/iconsnew/service.svg"
            />
          )}

          <SidebarMenuItem
            to={`${portalBase}/billing`}
            title="Pricing Plans"
            fontIcon="bi-credit-card"
            icon="/media/icons/duotune/finance/fin002.svg"
          />

          {hasModule("buyer_management") && (
            <SidebarMenuItem
              to={`${portalBase}/buyer-briefs`}
              title="Buyer Briefs"
              fontIcon="bi-people"
              icon="/media/icons/duotune/iconsnew/"
            />
          )}

          {hasModule("builder_management") && (
            <SidebarMenuItem
              to={`${portalBase}/builder-projects`}
              title="Builder Projects"
              fontIcon="bi-building"
              icon="/media/icons/duotune/iconsnew/"
            />
          )}

          {hasPermission("user.view") && (
            <SidebarMenuItem
              to={`${portalBase}/users`}
              title="Staff Management"
              fontIcon="bi-archive"
            icon="/media/icons/duotune/iconsnew/user.svg"
            />
          )}

          {hasPermission("referral.view") && (
            <SidebarMenuItem
              to={`${portalBase}/referrals`}
              title="Referrals"
              fontIcon="bi-archive"
              icon="/media/icons/duotune/iconsnew/ref.svg"
            />
          )}

          {hasPermission("activity_logs.view") && (
            <SidebarMenuItem
              to={`${portalBase}/activity-logs`}
              title="Activity Logs"
              fontIcon="bi-archive"
              icon="/media/icons/duotune/iconsnew/"
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
            icon="/media/icons/duotune/iconsnew/notification.svg"
          />
          <SidebarMenuItem
            to={`${portalBase}/settings`}
            title="Settings"
            fontIcon="bi-archive"
            icon="/media/icons/duotune/iconsnew/setting.svg"
          />
        </>
      )}
    </>
  );
};

export { SidebarMenuMain };
