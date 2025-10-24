import { Link, Stack } from "expo-router";
import { StyleSheet, Text, View } from "react-native";
import Colors from "@/constants/colors";

export default function NotFoundScreen() {
  return (
    <>
      <Stack.Screen options={{ title: "Oops!" }} />
      <View style={styles.container}>
        <Text style={styles.title}>This page doesn&apos;t exist.</Text>
        <Link href="/(tabs)/home" style={styles.link}>
          <Text style={styles.linkText}>Go to home screen</Text>
        </Link>
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center' as const,
    justifyContent: 'center' as const,
    padding: 20,
    backgroundColor: Colors.light.background,
  },
  title: {
    fontSize: 24,
    fontWeight: '700' as const,
    color: Colors.light.text,
    marginBottom: 16,
  },
  link: {
    marginTop: 15,
    paddingVertical: 15,
  },
  linkText: {
    fontSize: 16,
    fontWeight: '600' as const,
    color: Colors.light.primary,
  },
});
