import React from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
  Dimensions,
} from "react-native";
import { useRouter } from "expo-router";
import { Heart, ShoppingBag } from "lucide-react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import Colors from "@/constants/colors";
import { useWishlist } from "@/contexts/WishlistContext";
import { products } from "@/mocks/jewelry";

const { width } = Dimensions.get("window");

export default function WishlistScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { wishlist, toggleWishlist } = useWishlist();

  const wishlistProducts = products.filter((p) => wishlist.includes(p.id));

  const renderProductCard = (product: typeof products[0]) => {
    return (
      <TouchableOpacity
        key={product.id}
        style={styles.productCard}
        onPress={() => router.push(`/product/${product.id}` as any)}
      >
        <Image source={{ uri: product.image }} style={styles.productImage} />
        <TouchableOpacity
          style={styles.wishlistButton}
          onPress={() => toggleWishlist(product.id)}
        >
          <Heart
            color={Colors.light.error}
            fill={Colors.light.error}
            size={20}
          />
        </TouchableOpacity>
        <View style={styles.productInfo}>
          <Text style={styles.productCategory}>{product.category}</Text>
          <Text style={styles.productName} numberOfLines={2}>
            {product.name}
          </Text>
          {product.carat && (
            <Text style={styles.productCarat}>{product.carat} ct</Text>
          )}
          <Text style={styles.productPrice}>${product.price.toLocaleString()}</Text>
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <View style={styles.container}>
      <View style={[styles.header, { paddingTop: insets.top + 20 }]}>
        <Text style={styles.headerTitle}>My Wishlist</Text>
        <Text style={styles.headerSubtitle}>
          {wishlistProducts.length} {wishlistProducts.length === 1 ? "item" : "items"}
        </Text>
      </View>

      {wishlistProducts.length === 0 ? (
        <View style={styles.emptyContainer}>
          <View style={styles.emptyIconContainer}>
            <Heart color={Colors.light.textSecondary} size={64} />
          </View>
          <Text style={styles.emptyTitle}>Your wishlist is empty</Text>
          <Text style={styles.emptySubtitle}>
            Save items you love to view them later
          </Text>
          <TouchableOpacity
            style={styles.shopButton}
            onPress={() => router.push("/(tabs)/shop")}
          >
            <ShoppingBag color={Colors.light.white} size={20} />
            <Text style={styles.shopButtonText}>Start Shopping</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <ScrollView
          contentContainerStyle={styles.productsContent}
          showsVerticalScrollIndicator={false}
        >
          <View style={styles.productsGrid}>
            {wishlistProducts.map((product) => renderProductCard(product))}
          </View>
        </ScrollView>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.light.background,
  },
  header: {
    backgroundColor: Colors.light.white,
    paddingHorizontal: 20,
    paddingBottom: 20,
    borderBottomWidth: 1,
    borderBottomColor: Colors.light.border,
  },
  headerTitle: {
    fontSize: 32,
    fontWeight: '700' as const,
    color: Colors.light.text,
    marginBottom: 4,
  },
  headerSubtitle: {
    fontSize: 16,
    color: Colors.light.textSecondary,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center' as const,
    alignItems: 'center' as const,
    paddingHorizontal: 40,
  },
  emptyIconContainer: {
    marginBottom: 24,
    opacity: 0.3,
  },
  emptyTitle: {
    fontSize: 24,
    fontWeight: '700' as const,
    color: Colors.light.text,
    textAlign: 'center' as const,
    marginBottom: 8,
  },
  emptySubtitle: {
    fontSize: 16,
    color: Colors.light.textSecondary,
    textAlign: 'center' as const,
    marginBottom: 32,
  },
  shopButton: {
    flexDirection: 'row' as const,
    alignItems: 'center' as const,
    gap: 8,
    backgroundColor: Colors.light.primary,
    paddingHorizontal: 24,
    paddingVertical: 14,
    borderRadius: 30,
  },
  shopButtonText: {
    fontSize: 16,
    fontWeight: '600' as const,
    color: Colors.light.white,
  },
  productsContent: {
    padding: 20,
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
    height: 180,
    backgroundColor: Colors.light.surface,
  },
  wishlistButton: {
    position: 'absolute' as const,
    top: 8,
    right: 8,
    width: 36,
    height: 36,
    backgroundColor: Colors.light.white,
    borderRadius: 18,
    justifyContent: 'center' as const,
    alignItems: 'center' as const,
    shadowColor: Colors.light.black,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  productInfo: {
    padding: 12,
  },
  productCategory: {
    fontSize: 11,
    fontWeight: '500' as const,
    color: Colors.light.textSecondary,
    marginBottom: 4,
    textTransform: 'uppercase' as const,
  },
  productName: {
    fontSize: 14,
    fontWeight: '600' as const,
    color: Colors.light.text,
    marginBottom: 4,
    minHeight: 36,
  },
  productCarat: {
    fontSize: 12,
    fontWeight: '500' as const,
    color: Colors.light.textSecondary,
    marginBottom: 4,
  },
  productPrice: {
    fontSize: 16,
    fontWeight: '700' as const,
    color: Colors.light.primary,
  },
});
