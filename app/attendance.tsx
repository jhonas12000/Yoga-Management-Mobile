import { MaterialIcons } from "@expo/vector-icons";
import DateTimePicker from "@react-native-community/datetimepicker";
import { Picker } from "@react-native-picker/picker";
import { router, useLocalSearchParams } from "expo-router";
import React, { useEffect, useState } from "react";
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
    getAttendanceById,
    getClasses,
    getCustomers,
    insertAttendance,
    updateAttendance,
} from "../database/database";
import { saveAttendanceToFirestore } from "../firebase/firestoreSync";

type ClassOption = {
  id: number;
  title: string;
};

type CustomerOption = {
  id: number;
  firstName: string;
  lastName: string;
};

export default function AttendanceScreen() {
  const { id } = useLocalSearchParams<{ id?: string }>();

  const editingId = id ? Number(id) : null;
  const isEditing = editingId !== null;
  const [classes, setClasses] = useState<ClassOption[]>([]);
  const [customers, setCustomers] = useState<CustomerOption[]>([]);

  const [form, setForm] = useState({
    classId: "",
    customerId: "",
    attendanceDate: "",
    status: "Present",
    notes: "",
  });

  const [showDatePicker, setShowDatePicker] = useState(false);

  useEffect(() => {
    async function loadDropdownData() {
      try {
        const classData = await getClasses();
        const customerData = await getCustomers();

        setClasses(classData as ClassOption[]);
        setCustomers(customerData as CustomerOption[]);
      } catch (error) {
        console.error("Unable to load attendance options:", error);
        Alert.alert("Error", "Unable to load classes or customers.");
      }
    }

    loadDropdownData();
  }, []);

  useEffect(() => {
    async function loadAttendanceRecord() {
      if (!editingId) {
        return;
      }

      try {
        const record: any = await getAttendanceById(editingId);

        if (record) {
          setForm({
            classId: record.classId.toString(),
            customerId: record.customerId.toString(),
            attendanceDate: record.attendanceDate,
            status: record.status,
            notes: record.notes ?? "",
          });
        }
      } catch (error) {
        console.error("Unable to load attendance:", error);
      }
    }

    loadAttendanceRecord();
  }, [editingId]);

  const handleChange = (field: keyof typeof form, value: string) => {
    setForm((previousForm) => ({
      ...previousForm,
      [field]: value,
    }));
  };

  const handleContinue = async () => {
    if (!form.classId) {
      Alert.alert("Missing Information", "Please select a yoga class.");
      return;
    }

    if (!form.customerId) {
      Alert.alert("Missing Information", "Please select a customer.");
      return;
    }

    if (!form.attendanceDate) {
      Alert.alert("Missing Information", "Please select an attendance date.");
      return;
    }

    try {
      if (editingId) {
        await updateAttendance(
          editingId,
          Number(form.classId),
          Number(form.customerId),
          form.attendanceDate,
          form.status,
          form.notes,
        );

        await saveAttendanceToFirestore(editingId, {
          classId: Number(form.classId),
          customerId: Number(form.customerId),
          attendanceDate: form.attendanceDate,
          status: form.status,
          notes: form.notes,
        });
      } else {
        const result = await insertAttendance(
          Number(form.classId),
          Number(form.customerId),
          form.attendanceDate,
          form.status,
          form.notes,
        );

        await saveAttendanceToFirestore(Number(result.lastInsertRowId), {
          classId: Number(form.classId),
          customerId: Number(form.customerId),
          attendanceDate: form.attendanceDate,
          status: form.status,
          notes: form.notes,
        });
      }

      router.replace("/attendance-list");
    } catch (error: any) {
      console.error("Attendance error:", error);

      Alert.alert("Error", error?.message ?? "Unable to save attendance.");
    }
  };

  const handleBack = () => {
    if (router.canGoBack()) {
      router.back();
    } else {
      router.replace("/attendance-list");
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.header}>
          <TouchableOpacity style={styles.backButton} onPress={handleBack}>
            <MaterialIcons name="arrow-back" size={25} color="#2E8B57" />
          </TouchableOpacity>

          <View style={styles.headerText}>
            <Text style={styles.title}>
              {isEditing ? "Edit Attendance" : "Record Attendance"}
            </Text>

            <Text style={styles.subtitle}>
              Select a class, customer, date, and status.
            </Text>
          </View>
        </View>

        <View style={styles.card}>
          <Text style={styles.label}>Yoga Class</Text>

          <View style={styles.pickerContainer}>
            <Picker
              selectedValue={form.classId}
              onValueChange={(value) => handleChange("classId", String(value))}
            >
              <Picker.Item label="Select Class" value="" />

              {classes.map((item) => (
                <Picker.Item
                  key={item.id}
                  label={item.title}
                  value={item.id.toString()}
                />
              ))}
            </Picker>
          </View>

          <Text style={styles.label}>Customer</Text>

          <View style={styles.pickerContainer}>
            <Picker
              selectedValue={form.customerId}
              onValueChange={(value) =>
                handleChange("customerId", String(value))
              }
            >
              <Picker.Item label="Select Customer" value="" />

              {customers.map((item) => (
                <Picker.Item
                  key={item.id}
                  label={`${item.firstName} ${item.lastName}`}
                  value={item.id.toString()}
                />
              ))}
            </Picker>
          </View>

          <Text style={styles.label}>Attendance Date</Text>

          <TouchableOpacity
            style={styles.input}
            onPress={() => setShowDatePicker(true)}
          >
            <Text
              style={[
                styles.dateText,
                !form.attendanceDate && styles.placeholderText,
              ]}
            >
              {form.attendanceDate || "Select Date"}
            </Text>
          </TouchableOpacity>

          {showDatePicker && (
            <DateTimePicker
              value={
                form.attendanceDate ? new Date(form.attendanceDate) : new Date()
              }
              mode="date"
              display="default"
              onChange={(_, selectedDate) => {
                setShowDatePicker(false);

                if (selectedDate) {
                  const year = selectedDate.getFullYear();
                  const month = String(selectedDate.getMonth() + 1).padStart(
                    2,
                    "0",
                  );
                  const day = String(selectedDate.getDate()).padStart(2, "0");

                  handleChange("attendanceDate", `${year}-${month}-${day}`);
                }
              }}
            />
          )}

          <Text style={styles.label}>Status</Text>

          <View style={styles.pickerContainer}>
            <Picker
              selectedValue={form.status}
              onValueChange={(value) => handleChange("status", String(value))}
            >
              <Picker.Item label="Present" value="Present" />

              <Picker.Item label="Absent" value="Absent" />

              <Picker.Item label="Late" value="Late" />
            </Picker>
          </View>

          <Text style={styles.label}>Notes</Text>

          <TextInput
            style={[styles.input, styles.notesInput]}
            placeholder="Optional notes"
            value={form.notes}
            onChangeText={(text) => handleChange("notes", text)}
            multiline
            textAlignVertical="top"
          />

          <TouchableOpacity style={styles.button} onPress={handleContinue}>
            <MaterialIcons name="check-circle" size={21} color="#FFFFFF" />

            <Text style={styles.buttonText}>
              {isEditing ? "Update Attendance" : "Save Attendance"}
            </Text>
          </TouchableOpacity>
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
    paddingBottom: 14,
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
    borderRadius: 16,
    padding: 20,
    elevation: 3,
  },

  label: {
    fontSize: 15,
    fontWeight: "600",
    color: "#333333",
    marginBottom: 7,
  },

  pickerContainer: {
    borderWidth: 1,
    borderColor: "#D1D5DB",
    borderRadius: 10,
    marginBottom: 16,
    backgroundColor: "#FFFFFF",
    overflow: "hidden",
  },

  input: {
    borderWidth: 1,
    borderColor: "#D1D5DB",
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: 13,
    marginBottom: 16,
    backgroundColor: "#FFFFFF",
    minHeight: 50,
    justifyContent: "center",
    fontSize: 16,
  },

  notesInput: {
    minHeight: 100,
  },

  dateText: {
    color: "#000000",
    fontSize: 16,
  },

  placeholderText: {
    color: "#999999",
  },

  button: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#2E8B57",
    paddingVertical: 15,
    borderRadius: 10,
  },

  buttonText: {
    marginLeft: 7,
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "600",
  },
});
