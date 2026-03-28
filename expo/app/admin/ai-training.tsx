import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Alert,
  ActivityIndicator,
} from "react-native";
import { Stack, useRouter } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import { Brain, Plus, Search, TrendingUp, Database } from "lucide-react-native";
import Colors from "@/constants/colors";
import { trpc } from "@/lib/trpc";
import { useAdmin } from "@/contexts/AdminContext";

const CATEGORIES = [
  { value: "diamond-education", label: "Diamond Education" },
  { value: "metal-types", label: "Metal Types" },
  { value: "jewelry-care", label: "Jewelry Care" },
  { value: "sizing-guide", label: "Sizing Guide" },
  { value: "certification", label: "Certification" },
  { value: "customization", label: "Customization" },
  { value: "pricing", label: "Pricing" },
  { value: "lab-grown-vs-mined", label: "Lab-Grown vs Mined" },
  { value: "ring-styles", label: "Ring Styles" },
  { value: "earring-styles", label: "Earring Styles" },
  { value: "necklace-styles", label: "Necklace Styles" },
  { value: "bracelet-styles", label: "Bracelet Styles" },
  { value: "pendant-styles", label: "Pendant Styles" },
  { value: "gemstone-properties", label: "Gemstone Properties" },
  { value: "design-trends", label: "Design Trends" },
  { value: "maintenance", label: "Maintenance" },
  { value: "general", label: "General" },
];

