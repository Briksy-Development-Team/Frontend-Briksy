export const mapSeeker = (item: any) => ({
  id: item.id,
  name: item.full_name,
  email: item.email_address,
  status: item.status,
  last_login: item.last_login,
  age: item.age,
  gender: item.gender,
  location: item.location,
});