import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
  ScrollView,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { trpc } from '@/lib/trpc';
import { LinearGradient } from 'expo-linear-gradient';
import { Database, RefreshCw, CheckCircle, XCircle, ArrowLeft } from 'lucide-react-native';

export default function CheckDatabaseScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const dbQuery = trpc.admin.checkDb.useQuery(undefined, {
    refetchOnMount: true,
    refetchOnWindowFocus: false,
  });

  const handleRefresh = () => {
    dbQuery.refetch();
  };

  return (
    <LinearGradient colors={['#1a1f3a', '#2d3561', '#1a1f3a']} style={styles.container}>
        <View style={[styles.header, { paddingTop: insets.top + 16 }]}>
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => router.back()}
          >
            <ArrowLeft size={24} color="#d4af37" />
          </TouchableOpacity>
          <Text style={styles.title}>Database Status</Text>
          <TouchableOpacity
            style={styles.refreshButton}
            onPress={handleRefresh}
            disabled={dbQuery.isLoading}
          >
            <RefreshCw size={24} color="#d4af37" />
          </TouchableOpacity>
        </View>

        <ScrollView style={styles.content}>
          {dbQuery.isLoading && (
            <View style={styles.loadingContainer}>
              <ActivityIndicator size="large" color="#d4af37" />
              <Text style={styles.loadingText}>Checking database...</Text>
            </View>
          )}

          {dbQuery.error && (
            <View style={styles.errorContainer}>
              <XCircle size={48} color="#ef4444" />
              <Text style={styles.errorTitle}>Connection Error</Text>
              <Text style={styles.errorMessage}>{dbQuery.error.message}</Text>
              <TouchableOpacity style={styles.retryButton} onPress={handleRefresh}>
                <Text style={styles.retryButtonText}>Retry</Text>
              </TouchableOpacity>
            </View>
          )}

          {dbQuery.data && (
            <View style={styles.resultsContainer}>
              <View style={styles.statusCard}>
                {dbQuery.data.success ? (
                  <CheckCircle size={48} color="#10b981" />
                ) : (
                  <XCircle size={48} color="#ef4444" />
                )}
                <Text style={styles.statusTitle}>
                  {dbQuery.data.success ? 'Connected' : 'Failed'}
                </Text>
              </View>

              {dbQuery.data.success && dbQuery.data.database && (
                <>
                  <View style={styles.infoCard}>
                    <Database size={24} color="#d4af37" />
                    <Text style={styles.infoLabel}>Database Name</Text>
                    <Text style={styles.infoValue}>{dbQuery.data.database}</Text>
                  </View>

                  <View style={styles.section}>
                    <Text style={styles.sectionTitle}>Collections</Text>

                    <View style={styles.collectionCard}>
                      <Text style={styles.collectionName}>Admins</Text>
                      <Text style={styles.collectionCount}>
                        {dbQuery.data.collections?.admins.count || 0} documents
                      </Text>
                      
                      {dbQuery.data.collections?.admins.list && 
                       dbQuery.data.collections.admins.list.length > 0 && (
                        <View style={styles.adminList}>
                          <Text style={styles.adminListTitle}>Admin Accounts:</Text>
                          {dbQuery.data.collections.admins.list.map((admin, index) => (
                            <View key={index} style={styles.adminItem}>
                              <Text style={styles.adminEmail}>• {admin.email}</Text>
                              <Text style={styles.adminRole}>{admin.role}</Text>
                            </View>
                          ))}
                        </View>
                      )}

                      {(!dbQuery.data.collections?.admins.list || 
                        dbQuery.data.collections.admins.list.length === 0) && (
                        <View style={styles.warningBox}>
                          <Text style={styles.warningText}>
                            ⚠️ No admin accounts found!{'\n'}
                            Run the seed script to create default admin.
                          </Text>
                        </View>
                      )}
                    </View>

                    <View style={styles.collectionCard}>
                      <Text style={styles.collectionName}>Products</Text>
                      <Text style={styles.collectionCount}>
                        {dbQuery.data.collections?.products.count || 0} documents
                      </Text>

                      {(!dbQuery.data.collections?.products.count || 
                        dbQuery.data.collections.products.count === 0) && (
                        <View style={styles.warningBox}>
                          <Text style={styles.warningText}>
                            ⚠️ No products found!{'\n'}
                            Run the seed script to create sample products.
                          </Text>
                        </View>
                      )}
                    </View>
                  </View>

                  <View style={styles.instructionsCard}>
                    <Text style={styles.instructionsTitle}>How to Seed Database</Text>
                    <Text style={styles.instructionsText}>
                      Run this command in your terminal:
                    </Text>
                    <View style={styles.codeBlock}>
                      <Text style={styles.codeText}>
                        bun backend/scripts/seed.ts
                      </Text>
                    </View>
                    <Text style={styles.instructionsText}>
                      This will create:{'\n'}
                      • Default admin (admin@jewelry.com / admin123){'\n'}
                      • Sample products
                    </Text>
                  </View>
                </>
              )}

              {!dbQuery.data.success && (
                <View style={styles.errorDetailsCard}>
                  <Text style={styles.errorDetailsTitle}>Error Details</Text>
                  <Text style={styles.errorDetailsText}>
                    {dbQuery.data.error || 'Unknown error'}
                  </Text>
                </View>
              )}
            </View>
          )}
        </ScrollView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(212, 175, 55, 0.2)',
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(212, 175, 55, 0.1)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    fontSize: 20,
    fontWeight: '700' as const,
    color: '#ffffff',
  },
  refreshButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(212, 175, 55, 0.1)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  content: {
    flex: 1,
    padding: 20,
  },
  loadingContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 48,
  },
  loadingText: {
    color: '#9ca3af',
    fontSize: 16,
    marginTop: 16,
  },
  errorContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 32,
    backgroundColor: 'rgba(239, 68, 68, 0.1)',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: 'rgba(239, 68, 68, 0.3)',
  },
  errorTitle: {
    fontSize: 24,
    fontWeight: '700' as const,
    color: '#ef4444',
    marginTop: 16,
  },
  errorMessage: {
    fontSize: 14,
    color: '#9ca3af',
    textAlign: 'center',
    marginTop: 8,
  },
  retryButton: {
    backgroundColor: '#d4af37',
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 8,
    marginTop: 24,
  },
  retryButtonText: {
    color: '#1a1f3a',
    fontSize: 16,
    fontWeight: '600' as const,
  },
  resultsContainer: {
    gap: 20,
  },
  statusCard: {
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    borderRadius: 12,
    padding: 32,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(212, 175, 55, 0.2)',
  },
  statusTitle: {
    fontSize: 28,
    fontWeight: '700' as const,
    color: '#ffffff',
    marginTop: 16,
  },
  infoCard: {
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    borderRadius: 12,
    padding: 24,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(212, 175, 55, 0.2)',
  },
  infoLabel: {
    fontSize: 14,
    color: '#9ca3af',
    marginTop: 12,
  },
  infoValue: {
    fontSize: 20,
    fontWeight: '600' as const,
    color: '#ffffff',
    marginTop: 4,
  },
  section: {
    gap: 12,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '700' as const,
    color: '#ffffff',
    marginBottom: 8,
  },
  collectionCard: {
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    borderRadius: 12,
    padding: 20,
    borderWidth: 1,
    borderColor: 'rgba(212, 175, 55, 0.2)',
  },
  collectionName: {
    fontSize: 18,
    fontWeight: '600' as const,
    color: '#d4af37',
  },
  collectionCount: {
    fontSize: 14,
    color: '#9ca3af',
    marginTop: 4,
  },
  adminList: {
    marginTop: 16,
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: 'rgba(212, 175, 55, 0.2)',
  },
  adminListTitle: {
    fontSize: 14,
    fontWeight: '600' as const,
    color: '#9ca3af',
    marginBottom: 8,
  },
  adminItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 6,
  },
  adminEmail: {
    fontSize: 14,
    color: '#ffffff',
  },
  adminRole: {
    fontSize: 12,
    color: '#d4af37',
    backgroundColor: 'rgba(212, 175, 55, 0.1)',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
  },
  warningBox: {
    backgroundColor: 'rgba(251, 191, 36, 0.1)',
    borderRadius: 8,
    padding: 12,
    marginTop: 12,
    borderWidth: 1,
    borderColor: 'rgba(251, 191, 36, 0.3)',
  },
  warningText: {
    fontSize: 13,
    color: '#fbbf24',
    lineHeight: 20,
  },
  instructionsCard: {
    backgroundColor: 'rgba(212, 175, 55, 0.05)',
    borderRadius: 12,
    padding: 20,
    borderWidth: 1,
    borderColor: 'rgba(212, 175, 55, 0.3)',
  },
  instructionsTitle: {
    fontSize: 18,
    fontWeight: '700' as const,
    color: '#d4af37',
    marginBottom: 12,
  },
  instructionsText: {
    fontSize: 14,
    color: '#9ca3af',
    marginBottom: 8,
    lineHeight: 20,
  },
  codeBlock: {
    backgroundColor: 'rgba(0, 0, 0, 0.3)',
    borderRadius: 8,
    padding: 12,
    marginVertical: 12,
  },
  codeText: {
    fontSize: 13,
    color: '#d4af37',
    fontFamily: 'monospace',
  },
  errorDetailsCard: {
    backgroundColor: 'rgba(239, 68, 68, 0.1)',
    borderRadius: 12,
    padding: 20,
    borderWidth: 1,
    borderColor: 'rgba(239, 68, 68, 0.3)',
  },
  errorDetailsTitle: {
    fontSize: 18,
    fontWeight: '700' as const,
    color: '#ef4444',
    marginBottom: 8,
  },
  errorDetailsText: {
    fontSize: 14,
    color: '#9ca3af',
    lineHeight: 20,
  },
});
