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
  route?: string;
  items?: string[];
}

const MENU_DATA: MenuItem[] = [
  {
    title: "Rings",
    route: "/(tabs)/shop",
    items: [],
  },
  {
    title: "Earrings",
    route: "/(tabs)/shop",
    items: [],
  },
  {
    title: "Pendants",
    route: "/(tabs)/shop",
    items: [],
  },
  {
    title: "Necklaces",
    route: "/(tabs)/shop",
    items: [],
  },
  {
    title: "Bracelets",
    route: "/(tabs)/shop",
    items: [],
  },
  {
    title: "Collections",
    route: "/(tabs)/shop",
    items: [],
  },
  {
    title: "Create Your Own",
    route: "/(tabs)/shop",
    items: [],
  },
  {
    title: "Diamonds",
    route: "/diamonds/stock-search",
    items: [],
  },
];

export default function DrawerMenu({ visible, onClose }: DrawerMenuProps) {
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState("");
  const [expandedSections, setExpandedSections] = useState<{ [key: string]: boolean }>({});
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

  const handleMainSectionPress = (section: MenuItem) => {
    console.log("Navigate to:", section.title);
    
    if (section.items && section.items.length > 0) {
      toggleSection(section.title);
    } else {
      if (section.route) {
        router.push(section.route as any);
      }
      onClose();
    }
  };

  const handleItemPress = (item: string, section: string) => {
    console.log("Navigate to:", item, "in", section);
    router.push("/(tabs)/shop" as any);
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
                    style={styles.mainSectionButton}
                    onPress={() => handleMainSectionPress(section)}
                    activeOpacity={0.7}
                  >
                    <Text style={styles.mainSectionText}>{section.title}</Text>
                    {section.items && section.items.length > 0 ? (
                      expandedSections[section.title] ? (
                        <ChevronDown color={Colors.light.textSecondary} size={20} />
                      ) : (
                        <ChevronRight color={Colors.light.textSecondary} size={20} />
                      )
                    ) : (
                      <ChevronRight color={Colors.light.textSecondary} size={20} />
                    )}
                  </TouchableOpacity>

                  {expandedSections[section.title] && section.items && section.items.length > 0 && (
                    <View style={styles.itemsContainer}>
                      {section.items.map((item) => (
                        <TouchableOpacity
                          key={item}
                          style={styles.menuItem}
                          onPress={() => handleItemPress(item, section.title)}
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
                <Text style={styles.aboutItemText}>About Us</Text>
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
    marginBottom: 0,
  },
  mainSectionButton: {
    flexDirection: "row" as const,
    justifyContent: "space-between" as const,
    alignItems: "center" as const,
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: Colors.light.border,
    backgroundColor: Colors.light.white,
  },
  mainSectionText: {
    fontSize: 16,
    fontWeight: "500" as const,
    color: Colors.light.text,
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
    fontSize: 16,
    fontWeight: "500" as const,
    color: Colors.light.text,
  },
});
