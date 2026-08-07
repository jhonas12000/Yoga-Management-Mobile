import { router } from "expo-router";
import React from "react";
import {
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

const menuItems = [
  { title: "Instructors", icon: "👩‍🏫", route: "/instructor-list" },
  { title: "Customers", icon: "👥", route: "/customer-list" },
  { title: "Classes", icon: "🧘", route: "/class-list" },
  { title: "Attendance", icon: "✅", route: "/attendance-list" },
  { title: "Sales", icon: "💰", route: "/sales-list" },
  { title: "Reports", icon: "📊", route: "/reports" },
  { title: "Map", icon: "📍", route: "/map" },
  { title: "Notifications", icon: "🔔", route: "/notifications" },
];

export default function HomeScreen() {
  return (
    <SafeAreaView style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>
        <Text style={styles.title}>Yoga Management</Text>
        <Text style={styles.subtitle}>
          Welcome to your Yoga Management System
        </Text>

        <View style={styles.grid}>
          {menuItems.map((item) => (
            <TouchableOpacity
              key={item.title}
              style={styles.card}
              onPress={() => router.push(item.route as any)}
            >
              <Text style={styles.icon}>{item.icon}</Text>
              <Text style={styles.cardTitle}>{item.title}</Text>
            </TouchableOpacity>
          ))}
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
  title: {
    fontSize: 30,
    fontWeight: "bold",
    textAlign: "center",
    marginTop: 25,
    color: "#2E8B57",
  },
  subtitle: {
    textAlign: "center",
    color: "#666",
    marginTop: 8,
    marginBottom: 25,
    fontSize: 16,
  },
  grid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    paddingHorizontal: 18,
  },
  card: {
    width: "47%",
    backgroundColor: "#FFFFFF",
    borderRadius: 16,
    paddingVertical: 28,
    marginBottom: 18,
    alignItems: "center",
    elevation: 4,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 5,
  },
  icon: {
    fontSize: 36,
    marginBottom: 12,
  },
  cardTitle: {
    fontSize: 17,
    fontWeight: "600",
  },
});