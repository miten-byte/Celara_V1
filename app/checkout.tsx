import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Alert,
  Platform,
} from "react-native";
import { useRouter } from "expo-router";
import { CreditCard, Smartphone, Check, ChevronLeft } from "lucide-react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import Colors from "@/constants/colors";
import { useCart } from "@/contexts/CartContext";

type PaymentMethod = "card" | "google" | "apple" | "paypal";

export default function CheckoutScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { cartTotal, clearCart } = useCart();
  
  const [selectedPayment, setSelectedPayment] = useState<PaymentMethod>("card");
  const [cardNumber, setCardNumber] = useState("");
  const [expiryDate, setExpiryDate] = useState("");
  const [cvv, setCvv] = useState("");
  const [cardName, setCardName] = useState("");
  const [email, setEmail] = useState("");
  const [address, setAddress] = useState("");
  const [city, setCity] = useState("");
  const [zipCode, setZipCode] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);

  const handlePayment = () => {
    if (selectedPayment === "card") {
      if (!cardNumber || !expiryDate || !cvv || !cardName) {
        Alert.alert("Error", "Please fill in all card details");
        return;
      }
    }

    if (!email || !address || !city || !zipCode) {
      Alert.alert("Error", "Please fill in all shipping details");
      return;
    }

    setIsProcessing(true);

    setTimeout(() => {
      setIsProcessing(false);
      Alert.alert(
        "Order Confirmed!",
        "Your order has been placed successfully. You will receive a confirmation email shortly.",
        [
          {
            text: "OK",
            onPress: () => {
              clearCart();
              router.push("/(tabs)/home");
            },
          },
        ]
      );
    }, 2000);
  };

  const paymentMethods = [
    {
      id: "card" as PaymentMethod,
      name: "Credit/Debit Card",
      icon: CreditCard,
      available: true,
    },
    {
      id: "google" as PaymentMethod,
      name: "Google Pay",
      icon: Smartphone,
      available: Platform.OS === "android",
    },
    {
      id: "apple" as PaymentMethod,
      name: "Apple Pay",
      icon: Smartphone,
      available: Platform.OS === "ios",
    },
    {
      id: "paypal" as PaymentMethod,
      name: "PayPal",
      icon: CreditCard,
      available: true,
    },
  ];

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => router.back()}
        >
          <ChevronLeft color={Colors.light.text} size={24} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Checkout</Text>
        <View style={styles.placeholder} />
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Shipping Information</Text>
          
          <TextInput
            style={styles.input}
            placeholder="Email"
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
            autoCapitalize="none"
            placeholderTextColor={Colors.light.textSecondary}
          />
          
          <TextInput
            style={styles.input}
            placeholder="Street Address"
            value={address}
            onChangeText={setAddress}
            placeholderTextColor={Colors.light.textSecondary}
          />
          
          <View style={styles.row}>
            <TextInput
              style={[styles.input, styles.halfInput]}
              placeholder="City"
              value={city}
              onChangeText={setCity}
              placeholderTextColor={Colors.light.textSecondary}
            />
            
            <TextInput
              style={[styles.input, styles.halfInput]}
              placeholder="ZIP Code"
              value={zipCode}
              onChangeText={setZipCode}
              keyboardType="numeric"
              placeholderTextColor={Colors.light.textSecondary}
            />
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Payment Method</Text>
          
          <View style={styles.paymentMethods}>
            {paymentMethods
              .filter((method) => method.available)
              .map((method) => (
                <TouchableOpacity
                  key={method.id}
                  style={[
                    styles.paymentMethod,
                    selectedPayment === method.id && styles.paymentMethodActive,
                  ]}
                  onPress={() => setSelectedPayment(method.id)}
                >
                  <method.icon
                    color={
                      selectedPayment === method.id
                        ? Colors.light.primary
                        : Colors.light.text
                    }
                    size={24}
                  />
                  <Text
                    style={[
                      styles.paymentMethodText,
                      selectedPayment === method.id &&
                        styles.paymentMethodTextActive,
                    ]}
                  >
                    {method.name}
                  </Text>
                  {selectedPayment === method.id && (
                    <View style={styles.checkmark}>
                      <Check color={Colors.light.white} size={16} />
                    </View>
                  )}
                </TouchableOpacity>
              ))}
          </View>
        </View>

        {selectedPayment === "card" && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Card Details</Text>
            
            <TextInput
              style={styles.input}
              placeholder="Card Number"
              value={cardNumber}
              onChangeText={(text) => {
                const cleaned = text.replace(/\s/g, "");
                const formatted = cleaned.match(/.{1,4}/g)?.join(" ") || cleaned;
                setCardNumber(formatted);
              }}
              keyboardType="numeric"
              maxLength={19}
              placeholderTextColor={Colors.light.textSecondary}
            />
            
            <TextInput
              style={styles.input}
              placeholder="Cardholder Name"
              value={cardName}
              onChangeText={setCardName}
              autoCapitalize="words"
              placeholderTextColor={Colors.light.textSecondary}
            />
            
            <View style={styles.row}>
              <TextInput
                style={[styles.input, styles.halfInput]}
                placeholder="MM/YY"
                value={expiryDate}
                onChangeText={(text) => {
                  const cleaned = text.replace(/\D/g, "");
                  if (cleaned.length >= 2) {
                    setExpiryDate(`${cleaned.slice(0, 2)}/${cleaned.slice(2, 4)}`);
                  } else {
                    setExpiryDate(cleaned);
                  }
                }}
                keyboardType="numeric"
                maxLength={5}
                placeholderTextColor={Colors.light.textSecondary}
              />
              
              <TextInput
                style={[styles.input, styles.halfInput]}
                placeholder="CVV"
                value={cvv}
                onChangeText={setCvv}
                keyboardType="numeric"
                maxLength={4}
                secureTextEntry
                placeholderTextColor={Colors.light.textSecondary}
              />
            </View>
          </View>
        )}

        {selectedPayment === "google" && (
          <View style={styles.section}>
            <Text style={styles.infoText}>
              You will be redirected to Google Pay to complete your payment.
            </Text>
          </View>
        )}

        {selectedPayment === "apple" && (
          <View style={styles.section}>
            <Text style={styles.infoText}>
              You will be redirected to Apple Pay to complete your payment.
            </Text>
          </View>
        )}

        {selectedPayment === "paypal" && (
          <View style={styles.section}>
            <Text style={styles.infoText}>
              You will be redirected to PayPal to complete your payment.
            </Text>
          </View>
        )}

        <View style={styles.summarySection}>
          <Text style={styles.sectionTitle}>Order Summary</Text>
          
          <View style={styles.summaryRow}>
            <Text style={styles.summaryLabel}>Subtotal</Text>
            <Text style={styles.summaryValue}>${cartTotal.toLocaleString()}</Text>
          </View>
          
          <View style={styles.summaryRow}>
            <Text style={styles.summaryLabel}>Shipping</Text>
            <Text style={styles.summaryValue}>Free</Text>
          </View>
          
          <View style={styles.summaryRow}>
            <Text style={styles.summaryLabel}>Tax</Text>
            <Text style={styles.summaryValue}>
              ${(cartTotal * 0.1).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
            </Text>
          </View>
          
          <View style={styles.divider} />
          
          <View style={styles.summaryRow}>
            <Text style={styles.totalLabel}>Total</Text>
            <Text style={styles.totalValue}>
              ${(cartTotal * 1.1).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
            </Text>
          </View>
        </View>
      </ScrollView>

      <View style={styles.bottomSection}>
        <TouchableOpacity
          style={[styles.payButton, isProcessing && styles.payButtonDisabled]}
          onPress={handlePayment}
          disabled={isProcessing}
        >
          <Text style={styles.payButtonText}>
            {isProcessing ? "Processing..." : "Place Order"}
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.light.background,
  },
  header: {
    flexDirection: 'row' as const,
    alignItems: 'center' as const,
    justifyContent: 'space-between' as const,
    paddingHorizontal: 20,
    paddingVertical: 16,
    backgroundColor: Colors.light.white,
    borderBottomWidth: 1,
    borderBottomColor: Colors.light.border,
  },
  backButton: {
    padding: 4,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: '600' as const,
    color: Colors.light.text,
  },
  placeholder: {
    width: 32,
  },
  scrollContent: {
    padding: 20,
    paddingBottom: 32,
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700' as const,
    color: Colors.light.text,
    marginBottom: 16,
    letterSpacing: 0.5,
  },
  input: {
    backgroundColor: Colors.light.white,
    borderWidth: 1,
    borderColor: Colors.light.border,
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 14,
    fontSize: 15,
    color: Colors.light.text,
    marginBottom: 12,
  },
  row: {
    flexDirection: 'row' as const,
    gap: 12,
  },
  halfInput: {
    flex: 1,
  },
  paymentMethods: {
    gap: 12,
  },
  paymentMethod: {
    flexDirection: 'row' as const,
    alignItems: 'center' as const,
    backgroundColor: Colors.light.white,
    borderWidth: 2,
    borderColor: Colors.light.border,
    borderRadius: 12,
    padding: 16,
    gap: 12,
  },
  paymentMethodActive: {
    borderColor: Colors.light.primary,
    backgroundColor: 'rgba(10, 31, 68, 0.04)',
  },
  paymentMethodText: {
    flex: 1,
    fontSize: 16,
    fontWeight: '600' as const,
    color: Colors.light.text,
  },
  paymentMethodTextActive: {
    color: Colors.light.primary,
  },
  checkmark: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: Colors.light.primary,
    justifyContent: 'center' as const,
    alignItems: 'center' as const,
  },
  infoText: {
    fontSize: 15,
    color: Colors.light.textSecondary,
    lineHeight: 22,
    backgroundColor: Colors.light.surface,
    padding: 16,
    borderRadius: 12,
  },
  summarySection: {
    backgroundColor: Colors.light.white,
    padding: 20,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: Colors.light.border,
  },
  summaryRow: {
    flexDirection: 'row' as const,
    justifyContent: 'space-between' as const,
    alignItems: 'center' as const,
    marginBottom: 12,
  },
  summaryLabel: {
    fontSize: 15,
    color: Colors.light.textSecondary,
    fontWeight: '500' as const,
  },
  summaryValue: {
    fontSize: 15,
    color: Colors.light.text,
    fontWeight: '600' as const,
  },
  divider: {
    height: 1,
    backgroundColor: Colors.light.border,
    marginVertical: 16,
  },
  totalLabel: {
    fontSize: 20,
    fontWeight: '700' as const,
    color: Colors.light.text,
  },
  totalValue: {
    fontSize: 24,
    fontWeight: '700' as const,
    color: Colors.light.primary,
  },
  bottomSection: {
    backgroundColor: Colors.light.white,
    padding: 20,
    borderTopWidth: 1,
    borderTopColor: Colors.light.border,
  },
  payButton: {
    backgroundColor: Colors.light.primary,
    paddingVertical: 16,
    borderRadius: 30,
    alignItems: 'center' as const,
  },
  payButtonDisabled: {
    opacity: 0.6,
  },
  payButtonText: {
    fontSize: 16,
    fontWeight: '600' as const,
    color: Colors.light.white,
  },
});
