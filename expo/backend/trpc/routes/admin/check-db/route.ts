import { publicProcedure } from '../../../create-context';
import { connectToDatabase } from '../../../../lib/mongodb';
import { Admin } from '../../../../models/admin.model';

export const checkDbProcedure = publicProcedure
  .query(async () => {
    try {
      console.log('Checking database status...');
      
      const { db } = await connectToDatabase();
      
      const adminsCollection = db.collection<Admin>('admins');
      const adminCount = await adminsCollection.countDocuments();
      
      const admins = await adminsCollection.find({}, { 
        projection: { email: 1, name: 1, role: 1, createdAt: 1 } 
      }).toArray();

      const productsCollection = db.collection('products');
      const productCount = await productsCollection.countDocuments();

      console.log('Database check results:', {
        admins: adminCount,
        products: productCount,
      });

      return {
        success: true,
        database: db.databaseName,
        collections: {
          admins: {
            count: adminCount,
            list: admins.map(a => ({ 
              email: a.email, 
              name: a.name, 
              role: a.role,
              createdAt: a.createdAt 
            })),
          },
          products: {
            count: productCount,
          },
        },
      };
    } catch (error) {
      console.error('Database check error:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error',
        database: null,
        collections: null,
      };
    }
  });
