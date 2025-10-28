import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  TextInput,
  Modal,
  Animated,
  Dimensions,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Search, ChevronDown, ChevronRight } from "lucide-react-native";
import { useRouter } from "expo-router";
import Colors from "@/constants/colors";

const { width } = Dimensions.get("window");
const DRAWER_WIDTH = width * 0.8;

interface DrawerMenuProps {
  visible: boolean;
  onClose: () => void;
}

interface MenuItem {
  title: string;
  items?: string[];
}

const MENU_DATA: MenuItem[] = [
  {
    title: "JEWELLERY",
    items: ["Rings", "Earrings", "Wristwear"],
  },
  {
    title: "COLLECTIONS",
    items: [
      "Dazzling Brilliance",
      "Promise Of Forever",
      "Timeless Treasure",
      "Twinfinity",
      "Enchant",
      "Lyrical Fantasy",
      "Basket Of Love",
      "Everday Allure",
      "Fashion Forward Rings",
      "Tiryah",
      "Wristwear",
    ],
  },
];

export default function DrawerMenu({ visible, onClose }: DrawerMenuProps) {
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState("");
  const [expandedSections, setExpandedSections] = useState<{ [key: string]: boolean }>({
    JEWELLERY: true,
    COLLECTIONS: true,
  });
  const [slideAnim] = useState(new Animated.Value(-DRAWER_WIDTH));

  React.useEffect(() => {
    if (visible) {
      Animated.spring(slideAnim, {
        toValue: 0,
        useNativeDriver: true,
        tension: 65,
        friction: 11,
      }).start();
    } else {
      Animated.timing(slideAnim, {
        toValue: -DRAWER_WIDTH,
        duration: 250,
        useNativeDriver: true,
      }).start();
    }
  }, [visible, slideAnim]);

  const toggleSection = (section: string) => {
    setExpandedSections((prev) => ({
      ...prev,
      [section]: !prev[section],
    }));
  };

  const handleItemPress = (item: string) => {
    console.log("Navigate to:", item);
    router.push("/(tabs)/shop");
    onClose();
  };

  if (!visible) return null;

  return (
    <Modal
      visible={visible}
      transparent
      animationType="none"
      onRequestClose={onClose}
    >
      <View style={styles.overlay}>
        <TouchableOpacity
          style={styles.backdrop}
          activeOpacity={1}
          onPress={onClose}
        />
        <Animated.View
          style={[
            styles.drawer,
            {
              transform: [{ translateX: slideAnim }],
              paddingTop: insets.top,
              paddingBottom: insets.bottom,
            },
          ]}
        >
          <View style={styles.drawerContent}>
            <View style={styles.searchContainer}>
              <Search color={Colors.light.textSecondary} size={20} />
              <TextInput
                style={styles.searchInput}
                placeholder="Search"
                placeholderTextColor={Colors.light.textSecondary}
                value={searchQuery}
                onChangeText={setSearchQuery}
              />
            </View>

            <ScrollView
              style={styles.menuList}
              showsVerticalScrollIndicator={false}
            >
              {MENU_DATA.map((section) => (
                <View key={section.title} style={styles.section}>
                  <TouchableOpacity
                    style={styles.sectionHeader}
                    onPress={() => toggleSection(section.title)}
                  >
                    <Text style={styles.sectionTitle}>{section.title}</Text>
                    {expandedSections[section.title] ? (
                      <ChevronDown color={Colors.light.primary} size={20} />
                    ) : (
                      <ChevronRight color={Colors.light.textSecondary} size={20} />
                    )}
                  </TouchableOpacity>

                  {expandedSections[section.title] && section.items && (
                    <View style={styles.itemsContainer}>
                      {section.items.map((item) => (
                        <TouchableOpacity
                          key={item}
                          style={styles.menuItem}
                          onPress={() => handleItemPress(item)}
                        >
                          <Text style={styles.menuItemText}>{item}</Text>
                          <ChevronRight
                            color={Colors.light.textSecondary}
                            size={18}
                          />
                        </TouchableOpacity>
                      ))}
                    </View>
                  )}
                </View>
              ))}

              <TouchableOpacity
                style={styles.aboutItem}
                onPress={() => {
                  console.log("Navigate to About Us");
                  onClose();
                }}
              >
                <Text style={styles.aboutItemText}>ABOUT US</Text>
                <ChevronRight color={Colors.light.textSecondary} size={20} />
              </TouchableOpacity>
            </ScrollView>
          </View>
        </Animated.View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    flexDirection: "row" as const,
  },
  backdrop: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  drawer: {
    position: "absolute" as const,
    left: 0,
    top: 0,
    bottom: 0,
    width: DRAWER_WIDTH,
    backgroundColor: Colors.light.white,
    shadowColor: Colors.light.black,
    shadowOffset: { width: 2, height: 0 },
    shadowOpacity: 0.25,
    shadowRadius: 8,
    elevation: 5,
  },
  drawerContent: {
    flex: 1,
  },
  searchContainer: {
    flexDirection: "row" as const,
    alignItems: "center" as const,
    paddingHorizontal: 16,
    paddingVertical: 12,
    marginHorizontal: 16,
    marginTop: 16,
    marginBottom: 8,
    backgroundColor: Colors.light.surface,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: Colors.light.border,
  },
  searchInput: {
    flex: 1,
    marginLeft: 8,
    fontSize: 15,
    color: Colors.light.text,
  },
  menuList: {
    flex: 1,
  },
  section: {
    marginBottom: 8,
  },
  sectionHeader: {
    flexDirection: "row" as const,
    justifyContent: "space-between" as const,
    alignItems: "center" as const,
    paddingHorizontal: 20,
    paddingVertical: 14,
    backgroundColor: Colors.light.primary,
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: "600" as const,
    color: Colors.light.white,
    letterSpacing: 1.2,
  },
  itemsContainer: {
    backgroundColor: Colors.light.white,
  },
  menuItem: {
    flexDirection: "row" as const,
    justifyContent: "space-between" as const,
    alignItems: "center" as const,
    paddingHorizontal: 20,
    paddingVertical: 14,
    borderBottomWidth: 1,
    borderBottomColor: Colors.light.border,
  },
  menuItemText: {
    fontSize: 14,
    color: Colors.light.text,
    fontWeight: "400" as const,
  },
  aboutItem: {
    flexDirection: "row" as const,
    justifyContent: "space-between" as const,
    alignItems: "center" as const,
    paddingHorizontal: 20,
    paddingVertical: 14,
    marginTop: 16,
    borderTopWidth: 1,
    borderTopColor: Colors.light.border,
  },
  aboutItemText: {
    fontSize: 14,
    fontWeight: "600" as const,
    color: Colors.light.text,
    letterSpacing: 1.2,
  },
});
