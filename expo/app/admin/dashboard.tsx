import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  TextInput,
  Alert,
  ActivityIndicator,
} from 'react-native';
import { useRouter } from 'expo-router';
import { trpc } from '@/lib/trpc';
import { useAdmin } from '@/contexts/AdminContext';
import { LinearGradient } from 'expo-linear-gradient';
import { 
  LogOut, 
  Plus, 
  Package, 
  DollarSign,
  TrendingUp,
  Edit,
  Trash2,
} from 'lucide-react-native';

export default function AdminDashboardScreen() {
  const router = useRouter();
  const { admin, logout } = useAdmin();
  const [showAddProduct, setShowAddProduct] = useState(false);

  const productsQuery = trpc.products.list.useQuery({});

  const handleLogout = async () => {
    await logout();
    router.replace('/admin/login' as any);
  };

  if (!admin) {
    router.replace('/admin/login' as any);
    return null;
  }

  if (productsQuery.isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#d4af37" />
      </View>
    );
  }

  const products = productsQuery.data?.products || [];
  const totalProducts = productsQuery.data?.total || 0;
  const totalValue = products.reduce((sum, p: any) => sum + p.price, 0);
  const avgPrice = totalProducts > 0 ? totalValue / totalProducts : 0;

  return (
    <LinearGradient colors={['#1a1f3a', '#2d3561']} style={styles.container}>
      <ScrollView style={styles.scrollView}>
        <View style={styles.header}>
          <View>
            <Text style={styles.welcomeText}>Welcome back,</Text>
            <Text style={styles.adminName}>{admin.name}</Text>
          </View>
          <TouchableOpacity onPress={handleLogout} style={styles.logoutButton}>
            <LogOut size={24} color="#d4af37" />
          </TouchableOpacity>
        </View>

        <View style={styles.statsGrid}>
          <View style={styles.statCard}>
            <Package size={24} color="#d4af37" />
            <Text style={styles.statValue}>{totalProducts}</Text>
            <Text style={styles.statLabel}>Total Products</Text>
          </View>

          <View style={styles.statCard}>
            <DollarSign size={24} color="#d4af37" />
            <Text style={styles.statValue}>${(totalValue / 1000).toFixed(1)}k</Text>
            <Text style={styles.statLabel}>Total Value</Text>
          </View>

          <View style={styles.statCard}>
            <TrendingUp size={24} color="#d4af37" />
            <Text style={styles.statValue}>${(avgPrice / 1000).toFixed(1)}k</Text>
            <Text style={styles.statLabel}>Avg Price</Text>
          </View>
        </View>

        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Products</Text>
            <TouchableOpacity
              style={styles.addButton}
              onPress={() => setShowAddProduct(true)}
            >
              <Plus size={20} color="#1a1f3a" />
              <Text style={styles.addButtonText}>Add Product</Text>
            </TouchableOpacity>
          </View>

          {showAddProduct && <AddProductForm onClose={() => setShowAddProduct(false)} />}

          <View style={styles.productsList}>
            {products.map((product: any) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </View>
        </View>
      </ScrollView>
    </LinearGradient>
  );
}

function AddProductForm({ onClose }: { onClose: () => void }) {
  const [name, setName] = useState('');
  const [price, setPrice] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState('Engagement Rings');
  const [imageUrl, setImageUrl] = useState('');

  const utils = trpc.useUtils();
  const createMutation = trpc.products.create.useMutation({
    onSuccess: () => {
      Alert.alert('Success', 'Product created successfully');
      utils.products.list.invalidate();
      onClose();
    },
    onError: (error) => {
      Alert.alert('Error', error.message);
    },
  });

  const handleSubmit = () => {
    if (!name || !price || !description || !imageUrl) {
      Alert.alert('Error', 'Please fill all required fields');
      return;
    }

    createMutation.mutate({
      name,
      price: parseFloat(price),
      description,
      category: category as any,
      image: imageUrl,
      images: [imageUrl],
      inStock: true,
    });
  };

  return (
    <View style={styles.formContainer}>
      <Text style={styles.formTitle}>Add New Product</Text>

      <TextInput
        style={styles.formInput}
        placeholder="Product Name"
        placeholderTextColor="#6b7280"
        value={name}
        onChangeText={setName}
      />

      <TextInput
        style={styles.formInput}
        placeholder="Price (USD)"
        placeholderTextColor="#6b7280"
        value={price}
        onChangeText={setPrice}
        keyboardType="numeric"
      />

      <TextInput
        style={styles.formInput}
        placeholder="Category"
        placeholderTextColor="#6b7280"
        value={category}
        onChangeText={setCategory}
      />

      <TextInput
        style={[styles.formInput, styles.textArea]}
        placeholder="Description"
        placeholderTextColor="#6b7280"
        value={description}
        onChangeText={setDescription}
        multiline
        numberOfLines={3}
      />

      <TextInput
        style={styles.formInput}
        placeholder="Image URL"
        placeholderTextColor="#6b7280"
        value={imageUrl}
        onChangeText={setImageUrl}
      />

      <View style={styles.formButtons}>
        <TouchableOpacity
          style={[styles.formButton, styles.cancelButton]}
          onPress={onClose}
        >
          <Text style={styles.cancelButtonText}>Cancel</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.formButton, styles.submitButton]}
          onPress={handleSubmit}
          disabled={createMutation.isPending}
        >
          {createMutation.isPending ? (
            <ActivityIndicator color="#1a1f3a" />
          ) : (
            <Text style={styles.submitButtonText}>Create Product</Text>
          )}
        </TouchableOpacity>
      </View>
    </View>
  );
}

