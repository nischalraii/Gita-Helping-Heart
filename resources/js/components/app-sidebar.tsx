import { Link, usePage } from '@inertiajs/react';
import { FolderKanban, Inbox, KeyRound, LayoutGrid, Lock, Settings, Target, Users } from 'lucide-react';
import AppLogo from '@/components/app-logo';
import { NavMain } from '@/components/nav-main';
import { NavUser } from '@/components/nav-user';
import {
    Sidebar,
    SidebarContent,
    SidebarFooter,
    SidebarHeader,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
} from '@/components/ui/sidebar';
import { dashboard } from '@/routes';
import { index as activitiesIndex } from '@/routes/admin/activities';
import { index as focusAreasIndex } from '@/routes/admin/focus-areas';
import { index as permissionsIndex } from '@/routes/admin/permissions';
import { index as rolesIndex } from '@/routes/admin/roles';
import { index as usersIndex } from '@/routes/admin/users';
import { index as enquiriesIndex } from '@/routes/enquiries';
import { edit as siteSettingsEdit } from '@/routes/site-settings';
import type { Auth } from '@/types/auth';
import type { NavItem } from '@/types';

export function AppSidebar() {
    const { auth } = usePage<{ auth: Auth }>().props;
    const isSuperAdmin = auth.roles.includes('Super Admin');
    const can = (permission: string) => auth.permissions.includes(permission);

    const mainNavItems: NavItem[] = [
        { title: 'Dashboard', href: dashboard(), icon: LayoutGrid },
        ...(can('manage activities') ? [{ title: 'Activities', href: activitiesIndex(), icon: FolderKanban }] : []),
        ...(can('manage focus areas') ? [{ title: 'Focus Areas', href: focusAreasIndex(), icon: Target }] : []),
        ...(can('manage enquiries') ? [{ title: 'Enquiries', href: enquiriesIndex(), icon: Inbox }] : []),
        ...(can('manage site settings') ? [{ title: 'Site Settings', href: siteSettingsEdit(), icon: Settings }] : []),
    ];

    const administrationNavItems: NavItem[] = isSuperAdmin
        ? [
              { title: 'Users', href: usersIndex(), icon: Users },
              { title: 'Roles', href: rolesIndex(), icon: KeyRound },
              { title: 'Permissions', href: permissionsIndex(), icon: Lock },
          ]
        : [];

    return (
        <Sidebar collapsible="icon" variant="inset">
            <SidebarHeader>
                <SidebarMenu>
                    <SidebarMenuItem>
                        <SidebarMenuButton size="lg" asChild>
                            <Link href={dashboard()} prefetch>
                                <AppLogo />
                            </Link>
                        </SidebarMenuButton>
                    </SidebarMenuItem>
                </SidebarMenu>
            </SidebarHeader>

            <SidebarContent>
                <NavMain items={mainNavItems} />

                {administrationNavItems.length > 0 && (
                    <NavMain items={administrationNavItems} label="Administration" />
                )}
            </SidebarContent>

            <SidebarFooter>
                <NavUser />
            </SidebarFooter>
        </Sidebar>
    );
}
