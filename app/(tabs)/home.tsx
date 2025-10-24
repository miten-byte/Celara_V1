import React from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Image,
  TouchableOpacity,
  Dimensions,
} from "react-native";
import { useRouter } from "expo-router";
import { LinearGradient } from "expo-linear-gradient";
import { ChevronRight, Sparkles } from "lucide-react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import Colors from "@/constants/colors";
import { products, categories, Product } from "@/mocks/jewelry";

const { width } = Dimensions.get("window");

export default function HomeScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const featuredProducts = products.filter((p) => p.isFeatured).slice(0, 6);

  const renderCategoryCard = (category: string, index: number) => {
    const categoryImage = products.find((p) => p.category === category)?.image;
    
    return (
      <TouchableOpacity
        key={category}
        style={styles.categoryCard}
        onPress={() => router.push('/(tabs)/shop')}
      >
        <Image source={{ uri: categoryImage }} style={styles.categoryImage} />
        <LinearGradient
          colors={['transparent', 'rgba(0,0,0,0.7)']}
          style={styles.categoryGradient}
        >
          <Text style={styles.categoryText}>{category}</Text>
          <ChevronRight color={Colors.light.white} size={20} />
        </LinearGradient>
      </TouchableOpacity>
    );
  };

  const renderProductCard = (product: Product) => {
    return (
      <TouchableOpacity
        key={product.id}
        style={styles.productCard}
        onPress={() => router.push(`/product/${product.id}` as any)}
      >
        <Image source={{ uri: product.image }} style={styles.productImage} />
        <View style={styles.productInfo}>
          <Text style={styles.productName} numberOfLines={2}>
            {product.name}
          </Text>
          <Text style={styles.productPrice}>
            ${product.price.toLocaleString()}
          </Text>
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <View style={styles.container}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={[styles.scrollContent, { paddingTop: insets.top }]}
      >
        <View style={styles.heroSection}>
          <LinearGradient
            colors={[Colors.light.primary, '#0F2952']}
            style={styles.heroGradient}
          >
            <View style={styles.heroContent}>
              <View style={styles.heroIconContainer}>
                <Sparkles color={Colors.light.secondary} size={32} />
              </View>
              <Text style={styles.heroTitle}>Timeless Elegance</Text>
              <Text style={styles.heroSubtitle}>
                Discover lab-grown and natural diamonds
              </Text>
              <TouchableOpacity
                style={styles.heroButton}
                onPress={() => router.push('/(tabs)/shop')}
              >
                <Text style={styles.heroButtonText}>Shop Diamonds</Text>
                <ChevronRight color={Colors.light.primary} size={20} />
              </TouchableOpacity>
            </View>
          </LinearGradient>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Shop by Category</Text>
          <View style={styles.categoriesGrid}>
            {categories.slice(0, 4).map((cat, idx) => renderCategoryCard(cat, idx))}
          </View>
        </View>

        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Featured Collection</Text>
            <TouchableOpacity onPress={() => router.push('/(tabs)/shop')}>
              <Text style={styles.viewAllText}>View All</Text>
            </TouchableOpacity>
          </View>
          <View style={styles.productsGrid}>
            {featuredProducts.map((product) => renderProductCard(product))}
          </View>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.light.background,
  },
  scrollContent: {
    paddingBottom: 24,
  },
  heroSection: {
    marginBottom: 32,
  },
  heroGradient: {
    paddingHorizontal: 24,
    paddingVertical: 48,
  },
  heroContent: {
    alignItems: 'center' as const,
  },
  heroIconContainer: {
    marginBottom: 16,
  },
  heroTitle: {
    fontSize: 36,
    fontWeight: '700' as const,
    color: Colors.light.white,
    textAlign: 'center' as const,
    marginBottom: 12,
    letterSpacing: -0.5,
  },
  heroSubtitle: {
    fontSize: 16,
    color: Colors.light.white,
    textAlign: 'center' as const,
    marginBottom: 32,
    opacity: 0.9,
  },
  heroButton: {
    backgroundColor: Colors.light.white,
    paddingHorizontal: 32,
    paddingVertical: 16,
    borderRadius: 30,
    flexDirection: 'row' as const,
    alignItems: 'center' as const,
    gap: 8,
  },
  heroButtonText: {
    fontSize: 16,
    fontWeight: '600' as const,
    color: Colors.light.primary,
  },
  section: {
    marginBottom: 32,
    paddingHorizontal: 20,
  },
  sectionHeader: {
    flexDirection: 'row' as const,
    justifyContent: 'space-between' as const,
    alignItems: 'center' as const,
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 24,
    fontWeight: '700' as const,
    color: Colors.light.text,
    marginBottom: 16,
  },
  viewAllText: {
    fontSize: 14,
    fontWeight: '600' as const,
    color: Colors.light.primary,
  },
  categoriesGrid: {
    flexDirection: 'row' as const,
    flexWrap: 'wrap' as const,
    gap: 12,
  },
  categoryCard: {
    width: (width - 52) / 2,
    height: 140,
    borderRadius: 16,
    overflow: 'hidden' as const,
    backgroundColor: Colors.light.surface,
  },
  categoryImage: {
    width: '100%',
    height: '100%',
  },
  categoryGradient: {
    position: 'absolute' as const,
    bottom: 0,
    left: 0,
    right: 0,
    padding: 12,
    flexDirection: 'row' as const,
    justifyContent: 'space-between' as const,
    alignItems: 'center' as const,
  },
  categoryText: {
    fontSize: 16,
    fontWeight: '600' as const,
    color: Colors.light.white,
  },
  productsGrid: {
    flexDirection: 'row' as const,
    flexWrap: 'wrap' as const,
    gap: 16,
  },
  productCard: {
    width: (width - 56) / 2,
    backgroundColor: Colors.light.white,
    borderRadius: 16,
    overflow: 'hidden' as const,
    borderWidth: 1,
    borderColor: Colors.light.border,
  },
  productImage: {
    width: '100%',
    height: 160,
    backgroundColor: Colors.light.surface,
  },
  productInfo: {
    padding: 12,
  },
  productName: {
    fontSize: 14,
    fontWeight: '600' as const,
    color: Colors.light.text,
    marginBottom: 4,
    minHeight: 40,
  },
  productPrice: {
    fontSize: 16,
    fontWeight: '700' as const,
    color: Colors.light.primary,
  },
});
