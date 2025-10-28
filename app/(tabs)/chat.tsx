import React, { useState, useRef, useEffect, useMemo } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  ActivityIndicator,
  Alert,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Send, Sparkles, Wand2, ThumbsUp, ThumbsDown } from "lucide-react-native";
import { Image } from "expo-image";
import { createRorkTool, useRorkAgent } from "@rork/toolkit-sdk";
import { z } from "zod";
import { useRouter } from "expo-router";

import Colors from "@/constants/colors";
import { useWishlist } from "@/contexts/WishlistContext";
import { trpc } from "@/lib/trpc";

export default function ChatScreen() {
  console.log("[Chat] Rendering chat screen");
  const [input, setInput] = useState("");
  const scrollViewRef = useRef<ScrollView>(null);
  const router = useRouter();
  const { toggleWishlist, isInWishlist } = useWishlist();
  
  const productsQuery = trpc.products.list.useQuery();

  const [isGeneratingDesign, setIsGeneratingDesign] = useState(false);
  const [feedbackGiven, setFeedbackGiven] = useState<{ [key: string]: boolean }>({});
  
  const sessionId = useMemo(() => `session-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`, []);
  
  const saveConversationMutation = trpc.ai.conversation.save.useMutation();
  const feedbackMutation = trpc.ai.conversation.feedback.useMutation();

  const { messages, error, sendMessage } = useRorkAgent({
    tools: {
      searchProducts: createRorkTool({
        description: "Search for jewelry products by name, category, or characteristics like shape, metal, price range",
        zodSchema: z.object({
          query: z.string().describe("Search query for products"),
          category: z.enum(["Engagement Rings", "Wedding Bands", "Earrings", "Necklaces", "Bracelets", "Loose Diamonds"]).optional().describe("Filter by category"),
          maxPrice: z.number().optional().describe("Maximum price in dollars"),
          minPrice: z.number().optional().describe("Minimum price in dollars"),
        }),
        execute(params) {
          const data = productsQuery.data;
          if (!data || !Array.isArray(data.products)) {
            return JSON.stringify({ error: "No products available" });
          }
          
          let filtered = data.products;

          if (params.category) {
            filtered = filtered.filter(p => p.category === params.category);
          }

          if (params.minPrice !== undefined) {
            filtered = filtered.filter(p => p.price >= params.minPrice!);
          }

          if (params.maxPrice !== undefined) {
            filtered = filtered.filter(p => p.price <= params.maxPrice!);
          }

          if (params.query) {
            const query = params.query.toLowerCase();
            filtered = filtered.filter(p => 
              p.name.toLowerCase().includes(query) ||
              p.description.toLowerCase().includes(query) ||
              p.category.toLowerCase().includes(query) ||
              p.metal?.toLowerCase().includes(query) ||
              p.shape?.toLowerCase().includes(query)
            );
          }

          const results = filtered.slice(0, 5).map(p => ({
            id: p.id,
            name: p.name,
            price: p.price,
            category: p.category,
            metal: p.metal,
            carat: p.carat,
            inStock: p.inStock,
          }));
          
          return JSON.stringify(results, null, 2);
        },
      }),
      viewProduct: createRorkTool({
        description: "Navigate to view a specific product details page",
        zodSchema: z.object({
          productId: z.string().describe("The ID of the product to view"),
        }),
        execute(params) {
          router.push(`/product/${params.productId}`);
          return `Opening product ${params.productId}`;
        },
      }),
      addToWishlist: createRorkTool({
        description: "Add a product to the user wishlist",
        zodSchema: z.object({
          productId: z.string().describe("The ID of the product to add to wishlist"),
        }),
        execute(params) {
          if (!isInWishlist(params.productId)) {
            toggleWishlist(params.productId);
            return "Added to wishlist successfully";
          }
          return "Product is already in your wishlist";
        },
      }),
      searchKnowledge: createRorkTool({
        description: "Search the jewelry knowledge base for specific information about diamonds, jewelry care, styles, metals, certifications, and more. Use this for detailed expert knowledge.",
        zodSchema: z.object({
          query: z.string().describe("Search query for the knowledge base"),
          category: z.string().optional().describe("Category to filter by: diamond-education, metal-types, jewelry-care, sizing-guide, certification, customization, pricing, lab-grown-vs-mined, ring-styles, earring-styles, necklace-styles, bracelet-styles, pendant-styles, gemstone-properties, design-trends, maintenance, general"),
        }),
        async execute(params) {
          try {
            const result = await fetch(`${process.env.EXPO_PUBLIC_API_URL}/api/trpc/ai.knowledge.search?input=${encodeURIComponent(JSON.stringify(params))}`).then(r => r.json());
            
            if (result.result?.data?.results && result.result.data.results.length > 0) {
              const knowledge = result.result.data.results.map((k: any) => ({
                title: k.title,
                content: k.content,
                category: k.category,
              }));
              
              return JSON.stringify(knowledge, null, 2);
            }
            
            return JSON.stringify({ message: "No specific knowledge found. Please provide general guidance based on common jewelry expertise." });
          } catch (error) {
            console.error("Knowledge search error:", error);
            return JSON.stringify({ error: "Failed to search knowledge base" });
          }
        },
      }),
      getLabGrownInfo: createRorkTool({
        description: "Get quick information about lab-grown diamonds and Celara philosophy",
        zodSchema: z.object({
          topic: z.enum(["benefits", "quality", "sustainability", "certification", "pricing"]).optional(),
        }),
        execute(params) {
          const info = {
            benefits: "Lab-grown diamonds are chemically, physically, and optically identical to mined diamonds. They offer exceptional value, ethical sourcing, and environmental responsibility.",
            quality: "All Celara lab-grown diamonds meet the same strict grading standards as mined diamonds, certified by IGI or other recognized gemological institutes.",
            sustainability: "Lab-grown diamonds use significantly less water, generate less waste, and have a smaller carbon footprint compared to traditional mining.",
            certification: "Each diamond comes with certification from recognized institutions like IGI, ensuring authenticity and quality.",
            pricing: "Lab-grown diamonds typically cost 30-40% less than mined diamonds of comparable quality, allowing you to get a larger or higher-quality stone for your budget.",
          };
          
          return params.topic ? info[params.topic] : JSON.stringify(info, null, 2);
        },
      }),
      generateDesign: createRorkTool({
        description: "Generate a custom jewelry design based on user description. Use this when user wants to create, design, or visualize a custom piece of jewelry.",
        zodSchema: z.object({
          description: z.string().describe("Detailed description of the jewelry design including type (ring, necklace, earring, etc.), style, materials, gemstones, and any specific features"),
        }),
        async execute(params) {
          try {
            console.log("[Chat] Starting design generation for:", params.description);
            setIsGeneratingDesign(true);
            
            const response = await fetch("https://toolkit.rork.com/images/generate/", {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
              },
              body: JSON.stringify({
                prompt: `High-quality professional product photography of ${params.description}. Studio lighting, white background, jewelry photography, ultra detailed, 8K resolution, luxury jewelry aesthetic.`,
                size: "1024x1024",
              }),
            });

            console.log("[Chat] Image generation response status:", response.status);
            
            if (!response.ok) {
              const errorText = await response.text();
              console.error("[Chat] Image generation failed:", response.status, errorText);
              throw new Error(`Failed to generate design: ${response.status}`);
            }

            const data = await response.json();
            console.log("[Chat] Image generation successful, data received:", {
              hasMimeType: !!data.image?.mimeType,
              hasBase64: !!data.image?.base64Data,
              base64Length: data.image?.base64Data?.length,
            });
            
            setIsGeneratingDesign(false);
            
            const imageUri = `data:${data.image.mimeType};base64,${data.image.base64Data}`;
            console.log("[Chat] Generated image URI prefix:", imageUri.substring(0, 50));
            
            return JSON.stringify({
              success: true,
              image: imageUri,
              description: params.description,
            });
          } catch (error) {
            setIsGeneratingDesign(false);
            console.error("[Chat] Design generation error:", error);
            return JSON.stringify({ 
              success: false, 
              error: error instanceof Error ? error.message : "Failed to generate design" 
            });
          }
        },
      }),
    },
  });

  useEffect(() => {
    scrollViewRef.current?.scrollToEnd({ animated: true });
  }, [messages]);

  const handleSend = () => {
    if (input.trim()) {
      const message = input.trim();
      sendMessage(message);
      setInput("");
      
      saveConversationMutation.mutate({
        sessionId,
        message: {
          role: "user",
          content: message,
        },
      });
    }
  };
  
  const handleFeedback = (messageId: string, messageIndex: number, rating: "helpful" | "not-helpful", comment?: string) => {
    if (feedbackGiven[messageId]) return;
    
    setFeedbackGiven(prev => ({ ...prev, [messageId]: true }));
    
    feedbackMutation.mutate({
      sessionId,
      messageIndex,
      rating,
      comment,
    });
    
    console.log("[Chat] Feedback submitted:", { messageIndex, rating });
  };
  
  useEffect(() => {
    if (messages.length > 0) {
      const lastMessage = messages[messages.length - 1];
      if (lastMessage.role === "assistant") {
        const textContent = lastMessage.parts
          .filter(p => p.type === "text")
          .map(p => (p as any).text)
          .join(" ");
        
        const toolsUsed = lastMessage.parts
          .filter(p => p.type === "tool")
          .map(p => (p as any).toolName);
        
        if (textContent) {
          saveConversationMutation.mutate({
            sessionId,
            message: {
              role: "assistant",
              content: textContent,
              toolsUsed,
            },
          });
        }
      }
    }
  }, [messages]);

  return (
    <SafeAreaView style={styles.container} edges={["top"]}>
      <View style={styles.header}>
        <View style={styles.headerContent}>
          <View style={styles.iconContainer}>
            <Sparkles color={Colors.light.primary} size={24} />
          </View>
          <View>
            <Text style={styles.headerTitle}>Celara AI</Text>
            <Text style={styles.headerSubtitle}>Your Jewelry Consultant</Text>
          </View>
        </View>
      </View>

      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={styles.keyboardView}
        keyboardVerticalOffset={0}
      >
        <ScrollView
          ref={scrollViewRef}
          style={styles.messagesContainer}
          contentContainerStyle={styles.messagesContent}
          showsVerticalScrollIndicator={false}
        >
          {messages.length === 0 && (
            <View style={styles.emptyState}>
              <Sparkles color={Colors.light.primary} size={48} />
              <Text style={styles.emptyTitle}>Welcome to Celara AI</Text>
              <Text style={styles.emptySubtitle}>
                I&apos;m here to help you find the perfect lab-grown jewelry. Ask me about products, prices, or design your dream piece!
              </Text>
              <View style={styles.suggestionsContainer}>
                <TouchableOpacity
                  style={styles.suggestionChip}
                  onPress={() => sendMessage("Show me engagement rings under $10,000")}
                >
                  <Text style={styles.suggestionText}>Engagement rings under $10k</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={styles.suggestionChip}
                  onPress={() => sendMessage("Design a custom rose gold engagement ring")}
                >
                  <Text style={styles.suggestionText}>Design custom jewelry</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={styles.suggestionChip}
                  onPress={() => sendMessage("Tell me about lab-grown diamonds")}
                >
                  <Text style={styles.suggestionText}>About lab-grown diamonds</Text>
                </TouchableOpacity>
              </View>
            </View>
          )}

          {messages.map((message, messageIndex) => (
            <View key={message.id} style={styles.messageWrapper}>
              <View
                style={[
                  styles.messageBubble,
                  message.role === "user" ? styles.userBubble : styles.aiBubble,
                ]}
              >
                {message.parts.map((part, index) => {
                  if (part.type === "text") {
                    return (
                      <Text
                        key={`${message.id}-${index}`}
                        style={[
                          styles.messageText,
                          message.role === "user" ? styles.userText : styles.aiText,
                        ]}
                      >
                        {part.text}
                      </Text>
                    );
                  }

                  if (part.type === "tool") {
                    const toolName = part.toolName;

                    switch (part.state) {
                      case "input-streaming":
                      case "input-available":
                        return (
                          <View key={`${message.id}-${index}`} style={styles.toolCall}>
                            <ActivityIndicator size="small" color={Colors.light.primary} />
                            <Text style={styles.toolText}>
                              {toolName === "searchProducts" && "Searching products..."}
                              {toolName === "viewProduct" && "Opening product..."}
                              {toolName === "addToWishlist" && "Adding to wishlist..."}
                              {toolName === "searchKnowledge" && "Searching jewelry knowledge base..."}
                              {toolName === "getLabGrownInfo" && "Getting information..."}
                              {toolName === "generateDesign" && "Generating your custom design..."}
                            </Text>
                          </View>
                        );

                      case "output-available":
                        if (toolName === "generateDesign") {
                          try {
                            const output = typeof part.output === "string" ? JSON.parse(part.output) : part.output;
                            console.log("[Chat] Design output received:", { hasSuccess: !!output.success, hasImage: !!output.image, imagePrefix: output.image?.substring(0, 30) });
                            
                            if (output.success && output.image) {
                              return (
                                <View key={`${message.id}-${index}`} style={styles.designResult}>
                                  <Image
                                    source={{ uri: output.image }}
                                    style={styles.designImage}
                                    contentFit="cover"
                                    onLoad={() => console.log("[Chat] Image loaded successfully")}
                                    onError={(error) => {
                                      console.error("[Chat] Image load error:", {
                                        error: error?.error || 'Unknown error',
                                        uri: output.image?.substring(0, 100),
                                      });
                                    }}
                                  />
                                  <Text style={styles.designDescription}>{output.description}</Text>
                                  <TouchableOpacity
                                    style={styles.getQuoteButton}
                                    onPress={() => {
                                      Alert.alert(
                                        "Request a Quote",
                                        "Our jewelry consultants will contact you within 24 hours with a detailed quote for your custom design.",
                                        [
                                          { text: "Cancel", style: "cancel" },
                                          {
                                            text: "Continue",
                                            onPress: () => {
                                              Alert.alert("Quote Requested", "We'll be in touch soon!");
                                            },
                                          },
                                        ]
                                      );
                                    }}
                                  >
                                    <Wand2 color={Colors.light.white} size={18} />
                                    <Text style={styles.getQuoteText}>Get Quote</Text>
                                  </TouchableOpacity>
                                </View>
                              );
                            } else {
                              console.error("[Chat] Invalid design output:", output);
                              return (
                                <View key={`${message.id}-${index}`} style={styles.toolError}>
                                  <Text style={styles.toolErrorText}>Failed to generate design. Please try again.</Text>
                                </View>
                              );
                            }
                          } catch (e) {
                            console.error("[Chat] Error parsing design output:", e, part.output);
                            return (
                              <View key={`${message.id}-${index}`} style={styles.toolError}>
                                <Text style={styles.toolErrorText}>Error displaying design. Please try again.</Text>
                              </View>
                            );
                          }
                        }
                        return (
                          <View key={`${message.id}-${index}`} style={styles.toolResult}>
                            <Text style={styles.toolResultText}>
                              {JSON.stringify(part.output, null, 2)}
                            </Text>
                          </View>
                        );

                      case "output-error":
                        return (
                          <View key={`${message.id}-${index}`} style={styles.toolError}>
                            <Text style={styles.toolErrorText}>{part.errorText}</Text>
                          </View>
                        );
                    }
                  }

                  return null;
                })}
              </View>
              
              {message.role === "assistant" && (
                <View style={styles.feedbackContainer}>
                  <Text style={styles.feedbackLabel}>Was this helpful?</Text>
                  <View style={styles.feedbackButtons}>
                    <TouchableOpacity
                      style={[
                        styles.feedbackButton,
                        feedbackGiven[message.id] && styles.feedbackButtonDisabled,
                      ]}
                      onPress={() => handleFeedback(message.id, messageIndex, "helpful")}
                      disabled={feedbackGiven[message.id]}
                    >
                      <ThumbsUp
                        color={feedbackGiven[message.id] ? Colors.light.textSecondary : Colors.light.primary}
                        size={16}
                      />
                    </TouchableOpacity>
                    <TouchableOpacity
                      style={[
                        styles.feedbackButton,
                        feedbackGiven[message.id] && styles.feedbackButtonDisabled,
                      ]}
                      onPress={() => handleFeedback(message.id, messageIndex, "not-helpful")}
                      disabled={feedbackGiven[message.id]}
                    >
                      <ThumbsDown
                        color={feedbackGiven[message.id] ? Colors.light.textSecondary : Colors.light.primary}
                        size={16}
                      />
                    </TouchableOpacity>
                  </View>
                </View>
              )}
            </View>
          ))}

          {error && (
            <View style={styles.errorContainer}>
              <Text style={styles.errorText}>Error: {error.message}</Text>
            </View>
          )}
        </ScrollView>

        <View style={styles.inputContainer}>
          <View style={styles.inputWrapper}>
            <TextInput
              style={styles.input}
              value={input}
              onChangeText={setInput}
              placeholder="Ask about jewelry, diamonds, or prices..."
              placeholderTextColor={Colors.light.textSecondary}
              multiline
              maxLength={500}
            />
            <TouchableOpacity
              style={[styles.sendButton, !input.trim() && styles.sendButtonDisabled]}
              onPress={handleSend}
              disabled={!input.trim()}
            >
              <Send
                color={input.trim() ? Colors.light.white : Colors.light.textSecondary}
                size={20}
              />
            </TouchableOpacity>
          </View>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.light.background,
  },
  header: {
    backgroundColor: Colors.light.white,
    borderBottomWidth: 1,
    borderBottomColor: Colors.light.border,
    paddingVertical: 16,
    paddingHorizontal: 20,
  },
  headerContent: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  iconContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: `${Colors.light.primary}15`,
    alignItems: "center",
    justifyContent: "center",
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: "700" as const,
    color: Colors.light.text,
    letterSpacing: 0.5,
  },
  headerSubtitle: {
    fontSize: 13,
    color: Colors.light.textSecondary,
    marginTop: 2,
  },
  keyboardView: {
    flex: 1,
  },
  messagesContainer: {
    flex: 1,
  },
  messagesContent: {
    padding: 20,
    paddingBottom: 10,
  },
  emptyState: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 60,
    paddingHorizontal: 20,
  },
  emptyTitle: {
    fontSize: 24,
    fontWeight: "700" as const,
    color: Colors.light.text,
    marginTop: 20,
    letterSpacing: 0.5,
  },
  emptySubtitle: {
    fontSize: 15,
    color: Colors.light.textSecondary,
    textAlign: "center",
    marginTop: 12,
    lineHeight: 22,
    maxWidth: 280,
  },
  suggestionsContainer: {
    marginTop: 32,
    gap: 12,
    alignItems: "center",
  },
  suggestionChip: {
    backgroundColor: Colors.light.white,
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 24,
    borderWidth: 1,
    borderColor: Colors.light.border,
  },
  suggestionText: {
    fontSize: 14,
    color: Colors.light.text,
    fontWeight: "600" as const,
  },
  messageWrapper: {
    marginBottom: 16,
  },
  messageBubble: {
    maxWidth: "85%",
    padding: 14,
    borderRadius: 18,
  },
  userBubble: {
    backgroundColor: Colors.light.primary,
    alignSelf: "flex-end",
    borderBottomRightRadius: 4,
  },
  aiBubble: {
    backgroundColor: Colors.light.white,
    alignSelf: "flex-start",
    borderBottomLeftRadius: 4,
    borderWidth: 1,
    borderColor: Colors.light.border,
  },
  messageText: {
    fontSize: 15,
    lineHeight: 21,
  },
  userText: {
    color: Colors.light.white,
  },
  aiText: {
    color: Colors.light.text,
  },
  toolCall: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    marginTop: 4,
  },
  toolText: {
    fontSize: 13,
    color: Colors.light.primary,
    fontStyle: "italic" as const,
  },
  toolResult: {
    marginTop: 8,
    padding: 10,
    backgroundColor: Colors.light.background,
    borderRadius: 8,
  },
  toolResultText: {
    fontSize: 12,
    color: Colors.light.textSecondary,
    fontFamily: Platform.select({ ios: "Menlo", android: "monospace" }),
  },
  toolError: {
    marginTop: 8,
    padding: 10,
    backgroundColor: "#FEE2E2",
    borderRadius: 8,
  },
  toolErrorText: {
    fontSize: 13,
    color: "#DC2626",
  },
  errorContainer: {
    padding: 12,
    backgroundColor: "#FEE2E2",
    borderRadius: 8,
    marginTop: 8,
  },
  errorText: {
    fontSize: 13,
    color: "#DC2626",
  },
  inputContainer: {
    padding: 16,
    backgroundColor: Colors.light.white,
    borderTopWidth: 1,
    borderTopColor: Colors.light.border,
  },
  inputWrapper: {
    flexDirection: "row",
    alignItems: "flex-end",
    backgroundColor: Colors.light.background,
    borderRadius: 24,
    paddingHorizontal: 16,
    paddingVertical: 8,
    gap: 8,
  },
  input: {
    flex: 1,
    fontSize: 15,
    color: Colors.light.text,
    maxHeight: 100,
    paddingTop: 8,
    paddingBottom: 8,
  },
  sendButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: Colors.light.primary,
    alignItems: "center",
    justifyContent: "center",
  },
  sendButtonDisabled: {
    backgroundColor: Colors.light.border,
  },
  designResult: {
    marginTop: 12,
    width: "100%",
  },
  designImage: {
    width: "100%",
    height: 280,
    borderRadius: 12,
    backgroundColor: Colors.light.background,
  },
  designDescription: {
    fontSize: 13,
    color: Colors.light.textSecondary,
    marginTop: 8,
    lineHeight: 18,
  },
  getQuoteButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: Colors.light.primary,
    paddingVertical: 14,
    paddingHorizontal: 24,
    borderRadius: 12,
    marginTop: 12,
    gap: 8,
  },
  getQuoteText: {
    fontSize: 15,
    fontWeight: "700" as const,
    color: Colors.light.white,
    letterSpacing: 0.5,
  },
  feedbackContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 8,
    gap: 12,
  },
  feedbackLabel: {
    fontSize: 12,
    color: Colors.light.textSecondary,
  },
  feedbackButtons: {
    flexDirection: "row",
    gap: 8,
  },
  feedbackButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: `${Colors.light.primary}10`,
    alignItems: "center",
    justifyContent: "center",
  },
  feedbackButtonDisabled: {
    opacity: 0.5,
  },
});
