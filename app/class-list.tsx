import React, { useCallback, useState } from "react";
import { router, useFocusEffect } from "expo-router";
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
import { MaterialIcons } from "@expo/vector-icons";

import {
  getClasses,
  deleteClass,
} from "../database/database";

export default function ClassListScreen() {
  const [search, setSearch] = useState("");
  const [classes, setClasses] = useState<any[]>([]);

  useFocusEffect(
    useCallback(() => {
      async function loadClasses() {
        try {
          const data = await getClasses();
          setClasses(data as any[]);
        } catch (error) {
          console.error(error);
        }
      }

      loadClasses();
    }, [])
  );

  const filteredClasses = classes.filter((item) =>
    item.title.toLowerCase().includes(search.toLowerCase())
  );

  const handleDelete = (item: any) => {
    Alert.alert(
      "Delete Class",
      `Delete "${item.title}"?`,
      [
        {
          text: "Cancel",
          style: "cancel",
        },
        {
          text: "Delete",
          style: "destructive",
          onPress: async () => {
            await deleteClass(item.id);

            const data = await getClasses();
            setClasses(data as any[]);
          },
        },
      ]
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>

        <View style={styles.header}>
          <Text style={styles.title}>Yoga Classes</Text>

          <TouchableOpacity
            style={styles.addButton}
            onPress={() => router.push("/classes")}
          >
            <MaterialIcons name="add" size={22} color="#fff" />
            <Text style={styles.addText}>Add</Text>
          </TouchableOpacity>
        </View>

        <TextInput
          placeholder="Search classes..."
          value={search}
          onChangeText={setSearch}
          style={styles.searchInput}
        />

        {filteredClasses.map((item) => (
          <View
            key={item.id}
            style={styles.card}
          >
            <View style={{ flex: 1 }}>
              <Text style={styles.classTitle}>
                {item.title}
              </Text>

              <Text style={styles.subtitle}>
                Instructor: {item.instructorId}
              </Text>

              <Text style={styles.subtitle}>
                Start Date: {item.date}
              </Text>

              <Text style={styles.capacity}>
                Capacity: {item.capacity}
              </Text>
            </View>

            <View style={styles.actions}>
              <TouchableOpacity
                onPress={() =>
                  router.push({
                    pathname: "/classes",
                    params: {
                      id: item.id.toString(),
                    },
                  })
                }
              >
                <MaterialIcons
                  name="edit"
                  size={22}
                  color="#2E8B57"
                />
              </TouchableOpacity>

              <TouchableOpacity
                style={{ marginLeft: 12 }}
                onPress={() => handleDelete(item)}
              >
                <MaterialIcons
                  name="delete"
                  size={22}
                  color="#D32F2F"
                />
              </TouchableOpacity>
            </View>
          </View>
        ))}

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
  },

  classTitle: {
    fontSize: 18,
    fontWeight: "700",
  },

  subtitle: {
    color: "#666",
    marginTop: 3,
  },

  capacity: {
    marginTop: 4,
    color: "#2E8B57",
    fontWeight: "600",
  },

  actions: {
    flexDirection: "row",
    alignItems: "center",
  },
});