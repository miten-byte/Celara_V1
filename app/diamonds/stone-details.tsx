import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
  Dimensions,
} from "react-native";
import { Stack, useRouter } from "expo-router";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import {
  ZoomIn,
  ZoomOut,
  Share2,
  Heart,
  ShoppingCart,
  MoreVertical,
} from "lucide-react-native";
import Colors from "@/constants/colors";

const { width } = Dimensions.get("window");

const TABS = ["Image", "Video", "Certificate"];

const DIAMOND_INFO = {
  id: "#R0024630",
  shape: "RD",
  carat: "0.520",
  clarity: "IF",
  color: "D",
  cut: "EX",
  polish: "EX",
  symmetry: "VG",
  fluorescence: "(TR)SI",
  certificate: "0512617",
  lab: "GIA",
  discount: "-31.58%",
  rap: "$0",
  pricePerCarat: "$467.90/cts",
  totalPrice: "$243.31amt",
  reportNo: "5572645H",
  rapValue: "3700",
  shade: "-",
  milky: "-",
};

export default function StoneDetailsScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const [activeTab, setActiveTab] = useState("Image");

  return (
    <View style={styles.container}>
      <Stack.Screen
        options={{
          title: "Stone Detail",
          headerStyle: { backgroundColor: Colors.light.white },
          headerTintColor: Colors.light.text,
          headerShadowVisible: false,
          headerRight: () => (
            <TouchableOpacity style={styles.headerButton}>
              <MoreVertical color={Colors.light.text} size={20} />
            </TouchableOpacity>
          ),
        }}
      />

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.tabs}>
          {TABS.map((tab) => (
            <TouchableOpacity
              key={tab}
              style={[
                styles.tab,
                activeTab === tab && styles.tabActive,
              ]}
              onPress={() => setActiveTab(tab)}
            >
              <Text
                style={[
                  styles.tabText,
                  activeTab === tab && styles.tabTextActive,
                ]}
              >
                {tab}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        <View style={styles.imageContainer}>
          <Image
            source={{
              uri: "https://images.unsplash.com/photo-1605100804763-247f67b3557e?w=800&q=80",
            }}
            style={styles.diamondImage}
            resizeMode="contain"
          />
          <View style={styles.imageActions}>
            <TouchableOpacity style={styles.imageActionButton}>
              <ZoomIn color={Colors.light.text} size={20} />
            </TouchableOpacity>
            <TouchableOpacity style={styles.imageActionButton}>
              <ZoomOut color={Colors.light.text} size={20} />
            </TouchableOpacity>
            <TouchableOpacity style={styles.imageActionButton}>
              <Share2 color={Colors.light.text} size={20} />
            </TouchableOpacity>
          </View>
        </View>

        <View style={styles.infoCard}>
          <View style={styles.infoHeader}>
            <Text style={styles.infoId}>{DIAMOND_INFO.id}</Text>
            <View style={styles.shapeTag}>
              <Text style={styles.shapeTagText}>{DIAMOND_INFO.shape}</Text>
            </View>
          </View>
          <Text style={styles.infoSpecs}>
            {DIAMOND_INFO.carat} {DIAMOND_INFO.clarity} {DIAMOND_INFO.color}{" "}
            {DIAMOND_INFO.cut} {DIAMOND_INFO.polish} {DIAMOND_INFO.symmetry}{" "}
            {DIAMOND_INFO.fluorescence} (D%){DIAMOND_INFO.certificate}
          </Text>
          <View style={styles.priceRow}>
            <View style={styles.discountBadge}>
              <Text style={styles.discountText}>{DIAMOND_INFO.discount}</Text>
            </View>
            <Text style={styles.pricePerCarat}>
              {DIAMOND_INFO.pricePerCarat}
            </Text>
            <Text style={styles.totalPrice}>{DIAMOND_INFO.totalPrice}</Text>
          </View>
        </View>

        <View style={styles.detailsCard}>
          <Text style={styles.detailsTitle}>Diamond Description</Text>
          <View style={styles.detailsGrid}>
            <View style={styles.detailRow}>
              <Text style={styles.detailLabel}>Report No. :</Text>
              <Text style={styles.detailValue}>{DIAMOND_INFO.reportNo}</Text>
            </View>
            <View style={styles.detailRow}>
              <Text style={styles.detailLabel}>Rap $ :</Text>
              <Text style={styles.detailValue}>{DIAMOND_INFO.rapValue}</Text>
            </View>
            <View style={styles.detailRow}>
              <Text style={styles.detailLabel}>Shade :</Text>
              <Text style={styles.detailValue}>{DIAMOND_INFO.shade}</Text>
            </View>
            <View style={styles.detailRow}>
              <Text style={styles.detailLabel}>Milky :</Text>
              <Text style={styles.detailValue}>{DIAMOND_INFO.milky}</Text>
            </View>
          </View>
        </View>
      </ScrollView>

      <View
        style={[
          styles.bottomButtons,
          { paddingBottom: Math.max(insets.bottom, 16) },
        ]}
      >
        <TouchableOpacity style={styles.bottomIconButton}>
          <Heart color={Colors.light.white} size={24} />
        </TouchableOpacity>
        <TouchableOpacity style={styles.buyNowButton}>
          <Text style={styles.buyNowText}>Buy Now</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.addToCartButton}>
          <ShoppingCart color={Colors.light.white} size={24} />
          <Text style={styles.addToCartText}>Add To Cart</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.light.white,
  },
  headerButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: Colors.light.surface,
    justifyContent: "center" as const,
    alignItems: "center" as const,
    marginRight: 8,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 100,
  },
  tabs: {
    flexDirection: "row" as const,
    backgroundColor: Colors.light.white,
    borderBottomWidth: 1,
    borderBottomColor: Colors.light.border,
  },
  tab: {
    flex: 1,
    paddingVertical: 16,
    alignItems: "center" as const,
    borderBottomWidth: 2,
    borderBottomColor: "transparent",
  },
  tabActive: {
    borderBottomColor: Colors.light.primary,
  },
  tabText: {
    fontSize: 14,
    fontWeight: "500" as const,
    color: Colors.light.textSecondary,
  },
  tabTextActive: {
    fontWeight: "600" as const,
    color: Colors.light.primary,
  },
  imageContainer: {
    width: width,
    height: width,
    backgroundColor: Colors.light.surface,
    position: "relative" as const,
  },
  diamondImage: {
    width: "100%" as const,
    height: "100%" as const,
  },
  imageActions: {
    position: "absolute" as const,
    right: 16,
    top: 16,
    gap: 12,
  },
  imageActionButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: Colors.light.white,
    justifyContent: "center" as const,
    alignItems: "center" as const,
    shadowColor: Colors.light.black,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  infoCard: {
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: Colors.light.border,
  },
  infoHeader: {
    flexDirection: "row" as const,
    justifyContent: "space-between" as const,
    alignItems: "center" as const,
    marginBottom: 8,
  },
  infoId: {
    fontSize: 16,
    fontWeight: "700" as const,
    color: Colors.light.text,
  },
  shapeTag: {
    backgroundColor: "#4CAF50",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 6,
  },
  shapeTagText: {
    fontSize: 12,
    fontWeight: "700" as const,
    color: Colors.light.white,
  },
  infoSpecs: {
    fontSize: 11,
    color: Colors.light.textSecondary,
    marginBottom: 12,
    lineHeight: 18,
  },
  priceRow: {
    flexDirection: "row" as const,
    alignItems: "center" as const,
    gap: 16,
  },
  discountBadge: {
    backgroundColor: "#F44336",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 6,
  },
  discountText: {
    fontSize: 13,
    fontWeight: "700" as const,
    color: Colors.light.white,
  },
  pricePerCarat: {
    fontSize: 14,
    fontWeight: "600" as const,
    color: Colors.light.text,
  },
  totalPrice: {
    fontSize: 16,
    fontWeight: "700" as const,
    color: Colors.light.primary,
  },
  detailsCard: {
    padding: 20,
  },
  detailsTitle: {
    fontSize: 16,
    fontWeight: "600" as const,
    color: Colors.light.text,
    marginBottom: 16,
  },
  detailsGrid: {
    gap: 16,
  },
  detailRow: {
    flexDirection: "row" as const,
    paddingBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: Colors.light.border,
  },
  detailLabel: {
    width: 120,
    fontSize: 14,
    fontWeight: "500" as const,
    color: Colors.light.textSecondary,
  },
  detailValue: {
    flex: 1,
    fontSize: 14,
    fontWeight: "600" as const,
    color: Colors.light.text,
  },
  bottomButtons: {
    position: "absolute" as const,
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: Colors.light.white,
    borderTopWidth: 1,
    borderTopColor: Colors.light.border,
    flexDirection: "row" as const,
    paddingHorizontal: 20,
    paddingTop: 16,
    gap: 12,
  },
  bottomIconButton: {
    width: 52,
    height: 52,
    borderRadius: 10,
    backgroundColor: Colors.light.primary,
    justifyContent: "center" as const,
    alignItems: "center" as const,
  },
  buyNowButton: {
    flex: 1,
    height: 52,
    borderRadius: 10,
    backgroundColor: Colors.light.primary,
    justifyContent: "center" as const,
    alignItems: "center" as const,
  },
  buyNowText: {
    fontSize: 15,
    fontWeight: "700" as const,
    color: Colors.light.white,
  },
  addToCartButton: {
    flex: 1,
    height: 52,
    borderRadius: 10,
    backgroundColor: Colors.light.text,
    flexDirection: "row" as const,
    justifyContent: "center" as const,
    alignItems: "center" as const,
    gap: 8,
  },
  addToCartText: {
    fontSize: 15,
    fontWeight: "700" as const,
    color: Colors.light.white,
  },
});