export default function AITrainingScreen() {
  const router = useRouter();
  const { admin } = useAdmin();
  const isLoggedIn = !!admin;
  const [showAddForm, setShowAddForm] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [filterCategory, setFilterCategory] = useState<string | undefined>(undefined);

  const [formData, setFormData] = useState({
    category: "general" as any,
    title: "",
    content: "",
    keywords: "",
    priority: "0",
  });

  const knowledgeQuery = trpc.ai.knowledge.list.useQuery({
    category: filterCategory,
    limit: 100,
  });

  const addKnowledgeMutation = trpc.ai.knowledge.add.useMutation({
    onSuccess: () => {
      Alert.alert("Success", "Knowledge added successfully");
      setFormData({
        category: "general",
        title: "",
        content: "",
        keywords: "",
        priority: "0",
      });
      setShowAddForm(false);
      knowledgeQuery.refetch();
    },
    onError: (error: any) => {
      Alert.alert("Error", error.message);
    },
  });

  const updateKnowledgeMutation = trpc.ai.knowledge.update.useMutation({
    onSuccess: () => {
      Alert.alert("Success", "Knowledge updated successfully");
      knowledgeQuery.refetch();
    },
    onError: (error: any) => {
      Alert.alert("Error", error.message);
    },
  });

  React.useEffect(() => {
    if (!isLoggedIn) {
      router.replace("/admin/login");
    }
  }, [isLoggedIn, router]);

  const handleAddKnowledge = () => {
    if (!formData.title.trim() || !formData.content.trim()) {
      Alert.alert("Error", "Title and content are required");
      return;
    }

    addKnowledgeMutation.mutate({
      category: formData.category,
      title: formData.title.trim(),
      content: formData.content.trim(),
      keywords: formData.keywords
        .split(",")
        .map((k) => k.trim())
        .filter((k) => k.length > 0),
      priority: parseInt(formData.priority) || 0,
      source: "admin",
    });
  };

  const handleToggleActive = (id: string, isActive: boolean) => {
    updateKnowledgeMutation.mutate({
      id,
      isActive: !isActive,
    });
  };

  const filteredKnowledge = knowledgeQuery.data?.knowledge?.filter((k: any) => {
    if (!searchQuery) return true;
    const query = searchQuery.toLowerCase();
    return (
      k.title.toLowerCase().includes(query) ||
      k.content.toLowerCase().includes(query) ||
      k.keywords.some((keyword: string) => keyword.toLowerCase().includes(query))
    );
  });

  if (!isLoggedIn) {
    return null;
  }

  return (
    <SafeAreaView style={styles.container} edges={["top"]}>
      <Stack.Screen
        options={{
          title: "AI Training",
          headerStyle: {
            backgroundColor: Colors.light.white,
          },
          headerTintColor: Colors.light.text,
          headerShadowVisible: true,
        }}
      />

      <ScrollView style={styles.scrollView} contentContainerStyle={styles.scrollContent}>
        <View style={styles.header}>
          <View style={styles.headerTop}>
            <View style={styles.iconContainer}>
              <Brain color={Colors.light.primary} size={28} />
            </View>
            <View style={styles.headerInfo}>
              <Text style={styles.headerTitle}>Celara AI Training</Text>
              <Text style={styles.headerSubtitle}>
                Manage knowledge base for better AI responses
              </Text>
            </View>
          </View>

          <View style={styles.statsContainer}>
            <View style={styles.statCard}>
              <Database color={Colors.light.primary} size={20} />
              <Text style={styles.statValue}>{knowledgeQuery.data?.total || 0}</Text>
              <Text style={styles.statLabel}>Knowledge Items</Text>
            </View>
            <View style={styles.statCard}>
              <TrendingUp color={Colors.light.success} size={20} />
              <Text style={styles.statValue}>
                {filteredKnowledge?.filter((k: any) => k.isActive).length || 0}
              </Text>
              <Text style={styles.statLabel}>Active</Text>
            </View>
          </View>
        </View>

        <View style={styles.searchContainer}>
          <View style={styles.searchInputContainer}>
            <Search color={Colors.light.textSecondary} size={20} />
            <TextInput
              style={styles.searchInput}
              placeholder="Search knowledge..."
              placeholderTextColor={Colors.light.textSecondary}
              value={searchQuery}
              onChangeText={setSearchQuery}
            />
          </View>

          <TouchableOpacity
            style={styles.addButton}
            onPress={() => setShowAddForm(!showAddForm)}
          >
            <Plus color={Colors.light.white} size={20} />
          </TouchableOpacity>
        </View>

        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          style={styles.categoryFilter}
          contentContainerStyle={styles.categoryFilterContent}
        >
          <TouchableOpacity
            style={[
              styles.categoryChip,
              !filterCategory && styles.categoryChipActive,
            ]}
            onPress={() => setFilterCategory(undefined)}
          >
            <Text
              style={[
                styles.categoryChipText,
                !filterCategory && styles.categoryChipTextActive,
              ]}
            >
              All
            </Text>
          </TouchableOpacity>
          {CATEGORIES.map((cat) => (
            <TouchableOpacity
              key={cat.value}
              style={[
                styles.categoryChip,
                filterCategory === cat.value && styles.categoryChipActive,
              ]}
              onPress={() => setFilterCategory(cat.value)}
            >
              <Text
                style={[
                  styles.categoryChipText,
                  filterCategory === cat.value && styles.categoryChipTextActive,
                ]}
              >
                {cat.label}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>

        {showAddForm && (
          <View style={styles.formCard}>
            <Text style={styles.formTitle}>Add New Knowledge</Text>

            <Text style={styles.label}>Category</Text>
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              style={styles.categoryScroll}
            >
              {CATEGORIES.map((cat) => (
                <TouchableOpacity
                  key={cat.value}
                  style={[
                    styles.categoryOption,
                    formData.category === cat.value && styles.categoryOptionActive,
                  ]}
                  onPress={() => setFormData({ ...formData, category: cat.value as any })}
                >
                  <Text
                    style={[
                      styles.categoryOptionText,
                      formData.category === cat.value &&
                        styles.categoryOptionTextActive,
                    ]}
                  >
                    {cat.label}
                  </Text>
                </TouchableOpacity>
              ))}
            </ScrollView>

            <Text style={styles.label}>Title</Text>
            <TextInput
              style={styles.input}
              placeholder="e.g., What is a lab-grown diamond?"
              placeholderTextColor={Colors.light.textSecondary}
              value={formData.title}
              onChangeText={(text) => setFormData({ ...formData, title: text })}
            />

            <Text style={styles.label}>Content</Text>
            <TextInput
              style={[styles.input, styles.textArea]}
              placeholder="Detailed information..."
              placeholderTextColor={Colors.light.textSecondary}
              value={formData.content}
              onChangeText={(text) => setFormData({ ...formData, content: text })}
              multiline
              numberOfLines={6}
            />

            <Text style={styles.label}>Keywords (comma separated)</Text>
            <TextInput
              style={styles.input}
              placeholder="e.g., lab-grown, diamond, synthetic"
              placeholderTextColor={Colors.light.textSecondary}
              value={formData.keywords}
              onChangeText={(text) => setFormData({ ...formData, keywords: text })}
            />

            <Text style={styles.label}>Priority (higher = more important)</Text>
            <TextInput
              style={styles.input}
              placeholder="0"
              placeholderTextColor={Colors.light.textSecondary}
              value={formData.priority}
              onChangeText={(text) => setFormData({ ...formData, priority: text })}
              keyboardType="number-pad"
            />

            <View style={styles.formActions}>
              <TouchableOpacity
                style={styles.cancelButton}
                onPress={() => setShowAddForm(false)}
              >
                <Text style={styles.cancelButtonText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.submitButton}
                onPress={handleAddKnowledge}
                disabled={addKnowledgeMutation.isPending}
              >
                {addKnowledgeMutation.isPending ? (
                  <ActivityIndicator color={Colors.light.white} size="small" />
                ) : (
                  <Text style={styles.submitButtonText}>Add Knowledge</Text>
                )}
              </TouchableOpacity>
            </View>
          </View>
        )}

        {knowledgeQuery.isLoading ? (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color={Colors.light.primary} />
            <Text style={styles.loadingText}>Loading knowledge base...</Text>
          </View>
        ) : (
          <View style={styles.knowledgeList}>
            {filteredKnowledge?.map((item: any) => (
              <View key={item._id?.toString()} style={styles.knowledgeCard}>
                <View style={styles.knowledgeHeader}>
                  <View style={styles.knowledgeHeaderLeft}>
                    <Text style={styles.knowledgeTitle}>{item.title}</Text>
                    <View style={styles.categoryBadge}>
                      <Text style={styles.categoryBadgeText}>
                        {CATEGORIES.find((c: any) => c.value === item.category)?.label ||
                          item.category}
                      </Text>
                    </View>
                  </View>
                  <TouchableOpacity
                    style={[
                      styles.activeToggle,
                      item.isActive && styles.activeToggleActive,
                    ]}
                    onPress={() =>
                      handleToggleActive(item._id!.toString(), item.isActive)
                    }
                  >
                    <Text
                      style={[
                        styles.activeToggleText,
                        item.isActive && styles.activeToggleTextActive,
                      ]}
                    >
                      {item.isActive ? "Active" : "Inactive"}
                    </Text>
                  </TouchableOpacity>
                </View>

                <Text style={styles.knowledgeContent} numberOfLines={3}>
                  {item.content}
                </Text>

                <View style={styles.knowledgeFooter}>
                  <View style={styles.keywords}>
                    {item.keywords.slice(0, 3).map((keyword: string, index: number) => (
                      <View key={index} style={styles.keywordTag}>
                        <Text style={styles.keywordText}>{keyword}</Text>
                      </View>
                    ))}
                    {item.keywords.length > 3 && (
                      <Text style={styles.moreKeywords}>
                        +{item.keywords.length - 3} more
                      </Text>
                    )}
                  </View>

                  <View style={styles.knowledgeStats}>
                    <Text style={styles.knowledgeStat}>
                      Priority: {item.priority}
                    </Text>
                    <Text style={styles.knowledgeStat}>
                      Used: {item.usageCount}
                    </Text>
                  </View>
                </View>
              </View>
            ))}

            {filteredKnowledge?.length === 0 && (
              <View style={styles.emptyState}>
                <Database color={Colors.light.textSecondary} size={48} />
                <Text style={styles.emptyText}>No knowledge items found</Text>
                <Text style={styles.emptySubtext}>
                  Add knowledge to train Celara AI
                </Text>
              </View>
            )}
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.light.background,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    padding: 20,
  },
  header: {
    marginBottom: 24,
  },
  headerTop: {
    flexDirection: "row",
    alignItems: "center",
    gap: 16,
    marginBottom: 20,
  },
  iconContainer: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: `${Colors.light.primary}15`,
    alignItems: "center",
    justifyContent: "center",
  },
  headerInfo: {
    flex: 1,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: "700" as const,
    color: Colors.light.text,
    marginBottom: 4,
  },
  headerSubtitle: {
    fontSize: 14,
    color: Colors.light.textSecondary,
  },
  statsContainer: {
    flexDirection: "row",
    gap: 12,
  },
  statCard: {
    flex: 1,
    backgroundColor: Colors.light.white,
    padding: 16,
    borderRadius: 12,
    alignItems: "center",
    gap: 8,
  },
  statValue: {
    fontSize: 24,
    fontWeight: "700" as const,
    color: Colors.light.text,
  },
  statLabel: {
    fontSize: 12,
    color: Colors.light.textSecondary,
  },
  searchContainer: {
    flexDirection: "row",
    gap: 12,
    marginBottom: 16,
  },
  searchInputContainer: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: Colors.light.white,
    borderRadius: 12,
    paddingHorizontal: 16,
    gap: 12,
  },
  searchInput: {
    flex: 1,
    fontSize: 15,
    color: Colors.light.text,
    paddingVertical: 14,
  },
  addButton: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: Colors.light.primary,
    alignItems: "center",
    justifyContent: "center",
  },
  categoryFilter: {
    marginBottom: 20,
  },
  categoryFilterContent: {
    gap: 8,
  },
  categoryChip: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: Colors.light.white,
    borderWidth: 1,
    borderColor: Colors.light.border,
  },
  categoryChipActive: {
    backgroundColor: Colors.light.primary,
    borderColor: Colors.light.primary,
  },
  categoryChipText: {
    fontSize: 13,
    fontWeight: "600" as const,
    color: Colors.light.text,
  },
  categoryChipTextActive: {
    color: Colors.light.white,
  },
  formCard: {
    backgroundColor: Colors.light.white,
    borderRadius: 12,
    padding: 20,
    marginBottom: 20,
  },
  formTitle: {
    fontSize: 18,
    fontWeight: "700" as const,
    color: Colors.light.text,
    marginBottom: 20,
  },
  label: {
    fontSize: 14,
    fontWeight: "600" as const,
    color: Colors.light.text,
    marginBottom: 8,
    marginTop: 12,
  },
  categoryScroll: {
    marginBottom: 8,
  },
  categoryOption: {
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 16,
    backgroundColor: Colors.light.background,
    marginRight: 8,
  },
  categoryOptionActive: {
    backgroundColor: Colors.light.primary,
  },
  categoryOptionText: {
    fontSize: 12,
    fontWeight: "600" as const,
    color: Colors.light.text,
  },
  categoryOptionTextActive: {
    color: Colors.light.white,
  },
  input: {
    backgroundColor: Colors.light.background,
    borderRadius: 8,
    paddingHorizontal: 14,
    paddingVertical: 12,
    fontSize: 15,
    color: Colors.light.text,
    marginBottom: 8,
  },
  textArea: {
    height: 120,
    textAlignVertical: "top",
  },
  formActions: {
    flexDirection: "row",
    gap: 12,
    marginTop: 20,
  },
  cancelButton: {
    flex: 1,
    paddingVertical: 14,
    borderRadius: 8,
    backgroundColor: Colors.light.background,
    alignItems: "center",
  },
  cancelButtonText: {
    fontSize: 15,
    fontWeight: "600" as const,
    color: Colors.light.text,
  },
  submitButton: {
    flex: 1,
    paddingVertical: 14,
    borderRadius: 8,
    backgroundColor: Colors.light.primary,
    alignItems: "center",
  },
  submitButtonText: {
    fontSize: 15,
    fontWeight: "700" as const,
    color: Colors.light.white,
  },
  loadingContainer: {
    paddingVertical: 60,
    alignItems: "center",
    gap: 16,
  },
  loadingText: {
    fontSize: 14,
    color: Colors.light.textSecondary,
  },
  knowledgeList: {
    gap: 16,
  },
  knowledgeCard: {
    backgroundColor: Colors.light.white,
    borderRadius: 12,
    padding: 16,
  },
  knowledgeHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: 12,
  },
  knowledgeHeaderLeft: {
    flex: 1,
    marginRight: 12,
  },
  knowledgeTitle: {
    fontSize: 16,
    fontWeight: "700" as const,
    color: Colors.light.text,
    marginBottom: 6,
  },
  categoryBadge: {
    alignSelf: "flex-start",
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
    backgroundColor: `${Colors.light.primary}15`,
  },
  categoryBadgeText: {
    fontSize: 11,
    fontWeight: "600" as const,
    color: Colors.light.primary,
  },
  activeToggle: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
    backgroundColor: Colors.light.background,
    borderWidth: 1,
    borderColor: Colors.light.border,
  },
  activeToggleActive: {
    backgroundColor: `${Colors.light.success}15`,
    borderColor: Colors.light.success,
  },
  activeToggleText: {
    fontSize: 12,
    fontWeight: "600" as const,
    color: Colors.light.textSecondary,
  },
  activeToggleTextActive: {
    color: Colors.light.success,
  },
  knowledgeContent: {
    fontSize: 14,
    color: Colors.light.textSecondary,
    lineHeight: 20,
    marginBottom: 12,
  },
  knowledgeFooter: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  keywords: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 6,
    flex: 1,
  },
  keywordTag: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
    backgroundColor: Colors.light.background,
  },
  keywordText: {
    fontSize: 11,
    color: Colors.light.textSecondary,
  },
  moreKeywords: {
    fontSize: 11,
    color: Colors.light.textSecondary,
    fontStyle: "italic" as const,
  },
  knowledgeStats: {
    flexDirection: "row",
    gap: 12,
  },
  knowledgeStat: {
    fontSize: 11,
    color: Colors.light.textSecondary,
  },
  emptyState: {
    paddingVertical: 60,
    alignItems: "center",
  },
  emptyText: {
    fontSize: 16,
    fontWeight: "600" as const,
    color: Colors.light.text,
    marginTop: 16,
  },
  emptySubtext: {
    fontSize: 14,
    color: Colors.light.textSecondary,
    marginTop: 4,
  },
});
