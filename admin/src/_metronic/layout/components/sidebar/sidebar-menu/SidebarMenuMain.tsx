import { useEffect, useState } from "react";
import { useIntl } from "react-intl";
import {
  usePermissionAccess,
  useRoleAccess,
  useModuleAccess,
  useAuth,
} from "../../../../../app/modules/auth";
import { SidebarMenuItemWithSub } from "./SidebarMenuItemWithSub";
import { SidebarMenuItem } from "./SidebarMenuItem";
import { getRolePortalBaseRoute } from "../../../../../app/modules/auth/core/roleRoutes";
import axiosInstance from "../../../../../app/services/api/axiosInstance";

type MarketplaceLink = { title: string; to: string };
type MarketplaceCategory = { title: string; icon: string; children: MarketplaceLink[] };

const buildMarketplaceMenu = ({
  portalBase,
  agentTypes,
  canViewProperties,
  canViewCompanies,
  canViewServices,
  canViewBuilderProjects,
}: {
  portalBase: string;
  agentTypes: Array<{ slug: string; label?: string; name: string }>;
  canViewProperties: boolean;
  canViewCompanies: boolean;
  canViewServices: boolean;
  canViewBuilderProjects: boolean;
}): MarketplaceCategory[] => {
  const org = (slug: string) => `${portalBase}/companies/organization/${slug}`;
  const categories: MarketplaceCategory[] = [];

  if (canViewProperties) {
    categories.push({
      title: "Property Management",
      icon: "/media/icons/duotune/iconsnew/prom.svg",
      children: [
        { title: "Properties", to: `${portalBase}/property-management` },
        { title: "Property Approvals", to: `${portalBase}/property-management?approvals=1` },
        { title: "Property Map", to: `${portalBase}/property-map` },
        { title: "Property Amenities", to: `${portalBase}/property-amenities` },
        ...(canViewCompanies ? [{ title: "Real Estate Agencies", to: org("real-estate") }] : []),
      ],
    });
  }

  if (canViewCompanies) {
    const agentLinks: MarketplaceLink[] = [
      { title: "Buyer Agents", to: org("buyers-agent") },
      { title: "Real Estate Agents", to: org("real-estate-agent") },
      ...agentTypes
        .filter((type) => !["buyers-agent", "real-estate-agent"].includes(type.slug))
        .map((type) => ({ title: type.label || type.name, to: org(type.slug) })),
    ];
    categories.push({
      title: "Agents",
      icon: "/media/icons/duotune/iconsnew/org.svg",
      children: agentLinks,
    });
  }

  if (canViewCompanies || canViewBuilderProjects) {
    const children: MarketplaceLink[] = [];
    if (canViewCompanies) {
      children.push(
        { title: "Builders", to: org("builders") },
        { title: "Trades & Professionals", to: org("trades-professionals") },
      );
    }
    if (canViewBuilderProjects) {
      children.push({ title: "Builder Projects", to: `${portalBase}/builder-projects` });
    }
    categories.push({
      title: "Builders & Projects",
      icon: "/media/icons/duotune/iconsnew/builder.svg",
      children,
    });
  }

  if (canViewServices) {
    categories.push({
      title: "Services Management",
      icon: "/media/icons/duotune/iconsnew/service.svg",
      children: [
        { title: "Services", to: `${portalBase}/services` },
        { title: "Service Categories", to: `${portalBase}/service-categories` },
      ],
    });
  }

  if (canViewProperties) {
    categories.push({
      title: "Enquiries Management",
      icon: "/media/icons/duotune/iconsnew/proe.svg",
      children: [
        { title: "Property Enquiries", to: `${portalBase}/inquiry` },
        { title: "Auction Enquiries", to: `${portalBase}/auction-inquiries` },
      ],
    });
  }

  if (canViewServices) {
    categories.push({
      title: "Marketplace Configuration",
      icon: "/media/icons/duotune/iconsnew/setting.svg",
      children: [{ title: "Agent Types", to: `${portalBase}/agent-types` }],
    });
  }

  return categories;
};



