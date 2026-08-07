import React from "react";
import { router } from "expo-router";
import {
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { MaterialIcons } from "@expo/vector-icons";

import ClassForm from "../components/ClassForm";

export default function ClassesScreen() {
  const handleBack = () => {
    if (router.canGoBack()) {
      router.back();
    } else {
      router.replace("/class-list");
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
              size={26}
              color="#2E8B57"
            />
          </TouchableOpacity>

          <View style={styles.headerText}>
            <Text style={styles.title}>🧘 Yoga Classes</Text>

            <Text style={styles.subtitle}>
              Create and manage yoga classes.
            </Text>
          </View>
        </View>

        <View style={styles.card}>
          <ClassForm />
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
    alignItems: "flex-start",
    paddingHorizontal: 16,
    paddingTop: 20,
    paddingBottom: 10,
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
    marginTop: 6,
    color: "#666666",
    fontSize: 15,
  },

  card: {
    backgroundColor: "#FFFFFF",
    marginHorizontal: 16,
    marginBottom: 20,
    borderRadius: 16,
    padding: 8,
    elevation: 3,
    shadowColor: "#000000",
    shadowOpacity: 0.08,
    shadowRadius: 6,
  },
});