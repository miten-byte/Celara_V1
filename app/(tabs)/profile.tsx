import React from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
} from "react-native";
import {
  User,
  ShoppingBag,
  Heart,
  Settings,
  Bell,
  CreditCard,
  MapPin,
  HelpCircle,
  Shield,
  ChevronRight,
  LogOut,
} from "lucide-react-native";
import { useRouter } from 'expo-router';
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useUser } from '@/contexts/UserContext';

import Colors from "@/constants/colors";

interface MenuItem {
  icon: React.ReactNode;
  label: string;
  onPress: () => void;
}

export default function ProfileScreen() {
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const { user, logout } = useUser();

  const handleLogout = async () => {
    await logout();
    router.replace('/auth/login' as any);
  };

  const handleSignIn = () => {
    router.push('/auth/login' as any);
  };

  const menuSections: { title: string; items: MenuItem[] }[] = [
    {
      title: "Account",
      items: [
        {
          icon: <ShoppingBag color={Colors.light.primary} size={20} />,
          label: "My Orders",
          onPress: () => console.log("Orders"),
        },
        {
          icon: <Heart color={Colors.light.primary} size={20} />,
          label: "Wishlist",
          onPress: () => console.log("Wishlist"),
        },
        {
          icon: <MapPin color={Colors.light.primary} size={20} />,
          label: "Addresses",
          onPress: () => console.log("Addresses"),
        },
        {
          icon: <CreditCard color={Colors.light.primary} size={20} />,
          label: "Payment Methods",
          onPress: () => console.log("Payment"),
        },
      ],
    },
    {
      title: "Preferences",
      items: [
        {
          icon: <Bell color={Colors.light.primary} size={20} />,
          label: "Notifications",
          onPress: () => console.log("Notifications"),
        },
        {
          icon: <Settings color={Colors.light.primary} size={20} />,
          label: "Settings",
          onPress: () => console.log("Settings"),
        },
      ],
    },
    {
      title: "Support",
      items: [
        {
          icon: <HelpCircle color={Colors.light.primary} size={20} />,
          label: "Help & Support",
          onPress: () => console.log("Help"),
        },
        {
          icon: <Shield color={Colors.light.primary} size={20} />,
          label: "Privacy & Security",
          onPress: () => console.log("Privacy"),
        },
      ],
    },
  ];

  const renderMenuItem = (item: MenuItem) => {
    return (
      <TouchableOpacity
        key={item.label}
        style={styles.menuItem}
        onPress={item.onPress}
      >
        <View style={styles.menuItemLeft}>
          <View style={styles.iconContainer}>{item.icon}</View>
          <Text style={styles.menuItemLabel}>{item.label}</Text>
        </View>
        <ChevronRight color={Colors.light.textSecondary} size={20} />
      </TouchableOpacity>
    );
  };

  return (
    <View style={styles.container}>
      <View style={[styles.header, { paddingTop: insets.top + 20 }]}>
        <View style={styles.profileSection}>
          <View style={styles.avatarContainer}>
            <User color={Colors.light.white} size={32} />
          </View>
          <View style={styles.profileInfo}>
            <Text style={styles.profileName}>{user ? user.name : 'Guest User'}</Text>
            <Text style={styles.profileEmail}>
              {user ? user.email : 'Sign in to save your preferences'}
            </Text>
          </View>
        </View>
        {user ? (
          <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
            <LogOut color={Colors.light.white} size={18} />
            <Text style={styles.logoutButtonText}>Log Out</Text>
          </TouchableOpacity>
        ) : (
          <TouchableOpacity style={styles.signInButton} onPress={handleSignIn}>
            <Text style={styles.signInButtonText}>Sign In</Text>
          </TouchableOpacity>
        )}
      </View>

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {menuSections.map((section) => (
          <View key={section.title} style={styles.section}>
            <Text style={styles.sectionTitle}>{section.title}</Text>
            <View style={styles.menuContainer}>
              {section.items.map((item) => renderMenuItem(item))}
            </View>
          </View>
        ))}
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
    backgroundColor: Colors.light.white,
    paddingHorizontal: 20,
    paddingBottom: 20,
    borderBottomWidth: 1,
    borderBottomColor: Colors.light.border,
  },
  profileSection: {
    flexDirection: 'row' as const,
    alignItems: 'center' as const,
    marginBottom: 16,
  },
  avatarContainer: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: Colors.light.primary,
    justifyContent: 'center' as const,
    alignItems: 'center' as const,
    marginRight: 16,
  },
  profileInfo: {
    flex: 1,
  },
  profileName: {
    fontSize: 22,
    fontWeight: '700' as const,
    color: Colors.light.text,
    marginBottom: 4,
  },
  profileEmail: {
    fontSize: 14,
    color: Colors.light.textSecondary,
  },
  signInButton: {
    backgroundColor: Colors.light.primary,
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: 'center' as const,
  },
  signInButtonText: {
    fontSize: 16,
    fontWeight: '600' as const,
    color: Colors.light.white,
  },
  logoutButton: {
    backgroundColor: '#ef4444',
    paddingVertical: 14,
    paddingHorizontal: 20,
    borderRadius: 12,
    alignItems: 'center' as const,
    flexDirection: 'row' as const,
    justifyContent: 'center' as const,
    gap: 8,
  },
  logoutButtonText: {
    fontSize: 16,
    fontWeight: '600' as const,
    color: Colors.light.white,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    padding: 20,
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '700' as const,
    color: Colors.light.text,
    marginBottom: 12,
  },
  menuContainer: {
    backgroundColor: Colors.light.white,
    borderRadius: 16,
    overflow: 'hidden' as const,
    borderWidth: 1,
    borderColor: Colors.light.border,
  },
  menuItem: {
    flexDirection: 'row' as const,
    justifyContent: 'space-between' as const,
    alignItems: 'center' as const,
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: Colors.light.border,
  },
  menuItemLeft: {
    flexDirection: 'row' as const,
    alignItems: 'center' as const,
    gap: 12,
  },
  iconContainer: {
    width: 40,
    height: 40,
    backgroundColor: Colors.light.surface,
    borderRadius: 12,
    justifyContent: 'center' as const,
    alignItems: 'center' as const,
  },
  menuItemLabel: {
    fontSize: 16,
    fontWeight: '500' as const,
    color: Colors.light.text,
  },
});
