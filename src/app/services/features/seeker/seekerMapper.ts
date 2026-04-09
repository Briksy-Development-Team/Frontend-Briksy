export const mapSeeker = (item: any) => ({
  id: item.id,
  name: item.name,
  email: item.email,
  status: item.roles?.[0] || "", // backend gives roles[]
  created_at: item.created_at,
});
