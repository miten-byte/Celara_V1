# MongoDB & Admin Setup Guide

## Prerequisites

1. **MongoDB** - Install and run MongoDB locally or use MongoDB Atlas (cloud)

## Environment Variables

Create a `.env` file in the root directory with:

```env
MONGODB_URI=mongodb://localhost:27017/jewelry-store
JWT_SECRET=your-secret-key-change-in-production
```

For MongoDB Atlas, use:
```env
MONGODB_URI=mongodb+srv://<username>:<password>@<cluster>.mongodb.net/jewelry-store?retryWrites=true&w=majority
```

## Database Setup

### 1. Start MongoDB

**Local MongoDB:**
```bash
mongod
```

**MongoDB Atlas:**
- Create a free cluster at https://www.mongodb.com/cloud/atlas
- Get your connection string
- Update MONGODB_URI in .env

### 2. Seed the Database

Run the seed script to populate the database with sample jewelry products and create the default admin:

```bash
bun backend/scripts/seed.ts
```

This will:
- Create 12 sample jewelry products
- Create a default admin user with credentials:
  - **Email:** admin@jewelry.com
  - **Password:** admin123

## Admin Access

1. Start the app:
```bash
bun start
```

2. Navigate to the Admin Login page:
   - On mobile: Use the navigation or direct link
   - URL: `/admin/login`

3. Login with default credentials:
   - Email: `admin@jewelry.com`
   - Password: `admin123`

## Admin Dashboard Features

- **View Products:** See all products in the database
- **Add Products:** Create new jewelry items with:
  - Name
  - Price
  - Category
  - Description
  - Image URL
- **Delete Products:** Remove products from the catalog
- **Statistics:** View total products, inventory value, and average price

## API Endpoints (tRPC)

### Admin Routes
- `admin.login` - Admin authentication

### Product Routes
- `products.list` - Get all products (with filters)
- `products.get` - Get single product by ID
- `products.create` - Create new product (protected)
- `products.update` - Update product (protected)
- `products.delete` - Delete product (protected)

## Security Notes

1. **Change Default Credentials:** After first login, create new admin users
2. **Update JWT Secret:** Use a strong, random secret in production
3. **Use HTTPS:** Always use secure connections in production
4. **MongoDB Security:** Enable authentication and use strong passwords

## Troubleshooting

### Connection Issues
- Ensure MongoDB is running
- Check MONGODB_URI is correct
- Verify network connectivity (for Atlas)

### Authentication Issues
- Clear AsyncStorage cache
- Re-run seed script to reset admin credentials
- Check JWT_SECRET is set

### Port Conflicts
- Default MongoDB port: 27017
- Change if needed in connection string
