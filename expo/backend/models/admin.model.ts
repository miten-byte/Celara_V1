import { ObjectId } from 'mongodb';

export interface Admin {
  _id?: ObjectId;
  email: string;
  password: string;
  name: string;
  role: 'admin' | 'super-admin';
  createdAt: Date;
  updatedAt: Date;
}
