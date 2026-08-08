import { MaterialIcons } from "@expo/vector-icons";
import { router, useFocusEffect } from "expo-router";
import React, { useCallback, useState } from "react";
import {
    Alert,
    SafeAreaView,
    ScrollView,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from "react-native";

import {
    deleteInstructor,
    getInstructors,
    Instructor,
} from "../database/database";

export default function InstructorListScreen() {
  const [search, setSearch] = useState("");
  const [instructors, setInstructors] = useState<Instructor[]>([]);
  const [loading, setLoading] = useState(true);

  const loadInstructors = useCallback(async () => {
    try {
      setLoading(true);

      const data = await getInstructors();
      setInstructors(data);
    } catch (error) {
      console.error(error);
      Alert.alert("Error", "Failed to load instructors.");
    } finally {
      setLoading(false);
    }
  }, []);

  useFocusEffect(
    useCallback(() => {
      loadInstructors();
    }, [loadInstructors]),
  );

  const filteredInstructors = instructors.filter((item) => {
    const searchableText = `
        ${item.firstName}
        ${item.lastName}
        ${item.email ?? ""}
        ${item.phone ?? ""}
      `.toLowerCase();

    return searchableText.includes(search.trim().toLowerCase());
  });

  const handleEdit = (id: number) => {
    router.push({
      pathname: "/instructors",
      params: {
        id: String(id),
      },
    });
  };

  const handleDelete = (instructor: Instructor) => {
    const fullName = `${instructor.firstName} ${instructor.lastName}`;

    Alert.alert(
      "Delete Instructor",
      `Are you sure you want to delete ${fullName}?`,
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
              await deleteInstructor(instructor.id);

              setInstructors((current) =>
                current.filter((item) => item.id !== instructor.id),
              );

              Alert.alert("Deleted", "Instructor deleted successfully.");
            } catch (error) {
              console.error(error);
              Alert.alert("Error", "Failed to delete instructor.");
            }
          },
        },
      ],
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <Text style={styles.title}>Instructors</Text>

          <TouchableOpacity
            style={styles.addButton}
            onPress={() => router.push("/instructors")}
          >
            <MaterialIcons name="add" size={22} color="#FFFFFF" />
            <Text style={styles.addText}>Add</Text>
          </TouchableOpacity>
        </View>

        <TextInput
          placeholder="Search instructors..."
          placeholderTextColor="#999999"
          value={search}
          onChangeText={setSearch}
          style={styles.searchInput}
        />

        {loading ? (
          <Text style={styles.message}>Loading instructors...</Text>
        ) : filteredInstructors.length === 0 ? (
          <Text style={styles.message}>
            {search.trim()
              ? "No matching instructors found."
              : "No instructors have been added."}
          </Text>
        ) : (
          filteredInstructors.map((item) => (
            <View key={item.id} style={styles.card}>
              <View style={styles.avatar}>
                <MaterialIcons name="person" size={34} color="#2E8B57" />
              </View>

              <View style={styles.details}>
                <Text style={styles.name}>
                  {item.firstName} {item.lastName}
                </Text>

                <View style={styles.contactRow}>
                  <MaterialIcons name="email" size={16} color="#666666" />
                  <Text style={styles.secondaryText} numberOfLines={1}>
                    {item.email || "No email provided"}
                  </Text>
                </View>

                <View style={styles.contactRow}>
                  <MaterialIcons name="phone" size={16} color="#2E8B57" />
                  <Text style={styles.phone}>
                    {item.phone || "No phone provided"}
                  </Text>
                </View>
              </View>

              <View style={styles.actions}>
                <TouchableOpacity
                  style={styles.iconButton}
                  onPress={() => handleEdit(item.id)}
                  accessibilityLabel={`Edit ${item.firstName}`}
                >
                  <MaterialIcons name="edit" size={23} color="#2E8B57" />
                </TouchableOpacity>

                <TouchableOpacity
                  style={styles.iconButton}
                  onPress={() => handleDelete(item)}
                  accessibilityLabel={`Delete ${item.firstName}`}
                >
                  <MaterialIcons name="delete" size={23} color="#D32F2F" />
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

  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    margin: 18,
  },

  title: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#2E8B57",
  },

  addButton: {
    flexDirection: "row",
    backgroundColor: "#2E8B57",
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 10,
    alignItems: "center",
  },

  addText: {
    color: "#FFFFFF",
    marginLeft: 4,
    fontWeight: "600",
  },

  searchInput: {
    backgroundColor: "#FFFFFF",
    marginHorizontal: 16,
    marginBottom: 18,
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderWidth: 1,
    borderColor: "#E5E7EB",
    fontSize: 16,
  },

  card: {
    backgroundColor: "#FFFFFF",
    marginHorizontal: 16,
    marginBottom: 14,
    borderRadius: 14,
    padding: 16,
    flexDirection: "row",
    alignItems: "center",
    elevation: 3,
    shadowColor: "#000000",
    shadowOpacity: 0.08,
    shadowRadius: 5,
    shadowOffset: {
      width: 0,
      height: 2,
    },
  },

  avatar: {
    marginRight: 14,
  },

  details: {
    flex: 1,
    paddingRight: 8,
  },

  name: {
    fontSize: 18,
    fontWeight: "700",
    color: "#111827",
  },

  secondaryText: {
    color: "#666666",
    marginLeft: 6,
  },

  phone: {
    marginLeft: 6,
    color: "#2E8B57",
    fontWeight: "600",
  },

  contactRow: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 4,
  },

  actions: {
    flexDirection: "row",
    alignItems: "center",
  },

  iconButton: {
    padding: 7,
    marginLeft: 3,
  },

  message: {
    textAlign: "center",
    color: "#666666",
    marginTop: 35,
    fontSize: 16,
  },
});
