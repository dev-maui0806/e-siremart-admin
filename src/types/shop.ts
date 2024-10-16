export interface Department {
  name: string;
  head: string;
  facultyCount: number;
}

export interface Owner {
  first_name: string;
  last_name: string;
  email: string;
}

export interface Shop {
  _id: string;
  id?: string;
  name: string;
  email: string;
  approved: boolean;
  description: string;
  avatar?: string;
  ownerId?: string;
  owner: Owner;
  first_name: string;
  last_name: string;
  phone_number: string;
  createdAt?: string;
  updatedAt?: string;
  [key: string]: unknown;
}

// Define interfaces for nested objects
// interface Location {
//   type: string;
//   coordinates: number[];
// }

// interface Address {
//   street?: string;
//   city?: string;
//   state?: string;
//   postalCode?: string;
//   location?: Location;
// }

// interface SocialMedia {
//   facebook?: string;
//   twitter?: string;
//   instagram?: string;
// }

// export interface Shop {
//   _id: string;
//   id?: string;
//   name: string;
//   description?: string;
//   owner: string;
//   products: string[];
//   address?: Address;
//   socialMedia?: SocialMedia;
//   approved: boolean;
//   createdAt?: string;
//   updatedAt?: string;
//   [key: string]: unknown;
// }
