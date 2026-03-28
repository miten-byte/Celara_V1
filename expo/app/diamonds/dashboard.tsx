import React from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
} from "react-native";
import { Stack, useRouter } from "expo-router";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import {
  FileText,
  Heart,
  Lock,
  ShoppingBag,
  Phone,
  Mail,
  MessageCircle,
  Video,
  ChevronRight,
  Bookmark,
  RotateCcw,
} from "lucide-react-native";
import Colors from "@/constants/colors";

const STATS = [
  { id: "cert", label: "My Cert", value: "116", icon: FileText, color: "#00BCD4" },
  { id: "wishlist", label: "My Wishlist", value: "62", icon: Heart, color: "#4CAF50" },
  { id: "block", label: "My Block", value: "50", icon: Lock, color: "#2196F3" },
  { id: "purchase", label: "My Purchase", value: "150", icon: ShoppingBag, color: "#FF4081" },
];

const NEW_UPLOADS = [
  {
    id: "1",
    stoneId: "#R0024630",
    specs: "RD 0.52 D IF GIA EX EX EX MED",
    disc: "-4.60",
    psc: "$7,000.00",
    amt: "$7,000.00",
  },
];

const RECENT_SEARCHES = [
  {
    id: "1",
    title: "Full Stock",
    date: "10 Oct 2023 12:00 PM",
  },
  {
    id: "2",
    title: "RD F VVS+",
    date: "10 Oct 2023 12:00 PM",
  },
];

