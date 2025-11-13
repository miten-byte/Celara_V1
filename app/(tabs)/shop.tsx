import React, { useState, useMemo } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
  Dimensions,
  TextInput,
} from "react-native";
import { useRouter } from "expo-router";
import { Search, SlidersHorizontal, X, ArrowUpDown } from "lucide-react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import Colors from "@/constants/colors";
import { products, categories, shapes, Category, DiamondShape, Product } from "@/mocks/jewelry";

const { width } = Dimensions.get("window");

export default function ShopScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<Category | "All">("All");
  const [selectedShape, setSelectedShape] = useState<DiamondShape | "All">("All");
  const [showFilters, setShowFilters] = useState(false);
  const [priceRange, setPriceRange] = useState<"All" | "Under 5k" | "5k-10k" | "10k-20k" | "Over 20k">("All");
  const [sortBy, setSortBy] = useState<"default" | "price-low" | "price-high" | "newest">("default");
  const [showSortMenu, setShowSortMenu] = useState(false);

  const filteredProducts = useMemo(() => {
    let filtered = products.filter((product) => {
      const matchesSearch = product.name.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesCategory = selectedCategory === "All" || product.category === selectedCategory;
      const matchesShape = selectedShape === "All" || product.shape === selectedShape;
      
      let matchesPrice = true;
      if (priceRange === "Under 5k") matchesPrice = product.price < 5000;
      else if (priceRange === "5k-10k") matchesPrice = product.price >= 5000 && product.price < 10000;
      else if (priceRange === "10k-20k") matchesPrice = product.price >= 10000 && product.price < 20000;
      else if (priceRange === "Over 20k") matchesPrice = product.price >= 20000;

      return matchesSearch && matchesCategory && matchesShape && matchesPrice;
    });

    if (sortBy === "price-low") {
      filtered.sort((a, b) => a.price - b.price);
    } else if (sortBy === "price-high") {
      filtered.sort((a, b) => b.price - a.price);
    } else if (sortBy === "newest") {
      filtered = filtered.filter(p => p.isNewArrival).concat(filtered.filter(p => !p.isNewArrival));
    }

    return filtered;
  }, [searchQuery, selectedCategory, selectedShape, priceRange, sortBy]);

  const renderProductCard = (product: Product) => {
    return (
      <TouchableOpacity
        key={product.id}
        style={styles.productCard}
        onPress={() => router.push(`/product/${product.id}` as any)}
      >
        <Image source={{ uri: product.image }} style={styles.productImage} />
        {product.isBestseller && (
          <View style={styles.badge}>
            <Text style={styles.badgeText}>Bestseller</Text>
          </View>
        )}
        {product.isNewArrival && (
          <View style={[styles.badge, styles.newBadge]}>
            <Text style={styles.badgeText}>New</Text>
          </View>
        )}
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
      <View style={[styles.header, { paddingTop: insets.top + 12 }]}>
        <View style={styles.searchContainer}>
          <Search color={Colors.light.textSecondary} size={20} />
          <TextInput
            style={styles.searchInput}
            placeholder="Search diamonds & jewelry..."
            placeholderTextColor={Colors.light.textSecondary}
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
          {searchQuery.length > 0 && (
            <TouchableOpacity onPress={() => setSearchQuery("")}>
              <X color={Colors.light.textSecondary} size={20} />
            </TouchableOpacity>
          )}
        </View>
        <TouchableOpacity
          style={styles.filterButton}
          onPress={() => setShowFilters(!showFilters)}
        >
          <SlidersHorizontal color={Colors.light.primary} size={20} />
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.filterButton}
          onPress={() => setShowSortMenu(!showSortMenu)}
        >
          <ArrowUpDown color={Colors.light.primary} size={20} />
        </TouchableOpacity>
      </View>

      {showSortMenu && (
        <View style={styles.sortMenu}>
          <TouchableOpacity
            style={[styles.sortOption, sortBy === "default" && styles.sortOptionActive]}
            onPress={() => {
              setSortBy("default");
              setShowSortMenu(false);
            }}
          >
            <Text style={[styles.sortOptionText, sortBy === "default" && styles.sortOptionTextActive]}>
              Default
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.sortOption, sortBy === "price-low" && styles.sortOptionActive]}
            onPress={() => {
              setSortBy("price-low");
              setShowSortMenu(false);
            }}
          >
            <Text style={[styles.sortOptionText, sortBy === "price-low" && styles.sortOptionTextActive]}>
              Price: Low to High
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.sortOption, sortBy === "price-high" && styles.sortOptionActive]}
            onPress={() => {
              setSortBy("price-high");
              setShowSortMenu(false);
            }}
          >
            <Text style={[styles.sortOptionText, sortBy === "price-high" && styles.sortOptionTextActive]}>
              Price: High to Low
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.sortOption, sortBy === "newest" && styles.sortOptionActive]}
            onPress={() => {
              setSortBy("newest");
              setShowSortMenu(false);
            }}
          >
            <Text style={[styles.sortOptionText, sortBy === "newest" && styles.sortOptionTextActive]}>
              Newest First
            </Text>
          </TouchableOpacity>
        </View>
      )}

      {showFilters && (
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          style={styles.filtersContainer}
          contentContainerStyle={styles.filtersContent}
        >
          <View style={styles.filterSection}>
            <Text style={styles.filterLabel}>Category</Text>
            <View style={styles.filterChips}>
              <TouchableOpacity
                style={[styles.chip, selectedCategory === "All" && styles.chipActive]}
                onPress={() => setSelectedCategory("All")}
              >
                <Text style={[styles.chipText, selectedCategory === "All" && styles.chipTextActive]}>
                  All
                </Text>
              </TouchableOpacity>
              {categories.map((cat) => (
                <TouchableOpacity
                  key={cat}
                  style={[styles.chip, selectedCategory === cat && styles.chipActive]}
                  onPress={() => setSelectedCategory(cat)}
                >
                  <Text style={[styles.chipText, selectedCategory === cat && styles.chipTextActive]}>
                    {cat}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>

          <View style={styles.filterSection}>
            <Text style={styles.filterLabel}>Shape</Text>
            <View style={styles.filterChips}>
              <TouchableOpacity
                style={[styles.chip, selectedShape === "All" && styles.chipActive]}
                onPress={() => setSelectedShape("All")}
              >
                <Text style={[styles.chipText, selectedShape === "All" && styles.chipTextActive]}>
                  All
                </Text>
              </TouchableOpacity>
              {shapes.map((shape) => (
                <TouchableOpacity
                  key={shape}
                  style={[styles.chip, selectedShape === shape && styles.chipActive]}
                  onPress={() => setSelectedShape(shape)}
                >
                  <Text style={[styles.chipText, selectedShape === shape && styles.chipTextActive]}>
                    {shape}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>

          <View style={styles.filterSection}>
            <Text style={styles.filterLabel}>Price Range</Text>
            <View style={styles.filterChips}>
              {["All", "Under 5k", "5k-10k", "10k-20k", "Over 20k"].map((range) => (
                <TouchableOpacity
                  key={range}
                  style={[styles.chip, priceRange === range && styles.chipActive]}
                  onPress={() => setPriceRange(range as typeof priceRange)}
                >
                  <Text style={[styles.chipText, priceRange === range && styles.chipTextActive]}>
                    {range}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>
        </ScrollView>
      )}

      <ScrollView
        style={styles.productsScrollView}
        contentContainerStyle={styles.productsContent}
      >
        <Text style={styles.resultsText}>
          {filteredProducts.length} {filteredProducts.length === 1 ? "item" : "items"} found
        </Text>
        <View style={styles.productsGrid}>
          {filteredProducts.map((product) => renderProductCard(product))}
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
  header: {
    flexDirection: 'row' as const,
    paddingHorizontal: 20,
    paddingBottom: 12,
    gap: 12,
    backgroundColor: Colors.light.white,
    borderBottomWidth: 1,
    borderBottomColor: Colors.light.border,
  },
  searchContainer: {
    flex: 1,
    flexDirection: 'row' as const,
    alignItems: 'center' as const,
    backgroundColor: Colors.light.surface,
    borderRadius: 12,
    paddingHorizontal: 12,
    gap: 8,
  },
  searchInput: {
    flex: 1,
    height: 44,
    fontSize: 15,
    color: Colors.light.text,
  },
  filterButton: {
    width: 44,
    height: 44,
    backgroundColor: Colors.light.surface,
    borderRadius: 12,
    justifyContent: 'center' as const,
    alignItems: 'center' as const,
  },
  filtersContainer: {
    backgroundColor: Colors.light.white,
    borderBottomWidth: 1,
    borderBottomColor: Colors.light.border,
  },
  filtersContent: {
    paddingHorizontal: 20,
    paddingVertical: 16,
    gap: 20,
  },
  filterSection: {
    marginRight: 24,
  },
  filterLabel: {
    fontSize: 14,
    fontWeight: '600' as const,
    color: Colors.light.text,
    marginBottom: 8,
  },
  filterChips: {
    flexDirection: 'row' as const,
    flexWrap: 'wrap' as const,
    gap: 8,
  },
  chip: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: Colors.light.surface,
    borderWidth: 1,
    borderColor: Colors.light.border,
  },
  chipActive: {
    backgroundColor: Colors.light.primary,
    borderColor: Colors.light.primary,
  },
  chipText: {
    fontSize: 13,
    fontWeight: '500' as const,
    color: Colors.light.text,
  },
  chipTextActive: {
    color: Colors.light.white,
  },
  productsScrollView: {
    flex: 1,
  },
  productsContent: {
    padding: 20,
  },
  resultsText: {
    fontSize: 14,
    fontWeight: '500' as const,
    color: Colors.light.textSecondary,
    marginBottom: 16,
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
  badge: {
    position: 'absolute' as const,
    top: 8,
    right: 8,
    backgroundColor: Colors.light.secondary,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
  },
  newBadge: {
    backgroundColor: Colors.light.primary,
  },
  badgeText: {
    fontSize: 10,
    fontWeight: '700' as const,
    color: Colors.light.white,
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
  sortMenu: {
    backgroundColor: Colors.light.white,
    borderBottomWidth: 1,
    borderBottomColor: Colors.light.border,
    paddingHorizontal: 20,
    paddingVertical: 8,
  },
  sortOption: {
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: Colors.light.border,
  },
  sortOptionActive: {
    backgroundColor: Colors.light.surface,
  },
  sortOptionText: {
    fontSize: 14,
    fontWeight: '500' as const,
    color: Colors.light.text,
  },
  sortOptionTextActive: {
    color: Colors.light.primary,
    fontWeight: '600' as const,
  },
});
