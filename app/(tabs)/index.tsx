import { MaterialIcons } from "@expo/vector-icons";
import { router } from "expo-router";
import React from "react";
import {
  Image,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

const menuItems = [
  {
    title: "Instructors",
    subtitle: "Manage instructors information",
    icon: "self-improvement",
    route: "/instructor-list",
    accent: "#2E8B57",
    soft: "#DDF4E8",
  },
  {
    title: "Customers",
    subtitle: "Manage customers information",
    icon: "groups",
    route: "/customer-list",
    accent: "#159A9C",
    soft: "#DDF4F4",
  },
  {
    title: "Classes",
    subtitle: "Manage classes schedule",
    icon: "fitness-center",
    route: "/class-list",
    accent: "#D98A00",
    soft: "#FFF1D6",
  },
  {
    title: "Attendance",
    subtitle: "Track class attendance",
    icon: "fact-check",
    route: "/attendance-list",
    accent: "#6B45B8",
    soft: "#EEE7FA",
  },
  {
    title: "Sales",
    subtitle: "Manage sales and payments",
    icon: "payments",
    route: "/sales-list",
    accent: "#E4572E",
    soft: "#FDE5DE",
  },
  {
    title: "Reports",
    subtitle: "View reports and analytics",
    icon: "bar-chart",
    route: "/reports",
    accent: "#2676C9",
    soft: "#E2EFFB",
  },
  {
    title: "Map",
    subtitle: "View studio location",
    icon: "location-on",
    route: "/map",
    accent: "#4E8B3D",
    soft: "#E3F2DE",
  },
  {
    title: "Notifications",
    subtitle: "Manage reminders and alerts",
    icon: "notifications-none",
    route: "/notifications",
    accent: "#E48700",
    soft: "#FFF0D2",
  },
];

export default function HomeScreen() {
  return (
    <SafeAreaView style={styles.container}>
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.hero}>
          <View style={styles.heroTopRow}>
            <Image
              source={require("../../assets/images/yoga-logo.png")}
              style={styles.logo}
            />

            <TouchableOpacity
              style={styles.notificationButton}
              onPress={() => router.push("/notifications")}
            >
              <MaterialIcons
                name="notifications-none"
                size={27}
                color="#3B7A3F"
              />

              <View style={styles.badge}>
                <Text style={styles.badgeText}>3</Text>
              </View>
            </TouchableOpacity>
          </View>

          <Text style={styles.title}>Yoga Management</Text>

          <Text style={styles.subtitle}>
            Welcome to your Yoga Management System
          </Text>

          <View style={styles.heroDecoration}>
            <MaterialIcons
              name="spa"
              size={58}
              color="rgba(76, 140, 76, 0.13)"
              style={styles.heroIcon}
            />

            <View style={styles.waveOne} />
            <View style={styles.waveTwo} />
          </View>
        </View>

        <View style={styles.grid}>
          {menuItems.map((item) => (
            <TouchableOpacity
              key={item.title}
              style={styles.card}
              activeOpacity={0.85}
              onPress={() => router.push(item.route as any)}
            >
              <View
                style={[styles.cardAccent, { backgroundColor: item.accent }]}
              />

              <View style={[styles.iconCircle, { backgroundColor: item.soft }]}>
                <MaterialIcons
                  name={item.icon as any}
                  size={30}
                  color={item.accent}
                />
              </View>

              <Text
                style={[styles.cardTitle, { color: item.accent }]}
                numberOfLines={1}
              >
                {item.title}
              </Text>

              <Text style={styles.cardSubtitle} numberOfLines={2}>
                {item.subtitle}
              </Text>

              <MaterialIcons
                name="chevron-right"
                size={25}
                color={item.accent}
                style={styles.chevron}
              />
            </TouchableOpacity>
          ))}
        </View>

        <View style={styles.quoteCard}>
          <MaterialIcons name="eco" size={34} color="#6A9A5D" />

          <View style={styles.quoteTextContainer}>
            <Text style={styles.quote}>
              “Yoga is the journey of the self, through the self, to the self.”
            </Text>

            <Text style={styles.quoteSource}>— The Bhagavad Gita</Text>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F8FAF7",
  },

  scrollContent: {
    paddingBottom: 24,
  },

  hero: {
    backgroundColor: "#FCFDF9",
    paddingHorizontal: 18,
    paddingTop: 14,
    paddingBottom: 8,
    overflow: "hidden",
  },

  heroTopRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },

  logo: {
    width: 210,
    height: 140,
    resizeMode: "contain",
    alignSelf: "center",
    marginTop: 10,
    marginBottom: 0,
  },

  notificationButton: {
    width: 50,
    height: 50,
    borderRadius: 16,
    backgroundColor: "#FFFFFF",
    alignItems: "center",
    justifyContent: "center",
    elevation: 2,
  },

  badge: {
    position: "absolute",
    top: -5,
    right: -3,
    minWidth: 21,
    height: 21,
    borderRadius: 11,
    backgroundColor: "#EF5350",
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 5,
  },

  badgeText: {
    color: "#FFFFFF",
    fontSize: 11,
    fontWeight: "700",
  },

  title: {
    marginTop: 0,
    fontSize: 28,
    fontWeight: "800",
    color: "#2F6837",
  },

  subtitle: {
    marginTop: 4,
    fontSize: 14,
    color: "#60656B",
  },

  heroDecoration: {
    height: 24,
    marginTop: 4,
    position: "relative",
  },

  heroIcon: {
    position: "absolute",
    right: 16,
    bottom: -2,
  },

  waveOne: {
    position: "absolute",
    left: -25,
    right: -25,
    bottom: 12,
    height: 2,
    backgroundColor: "rgba(92, 151, 78, 0.20)",
    transform: [{ rotate: "2deg" }],
  },

  waveTwo: {
    position: "absolute",
    left: 70,
    right: -20,
    bottom: 5,
    height: 2,
    backgroundColor: "rgba(92, 151, 78, 0.10)",
    transform: [{ rotate: "-2deg" }],
  },

  grid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    paddingHorizontal: 12,
    paddingTop: 4,
  },

  card: {
    width: "48.2%",
    minHeight: 170,
    backgroundColor: "#FFFFFF",
    borderRadius: 18,
    marginBottom: 12,
    paddingHorizontal: 14,
    paddingTop: 16,
    paddingBottom: 14,
    overflow: "hidden",
    elevation: 3,
    shadowColor: "#000000",
    shadowOpacity: 0.07,
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowRadius: 6,
  },

  cardAccent: {
    position: "absolute",
    left: 0,
    top: 0,
    bottom: 0,
    width: 4,
  },

  iconCircle: {
    width: 58,
    height: 58,
    borderRadius: 29,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 12,
  },

  cardTitle: {
    fontSize: 17,
    fontWeight: "800",
    paddingRight: 20,
  },

  cardSubtitle: {
    marginTop: 7,
    fontSize: 12.5,
    lineHeight: 18,
    color: "#62666C",
    paddingRight: 10,
  },

  chevron: {
    position: "absolute",
    right: 10,
    top: 75,
  },

  quoteCard: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#FCFDF8",
    borderWidth: 1,
    borderColor: "#D6E3CF",
    borderRadius: 16,
    marginHorizontal: 12,
    marginTop: 2,
    padding: 15,
  },

  quoteTextContainer: {
    flex: 1,
    marginLeft: 10,
  },

  quote: {
    fontSize: 13,
    lineHeight: 19,
    color: "#416C44",
    fontStyle: "italic",
    fontWeight: "500",
  },

  quoteSource: {
    marginTop: 5,
    fontSize: 12,
    color: "#51924F",
    fontWeight: "600",
  },
});
