import React from "react";
import { SafeAreaView, StyleSheet, Text, View, ScrollView } from "react-native";
import CustomerForm from "../components/CustomerForm";

export default function CustomersScreen() {
  return (
    <SafeAreaView style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <Text style={styles.title}>👥 Customers</Text>
          <Text style={styles.subtitle}>
            Add and manage yoga customers.
          </Text>
        </View>

        <View style={styles.card}>
          <CustomerForm />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F5F7FA",
  },
  header: {
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 10,
  },
  title: {
    fontSize: 28,
    fontWeight: "700",
    color: "#2E8B57",
  },
  subtitle: {
    marginTop: 6,
    color: "#666",
    fontSize: 15,
  },
  card: {
    backgroundColor: "#FFFFFF",
    marginHorizontal: 16,
    marginBottom: 20,
    borderRadius: 16,
    padding: 8,
    elevation: 3,
    shadowColor: "#000",
    shadowOpacity: 0.08,
    shadowRadius: 6,
  },
});