const SidebarMenuMain = () => {
  const [agentTypes, setAgentTypes] = useState<Array<{ slug: string; label?: string; name: string }>>([]);
  const intl = useIntl();
  const { isSuperAdmin, isAdmin } = useRoleAccess();
  const { hasPermission } = usePermissionAccess();
  const { hasModule } = useModuleAccess();
  const { entitlements } = useAuth();
  const promoOffersEnabled = !isSuperAdmin && Boolean(entitlements?.features?.promo_offers?.enabled);
  const portalBase = getRolePortalBaseRoute(
    isSuperAdmin ? ["super_admin"] : isAdmin ? ["admin"] : [],
  );
  const marketplaceMenu = isSuperAdmin
    ? buildMarketplaceMenu({
        portalBase,
        agentTypes,
        canViewProperties: hasPermission("property.view"),
        canViewCompanies: hasPermission("company.view"),
        canViewServices: hasModule("service_management") && hasPermission("service.view"),
        canViewBuilderProjects: hasModule("builder_management") && hasPermission("project.view"),
      })
    : [];

  useEffect(() => {
    if (!isSuperAdmin) return;
    void axiosInstance.get<{ data: Array<{ slug: string; label?: string; name: string }> }>("/super-admin/organization-types", {
      params: { per_page: 100, "filter[module]": "Agents", "filter[is_active]": 1, sort: "sort_order", direction: "asc" },
    }).then((response) => setAgentTypes(response.data.data ?? [])).catch(() => undefined);
  }, [isSuperAdmin]);

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

      {isSuperAdmin && (
        <>
          {marketplaceMenu.length > 0 && (
            <SidebarMenuItemWithSub
              to={`${portalBase}/property-management`}
              title="Marketplace Management"
              fontIcon="bi-shop"
              icon="/media/icons/duotune/iconsnew/prom.svg"
              activePaths={marketplaceMenu.flatMap((category) => category.children.map((item) => item.to))}
            >
              {marketplaceMenu.map((category) => (
                <SidebarMenuItemWithSub
                  key={category.title}
                  to={category.children[0].to}
                  title={category.title}
                  icon={category.icon}
                  activePaths={category.children.map((item) => item.to)}
                >
                  {category.children.map((item) => (
                    <SidebarMenuItem
                      key={`${item.title}:${item.to}`}
                      to={item.to}
                      icon="/media/icons/duotune/iconsnew/arrowside.svg"
                      title={item.title}
                      fontIcon="bi-layers"
                      activeSearchParams={item.title === "Property Approvals" ? { approvals: "1" } : undefined}
                      excludeSearchParams={item.title === "Properties" ? { approvals: "1" } : undefined}
                    />
                  ))}
                </SidebarMenuItemWithSub>
              ))}
            </SidebarMenuItemWithSub>
          )}

          {(hasPermission("user.view") || hasPermission("company.view")) && (
            <SidebarMenuItemWithSub to={`${portalBase}/endusers`} title="User Management" fontIcon="bi-people" icon="/media/icons/duotune/iconsnew/user.svg" activePaths={[`${portalBase}/staff`, `${portalBase}/companies`]}>
              {hasPermission("user.view") && <>
                <SidebarMenuItem to={`${portalBase}/endusers`} icon="/media/icons/duotune/iconsnew/arrowside.svg" title="End Users" fontIcon="bi-layers" />
                <SidebarMenuItem to={`${portalBase}/staff`} icon="/media/icons/duotune/iconsnew/arrowside.svg" title="Platform Staff" fontIcon="bi-layers" />
              </>}
              {hasPermission("company.view") && <SidebarMenuItem to={`${portalBase}/companies`} icon="/media/icons/duotune/iconsnew/arrowside.svg" title="Organisations" fontIcon="bi-layers" />}
            </SidebarMenuItemWithSub>
          )}

          {(hasPermission("addon.view") || hasPermission("plan.view") || hasPermission("subscription.view") || hasPermission("plan_request.view") || hasPermission("coupon.view") || hasPermission("referral.view") || hasPermission("order.view")) && (
            <SidebarMenuItemWithSub to={`${portalBase}/plans`} title="Billing & Commercial" fontIcon="bi-credit-card" icon="/media/icons/duotune/iconsnew/bill.svg" activePaths={[`${portalBase}/addons`, `${portalBase}/subscriptions`, `${portalBase}/invoices`, `${portalBase}/orders`, `${portalBase}/plan-requests`, `${portalBase}/pricing-inquiries`, `${portalBase}/coupons`, `${portalBase}/referral-programs`, `${portalBase}/property-offers`, `${portalBase}/service-offers`]}>
              {hasPermission("addon.view") && <SidebarMenuItem to={`${portalBase}/addons`} icon="/media/icons/duotune/iconsnew/arrowside.svg" title="Add-ons" fontIcon="bi-layers" />}
              {hasPermission("plan.view") && <>
                <SidebarMenuItem to={`${portalBase}/plans`} icon="/media/icons/duotune/iconsnew/arrowside.svg" title="Plans" fontIcon="bi-layers" />
                <SidebarMenuItem to={`${portalBase}/pricing-inquiries`} icon="/media/icons/duotune/iconsnew/arrowside.svg" title="Pricing Inquiries" fontIcon="bi-layers" />
              </>}
              {hasPermission("subscription.view") && <SidebarMenuItem to={`${portalBase}/subscriptions`} icon="/media/icons/duotune/iconsnew/arrowside.svg" title="Subscriptions" fontIcon="bi-layers" />}
              <SidebarMenuItem to={`${portalBase}/invoices`} icon="/media/icons/duotune/iconsnew/arrowside.svg" title="Invoices" fontIcon="bi-layers" />
              {hasPermission("order.view") && <SidebarMenuItem to={`${portalBase}/orders`} icon="/media/icons/duotune/iconsnew/arrowside.svg" title="Orders" fontIcon="bi-layers" />}
              {hasPermission("plan_request.view") && <SidebarMenuItem to={`${portalBase}/plan-requests`} icon="/media/icons/duotune/iconsnew/arrowside.svg" title="Plan Requests" fontIcon="bi-layers" />}
              {hasPermission("coupon.view") && <SidebarMenuItem to={`${portalBase}/coupons`} icon="/media/icons/duotune/iconsnew/arrowside.svg" title="Coupons" fontIcon="bi-layers" />}
              {hasPermission("referral.view") && <SidebarMenuItem to={`${portalBase}/referral-programs`} icon="/media/icons/duotune/iconsnew/arrowside.svg" title="Referral Programs" fontIcon="bi-layers" />}
              <SidebarMenuItem to={`${portalBase}/property-offers`} icon="/media/icons/duotune/iconsnew/arrowside.svg" title="Property Offers" fontIcon="bi-layers" />
              <SidebarMenuItem to={`${portalBase}/service-offers`} icon="/media/icons/duotune/iconsnew/arrowside.svg" title="Service Offers" fontIcon="bi-layers" />
            </SidebarMenuItemWithSub>
          )}

          {hasPermission("permission.view") && (
            <SidebarMenuItemWithSub to={`${portalBase}/permissions`} title="Trust & Compliance" fontIcon="bi-shield-check" icon="/media/icons/duotune/iconsnew/permission.svg">
              {hasPermission("permission.view") && <SidebarMenuItem to={`${portalBase}/permissions`} icon="/media/icons/duotune/iconsnew/arrowside.svg" title="Permissions" fontIcon="bi-layers" />}
            </SidebarMenuItemWithSub>
          )}

          {(hasPermission("email_template.view") || hasPermission("settings.view")) && (
            <SidebarMenuItemWithSub to={`${portalBase}/email-templates`} title="Communications" fontIcon="bi-envelope" icon="/media/icons/duotune/iconsnew/com.svg" activePaths={[`${portalBase}/notifications`]}>
              {hasPermission("email_template.view") && <SidebarMenuItem to={`${portalBase}/email-templates`} icon="/media/icons/duotune/iconsnew/arrowside.svg" title="Email Templates" fontIcon="bi-layers" />}
              {hasPermission("settings.view") && <SidebarMenuItem to={`${portalBase}/notifications`} icon="/media/icons/duotune/iconsnew/arrowside.svg" title="Notifications" fontIcon="bi-layers" />}
            </SidebarMenuItemWithSub>
          )}

          {hasPermission("activity_logs.view") && <SidebarMenuItemWithSub to={`${portalBase}/activity-logs`} title="Reports & Analytics" fontIcon="bi-graph-up" icon="/media/icons/duotune/iconsnew/act.svg">
            <SidebarMenuItem to={`${portalBase}/activity-logs`} icon="/media/icons/duotune/iconsnew/arrowside.svg" title="Activity Logs" fontIcon="bi-layers" />
          </SidebarMenuItemWithSub>}

          {hasPermission("settings.view") && <SidebarMenuItemWithSub to={`${portalBase}/settings`} title="Settings" fontIcon="bi-gear" icon="/media/icons/duotune/iconsnew/setting.svg" activePaths={[`${portalBase}/dynamic-id-settings`]}>
            <SidebarMenuItem to={`${portalBase}/settings`} icon="/media/icons/duotune/iconsnew/arrowside.svg" title="Platform Settings" fontIcon="bi-layers" />
            <SidebarMenuItem to={`${portalBase}/dynamic-id-settings`} icon="/media/icons/duotune/iconsnew/arrowside.svg" title="Dynamic ID Settings" fontIcon="bi-layers" />
          </SidebarMenuItemWithSub>}
        </>
      )}

      {isAdmin && (
        <>
          {hasModule("inquiry_management") && (
            <SidebarMenuItem
              to={`${portalBase}/inquiry`}
              title="Enquiries"
              fontIcon="bi-archive"
              icon="/media/icons/duotune/iconsnew/proe.svg"
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
          {hasModule("builder_management") && hasPermission("project.view") && (
            <SidebarMenuItem
              to={`${portalBase}/builder-projects`}
              title="Builder Projects"
              fontIcon="bi-building"
              icon="/media/icons/duotune/iconsnew/builder.svg"
            />
          )}
          {(hasModule("property_management") || hasModule("builder_management")) && hasPermission("property.view") && (
            <>
              <SidebarMenuItem
                to={`${portalBase}/property-management`}
                title="Property Management"
                fontIcon="bi-archive"
                icon="/media/icons/duotune/iconsnew/prom.svg"
              />
              <SidebarMenuItem
                to={`${portalBase}/property-offers`}
                title="Property Offers"
                fontIcon="bi-archive"
                icon="/media/icons/duotune/iconsnew/proo.svg"
              />
            </>
          )}
          {isSuperAdmin && hasPermission("property.view") && (
            <SidebarMenuItem to={`${portalBase}/property-amenities`} title="Property Amenities" fontIcon="bi-tags" icon="/media/icons/duotune/iconsnew/prom.svg" />
          )}

          {hasModule("service_management") && hasPermission("service.view") && (
            <>
              <SidebarMenuItem
                to={`${portalBase}/services`}
                title="Services Management"
                fontIcon="bi-archive"
                icon="/media/icons/duotune/iconsnew/service.svg"
              />
              {promoOffersEnabled && (
                <SidebarMenuItem
                  to={`${portalBase}/service-offers`}
                  title="Service Offers"
                  fontIcon="bi-archive"
                  icon="/media/icons/duotune/iconsnew/proo.svg"
                />
              )}
            </>
          )}
          {hasModule("buyer_management") && (
            <SidebarMenuItemWithSub
              to={`${portalBase}/buyer-briefs`}
              title="Buyer Management"
              fontIcon="bi-people"
              icon="/media/icons/duotune/iconsnew/"
              activePaths={[`${portalBase}/buyer-briefs`]}>
              <SidebarMenuItem to={`${portalBase}/buyer-briefs`} excludePaths={[`${portalBase}/buyer-briefs/profile`]} icon="/media/icons/duotune/iconsnew/arrowside.svg" title="Buyer Briefs" fontIcon="bi-layers" />
              <SidebarMenuItem exact to={`${portalBase}/buyer-briefs/profile`} icon="/media/icons/duotune/iconsnew/arrowside.svg" title="Agency Profile" fontIcon="bi-layers" />
            </SidebarMenuItemWithSub>
          )}
          <SidebarMenuItem
            to={`${portalBase}/billing`}
            title="Pricing Plans"
            fontIcon="bi-credit-card"
            icon="/media/icons/duotune/finance/fin002.svg"
          />

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
              icon="/media/icons/duotune/iconsnew/act.svg"
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
