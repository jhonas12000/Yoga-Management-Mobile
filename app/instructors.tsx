import React from "react";
import { Stack } from "expo-router";
import { SafeAreaView, StyleSheet, Text, View } from "react-native";
import InstructorForm from "../components/InstructorForm";

export default function InstructorsScreen() {
  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>👩‍🏫 Instructors</Text>
        <Text style={styles.subtitle}>
          Add and manage yoga instructors.
        </Text>
      </View>

      <InstructorForm />
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
});