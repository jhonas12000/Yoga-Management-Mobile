import React, { useCallback, useState } from "react";
import { router, useFocusEffect } from "expo-router";
import {
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { MaterialIcons } from "@expo/vector-icons";

import {
  getCustomerCount,
  getClassCount,
  getAttendanceCount,
  getSalesCount,
  getTotalSalesRevenue,
} from "../database/database";

export default function ReportsScreen() {
  const [customers, setCustomers] = useState(0);
  const [classes, setClasses] = useState(0);
  const [attendance, setAttendance] = useState(0);
  const [salesCount, setSalesCount] = useState(0);
  const [revenue, setRevenue] = useState(0);

  const loadReports = async () => {
    try {
      const customerTotal = await getCustomerCount();
      const classTotal = await getClassCount();
      const attendanceTotal = await getAttendanceCount();
      const salesTotal = await getSalesCount();
      const revenueTotal = await getTotalSalesRevenue();

      setCustomers(Number(customerTotal));
      setClasses(Number(classTotal));
      setAttendance(Number(attendanceTotal));
      setSalesCount(Number(salesTotal));
      setRevenue(Number(revenueTotal));
    } catch (error) {
      console.error("Reports load error:", error);
    }
  };

  useFocusEffect(
    useCallback(() => {
      loadReports();
    }, [])
  );

  const handleBack = () => {
    if (router.canGoBack()) {
      router.back();
    } else {
      router.replace("/");
    }
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
            <Text style={styles.title}>Reports</Text>

            <Text style={styles.subtitle}>
              Overview of yoga studio activity.
            </Text>
          </View>
        </View>

        <View style={styles.grid}>
          <View style={styles.card}>
            <MaterialIcons
              name="people"
              size={34}
              color="#2E8B57"
            />

            <Text style={styles.value}>
              {customers}
            </Text>

            <Text style={styles.label}>
              Customers
            </Text>
          </View>

          <View style={styles.card}>
            <MaterialIcons
              name="self-improvement"
              size={34}
              color="#2E8B57"
            />

            <Text style={styles.value}>
              {classes}
            </Text>

            <Text style={styles.label}>
              Classes
            </Text>
          </View>

          <View style={styles.card}>
            <MaterialIcons
              name="fact-check"
              size={34}
              color="#2E8B57"
            />

            <Text style={styles.value}>
              {attendance}
            </Text>

            <Text style={styles.label}>
              Attendance
            </Text>
          </View>

          <View style={styles.card}>
            <MaterialIcons
              name="receipt-long"
              size={34}
              color="#2E8B57"
            />

            <Text style={styles.value}>
              {salesCount}
            </Text>

            <Text style={styles.label}>
              Sales
            </Text>
          </View>
        </View>

        <View style={styles.revenueCard}>
          <View style={styles.revenueIcon}>
            <MaterialIcons
              name="attach-money"
              size={34}
              color="#FFFFFF"
            />
          </View>

          <View>
            <Text style={styles.revenueLabel}>
              Total Sales Revenue
            </Text>

            <Text style={styles.revenueValue}>
              ${revenue.toFixed(2)}
            </Text>
          </View>
        </View>

        <View style={styles.summaryCard}>
          <Text style={styles.summaryTitle}>
            Studio Summary
          </Text>

          <View style={styles.summaryRow}>
            <Text style={styles.summaryLabel}>
              Total Customers
            </Text>

            <Text style={styles.summaryValue}>
              {customers}
            </Text>
          </View>

          <View style={styles.divider} />

          <View style={styles.summaryRow}>
            <Text style={styles.summaryLabel}>
              Total Classes
            </Text>

            <Text style={styles.summaryValue}>
              {classes}
            </Text>
          </View>

          <View style={styles.divider} />

          <View style={styles.summaryRow}>
            <Text style={styles.summaryLabel}>
              Attendance Records
            </Text>

            <Text style={styles.summaryValue}>
              {attendance}
            </Text>
          </View>

          <View style={styles.divider} />

          <View style={styles.summaryRow}>
            <Text style={styles.summaryLabel}>
              Sales Transactions
            </Text>

            <Text style={styles.summaryValue}>
              {salesCount}
            </Text>
          </View>
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
    fontSize: 28,
    fontWeight: "700",
    color: "#2E8B57",
  },

  subtitle: {
    marginTop: 4,
    color: "#666666",
    fontSize: 15,
  },

  grid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    paddingHorizontal: 16,
  },

  card: {
    width: "48%",
    backgroundColor: "#FFFFFF",
    borderRadius: 16,
    paddingVertical: 22,
    paddingHorizontal: 16,
    marginBottom: 14,
    alignItems: "center",
    elevation: 3,
  },

  value: {
    fontSize: 30,
    fontWeight: "700",
    color: "#333333",
    marginTop: 8,
  },

  label: {
    fontSize: 15,
    color: "#666666",
    marginTop: 4,
  },

  revenueCard: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#2E8B57",
    marginHorizontal: 16,
    marginTop: 4,
    padding: 20,
    borderRadius: 16,
    elevation: 3,
  },

  revenueIcon: {
    width: 58,
    height: 58,
    borderRadius: 29,
    backgroundColor: "rgba(255,255,255,0.18)",
    alignItems: "center",
    justifyContent: "center",
    marginRight: 16,
  },

  revenueLabel: {
    color: "#E8F5EE",
    fontSize: 15,
  },

  revenueValue: {
    color: "#FFFFFF",
    fontSize: 30,
    fontWeight: "700",
    marginTop: 4,
  },

  summaryCard: {
    backgroundColor: "#FFFFFF",
    marginHorizontal: 16,
    marginTop: 16,
    padding: 20,
    borderRadius: 16,
    elevation: 3,
  },

  summaryTitle: {
    fontSize: 19,
    fontWeight: "700",
    color: "#333333",
    marginBottom: 16,
  },

  summaryRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 10,
  },

  summaryLabel: {
    fontSize: 15,
    color: "#666666",
  },

  summaryValue: {
    fontSize: 16,
    fontWeight: "700",
    color: "#2E8B57",
  },

  divider: {
    height: 1,
    backgroundColor: "#E5E7EB",
  },
});