import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
} from "react-native";
import { Stack, useRouter } from "expo-router";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { ChevronRight, Menu, MoreVertical, Filter } from "lucide-react-native";
import Colors from "@/constants/colors";

interface Diamond {
  id: string;
  stoneId: string;
  shape: string;
  carat: string;
  clarity: string;
  color: string;
  cut: string;
  polish: string;
  symmetry: string;
  fluorescence: string;
  certificate: string;
  certNumber: string;
  lab: string;
  discount: string;
  rap: string;
  pricePerCarat: string;
  totalPrice: string;
}

const MOCK_DIAMONDS: Diamond[] = [
  {
    id: "1",
    stoneId: "#R0024632",
    shape: "RD",
    carat: "0.600",
    clarity: "IF",
    color: "D",
    cut: "EX",
    polish: "EX",
    symmetry: "VG",
    fluorescence: "(TR)SI",
    certificate: "#94124",
    certNumber: "0512617",
    lab: "GIA",
    discount: "-11.75",
    rap: "$7,264.57/ct",
    pricePerCarat: "$7,061.50",
    totalPrice: "$2,000.61Cts",
  },
  {
    id: "2",
    stoneId: "#R0024633",
    shape: "RD",
    carat: "0.520",
    clarity: "IF",
    color: "E",
    cut: "EX",
    polish: "EX",
    symmetry: "VG",
    fluorescence: "(TR)SI",
    certificate: "#94125",
    certNumber: "0512618",
    lab: "GIA",
    discount: "-31.58%",
    rap: "$0",
    pricePerCarat: "$1,710.52/Cts",
    totalPrice: "$889.470",
  },
  {
    id: "3",
    stoneId: "#R0024669",
    shape: "RD",
    carat: "0.600",
    clarity: "IF",
    color: "F",
    cut: "EX",
    polish: "EX",
    symmetry: "VG",
    fluorescence: "(TR)SI",
    certificate: "#94126",
    certNumber: "0512619",
    lab: "GIA",
    discount: "-31.75%",
    rap: "$0",
    pricePerCarat: "$1,072.97/Cts",
    totalPrice: "$643.782",
  },
];

