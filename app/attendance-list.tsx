import { MaterialIcons } from "@expo/vector-icons";
import { router, useFocusEffect } from "expo-router";
import React, { useCallback, useState } from "react";
import {
    Alert,
    SafeAreaView,
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from "react-native";

import { deleteAttendance, getAttendance } from "../database/database";
import { deleteAttendanceFromFirestore } from "../firebase/firestoreSync";

export default function AttendanceListScreen() {
  const [attendance, setAttendance] = useState<any[]>([]);

  const loadAttendance = async () => {
    try {
      const data = await getAttendance();
      setAttendance(data as any[]);
    } catch (error) {
      console.error("Attendance load error:", error);
    }
  };

  useFocusEffect(
    useCallback(() => {
      loadAttendance();
    }, []),
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
      "Delete Attendance",
      `Delete attendance for ${item.customerFirstName} ${item.customerLastName}?`,
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
              await deleteAttendance(item.id);
              await deleteAttendanceFromFirestore(item.id);
              await loadAttendance();
            } catch (error) {
              console.error(error);
              Alert.alert("Error", "Unable to delete attendance.");
            }
          },
        },
      ],
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.header}>
          <TouchableOpacity style={styles.backButton} onPress={handleBack}>
            <MaterialIcons name="arrow-back" size={25} color="#2E8B57" />
          </TouchableOpacity>

          <View style={styles.headerText}>
            <Text style={styles.title}>Attendance</Text>

            <Text style={styles.subtitle}>
              Record and manage class attendance.
            </Text>
          </View>

          <TouchableOpacity
            style={styles.addButton}
            onPress={() => router.push("/attendance")}
          >
            <MaterialIcons name="add" size={22} color="#FFFFFF" />

            <Text style={styles.addText}>Add</Text>
          </TouchableOpacity>
        </View>

        {attendance.length === 0 ? (
          <View style={styles.emptyCard}>
            <MaterialIcons name="fact-check" size={55} color="#2E8B57" />

            <Text style={styles.emptyTitle}>No Attendance Records</Text>

            <Text style={styles.emptyText}>
              Tap Add to record attendance for a yoga class.
            </Text>
          </View>
        ) : (
          attendance.map((item) => (
            <View key={item.id} style={styles.card}>
              <View style={styles.cardIcon}>
                <MaterialIcons name="person" size={28} color="#2E8B57" />
              </View>

              <View style={styles.cardContent}>
                <Text style={styles.customerName}>
                  {item.customerFirstName} {item.customerLastName}
                </Text>

                <Text style={styles.className}>{item.classTitle}</Text>

                <Text style={styles.details}>Date: {item.attendanceDate}</Text>

                <View style={styles.statusRow}>
                  <Text style={styles.statusLabel}>Status:</Text>

                  <Text style={styles.status}>{item.status}</Text>
                </View>

                {item.notes ? (
                  <Text style={styles.notes}>Notes: {item.notes}</Text>
                ) : null}
              </View>

              <View style={styles.actions}>
                <TouchableOpacity
                  onPress={() =>
                    router.push({
                      pathname: "/attendance",
                      params: {
                        id: item.id.toString(),
                      },
                    })
                  }
                >
                  <MaterialIcons name="edit" size={23} color="#2E8B57" />
                </TouchableOpacity>

                <TouchableOpacity
                  style={styles.deleteButton}
                  onPress={() => handleDelete(item)}
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

  className: {
    fontSize: 16,
    fontWeight: "600",
    color: "#2E8B57",
    marginTop: 4,
  },

  details: {
    color: "#666666",
    marginTop: 5,
  },

  statusRow: {
    flexDirection: "row",
    marginTop: 5,
  },

  statusLabel: {
    color: "#666666",
  },

  status: {
    marginLeft: 5,
    fontWeight: "700",
    color: "#2E8B57",
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