export default function DashboardScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();

  return (
    <View style={styles.container}>
      <Stack.Screen
        options={{
          title: "Dashboard",
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
        <View style={styles.statsGrid}>
          {STATS.map((stat) => {
            const IconComponent = stat.icon;
            return (
              <TouchableOpacity key={stat.id} style={styles.statCard}>
                <Text style={styles.statValue}>{stat.value}</Text>
                <View
                  style={[
                    styles.statIconContainer,
                    { backgroundColor: stat.color + "20" },
                  ]}
                >
                  <IconComponent color={stat.color} size={20} />
                </View>
                <Text style={styles.statLabel}>{stat.label}</Text>
              </TouchableOpacity>
            );
          })}
        </View>

        <View style={styles.contactCard}>
          <View style={styles.contactHeader}>
            <FileText color={Colors.light.text} size={18} />
            <Text style={styles.contactTitle}>Contact Sales executive</Text>
          </View>
          <View style={styles.contactContent}>
            <View style={styles.contactAvatar}>
              <Text style={styles.contactAvatarText}>A</Text>
            </View>
            <View style={styles.contactInfo}>
              <Text style={styles.contactName}>Admin</Text>
              <Text style={styles.contactEmail}>admin@gmail.com</Text>
            </View>
          </View>
          <View style={styles.contactActions}>
            <TouchableOpacity style={styles.contactActionButton}>
              <Phone color={Colors.light.text} size={18} />
            </TouchableOpacity>
            <TouchableOpacity style={styles.contactActionButton}>
              <Mail color={Colors.light.text} size={18} />
            </TouchableOpacity>
            <TouchableOpacity style={styles.contactActionButton}>
              <MessageCircle color={Colors.light.text} size={18} />
            </TouchableOpacity>
            <TouchableOpacity style={styles.contactActionButton}>
              <Video color={Colors.light.text} size={18} />
            </TouchableOpacity>
          </View>
        </View>

        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>New Uploads (399)</Text>
            <TouchableOpacity>
              <Text style={styles.seeAllText}>See All</Text>
            </TouchableOpacity>
          </View>
          {NEW_UPLOADS.map((upload) => (
            <TouchableOpacity
              key={upload.id}
              style={styles.uploadCard}
              onPress={() => router.push("/diamonds/stone-details")}
            >
              <View style={styles.uploadIcon}>
                <Image
                  source={{ uri: "https://via.placeholder.com/60" }}
                  style={styles.uploadImage}
                />
              </View>
              <View style={styles.uploadContent}>
                <Text style={styles.uploadId}>
                  Stone id: {upload.stoneId}
                </Text>
                <Text style={styles.uploadSpecs}>{upload.specs}</Text>
                <View style={styles.uploadPricing}>
                  <Text style={styles.uploadDisc}>Disc: {upload.disc}</Text>
                  <Text style={styles.uploadPsc}>PSC: {upload.psc}</Text>
                  <Text style={styles.uploadAmt}>AMT: {upload.amt}</Text>
                </View>
              </View>
              <View style={styles.uploadActions}>
                <TouchableOpacity style={styles.uploadActionButton}>
                  <Heart color={Colors.light.textSecondary} size={18} />
                </TouchableOpacity>
                <TouchableOpacity style={styles.uploadActionButton}>
                  <ShoppingBag color={Colors.light.textSecondary} size={18} />
                </TouchableOpacity>
                <TouchableOpacity style={styles.uploadViewButton}>
                  <Text style={styles.uploadViewText}>View All</Text>
                </TouchableOpacity>
              </View>
            </TouchableOpacity>
          ))}
        </View>

        <View style={styles.searchButtons}>
          <TouchableOpacity
            style={styles.saveSearchButton}
            onPress={() => router.push("/diamonds/stock-search")}
          >
            <Bookmark color={Colors.light.white} size={20} />
            <Text style={styles.saveSearchText}>Saved Search</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.recentSearchButton}
            onPress={() => router.push("/diamonds/stock-search")}
          >
            <RotateCcw color={Colors.light.primary} size={20} />
            <Text style={styles.recentSearchText}>Recent Search</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Recent Search</Text>
            <TouchableOpacity>
              <Text style={styles.seeAllText}>See All</Text>
            </TouchableOpacity>
          </View>
          {RECENT_SEARCHES.map((search) => (
            <TouchableOpacity key={search.id} style={styles.searchItem}>
              <View>
                <Text style={styles.searchTitle}>{search.title}</Text>
                <Text style={styles.searchDate}>{search.date}</Text>
              </View>
              <ChevronRight color={Colors.light.textSecondary} size={20} />
            </TouchableOpacity>
          ))}
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.light.surface,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    padding: 16,
    paddingBottom: 32,
  },
  statsGrid: {
    flexDirection: "row" as const,
    flexWrap: "wrap" as const,
    gap: 12,
    marginBottom: 16,
  },
  statCard: {
    width: "48%" as const,
    backgroundColor: Colors.light.white,
    borderRadius: 12,
    padding: 16,
    alignItems: "flex-start" as const,
  },
  statValue: {
    fontSize: 32,
    fontWeight: "700" as const,
    color: Colors.light.text,
    marginBottom: 8,
  },
  statIconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: "center" as const,
    alignItems: "center" as const,
    marginBottom: 8,
  },
  statLabel: {
    fontSize: 13,
    color: Colors.light.textSecondary,
    fontWeight: "500" as const,
  },
  contactCard: {
    backgroundColor: Colors.light.white,
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
  },
  contactHeader: {
    flexDirection: "row" as const,
    alignItems: "center" as const,
    gap: 8,
    marginBottom: 16,
  },
  contactTitle: {
    fontSize: 14,
    fontWeight: "600" as const,
    color: Colors.light.text,
  },
  contactContent: {
    flexDirection: "row" as const,
    alignItems: "center" as const,
    gap: 12,
    marginBottom: 16,
  },
  contactAvatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: Colors.light.primary,
    justifyContent: "center" as const,
    alignItems: "center" as const,
  },
  contactAvatarText: {
    fontSize: 20,
    fontWeight: "700" as const,
    color: Colors.light.white,
  },
  contactInfo: {
    flex: 1,
  },
  contactName: {
    fontSize: 16,
    fontWeight: "600" as const,
    color: Colors.light.text,
    marginBottom: 4,
  },
  contactEmail: {
    fontSize: 13,
    color: Colors.light.textSecondary,
  },
  contactActions: {
    flexDirection: "row" as const,
    gap: 12,
  },
  contactActionButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: Colors.light.surface,
    justifyContent: "center" as const,
    alignItems: "center" as const,
    borderWidth: 1,
    borderColor: Colors.light.border,
  },
  section: {
    marginBottom: 16,
  },
  sectionHeader: {
    flexDirection: "row" as const,
    justifyContent: "space-between" as const,
    alignItems: "center" as const,
    marginBottom: 12,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: "600" as const,
    color: Colors.light.text,
  },
  seeAllText: {
    fontSize: 13,
    fontWeight: "600" as const,
    color: Colors.light.primary,
  },
  uploadCard: {
    backgroundColor: Colors.light.white,
    borderRadius: 12,
    padding: 16,
    flexDirection: "row" as const,
    gap: 12,
  },
  uploadIcon: {
    width: 60,
    height: 60,
    borderRadius: 8,
    backgroundColor: Colors.light.surface,
    overflow: "hidden" as const,
  },
  uploadImage: {
    width: "100%" as const,
    height: "100%" as const,
  },
  uploadContent: {
    flex: 1,
  },
  uploadId: {
    fontSize: 13,
    fontWeight: "600" as const,
    color: Colors.light.text,
    marginBottom: 4,
  },
  uploadSpecs: {
    fontSize: 11,
    color: Colors.light.textSecondary,
    marginBottom: 8,
  },
  uploadPricing: {
    flexDirection: "row" as const,
    gap: 12,
  },
  uploadDisc: {
    fontSize: 11,
    color: Colors.light.textSecondary,
  },
  uploadPsc: {
    fontSize: 11,
    fontWeight: "600" as const,
    color: Colors.light.text,
  },
  uploadAmt: {
    fontSize: 11,
    color: Colors.light.textSecondary,
  },
  uploadActions: {
    gap: 8,
    justifyContent: "center" as const,
    alignItems: "center" as const,
  },
  uploadActionButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: Colors.light.surface,
    justifyContent: "center" as const,
    alignItems: "center" as const,
  },
  uploadViewButton: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
    backgroundColor: Colors.light.surface,
  },
  uploadViewText: {
    fontSize: 11,
    fontWeight: "600" as const,
    color: Colors.light.text,
  },
  searchButtons: {
    flexDirection: "row" as const,
    gap: 12,
    marginBottom: 16,
  },
  saveSearchButton: {
    flex: 1,
    height: 50,
    borderRadius: 10,
    backgroundColor: Colors.light.primary,
    flexDirection: "row" as const,
    justifyContent: "center" as const,
    alignItems: "center" as const,
    gap: 8,
  },
  saveSearchText: {
    fontSize: 14,
    fontWeight: "600" as const,
    color: Colors.light.white,
  },
  recentSearchButton: {
    flex: 1,
    height: 50,
    borderRadius: 10,
    backgroundColor: Colors.light.white,
    borderWidth: 1.5,
    borderColor: Colors.light.primary,
    flexDirection: "row" as const,
    justifyContent: "center" as const,
    alignItems: "center" as const,
    gap: 8,
  },
  recentSearchText: {
    fontSize: 14,
    fontWeight: "600" as const,
    color: Colors.light.primary,
  },
  searchItem: {
    backgroundColor: Colors.light.white,
    borderRadius: 12,
    padding: 16,
    flexDirection: "row" as const,
    justifyContent: "space-between" as const,
    alignItems: "center" as const,
    marginBottom: 8,
  },
  searchTitle: {
    fontSize: 14,
    fontWeight: "600" as const,
    color: Colors.light.text,
    marginBottom: 4,
  },
  searchDate: {
    fontSize: 12,
    color: Colors.light.textSecondary,
  },
});