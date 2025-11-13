import React, { useState, useRef } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Image,
  TouchableOpacity,
  Dimensions,
  Platform,
} from "react-native";
import { useRouter } from "expo-router";
import { LinearGradient } from "expo-linear-gradient";
import { ChevronRight, Sparkles, Heart, Shield, Gem, Menu, Star, Package, TrendingUp, Play } from "lucide-react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { ResizeMode, Video } from "expo-av";
import DrawerMenu from "@/components/DrawerMenu";

import Colors from "@/constants/colors";
import { products, categories, Product } from "@/mocks/jewelry";

const { width } = Dimensions.get("window");

export default function HomeScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const featuredProducts = products.filter((p) => p.isFeatured).slice(0, 6);
  const bestSellers = products.filter((p) => p.isBestseller).slice(0, 6);
  const newArrivals = products.filter((p) => p.isNewArrival).slice(0, 6);
  const [drawerVisible, setDrawerVisible] = useState(false);
  const [videoError, setVideoError] = useState(false);
  const [isVideoPlaying, setIsVideoPlaying] = useState(true);
  const videoRef = useRef<Video>(null);

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
      <TouchableOpacity
        style={[styles.menuButton, { top: insets.top + 16 }]}
        onPress={() => setDrawerVisible(true)}
      >
        <Menu color={Colors.light.white} size={24} />
      </TouchableOpacity>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={[styles.scrollContent, { paddingTop: insets.top }]}
      >
        <View style={styles.heroSection}>
          <View style={styles.videoContainer}>
            {!videoError && Platform.OS !== 'web' ? (
              <Video
                ref={videoRef}
                source={{ uri: "https://player.vimeo.com/external/371433846.sd.mp4?s=236f93e679c1c0e8b1d6bdfa29210e8e4a5d7088&profile_id=165" }}
                style={styles.heroVideo}
                resizeMode={ResizeMode.COVER}
                shouldPlay={isVideoPlaying}
                isLooping
                isMuted
                onError={() => setVideoError(true)}
              />
            ) : (
              <Image
                source={{ uri: "https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?w=1200&q=80" }}
                style={styles.heroVideo}
              />
            )}
            
            <LinearGradient
              colors={['rgba(26, 11, 46, 0.7)', 'rgba(74, 14, 78, 0.8)', 'rgba(26, 11, 46, 0.9)']}
              style={styles.videoOverlay}
            >
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
                  <Text style={styles.heroButtonText}>Shop This Collection</Text>
                  <Sparkles color={Colors.light.primary} size={18} />
                </TouchableOpacity>
              </View>
            </LinearGradient>
          </View>
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
            <Text style={styles.valueText}>IGI certified diamonds</Text>
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

        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <View style={styles.sectionTitleContainer}>
              <TrendingUp color={Colors.light.secondary} size={24} strokeWidth={1.5} />
              <Text style={styles.sectionTitle}>Best Sellers</Text>
            </View>
            <TouchableOpacity onPress={() => router.push('/(tabs)/shop')}>
              <Text style={styles.viewAllText}>View All</Text>
            </TouchableOpacity>
          </View>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.horizontalScroll}
          >
            {bestSellers.map((product) => (
              <TouchableOpacity
                key={product.id}
                style={styles.horizontalCard}
                onPress={() => router.push(`/product/${product.id}` as any)}
              >
                <Image source={{ uri: product.image }} style={styles.horizontalImage} />
                <View style={styles.bestsellerBadge}>
                  <Star color={Colors.light.white} size={12} fill={Colors.light.white} />
                </View>
                <View style={styles.horizontalInfo}>
                  <Text style={styles.horizontalName} numberOfLines={2}>
                    {product.name}
                  </Text>
                  <Text style={styles.horizontalPrice}>
                    ${product.price.toLocaleString()}
                  </Text>
                </View>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>

        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <View style={styles.sectionTitleContainer}>
              <Package color={Colors.light.secondary} size={24} strokeWidth={1.5} />
              <Text style={styles.sectionTitle}>New Arrivals</Text>
            </View>
            <TouchableOpacity onPress={() => router.push('/(tabs)/shop')}>
              <Text style={styles.viewAllText}>View All</Text>
            </TouchableOpacity>
          </View>
          <View style={styles.productsGrid}>
            {newArrivals.map((product) => renderProductCard(product))}
          </View>
        </View>

        <View style={styles.educationSection}>
          <Text style={styles.educationTitle}>Why Lab-Grown Diamonds?</Text>
          <Text style={styles.educationText}>
            Our lab-grown diamonds are chemically, physically, and optically identical to mined diamonds, 
            but created in controlled laboratory environments. They offer exceptional value, ethical sourcing, 
            and environmental sustainability without compromising on quality or beauty.
          </Text>
          <View style={styles.educationPoints}>
            <View style={styles.educationPoint}>
              <View style={styles.educationIconContainer}>
                <Gem color={Colors.light.secondary} size={20} />
              </View>
              <View style={styles.educationPointText}>
                <Text style={styles.educationPointTitle}>Same Quality</Text>
                <Text style={styles.educationPointDesc}>Identical to mined diamonds</Text>
              </View>
            </View>
            <View style={styles.educationPoint}>
              <View style={styles.educationIconContainer}>
                <Shield color={Colors.light.secondary} size={20} />
              </View>
              <View style={styles.educationPointText}>
                <Text style={styles.educationPointTitle}>Ethical Choice</Text>
                <Text style={styles.educationPointDesc}>Conflict-free & sustainable</Text>
              </View>
            </View>
            <View style={styles.educationPoint}>
              <View style={styles.educationIconContainer}>
                <Sparkles color={Colors.light.secondary} size={20} />
              </View>
              <View style={styles.educationPointText}>
                <Text style={styles.educationPointTitle}>Better Value</Text>
                <Text style={styles.educationPointDesc}>30-40% less expensive</Text>
              </View>
            </View>
          </View>
        </View>

        <View style={styles.customDesignBanner}>
          <LinearGradient
            colors={[Colors.light.primary, '#1A2F5C']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={styles.customDesignGradient}
          >
            <Sparkles color={Colors.light.secondary} size={32} strokeWidth={1.5} />
            <Text style={styles.customDesignTitle}>Design Your Dream Jewelry</Text>
            <Text style={styles.customDesignText}>
              Create a unique piece with our AI-powered jewelry designer
            </Text>
            <TouchableOpacity
              style={styles.customDesignButton}
              onPress={() => router.push('/(tabs)/chat')}
            >
              <Text style={styles.customDesignButtonText}>Start Designing</Text>
              <ChevronRight color={Colors.light.primary} size={18} />
            </TouchableOpacity>
          </LinearGradient>
        </View>
      </ScrollView>

      <DrawerMenu
        visible={drawerVisible}
        onClose={() => setDrawerVisible(false)}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.light.background,
  },
  menuButton: {
    position: 'absolute' as const,
    left: 16,
    zIndex: 10,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    borderRadius: 8,
    padding: 8,
    shadowColor: Colors.light.black,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 5,
  },
  scrollContent: {
    paddingBottom: 24,
  },
  heroSection: {
    marginBottom: 24,
  },
  videoContainer: {
    height: 500,
    position: 'relative' as const,
  },
  heroVideo: {
    width: '100%',
    height: '100%',
  },
  videoOverlay: {
    position: 'absolute' as const,
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: 'center' as const,
    alignItems: 'center' as const,
    paddingHorizontal: 24,
  },
  heroContent: {
    alignItems: 'center' as const,
    width: '100%',
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
  sectionTitleContainer: {
    flexDirection: 'row' as const,
    alignItems: 'center' as const,
    gap: 8,
  },
  horizontalScroll: {
    paddingRight: 20,
    gap: 16,
  },
  horizontalCard: {
    width: 200,
    backgroundColor: Colors.light.white,
    borderRadius: 16,
    overflow: 'hidden' as const,
    borderWidth: 1,
    borderColor: Colors.light.border,
  },
  horizontalImage: {
    width: 200,
    height: 200,
    backgroundColor: Colors.light.surface,
  },
  bestsellerBadge: {
    position: 'absolute' as const,
    top: 8,
    right: 8,
    backgroundColor: Colors.light.secondary,
    paddingHorizontal: 8,
    paddingVertical: 6,
    borderRadius: 20,
    flexDirection: 'row' as const,
    alignItems: 'center' as const,
  },
  horizontalInfo: {
    padding: 12,
  },
  horizontalName: {
    fontSize: 14,
    fontWeight: '600' as const,
    color: Colors.light.text,
    marginBottom: 6,
    minHeight: 40,
  },
  horizontalPrice: {
    fontSize: 18,
    fontWeight: '700' as const,
    color: Colors.light.primary,
  },
  educationSection: {
    marginHorizontal: 20,
    marginBottom: 32,
    backgroundColor: Colors.light.surface,
    padding: 24,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: Colors.light.border,
  },
  educationTitle: {
    fontSize: 24,
    fontWeight: '600' as const,
    color: Colors.light.text,
    marginBottom: 12,
    textAlign: 'center' as const,
  },
  educationText: {
    fontSize: 14,
    lineHeight: 22,
    color: Colors.light.textSecondary,
    textAlign: 'center' as const,
    marginBottom: 24,
  },
  educationPoints: {
    gap: 16,
  },
  educationPoint: {
    flexDirection: 'row' as const,
    alignItems: 'center' as const,
    gap: 12,
  },
  educationIconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: Colors.light.white,
    alignItems: 'center' as const,
    justifyContent: 'center' as const,
  },
  educationPointText: {
    flex: 1,
  },
  educationPointTitle: {
    fontSize: 15,
    fontWeight: '600' as const,
    color: Colors.light.text,
    marginBottom: 2,
  },
  educationPointDesc: {
    fontSize: 13,
    color: Colors.light.textSecondary,
  },
  customDesignBanner: {
    marginHorizontal: 20,
    marginBottom: 32,
    borderRadius: 16,
    overflow: 'hidden' as const,
    shadowColor: Colors.light.black,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 12,
    elevation: 6,
  },
  customDesignGradient: {
    padding: 32,
    alignItems: 'center' as const,
  },
  customDesignTitle: {
    fontSize: 26,
    fontWeight: '600' as const,
    color: Colors.light.white,
    marginTop: 16,
    marginBottom: 8,
    textAlign: 'center' as const,
  },
  customDesignText: {
    fontSize: 15,
    color: Colors.light.white,
    opacity: 0.9,
    textAlign: 'center' as const,
    marginBottom: 24,
  },
  customDesignButton: {
    flexDirection: 'row' as const,
    alignItems: 'center' as const,
    gap: 8,
    backgroundColor: Colors.light.secondary,
    paddingHorizontal: 32,
    paddingVertical: 14,
    borderRadius: 25,
  },
  customDesignButtonText: {
    fontSize: 15,
    fontWeight: '600' as const,
    color: Colors.light.primary,
  },
});