export default function SearchResultsScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();

  const renderDiamond = ({ item }: { item: Diamond }) => (
    <TouchableOpacity
      style={styles.diamondCard}
      onPress={() => router.push("/diamonds/stone-details")}
    >
      <View style={styles.diamondHeader}>
        <View style={styles.diamondHeaderLeft}>
          <View style={styles.shapeTag}>
            <Text style={styles.shapeTagText}>{item.shape}</Text>
          </View>
          <View style={styles.diamondHeaderInfo}>
            <Text style={styles.diamondSpecs}>
              {item.carat} {item.clarity} {item.color} {item.cut} {item.polish}{" "}
              {item.symmetry}
            </Text>
            <Text style={styles.diamondId}>
              {item.lab} {item.stoneId} / {item.certNumber} / {item.lab}
            </Text>
          </View>
        </View>
        <ChevronRight color={Colors.light.textSecondary} size={20} />
      </View>

      <View style={styles.diamondDetails}>
        <View style={styles.detailItem}>
          <Text style={styles.detailLabel}>RES</Text>
          <Text style={styles.detailValue}>0.640</Text>
        </View>
        <View style={styles.detailItem}>
          <Text style={styles.detailLabel}>CVS</Text>
          <Text style={styles.detailValue}>-11.72</Text>
        </View>
        <View style={styles.detailItem}>
          <Text style={styles.detailLabel}>DBOX</Text>
          <Text style={styles.detailValue}>-</Text>
        </View>
        <View style={styles.detailItem}>
          <Text style={styles.detailLabel}>PRICE</Text>
          <Text style={styles.detailValue}>LAB Test</Text>
        </View>
        <View style={styles.detailItem}>
          <Text style={styles.detailLabel}>AMT$</Text>
          <Text style={styles.detailValue}>Jul 2024</Text>
        </View>
      </View>

      <View style={styles.diamondPricing}>
        <View style={styles.discountBadge}>
          <Text style={styles.discountText}>{item.discount}</Text>
        </View>
        <View style={styles.pricingInfo}>
          <Text style={styles.rapPrice}>{item.rap}</Text>
          <Text style={styles.totalPrice}>{item.totalPrice}</Text>
        </View>
      </View>

      <View style={styles.pricePerCarat}>
        <Text style={styles.pricePerCaratText}>{item.pricePerCarat}</Text>
        <Text style={styles.availabilityText}>$248.18 Avail</Text>
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <Stack.Screen
        options={{
          title: "Search Result",
          headerStyle: { backgroundColor: Colors.light.white },
          headerTintColor: Colors.light.text,
          headerShadowVisible: false,
          headerRight: () => (
            <View style={styles.headerRight}>
              <TouchableOpacity style={styles.headerButton}>
                <Menu color={Colors.light.text} size={20} />
              </TouchableOpacity>
              <TouchableOpacity style={styles.headerButton}>
                <MoreVertical color={Colors.light.text} size={20} />
              </TouchableOpacity>
            </View>
          ),
        }}
      />

      <View style={styles.resultsHeader}>
        <Text style={styles.resultsCount}>Total 114587</Text>
        <TouchableOpacity style={styles.filterButton}>
          <Filter color={Colors.light.text} size={16} />
          <Text style={styles.filterText}>Filter</Text>
        </TouchableOpacity>
      </View>

      <FlatList
        data={MOCK_DIAMONDS}
        renderItem={renderDiamond}
        keyExtractor={(item) => item.id}
        contentContainerStyle={[
          styles.listContent,
          { paddingBottom: Math.max(insets.bottom + 100, 100) },
        ]}
        showsVerticalScrollIndicator={false}
      />

      <View
        style={[
          styles.bottomButtons,
          { paddingBottom: Math.max(insets.bottom, 16) },
        ]}
      >
        <TouchableOpacity style={styles.buyNowButton}>
          <Text style={styles.buyNowText}>Customize</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.addToCartButton}>
          <Text style={styles.addToCartText}>Add To Cart</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.light.surface,
  },
  headerRight: {
    flexDirection: "row" as const,
    gap: 12,
    marginRight: 8,
  },
  headerButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: Colors.light.surface,
    justifyContent: "center" as const,
    alignItems: "center" as const,
  },
  resultsHeader: {
    flexDirection: "row" as const,
    justifyContent: "space-between" as const,
    alignItems: "center" as const,
    padding: 16,
    backgroundColor: Colors.light.white,
    borderBottomWidth: 1,
    borderBottomColor: Colors.light.border,
  },
  resultsCount: {
    fontSize: 14,
    fontWeight: "600" as const,
    color: Colors.light.text,
  },
  filterButton: {
    flexDirection: "row" as const,
    alignItems: "center" as const,
    gap: 6,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 6,
    backgroundColor: Colors.light.surface,
  },
  filterText: {
    fontSize: 13,
    fontWeight: "600" as const,
    color: Colors.light.text,
  },
  listContent: {
    padding: 16,
  },
  diamondCard: {
    backgroundColor: Colors.light.white,
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: Colors.light.border,
  },
  diamondHeader: {
    flexDirection: "row" as const,
    justifyContent: "space-between" as const,
    alignItems: "flex-start" as const,
    marginBottom: 12,
  },
  diamondHeaderLeft: {
    flex: 1,
    flexDirection: "row" as const,
    gap: 10,
  },
  shapeTag: {
    backgroundColor: "#FFA726",
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
  },
  shapeTagText: {
    fontSize: 11,
    fontWeight: "700" as const,
    color: Colors.light.white,
  },
  diamondHeaderInfo: {
    flex: 1,
  },
  diamondSpecs: {
    fontSize: 11,
    fontWeight: "600" as const,
    color: Colors.light.text,
    marginBottom: 4,
  },
  diamondId: {
    fontSize: 10,
    color: Colors.light.textSecondary,
  },
  diamondDetails: {
    flexDirection: "row" as const,
    justifyContent: "space-between" as const,
    marginBottom: 12,
    paddingBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: Colors.light.border,
  },
  detailItem: {
    alignItems: "center" as const,
  },
  detailLabel: {
    fontSize: 10,
    color: Colors.light.textSecondary,
    marginBottom: 4,
  },
  detailValue: {
    fontSize: 11,
    fontWeight: "600" as const,
    color: Colors.light.text,
  },
  diamondPricing: {
    flexDirection: "row" as const,
    alignItems: "center" as const,
    gap: 12,
    marginBottom: 8,
  },
  discountBadge: {
    backgroundColor: "#4CAF50",
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 6,
  },
  discountText: {
    fontSize: 12,
    fontWeight: "700" as const,
    color: Colors.light.white,
  },
  pricingInfo: {
    flex: 1,
    flexDirection: "row" as const,
    justifyContent: "space-between" as const,
  },
  rapPrice: {
    fontSize: 13,
    fontWeight: "600" as const,
    color: Colors.light.text,
  },
  totalPrice: {
    fontSize: 13,
    fontWeight: "700" as const,
    color: Colors.light.primary,
  },
  pricePerCarat: {
    flexDirection: "row" as const,
    justifyContent: "space-between" as const,
    alignItems: "center" as const,
  },
  pricePerCaratText: {
    fontSize: 13,
    fontWeight: "600" as const,
    color: Colors.light.text,
  },
  availabilityText: {
    fontSize: 12,
    fontWeight: "500" as const,
    color: "#F44336",
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
    backgroundColor: Colors.light.surface,
    borderWidth: 1.5,
    borderColor: Colors.light.primary,
    justifyContent: "center" as const,
    alignItems: "center" as const,
  },
  addToCartText: {
    fontSize: 15,
    fontWeight: "700" as const,
    color: Colors.light.primary,
  },
});