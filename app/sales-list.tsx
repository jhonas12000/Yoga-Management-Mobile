import React, { useCallback, useState } from "react";
import { router, useFocusEffect } from "expo-router";
import {
  Alert,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { MaterialIcons } from "@expo/vector-icons";

import {
  getSales,
  deleteSale,
} from "../database/database";

export default function SalesListScreen() {
  const [sales, setSales] = useState<any[]>([]);

  const loadSales = async () => {
    try {
      const data = await getSales();
      setSales(data as any[]);
    } catch (error) {
      console.error("Sales load error:", error);
    }
  };

  useFocusEffect(
    useCallback(() => {
      loadSales();
    }, [])
  );

  const handleBack = () => {
    if (router.canGoBack()) {
      router.back();
    } else {
      router.replace("/");
    }
  };

  const handleDelete = (item: any) => {
    Alert.alert(
      "Delete Sale",
      `Delete sale for ${item.customerFirstName} ${item.customerLastName}?`,
      [
        {
          text: "Cancel",
          style: "cancel",
        },
        {
          text: "Delete",
          style: "destructive",
          onPress: async () => {
            try {
              await deleteSale(item.id);
              await loadSales();
            } catch (error) {
              console.error("Delete sale error:", error);

              Alert.alert(
                "Error",
                "Unable to delete sale."
              );
            }
          },
        },
      ]
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.header}>
          <TouchableOpacity
            style={styles.backButton}
            onPress={handleBack}
          >
            <MaterialIcons
              name="arrow-back"
              size={25}
              color="#2E8B57"
            />
          </TouchableOpacity>

          <View style={styles.headerText}>
            <Text style={styles.title}>Sales</Text>

            <Text style={styles.subtitle}>
              Record and manage customer sales.
            </Text>
          </View>

          <TouchableOpacity
            style={styles.addButton}
            onPress={() => router.push("/sales")}
          >
            <MaterialIcons
              name="add"
              size={22}
              color="#FFFFFF"
            />

            <Text style={styles.addText}>Add</Text>
          </TouchableOpacity>
        </View>

        {sales.length === 0 ? (
          <View style={styles.emptyCard}>
            <MaterialIcons
              name="payments"
              size={55}
              color="#2E8B57"
            />

            <Text style={styles.emptyTitle}>
              No Sales Records
            </Text>

            <Text style={styles.emptyText}>
              Tap Add to record a new sale.
            </Text>
          </View>
        ) : (
          sales.map((item) => (
            <View key={item.id} style={styles.card}>
              <View style={styles.cardIcon}>
                <MaterialIcons
                  name="attach-money"
                  size={28}
                  color="#2E8B57"
                />
              </View>

              <View style={styles.cardContent}>
                <Text style={styles.customerName}>
                  {item.customerFirstName}{" "}
                  {item.customerLastName}
                </Text>

                <Text style={styles.amount}>
                  ${Number(item.amount).toFixed(2)}
                </Text>

                <Text style={styles.details}>
                  Date: {item.saleDate}
                </Text>

                <Text style={styles.details}>
                  Payment: {item.paymentMethod}
                </Text>

                {item.notes ? (
                  <Text style={styles.notes}>
                    Notes: {item.notes}
                  </Text>
                ) : null}
              </View>

              <View style={styles.actions}>
                <TouchableOpacity
                  onPress={() =>
                    router.push({
                      pathname: "/sales",
                      params: {
                        id: item.id.toString(),
                      },
                    })
                  }
                >
                  <MaterialIcons
                    name="edit"
                    size={23}
                    color="#2E8B57"
                  />
                </TouchableOpacity>

                <TouchableOpacity
                  style={styles.deleteButton}
                  onPress={() => handleDelete(item)}
                >
                  <MaterialIcons
                    name="delete"
                    size={23}
                    color="#D32F2F"
                  />
                </TouchableOpacity>
              </View>
            </View>
          ))
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F5F7FA",
  },

  scrollContent: {
    paddingBottom: 30,
  },

  header: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingTop: 20,
    paddingBottom: 18,
  },

  backButton: {
    width: 42,
    height: 42,
    borderRadius: 21,
    backgroundColor: "#FFFFFF",
    alignItems: "center",
    justifyContent: "center",
    marginRight: 10,
    elevation: 2,
  },

  headerText: {
    flex: 1,
  },

  title: {
    fontSize: 27,
    fontWeight: "700",
    color: "#2E8B57",
  },

  subtitle: {
    marginTop: 4,
    color: "#666666",
    fontSize: 14,
  },

  addButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#2E8B57",
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: 10,
  },

  addText: {
    marginLeft: 4,
    color: "#FFFFFF",
    fontWeight: "600",
  },

  emptyCard: {
    minHeight: 450,
    marginHorizontal: 16,
    backgroundColor: "#FFFFFF",
    borderRadius: 16,
    alignItems: "center",
    justifyContent: "center",
    padding: 30,
    elevation: 3,
  },

  emptyTitle: {
    marginTop: 14,
    fontSize: 20,
    fontWeight: "700",
    color: "#333333",
  },

  emptyText: {
    marginTop: 8,
    color: "#777777",
    fontSize: 15,
    textAlign: "center",
  },

  card: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#FFFFFF",
    marginHorizontal: 16,
    marginBottom: 14,
    padding: 16,
    borderRadius: 14,
    elevation: 3,
  },

  cardIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: "#E8F5EE",
    alignItems: "center",
    justifyContent: "center",
    marginRight: 14,
  },

  cardContent: {
    flex: 1,
  },

  customerName: {
    fontSize: 18,
    fontWeight: "700",
    color: "#333333",
  },

  amount: {
    fontSize: 17,
    fontWeight: "700",
    color: "#2E8B57",
    marginTop: 4,
  },

  details: {
    color: "#666666",
    marginTop: 5,
  },

  notes: {
    color: "#777777",
    marginTop: 5,
  },

  actions: {
    flexDirection: "row",
    alignItems: "center",
    marginLeft: 10,
  },

  deleteButton: {
    marginLeft: 12,
  },
});