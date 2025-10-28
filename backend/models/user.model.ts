import { ObjectId } from 'mongodb';

export interface User {
  _id?: ObjectId;
  email: string;
  password: string;
  name: string;
  countryCode?: string;
  phone?: string;
  phoneVerified?: boolean;
  addresses?: {
    id: string;
    label: string;
    street: string;
    city: string;
    state: string;
    zipCode: string;
    country: string;
    isDefault?: boolean;
  }[];
  createdAt: Date;
  updatedAt: Date;
}
