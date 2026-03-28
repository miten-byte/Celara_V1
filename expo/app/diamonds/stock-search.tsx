import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
} from "react-native";
import { Stack, useRouter } from "expo-router";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Menu, Search, RefreshCw } from "lucide-react-native";
import Colors from "@/constants/colors";

const SHAPES = [
  { id: "RD", label: "RD" },
  { id: "PR", label: "PR" },
  { id: "CUS", label: "CUS" },
  { id: "EM", label: "EM" },
  { id: "HRT", label: "HRT" },
  { id: "PS", label: "PS" },
  { id: "MQ", label: "MQ" },
  { id: "LR", label: "LR" },
  { id: "OVAL", label: "OVAL" },
  { id: "Other", label: "Other" },
];

const COLOR_LETTERS = [
  ["D", "E", "F", "G", "H", "I", "J", "K"],
  ["L", "M", "N", "O-P", "P", "Q", "Q-R"],
  ["S-T", "W-X", "Y-Z"],
];

export default function StockSearchScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const [selectedShapes, setSelectedShapes] = useState<string[]>([]);
  const [caratFrom, setCaratFrom] = useState("");
  const [caratTo, setCaratTo] = useState("");
  const [colorMode, setColorMode] = useState<"white" | "fancy">("white");
  const [selectedColors, setSelectedColors] = useState<string[]>([]);

  const toggleShape = (shapeId: string) => {
    if (selectedShapes.includes(shapeId)) {
      setSelectedShapes(selectedShapes.filter((id) => id !== shapeId));
    } else {
      setSelectedShapes([...selectedShapes, shapeId]);
    }
  };

  const toggleColor = (color: string) => {
    if (selectedColors.includes(color)) {
      setSelectedColors(selectedColors.filter((c) => c !== color));
    } else {
      setSelectedColors([...selectedColors, color]);
    }
  };

  const handleSearch = () => {
    console.log("Searching with:", {
      shapes: selectedShapes,
      carat: { from: caratFrom, to: caratTo },
      colorMode,
      colors: selectedColors,
    });
    router.push("/diamonds/search-results");
  };

  const handleRefresh = () => {
    setSelectedShapes([]);
    setCaratFrom("");
    setCaratTo("");
    setColorMode("white");
    setSelectedColors([]);
  };

  return (
    <View style={styles.container}>
      <Stack.Screen
        options={{
          title: "Stock Search",
          headerStyle: { backgroundColor: Colors.light.white },
          headerTintColor: Colors.light.text,
          headerShadowVisible: false,
        }}
      />

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Shape</Text>
          <View style={styles.shapesGrid}>
            {SHAPES.map((shape) => {
              const isSelected = selectedShapes.includes(shape.id);
              return (
                <TouchableOpacity
                  key={shape.id}
                  style={[
                    styles.shapeButton,
                    isSelected && styles.shapeButtonSelected,
                  ]}
                  onPress={() => toggleShape(shape.id)}
                >
                  <Text
                    style={[
                      styles.shapeButtonText,
                      isSelected && styles.shapeButtonTextSelected,
                    ]}
                  >
                    {shape.label}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Carat Weight</Text>
          <View style={styles.caratContainer}>
            <TextInput
              style={styles.caratInput}
              placeholder="From"
              placeholderTextColor={Colors.light.textSecondary}
              keyboardType="decimal-pad"
              value={caratFrom}
              onChangeText={setCaratFrom}
            />
            <Text style={styles.caratSeparator}>To</Text>
            <TextInput
              style={styles.caratInput}
              placeholder="To"
              placeholderTextColor={Colors.light.textSecondary}
              keyboardType="decimal-pad"
              value={caratTo}
              onChangeText={setCaratTo}
            />
            <TouchableOpacity style={styles.caratAddButton}>
              <Text style={styles.caratAddButtonText}>+</Text>
            </TouchableOpacity>
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Color</Text>
          <View style={styles.colorModeContainer}>
            <TouchableOpacity
              style={[
                styles.colorModeButton,
                colorMode === "white" && styles.colorModeButtonActive,
              ]}
              onPress={() => setColorMode("white")}
            >
              <Text
                style={[
                  styles.colorModeText,
                  colorMode === "white" && styles.colorModeTextActive,
                ]}
              >
                White
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[
                styles.colorModeButton,
                colorMode === "fancy" && styles.colorModeButtonActive,
              ]}
              onPress={() => setColorMode("fancy")}
            >
              <Text
                style={[
                  styles.colorModeText,
                  colorMode === "fancy" && styles.colorModeTextActive,
                ]}
              >
                Fancy
              </Text>
            </TouchableOpacity>
          </View>

          <View style={styles.colorGrid}>
            {COLOR_LETTERS.map((row, rowIndex) => (
              <View key={rowIndex} style={styles.colorRow}>
                {row.map((color) => {
                  const isSelected = selectedColors.includes(color);
                  return (
                    <TouchableOpacity
                      key={color}
                      style={[
                        styles.colorButton,
                        isSelected && styles.colorButtonSelected,
                      ]}
                      onPress={() => toggleColor(color)}
                    >
                      <Text
                        style={[
                          styles.colorButtonText,
                          isSelected && styles.colorButtonTextSelected,
                        ]}
                      >
                        {color}
                      </Text>
                    </TouchableOpacity>
                  );
                })}
              </View>
            ))}
          </View>
        </View>
      </ScrollView>

      <View
        style={[
          styles.bottomButtons,
          { paddingBottom: Math.max(insets.bottom, 16) },
        ]}
      >
        <TouchableOpacity style={styles.bottomButton} onPress={handleRefresh}>
          <RefreshCw color={Colors.light.text} size={20} />
          <Text style={styles.bottomButtonText}>Refresh Search</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.bottomButton, styles.searchButton]}
          onPress={handleSearch}
        >
          <Search color={Colors.light.white} size={20} />
          <Text style={styles.searchButtonText}>Search (P)</Text>
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
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    padding: 20,
    paddingBottom: 100,
  },
  section: {
    marginBottom: 28,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: "600" as const,
    color: Colors.light.text,
    marginBottom: 12,
  },
  shapesGrid: {
    flexDirection: "row" as const,
    flexWrap: "wrap" as const,
    gap: 12,
  },
  shapeButton: {
    width: 70,
    height: 70,
    borderRadius: 8,
    backgroundColor: Colors.light.surface,
    borderWidth: 1.5,
    borderColor: Colors.light.border,
    justifyContent: "center" as const,
    alignItems: "center" as const,
  },
  shapeButtonSelected: {
    backgroundColor: Colors.light.primary,
    borderColor: Colors.light.primary,
  },
  shapeButtonText: {
    fontSize: 13,
    fontWeight: "600" as const,
    color: Colors.light.text,
  },
  shapeButtonTextSelected: {
    color: Colors.light.white,
  },
  caratContainer: {
    flexDirection: "row" as const,
    alignItems: "center" as const,
    gap: 12,
  },
  caratInput: {
    flex: 1,
    height: 48,
    backgroundColor: Colors.light.surface,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: Colors.light.border,
    paddingHorizontal: 16,
    fontSize: 15,
    color: Colors.light.text,
  },
  caratSeparator: {
    fontSize: 15,
    color: Colors.light.textSecondary,
    fontWeight: "500" as const,
  },
  caratAddButton: {
    width: 48,
    height: 48,
    borderRadius: 8,
    backgroundColor: Colors.light.surface,
    borderWidth: 1,
    borderColor: Colors.light.border,
    justifyContent: "center" as const,
    alignItems: "center" as const,
  },
  caratAddButtonText: {
    fontSize: 24,
    color: Colors.light.text,
    fontWeight: "300" as const,
  },
  colorModeContainer: {
    flexDirection: "row" as const,
    marginBottom: 16,
    backgroundColor: Colors.light.surface,
    borderRadius: 8,
    padding: 4,
  },
  colorModeButton: {
    flex: 1,
    paddingVertical: 10,
    borderRadius: 6,
    alignItems: "center" as const,
  },
  colorModeButtonActive: {
    backgroundColor: Colors.light.text,
  },
  colorModeText: {
    fontSize: 15,
    fontWeight: "600" as const,
    color: Colors.light.text,
  },
  colorModeTextActive: {
    color: Colors.light.white,
  },
  colorGrid: {
    gap: 10,
  },
  colorRow: {
    flexDirection: "row" as const,
    gap: 10,
  },
  colorButton: {
    flex: 1,
    height: 44,
    borderRadius: 8,
    backgroundColor: Colors.light.surface,
    borderWidth: 1,
    borderColor: Colors.light.border,
    justifyContent: "center" as const,
    alignItems: "center" as const,
  },
  colorButtonSelected: {
    backgroundColor: Colors.light.primary,
    borderColor: Colors.light.primary,
  },
  colorButtonText: {
    fontSize: 13,
    fontWeight: "600" as const,
    color: Colors.light.text,
  },
  colorButtonTextSelected: {
    color: Colors.light.white,
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
  bottomButton: {
    flex: 1,
    height: 52,
    borderRadius: 10,
    backgroundColor: Colors.light.surface,
    borderWidth: 1.5,
    borderColor: Colors.light.border,
    flexDirection: "row" as const,
    justifyContent: "center" as const,
    alignItems: "center" as const,
    gap: 8,
  },
  bottomButtonText: {
    fontSize: 14,
    fontWeight: "600" as const,
    color: Colors.light.text,
  },
  searchButton: {
    backgroundColor: Colors.light.primary,
    borderColor: Colors.light.primary,
  },
  searchButtonText: {
    fontSize: 14,
    fontWeight: "600" as const,
    color: Colors.light.white,
  },
});