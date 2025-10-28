import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Image,
  TouchableOpacity,
  Dimensions,
} from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import { Heart, ShoppingCart, Info, Award, Shield } from "lucide-react-native";

import Colors from "@/constants/colors";
import { products, metals, MetalType } from "@/mocks/jewelry";
import { useWishlist } from "@/contexts/WishlistContext";

const { width } = Dimensions.get("window");

export default function ProductDetailScreen() {
  const { id } = useLocalSearchParams();
  const router = useRouter();
  const { isInWishlist, toggleWishlist } = useWishlist();

  const product = products.find((p) => p.id === id);
  const [selectedImage, setSelectedImage] = useState(0);
  const defaultMetal: MetalType = "18K White Gold";
  const [selectedMetal, setSelectedMetal] = useState<MetalType>(
    (product?.metal as MetalType) || defaultMetal
  );
  const [ringSize, setRingSize] = useState("6");

  if (!product) {
    return (
      <View style={styles.errorContainer}>
        <Text style={styles.errorText}>Product not found</Text>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => router.back()}
        >
          <Text style={styles.backButtonText}>Go Back</Text>
        </TouchableOpacity>
      </View>
    );
  }

  const isWishlisted = isInWishlist(product.id);
  const images = product.images.length > 0 ? product.images : [product.image];

  return (
    <View style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={styles.imageSection}>
          <Image
            source={{ uri: images[selectedImage] }}
            style={styles.mainImage}
          />
          <TouchableOpacity
            style={styles.wishlistButton}
            onPress={() => toggleWishlist(product.id)}
          >
            <Heart
              color={isWishlisted ? Colors.light.error : Colors.light.text}
              fill={isWishlisted ? Colors.light.error : "transparent"}
              size={24}
            />
          </TouchableOpacity>
          {images.length > 1 && (
            <View style={styles.imageThumbnails}>
              {images.map((img, idx) => (
                <TouchableOpacity
                  key={idx}
                  onPress={() => setSelectedImage(idx)}
                  style={[
                    styles.thumbnail,
                    selectedImage === idx && styles.thumbnailActive,
                  ]}
                >
                  <Image source={{ uri: img }} style={styles.thumbnailImage} />
                </TouchableOpacity>
              ))}
            </View>
          )}
        </View>

        <View style={styles.detailsSection}>
          <View style={styles.categoryBadge}>
            <Text style={styles.categoryBadgeText}>{product.category}</Text>
          </View>
          
          <Text style={styles.productName}>{product.name}</Text>
          
          <View style={styles.priceContainer}>
            <Text style={styles.price}>${product.price.toLocaleString()}</Text>
            {product.inStock ? (
              <View style={styles.inStockBadge}>
                <Text style={styles.inStockText}>In Stock</Text>
              </View>
            ) : (
              <View style={[styles.inStockBadge, styles.outOfStockBadge]}>
                <Text style={styles.outOfStockText}>Out of Stock</Text>
              </View>
            )}
          </View>

          {product.carat && (
            <View style={styles.specsContainer}>
              <View style={styles.specItem}>
                <Text style={styles.specLabel}>Carat Weight</Text>
                <Text style={styles.specValue}>{product.carat} ct</Text>
              </View>
              {product.cut && (
                <View style={styles.specItem}>
                  <Text style={styles.specLabel}>Cut</Text>
                  <Text style={styles.specValue}>{product.cut}</Text>
                </View>
              )}
              {product.color && (
                <View style={styles.specItem}>
                  <Text style={styles.specLabel}>Color</Text>
                  <Text style={styles.specValue}>{product.color}</Text>
                </View>
              )}
              {product.clarity && (
                <View style={styles.specItem}>
                  <Text style={styles.specLabel}>Clarity</Text>
                  <Text style={styles.specValue}>{product.clarity}</Text>
                </View>
              )}
            </View>
          )}

          <View style={styles.divider} />

          <Text style={styles.sectionTitle}>Description</Text>
          <Text style={styles.description}>{product.description}</Text>

          {product.shape && (
            <>
              <View style={styles.divider} />
              <Text style={styles.sectionTitle}>Diamond Shape</Text>
              <View style={styles.shapeContainer}>
                <Text style={styles.shapeText}>{product.shape}</Text>
              </View>
            </>
          )}

          {product.metal && (
            <>
              <View style={styles.divider} />
              <Text style={styles.sectionTitle}>Metal Type</Text>
              <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={styles.metalOptions}
              >
                {metals.map((metal) => (
                  <TouchableOpacity
                    key={metal}
                    style={[
                      styles.metalChip,
                      selectedMetal === metal && styles.metalChipActive,
                    ]}
                    onPress={() => setSelectedMetal(metal)}
                  >
                    <Text
                      style={[
                        styles.metalChipText,
                        selectedMetal === metal && styles.metalChipTextActive,
                      ]}
                    >
                      {metal}
                    </Text>
                  </TouchableOpacity>
                ))}
              </ScrollView>
            </>
          )}

          {product.category === "Engagement Rings" && (
            <>
              <View style={styles.divider} />
              <Text style={styles.sectionTitle}>Ring Size</Text>
              <View style={styles.sizeGrid}>
                {["4", "5", "6", "7", "8", "9", "10"].map((size) => (
                  <TouchableOpacity
                    key={size}
                    style={[
                      styles.sizeChip,
                      ringSize === size && styles.sizeChipActive,
                    ]}
                    onPress={() => setRingSize(size)}
                  >
                    <Text
                      style={[
                        styles.sizeChipText,
                        ringSize === size && styles.sizeChipTextActive,
                      ]}
                    >
                      {size}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </>
          )}

          {product.certification && (
            <>
              <View style={styles.divider} />
              <View style={styles.certificationSection}>
                <Award color={Colors.light.secondary} size={24} />
                <View style={styles.certificationInfo}>
                  <Text style={styles.certificationTitle}>
                    {product.certification} Certified
                  </Text>
                  <Text style={styles.certificationText}>
                    Includes official certificate of authenticity
                  </Text>
                </View>
              </View>
            </>
          )}

          <View style={styles.featuresContainer}>
            <View style={styles.featureItem}>
              <Shield color={Colors.light.primary} size={20} />
              <Text style={styles.featureText}>Lifetime Warranty</Text>
            </View>
            <View style={styles.featureItem}>
              <Info color={Colors.light.primary} size={20} />
              <Text style={styles.featureText}>Free Resizing</Text>
            </View>
          </View>
        </View>
      </ScrollView>

      <View style={styles.bottomBar}>
        <TouchableOpacity
          style={styles.addToCartButton}
          onPress={() => console.log("Add to cart")}
        >
          <ShoppingCart color={Colors.light.white} size={20} />
          <Text style={styles.addToCartText}>Add to Cart</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.light.background,
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center' as const,
    alignItems: 'center' as const,
    padding: 20,
  },
  errorText: {
    fontSize: 18,
    color: Colors.light.text,
    marginBottom: 20,
  },
  backButton: {
    backgroundColor: Colors.light.primary,
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 8,
  },
  backButtonText: {
    color: Colors.light.white,
    fontSize: 16,
    fontWeight: '600' as const,
  },
  imageSection: {
    backgroundColor: Colors.light.white,
    paddingBottom: 16,
  },
  mainImage: {
    width,
    height: width,
    backgroundColor: Colors.light.surface,
  },
  wishlistButton: {
    position: 'absolute' as const,
    top: 16,
    right: 16,
    width: 48,
    height: 48,
    backgroundColor: Colors.light.white,
    borderRadius: 24,
    justifyContent: 'center' as const,
    alignItems: 'center' as const,
    shadowColor: Colors.light.black,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 4,
  },
  imageThumbnails: {
    flexDirection: 'row' as const,
    paddingHorizontal: 16,
    gap: 8,
    marginTop: 16,
  },
  thumbnail: {
    width: 60,
    height: 60,
    borderRadius: 8,
    overflow: 'hidden' as const,
    borderWidth: 2,
    borderColor: Colors.light.border,
  },
  thumbnailActive: {
    borderColor: Colors.light.primary,
  },
  thumbnailImage: {
    width: '100%',
    height: '100%',
  },
  detailsSection: {
    padding: 20,
  },
  categoryBadge: {
    alignSelf: 'flex-start' as const,
    backgroundColor: Colors.light.surface,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    marginBottom: 12,
  },
  categoryBadgeText: {
    fontSize: 12,
    fontWeight: '600' as const,
    color: Colors.light.primary,
    textTransform: 'uppercase' as const,
  },
  productName: {
    fontSize: 26,
    fontWeight: '700' as const,
    color: Colors.light.text,
    marginBottom: 12,
    lineHeight: 32,
  },
  priceContainer: {
    flexDirection: 'row' as const,
    alignItems: 'center' as const,
    marginBottom: 20,
    gap: 12,
  },
  price: {
    fontSize: 32,
    fontWeight: '700' as const,
    color: Colors.light.primary,
  },
  inStockBadge: {
    backgroundColor: Colors.light.success,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
  },
  inStockText: {
    fontSize: 12,
    fontWeight: '600' as const,
    color: Colors.light.white,
  },
  outOfStockBadge: {
    backgroundColor: Colors.light.error,
  },
  outOfStockText: {
    fontSize: 12,
    fontWeight: '600' as const,
    color: Colors.light.white,
  },
  specsContainer: {
    flexDirection: 'row' as const,
    flexWrap: 'wrap' as const,
    gap: 16,
    marginBottom: 20,
  },
  specItem: {
    backgroundColor: Colors.light.surface,
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 12,
    minWidth: (width - 56) / 2,
  },
  specLabel: {
    fontSize: 12,
    fontWeight: '500' as const,
    color: Colors.light.textSecondary,
    marginBottom: 4,
  },
  specValue: {
    fontSize: 16,
    fontWeight: '600' as const,
    color: Colors.light.text,
  },
  divider: {
    height: 1,
    backgroundColor: Colors.light.border,
    marginVertical: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700' as const,
    color: Colors.light.text,
    marginBottom: 12,
  },
  description: {
    fontSize: 15,
    lineHeight: 24,
    color: Colors.light.textSecondary,
  },
  shapeContainer: {
    backgroundColor: Colors.light.surface,
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 12,
    alignSelf: 'flex-start' as const,
  },
  shapeText: {
    fontSize: 16,
    fontWeight: '600' as const,
    color: Colors.light.text,
  },
  metalOptions: {
    gap: 8,
  },
  metalChip: {
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 20,
    backgroundColor: Colors.light.surface,
    borderWidth: 2,
    borderColor: Colors.light.border,
  },
  metalChipActive: {
    backgroundColor: Colors.light.primary,
    borderColor: Colors.light.primary,
  },
  metalChipText: {
    fontSize: 14,
    fontWeight: '600' as const,
    color: Colors.light.text,
  },
  metalChipTextActive: {
    color: Colors.light.white,
  },
  sizeGrid: {
    flexDirection: 'row' as const,
    flexWrap: 'wrap' as const,
    gap: 12,
  },
  sizeChip: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: Colors.light.surface,
    borderWidth: 2,
    borderColor: Colors.light.border,
    justifyContent: 'center' as const,
    alignItems: 'center' as const,
  },
  sizeChipActive: {
    backgroundColor: Colors.light.primary,
    borderColor: Colors.light.primary,
  },
  sizeChipText: {
    fontSize: 16,
    fontWeight: '600' as const,
    color: Colors.light.text,
  },
  sizeChipTextActive: {
    color: Colors.light.white,
  },
  certificationSection: {
    flexDirection: 'row' as const,
    alignItems: 'center' as const,
    backgroundColor: Colors.light.surface,
    padding: 16,
    borderRadius: 12,
    gap: 12,
  },
  certificationInfo: {
    flex: 1,
  },
  certificationTitle: {
    fontSize: 16,
    fontWeight: '600' as const,
    color: Colors.light.text,
    marginBottom: 4,
  },
  certificationText: {
    fontSize: 13,
    color: Colors.light.textSecondary,
  },
  featuresContainer: {
    flexDirection: 'row' as const,
    gap: 16,
    marginTop: 24,
  },
  featureItem: {
    flex: 1,
    flexDirection: 'row' as const,
    alignItems: 'center' as const,
    gap: 8,
    backgroundColor: Colors.light.surface,
    padding: 12,
    borderRadius: 12,
  },
  featureText: {
    fontSize: 13,
    fontWeight: '600' as const,
    color: Colors.light.text,
  },
  bottomBar: {
    backgroundColor: Colors.light.white,
    padding: 20,
    borderTopWidth: 1,
    borderTopColor: Colors.light.border,
  },
  addToCartButton: {
    flexDirection: 'row' as const,
    alignItems: 'center' as const,
    justifyContent: 'center' as const,
    gap: 8,
    backgroundColor: Colors.light.primary,
    paddingVertical: 16,
    borderRadius: 30,
  },
  addToCartText: {
    fontSize: 16,
    fontWeight: '600' as const,
    color: Colors.light.white,
  },
});
