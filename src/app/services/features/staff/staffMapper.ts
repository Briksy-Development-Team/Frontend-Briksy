export const mapStaff = (item: any) => ({
  id: item.id,
  name: item.name,
  email: item.email,
  status: item.status || item.roles?.[0] || "",

  last_login: item.last_login,
  current_login: item.current_login,
  location: item.location,

  created_at: item.created_at,
  updated_at: item.updated_at,
});
