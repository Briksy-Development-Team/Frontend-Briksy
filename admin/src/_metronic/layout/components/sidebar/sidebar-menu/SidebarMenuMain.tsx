import { useIntl } from "react-intl";
// import {KTIcon} from '../../../../helpers'
import { SidebarMenuItemWithSub } from "./SidebarMenuItemWithSub";
import { SidebarMenuItem } from "./SidebarMenuItem";
import { useAuth } from "../../../../../app/modules/auth";
import {
  canAccessDashboard,
  canManageBusinesses,
  canManageProperties,
  canManageSeekers,
  canManageServices,
  canManageStaff,
  canManageSubscriptions,
} from "../../../../../app/modules/auth/core/roleRoutes";

const SidebarMenuMain = () => {
  const intl = useIntl();
  const { currentUser } = useAuth();

  return (
    <>
      {canAccessDashboard(currentUser) && (
        <SidebarMenuItem
          to="/dashboard/home"
          icon="element-11"
          title={intl.formatMessage({ id: "MENU.DASHBOARD" })}
          fontIcon="bi-app-indicator"
        />
      )}
      {/* <SidebarMenuItem to='/builder' icon='switch' title='Layout Builder' fontIcon='bi-layers' /> */}
      <div className="menu-item">
        <div className="menu-content pt-8 pb-2">
          <span className="menu-section text-muted text-uppercase fs-8 ls-1">
            Crafted
          </span>
        </div>
      </div>
      <SidebarMenuItemWithSub
        to="/crafted/pages"
        title="Pages"
        fontIcon="bi-archive"
        icon="element-plus"
      >
        <SidebarMenuItemWithSub
          to="/crafted/pages/profile"
          title="Profile"
          hasBullet={true}
        >
          <SidebarMenuItem
            to="/crafted/pages/profile/overview"
            title="Overview"
            hasBullet={true}
          />
          <SidebarMenuItem
            to="/crafted/pages/profile/projects"
            title="Projects"
            hasBullet={true}
          />
          <SidebarMenuItem
            to="/crafted/pages/profile/campaigns"
            title="Campaigns"
            hasBullet={true}
          />
          <SidebarMenuItem
            to="/crafted/pages/profile/documents"
            title="Documents"
            hasBullet={true}
          />
          <SidebarMenuItem
            to="/crafted/pages/profile/connections"
            title="Connections"
            hasBullet={true}
          />
        </SidebarMenuItemWithSub>

        <SidebarMenuItemWithSub
          to="/crafted/pages/wizards"
          title="Wizards"
          hasBullet={true}
        >
          <SidebarMenuItem
            to="/crafted/pages/wizards/horizontal"
            title="Horizontal"
            hasBullet={true}
          />
          <SidebarMenuItem
            to="/crafted/pages/wizards/vertical"
            title="Vertical"
            hasBullet={true}
          />
        </SidebarMenuItemWithSub>
      </SidebarMenuItemWithSub>
      <SidebarMenuItemWithSub
        to="/crafted/accounts"
        title="Accounts"
        icon="profile-circle"
        fontIcon="bi-person"
      >
        <SidebarMenuItem
          to="/crafted/account/overview"
          title="Overview"
          hasBullet={true}
        />
        <SidebarMenuItem
          to="/crafted/account/settings"
          title="Settings"
          hasBullet={true}
        />
      </SidebarMenuItemWithSub>
      <SidebarMenuItemWithSub
        to="/error"
        title="Errors"
        fontIcon="bi-sticky"
        icon="cross-circle"
      >
        <SidebarMenuItem to="/error/404" title="Error 404" hasBullet={true} />
        <SidebarMenuItem to="/error/500" title="Error 500" hasBullet={true} />
      </SidebarMenuItemWithSub>
      <SidebarMenuItemWithSub
        to="/crafted/widgets"
        title="Widgets"
        icon="element-7"
        fontIcon="bi-layers"
      >
        <SidebarMenuItem
          to="/crafted/widgets/lists"
          title="Lists"
          hasBullet={true}
        />
        <SidebarMenuItem
          to="/crafted/widgets/statistics"
          title="Statistics"
          hasBullet={true}
        />
        <SidebarMenuItem
          to="/crafted/widgets/charts"
          title="Charts"
          hasBullet={true}
        />
        <SidebarMenuItem
          to="/crafted/widgets/mixed"
          title="Mixed"
          hasBullet={true}
        />
        <SidebarMenuItem
          to="/crafted/widgets/tables"
          title="Tables"
          hasBullet={true}
        />
        <SidebarMenuItem
          to="/crafted/widgets/feeds"
          title="Feeds"
          hasBullet={true}
        />
      </SidebarMenuItemWithSub>
      <div className="menu-item">
        <div className="menu-content pt-8 pb-2">
          <span className="menu-section text-muted text-uppercase fs-8 ls-1">
            Apps
          </span>
        </div>
      </div>

      {(canManageSeekers(currentUser) || canManageStaff(currentUser) || canManageBusinesses(currentUser)) && (
        <SidebarMenuItemWithSub
          to="/crafted/widgets"
          title=" User Management"
          icon="element-7"
          fontIcon="bi-layers"
        >
          {canManageSeekers(currentUser) && (
            <SidebarMenuItem
              to="/apps/seeker-management/seeker"
              icon="abstract-28"
              title="Seekers"
              fontIcon="bi-layers"
            />
          )}

          {canManageStaff(currentUser) && (
            <SidebarMenuItem
              to="/apps/staff-management/staff"
              icon="abstract-28"
              title="Staff "
              fontIcon="bi-layers"
            />
          )}
          {canManageBusinesses(currentUser) && (
            <SidebarMenuItem
              to="/apps/business-management/agencies"
              icon="abstract-28"
              title="Service Provider"
              fontIcon="bi-layers"
            />
          )}
        </SidebarMenuItemWithSub>
      )}
      {canManageProperties(currentUser) && (
        <SidebarMenuItemWithSub
          to="/crafted/widgets"
          title=" Property Management"
          icon="element-7"
          fontIcon="bi-layers"
        >
          <SidebarMenuItem
            to="/apps/property-management/listing"
            icon="abstract-28"
            title="Property Listing"
            fontIcon="bi-layers"
          />

          <SidebarMenuItem
            to="/apps/property-management/features"
            icon="abstract-28"
            title="Property Features "
            fontIcon="bi-layers"
          />

        </SidebarMenuItemWithSub>
      )}
      {canManageServices(currentUser) && (
        <SidebarMenuItemWithSub
          to="/crafted/widgets"
          title=" Service Management"
          icon="element-7"
          fontIcon="bi-layers"
        >
          <SidebarMenuItem
            to="/apps/service-management/group"
            icon="abstract-28"
            title="Service Group"
            fontIcon="bi-layers"
          />

          <SidebarMenuItem
            to="/apps/service-management/listing"
            icon="abstract-28"
            title="Service Features "
            fontIcon="bi-layers"
          />

        </SidebarMenuItemWithSub>
      )}

      {canManageSubscriptions(currentUser) && (
        <SidebarMenuItem
          to="/apps/subscription-plans"
          icon="abstract-28"
          title="Subscription Plans"
          fontIcon="bi-layers"
        />
      )}
    </>
  );
};

export { SidebarMenuMain };