function ProductCard({ product }: { product: any }) {
  const utils = trpc.useUtils();

  const deleteMutation = trpc.products.delete.useMutation({
    onSuccess: () => {
      Alert.alert('Success', 'Product deleted successfully');
      utils.products.list.invalidate();
    },
    onError: (error) => {
      Alert.alert('Error', error.message);
    },
  });

  const handleDelete = () => {
    Alert.alert(
      'Delete Product',
      'Are you sure you want to delete this product?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: () => deleteMutation.mutate({ id: product.id }),
        },
      ]
    );
  };

  return (
    <View style={styles.productCard}>
      <View style={styles.productInfo}>
        <Text style={styles.productName}>{product.name}</Text>
        <Text style={styles.productCategory}>{product.category}</Text>
        <Text style={styles.productPrice}>${product.price.toLocaleString()}</Text>
      </View>

      <View style={styles.productActions}>
        <TouchableOpacity style={styles.actionButton}>
          <Edit size={20} color="#d4af37" />
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.actionButton}
          onPress={handleDelete}
          disabled={deleteMutation.isPending}
        >
          {deleteMutation.isPending ? (
            <ActivityIndicator size="small" color="#ef4444" />
          ) : (
            <Trash2 size={20} color="#ef4444" />
          )}
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#1a1f3a',
  },
  scrollView: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    paddingTop: 60,
  },
  welcomeText: {
    fontSize: 16,
    color: '#9ca3af',
  },
  adminName: {
    fontSize: 28,
    fontWeight: '700' as const,
    color: '#ffffff',
    marginTop: 4,
  },
  logoutButton: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: 'rgba(212, 175, 55, 0.1)',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: 'rgba(212, 175, 55, 0.3)',
  },
  statsGrid: {
    flexDirection: 'row',
    padding: 20,
    gap: 12,
  },
  statCard: {
    flex: 1,
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(212, 175, 55, 0.2)',
  },
  statValue: {
    fontSize: 24,
    fontWeight: '700' as const,
    color: '#ffffff',
    marginTop: 8,
  },
  statLabel: {
    fontSize: 12,
    color: '#9ca3af',
    marginTop: 4,
    textAlign: 'center',
  },
  section: {
    padding: 20,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 24,
    fontWeight: '700' as const,
    color: '#ffffff',
  },
  addButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#d4af37',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
    gap: 6,
  },
  addButtonText: {
    color: '#1a1f3a',
    fontSize: 14,
    fontWeight: '600' as const,
  },
  productsList: {
    gap: 12,
  },
  productCard: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
    borderColor: 'rgba(212, 175, 55, 0.2)',
  },
  productInfo: {
    flex: 1,
  },
  productName: {
    fontSize: 16,
    fontWeight: '600' as const,
    color: '#ffffff',
    marginBottom: 4,
  },
  productCategory: {
    fontSize: 14,
    color: '#d4af37',
    marginBottom: 4,
  },
  productPrice: {
    fontSize: 18,
    fontWeight: '700' as const,
    color: '#ffffff',
  },
  productActions: {
    flexDirection: 'row',
    gap: 12,
  },
  actionButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  formContainer: {
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    borderRadius: 12,
    padding: 20,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: 'rgba(212, 175, 55, 0.3)',
  },
  formTitle: {
    fontSize: 20,
    fontWeight: '700' as const,
    color: '#ffffff',
    marginBottom: 16,
  },
  formInput: {
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    borderRadius: 8,
    padding: 12,
    color: '#ffffff',
    fontSize: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: 'rgba(212, 175, 55, 0.2)',
  },
  textArea: {
    height: 80,
    textAlignVertical: 'top',
  },
  formButtons: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 8,
  },
  formButton: {
    flex: 1,
    height: 48,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  cancelButton: {
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
  },
  cancelButtonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '600' as const,
  },
  submitButton: {
    backgroundColor: '#d4af37',
  },
  submitButtonText: {
    color: '#1a1f3a',
    fontSize: 16,
    fontWeight: '700' as const,
  },
});
