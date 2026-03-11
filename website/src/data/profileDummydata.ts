import { ProfileData } from "../types/profile.types";

export const profileData: ProfileData = {
  seeker: {
    id: 1,
    name: "Aryan Singh",
    email: "aryan.snh@gmail.com",
    phone: "+91 9876XXXX210",
    city: "Ahmedabad",
    joinedDate: "2024-12-10",
    avatar: "https://i.pravatar.cc/150?img=3",
  },

  stats: {
    favourites: 3,
    viewed: 3,
    scheduledVisits: 2,
    enquiries: 2,
  },

  favouriteProperties: [
    {
      id: 101,
      title: "Luxury Apartment",
      location: "Ahmedabad",
      price: "₹85,00,000",
      image: "https://picsum.photos/400/250?random=1",
    },
    {
      id: 102,
      title: "Modern Villa",
      location: "Surat",
      price: "₹1,20,00,000",
      image: "https://picsum.photos/400/250?random=2",
    },
    {
      id: 103,
      title: "Garden View Flat",
      location: "Vadodara",
      price: "₹65,00,000",
      image: "https://picsum.photos/400/250?random=3",
    },
  ],

  viewedProperties: [
    {
      id: 201,
      title: "Lakeview Apartment",
      location: "Udaipur",
      price: "₹90,00,000",
      image: "https://picsum.photos/400/250?random=4",
    },
    {
      id: 202,
      title: "City Center Flat",
      location: "Mumbai",
      price: "₹1,75,00,000",
      image: "https://picsum.photos/400/250?random=5",
    },
    {
      id: 203,
      title: "Premium Penthouse",
      location: "Pune",
      price: "₹2,10,00,000",
      image: "https://picsum.photos/400/250?random=6",
    },
  ],

  scheduledVisits: [
    {
      id: 301,
      propertyTitle: "Beachside Villa",
      location: "Goa",
      date: "2026-03-18",
      time: "11:30 AM",
    },
    {
      id: 302,
      propertyTitle: "Skyline Apartment",
      location: "Mumbai",
      date: "2026-03-21",
      time: "02:00 PM",
    },
  ],

  enquiries: [
    {
      id: 401,
      propertyTitle: "Luxury Duplex",
      location: "Delhi",
      date: "2026-03-10",
      message: "Interested in booking a site visit. Please share more details.",
    },
    {
      id: 402,
      propertyTitle: "Modern Smart Home",
      location: "Bangalore",
      date: "2026-03-12",
      message: "Can you provide the floor plan and payment options?",
    },
  ],
};
