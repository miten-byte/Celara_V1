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
import { ChevronRight, Sparkles, Heart, Shield, Gem } from "lucide-react-native";
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
            colors={['#1A0B2E', '#4A0E4E', '#1A0B2E']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={styles.heroGradient}
          >
            <View style={styles.brandContainer}>
              <Text style={styles.brandName}>CELARA</Text>
              <Text style={styles.tagline}>Crafted by Science. Worn with Soul.</Text>
            </View>

            <View style={styles.heroContent}>
              <Text style={styles.heroTitle}>Lab-Grown Luxury</Text>
              <Text style={styles.heroSubtitle}>
                Ethically created diamonds that match nature&apos;s perfection.
                {"\n"}Same fire. Same brilliance. Better future.
              </Text>
              <TouchableOpacity
                style={styles.heroButton}
                onPress={() => router.push('/(tabs)/shop')}
              >
                <Text style={styles.heroButtonText}>Explore Collection</Text>
                <Sparkles color={Colors.light.primary} size={18} />
              </TouchableOpacity>
            </View>
          </LinearGradient>
        </View>

        <View style={styles.valuesSection}>
          <View style={styles.valueCard}>
            <View style={styles.valueIconContainer}>
              <Gem color={Colors.light.primary} size={24} strokeWidth={1.5} />
            </View>
            <Text style={styles.valueTitle}>Lab-Grown</Text>
            <Text style={styles.valueText}>Sustainably created with precision</Text>
          </View>
          <View style={styles.valueCard}>
            <View style={styles.valueIconContainer}>
              <Shield color={Colors.light.primary} size={24} strokeWidth={1.5} />
            </View>
            <Text style={styles.valueTitle}>Certified</Text>
            <Text style={styles.valueText}>IGI & GIA certified diamonds</Text>
          </View>
          <View style={styles.valueCard}>
            <View style={styles.valueIconContainer}>
              <Heart color={Colors.light.primary} size={24} strokeWidth={1.5} />
            </View>
            <Text style={styles.valueTitle}>Ethical</Text>
            <Text style={styles.valueText}>Conflict-free & eco-friendly</Text>
          </View>
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
    marginBottom: 24,
  },
  heroGradient: {
    paddingHorizontal: 24,
    paddingVertical: 56,
    paddingBottom: 40,
  },
  brandContainer: {
    alignItems: 'center' as const,
    marginBottom: 48,
  },
  brandName: {
    fontSize: 56,
    fontWeight: '300' as const,
    color: Colors.light.secondary,
    letterSpacing: 8,
    marginBottom: 16,
    fontFamily: 'serif',
  },
  tagline: {
    fontSize: 13,
    color: Colors.light.white,
    letterSpacing: 2.5,
    fontWeight: '300' as const,
    opacity: 0.85,
    fontFamily: 'serif',
  },
  heroContent: {
    alignItems: 'center' as const,
  },
  heroTitle: {
    fontSize: 34,
    fontWeight: '300' as const,
    color: Colors.light.white,
    textAlign: 'center' as const,
    marginBottom: 16,
    letterSpacing: 2,
  },
  heroSubtitle: {
    fontSize: 15,
    color: Colors.light.white,
    textAlign: 'center' as const,
    marginBottom: 32,
    opacity: 0.85,
    lineHeight: 22,
    paddingHorizontal: 20,
  },
  heroButton: {
    backgroundColor: Colors.light.secondary,
    paddingHorizontal: 36,
    paddingVertical: 16,
    borderRadius: 8,
    flexDirection: 'row' as const,
    alignItems: 'center' as const,
    gap: 8,
    shadowColor: Colors.light.secondary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 12,
    elevation: 8,
  },
  heroButtonText: {
    fontSize: 15,
    fontWeight: '600' as const,
    color: Colors.light.primary,
    letterSpacing: 0.5,
  },
  valuesSection: {
    flexDirection: 'row' as const,
    paddingHorizontal: 20,
    marginBottom: 32,
    gap: 12,
  },
  valueCard: {
    flex: 1,
    backgroundColor: Colors.light.white,
    padding: 16,
    borderRadius: 12,
    alignItems: 'center' as const,
    borderWidth: 1,
    borderColor: Colors.light.border,
    shadowColor: Colors.light.black,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  valueIconContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: 'rgba(10, 31, 68, 0.08)',
    alignItems: 'center' as const,
    justifyContent: 'center' as const,
    marginBottom: 12,
  },
  valueTitle: {
    fontSize: 12,
    fontWeight: '500' as const,
    color: Colors.light.text,
    marginBottom: 4,
    letterSpacing: 1,
  },
  valueText: {
    fontSize: 11,
    color: Colors.light.textSecondary,
    textAlign: 'center' as const,
    lineHeight: 16,
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
    fontSize: 22,
    fontWeight: '300' as const,
    color: Colors.light.text,
    marginBottom: 16,
    letterSpacing: 1,
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
