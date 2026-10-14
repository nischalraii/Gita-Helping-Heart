export type AdminRole = {
    id: number;
    name: string;
    permissions_count?: number;
    users_count?: number;
};

export type AdminUser = {
    id: number;
    name: string;
    email: string;
    roles: { id: number; name: string }[];
};

export type Permission = {
    id: number;
    name: string;
    roles_count?: number;
};