import React, { useEffect, useState } from "react";
import { router, useLocalSearchParams } from "expo-router";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
} from "react-native";
import {
  insertClass,
  getClassById,
  updateClass,
  getInstructorNames,
} from "../database/database";
import DateTimePicker from "@react-native-community/datetimepicker";
import { Picker } from "@react-native-picker/picker";

type Instructor = {
  id: number;
  firstName: string;
  lastName: string;
};

export default function ClassForm() {
  const { id } = useLocalSearchParams<{ id?: string }>();

  const editingClassId = id ? Number(id) : null;
  const isEditing = editingClassId !== null;

  const [form, setForm] = useState({
    className: "",
    instructor: "",
    date: "",
    time: "",
    duration: "",
    capacity: "",
  });

  const [instructors, setInstructors] = useState<Instructor[]>([]);
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    async function loadClass() {
      if (!editingClassId) {
        return;
      }

      try {
        const yogaClass: any = await getClassById(editingClassId);

        if (yogaClass) {
          setForm({
            className: yogaClass.title ?? "",
            instructor: yogaClass.instructorId
              ? yogaClass.instructorId.toString()
              : "",
            date: yogaClass.date ?? "",
            time: yogaClass.time ?? "",
            duration: yogaClass.duration
              ? yogaClass.duration.toString()
              : "",
            capacity: yogaClass.capacity
              ? yogaClass.capacity.toString()
              : "",
          });
        }
      } catch (error) {
        console.error("Unable to load class:", error);
        Alert.alert("Error", "Unable to load the selected class.");
      }
    }

    loadClass();
  }, [editingClassId]);

  useEffect(() => {
    async function loadInstructors() {
      try {
        const data = await getInstructorNames();
        setInstructors(data as Instructor[]);
      } catch (error) {
        console.error("Unable to load instructors:", error);
      }
    }

    loadInstructors();
  }, []);

  const handleChange = (
    field: keyof typeof form,
    value: string
  ) => {
    setForm((previousForm) => ({
      ...previousForm,
      [field]: value,
    }));
  };

  const validateForm = () => {
    if (!form.className.trim()) {
      Alert.alert("Missing Information", "Please enter a class name.");
      return false;
    }

    if (!form.instructor) {
      Alert.alert("Missing Information", "Please select an instructor.");
      return false;
    }

    if (!form.date) {
      Alert.alert("Missing Information", "Please select a date.");
      return false;
    }

    if (!form.time.trim()) {
      Alert.alert("Missing Information", "Please enter a class time.");
      return false;
    }

    if (!form.duration || Number(form.duration) <= 0) {
      Alert.alert(
        "Invalid Duration",
        "Please enter a valid duration."
      );
      return false;
    }

    if (!form.capacity || Number(form.capacity) <= 0) {
      Alert.alert(
        "Invalid Capacity",
        "Please enter a valid capacity."
      );
      return false;
    }

    return true;
  };

  const handleSubmit = async () => {
    if (!validateForm() || isSubmitting) {
      return;
    }

    try {
      setIsSubmitting(true);

      if (editingClassId) {
        await updateClass(
          editingClassId,
          form.className.trim(),
          form.className.trim(),
          Number(form.instructor),
          form.date,
          form.time.trim(),
          Number(form.duration),
          Number(form.capacity)
        );
      } else {
        await insertClass(
          form.className.trim(),
          form.className.trim(),
          Number(form.instructor),
          form.date,
          form.time.trim(),
          Number(form.duration),
          Number(form.capacity)
        );
      }

      Alert.alert(
        "Success",
        isEditing
          ? "Class updated successfully."
          : "Class created successfully.",
        [
          {
            text: "OK",
            onPress: () => router.replace("/class-list"),
          },
        ]
      );
    } catch (error: any) {
      console.error("Unable to save class:", error);
      Alert.alert(
        "Error",
        error?.message ?? "Unable to save the class."
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>
        {isEditing ? "Edit Yoga Class" : "Add Yoga Class"}
      </Text>

      <TextInput
        style={styles.input}
        placeholder="Class Name"
        value={form.className}
        onChangeText={(text) => handleChange("className", text)}
      />

      <View style={styles.pickerContainer}>
        <Picker
          selectedValue={form.instructor}
          onValueChange={(value) =>
            handleChange("instructor", String(value))
          }
        >
          <Picker.Item
            label="Select Instructor"
            value=""
          />

          {instructors.map((item) => (
            <Picker.Item
              key={item.id}
              label={`${item.firstName} ${item.lastName}`}
              value={item.id.toString()}
            />
          ))}
        </Picker>
      </View>

      <TouchableOpacity
        style={styles.input}
        onPress={() => setShowDatePicker(true)}
      >
        <Text
          style={[
            styles.dateText,
            !form.date && styles.placeholderText,
          ]}
        >
          {form.date || "Select Date"}
        </Text>
      </TouchableOpacity>

      {showDatePicker && (
        <DateTimePicker
          value={form.date ? new Date(form.date) : new Date()}
          mode="date"
          display="default"
          onChange={(_, selectedDate) => {
            setShowDatePicker(false);

            if (selectedDate) {
              const year = selectedDate.getFullYear();
              const month = String(
                selectedDate.getMonth() + 1
              ).padStart(2, "0");
              const day = String(
                selectedDate.getDate()
              ).padStart(2, "0");

              handleChange(
                "date",
                `${year}-${month}-${day}`
              );
            }
          }}
        />
      )}

      <TextInput
        style={styles.input}
        placeholder="Time"
        value={form.time}
        onChangeText={(text) => handleChange("time", text)}
      />

      <TextInput
        style={styles.input}
        placeholder="Duration (minutes)"
        keyboardType="numeric"
        value={form.duration}
        onChangeText={(text) => handleChange("duration", text)}
      />

      <TextInput
        style={styles.input}
        placeholder="Maximum Capacity"
        keyboardType="numeric"
        value={form.capacity}
        onChangeText={(text) => handleChange("capacity", text)}
      />

      <TouchableOpacity
        style={[
          styles.button,
          isSubmitting && styles.disabledButton,
        ]}
        onPress={handleSubmit}
        disabled={isSubmitting}
      >
        <Text style={styles.buttonText}>
          {isSubmitting
            ? "Saving..."
            : isEditing
              ? "Update Class"
              : "Save Class"}
        </Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 20,
  },

  title: {
    fontSize: 24,
    fontWeight: "700",
    marginBottom: 20,
    color: "#2E8B57",
  },

  input: {
    borderWidth: 1,
    borderColor: "#D1D5DB",
    borderRadius: 10,
    padding: 12,
    marginBottom: 15,
    backgroundColor: "#FFFFFF",
    minHeight: 50,
    justifyContent: "center",
  },

  pickerContainer: {
    borderWidth: 1,
    borderColor: "#D1D5DB",
    borderRadius: 10,
    marginBottom: 15,
    backgroundColor: "#FFFFFF",
    overflow: "hidden",
  },

  dateText: {
    color: "#000000",
    fontSize: 16,
  },

  placeholderText: {
    color: "#999999",
  },

  button: {
    backgroundColor: "#2E8B57",
    padding: 15,
    borderRadius: 10,
    alignItems: "center",
  },

  disabledButton: {
    opacity: 0.6,
  },

  buttonText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "600",
  },
});