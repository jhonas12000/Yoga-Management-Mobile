import { Picker } from "@react-native-picker/picker";
import { router, useLocalSearchParams } from "expo-router";
import { addDoc, collection } from "firebase/firestore";
import React, { useEffect, useState } from "react";
import {
  Alert,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

import {
  findDuplicateInstructorContact,
  getInstructorById,
  insertInstructor,
  updateInstructor,
} from "../database/database";

import { firestore } from "../firebase/firebaseConfig";

const emptyForm = {
  firstName: "",
  lastName: "",
  address: "",
  phone: "",
  email: "",
  preferredContact: "email",
};

export default function InstructorForm() {
  const params = useLocalSearchParams<{ id?: string }>();

  const instructorId = params.id ? Number(params.id) : null;

  const isEditing = instructorId !== null && !Number.isNaN(instructorId);

  const [form, setForm] = useState(emptyForm);
  const [errors, setErrors] = useState({
    firstName: "",
    lastName: "",
    phone: "",
    email: "",
  });
  const [loading, setLoading] = useState(isEditing);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    async function loadInstructor() {
      if (!isEditing || instructorId === null) {
        setLoading(false);
        return;
      }

      try {
        const instructor = await getInstructorById(instructorId);

        if (!instructor) {
          Alert.alert("Not Found", "The instructor could not be found.", [
            {
              text: "OK",
              onPress: () => router.replace("/instructor-list"),
            },
          ]);
          return;
        }

        setForm({
          firstName: instructor.firstName ?? "",
          lastName: instructor.lastName ?? "",
          address: instructor.address ?? "",
          phone: instructor.phone ?? "",
          email: instructor.email ?? "",
          preferredContact: instructor.preferredContact ?? "email",
        });
      } catch (error) {
        console.error(error);
        Alert.alert("Error", "Failed to load the instructor.");
      } finally {
        setLoading(false);
      }
    }

    loadInstructor();
  }, [instructorId, isEditing]);

  const handleChange = (field: keyof typeof form, value: string) => {
    setForm((currentForm) => ({
      ...currentForm,
      [field]: value,
    }));

    if (
      field === "firstName" ||
      field === "lastName" ||
      field === "phone" ||
      field === "email"
    ) {
      setErrors((currentErrors) => ({
        ...currentErrors,
        [field]: "",
      }));
    }
  };

  const handleSubmit = async () => {
    const firstName = form.firstName.trim();
    const lastName = form.lastName.trim();
    const phone = form.phone.trim();
    const email = form.email.trim();

    const newErrors = {
      firstName: "",
      lastName: "",
      phone: "",
      email: "",
    };

    if (!firstName) {
      newErrors.firstName = "First Name is required.";
    }

    if (!lastName) {
      newErrors.lastName = "Last Name is required.";
    }

    const phoneDigits = phone.replace(/\D/g, "");

    if (!phone) {
      newErrors.phone = "Phone number is required.";
    } else if (
      !/^[+\d\s()-]+$/.test(phone) ||
      phoneDigits.length < 7 ||
      phoneDigits.length > 15
    ) {
      newErrors.phone = "Enter a valid phone number.";
    }

    if (!email) {
      newErrors.email = "Email is required.";
    } else if (!/^\S+@\S+\.\S+$/.test(email)) {
      newErrors.email = "Enter a valid email address.";
    }

    setErrors(newErrors);

    if (
      newErrors.firstName ||
      newErrors.lastName ||
      newErrors.phone ||
      newErrors.email
    ) {
      return;
    }

    const duplicateContact = await findDuplicateInstructorContact(
      phone,
      email,
      isEditing ? (instructorId ?? undefined) : undefined,
    );

    if (duplicateContact) {
      Alert.alert(
        "Already Registered",
        `This ${duplicateContact} is already registered.`,
      );
      return;
    }

    try {
      setSaving(true);

      if (isEditing && instructorId !== null) {
        await updateInstructor(
          instructorId,
          firstName,
          lastName,
          form.address.trim(),
          phone,
          email,
          form.preferredContact,
        );

        Alert.alert("Success", "Instructor updated successfully!", [
          {
            text: "OK",
            onPress: () => router.replace("/instructor-list"),
          },
        ]);
      } else {
        await insertInstructor(
          firstName,
          lastName,
          form.address.trim(),
          phone,
          email,
          form.preferredContact,
        );

        await addDoc(collection(firestore, "instructors"), {
          firstName,
          lastName,
          address: form.address.trim(),
          phone,
          email,
          preferredContact: form.preferredContact,
          createdAt: new Date().toISOString(),
        });

        Alert.alert("Success", "Instructor saved successfully!", [
          {
            text: "OK",
            onPress: () => router.back(),
          },
        ]);
      }
    } catch (error) {
      console.error(error);

      Alert.alert(
        "Error",
        isEditing
          ? "Failed to update instructor."
          : "Failed to save instructor.",
      );
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <View style={styles.container}>
        <Text style={styles.loadingText}>Loading instructor...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>
        {isEditing ? "Edit Instructor" : "Add Instructor"}
      </Text>

      <Text style={styles.label}>First Name</Text>
      <TextInput
        style={[styles.input, errors.firstName ? styles.inputError : null]}
        placeholder="First Name"
        value={form.firstName}
        onChangeText={(text) => handleChange("firstName", text)}
      />

      {errors.firstName ? (
        <Text style={styles.errorText}>{errors.firstName}</Text>
      ) : null}

      <Text style={styles.label}>Last Name</Text>
      <TextInput
        style={[styles.input, errors.lastName ? styles.inputError : null]}
        placeholder="Last Name"
        value={form.lastName}
        onChangeText={(text) => handleChange("lastName", text)}
      />

      {errors.lastName ? (
        <Text style={styles.errorText}>{errors.lastName}</Text>
      ) : null}

      <Text style={styles.label}>Address</Text>
      <TextInput
        style={styles.input}
        placeholder="Address"
        value={form.address}
        onChangeText={(text) => handleChange("address", text)}
      />

      <Text style={styles.label}>Phone</Text>
      <TextInput
        style={[styles.input, errors.phone ? styles.inputError : null]}
        placeholder="Phone"
        keyboardType="phone-pad"
        value={form.phone}
        onChangeText={(text) => handleChange("phone", text)}
      />

      {errors.phone ? (
        <Text style={styles.errorText}>{errors.phone}</Text>
      ) : null}

      <Text style={styles.label}>Email</Text>
      <TextInput
        style={[styles.input, errors.email ? styles.inputError : null]}
        placeholder="Email"
        keyboardType="email-address"
        autoCapitalize="none"
        value={form.email}
        onChangeText={(text) => handleChange("email", text)}
      />

      {errors.email ? (
        <Text style={styles.errorText}>{errors.email}</Text>
      ) : null}

      <Text style={styles.label}>Preferred Contact</Text>

      <View style={styles.pickerContainer}>
        <Picker
          selectedValue={form.preferredContact}
          onValueChange={(value) =>
            handleChange("preferredContact", String(value))
          }
        >
          <Picker.Item label="Email" value="email" />
          <Picker.Item label="Phone" value="phone" />
        </Picker>
      </View>

      <TouchableOpacity
        style={[styles.button, saving && styles.disabledButton]}
        onPress={handleSubmit}
        disabled={saving}
      >
        <Text style={styles.buttonText}>
          {saving
            ? "Saving..."
            : isEditing
              ? "Update Instructor"
              : "Add Instructor"}
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

  label: {
    marginBottom: 6,
    fontSize: 14,
    fontWeight: "600",
    color: "#374151",
  },

  input: {
    borderWidth: 1,
    borderColor: "#D1D5DB",
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: 12,
    marginBottom: 15,
    backgroundColor: "#FFFFFF",
    fontSize: 16,
  },

  pickerContainer: {
    borderWidth: 1,
    borderColor: "#D1D5DB",
    borderRadius: 10,
    marginBottom: 20,
    overflow: "hidden",
    backgroundColor: "#FFFFFF",
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
    fontWeight: "700",
    fontSize: 16,
  },

  loadingText: {
    textAlign: "center",
    marginTop: 30,
    color: "#666666",
  },

  inputError: {
    borderColor: "#EF4444",
    borderWidth: 2,
  },

  errorText: {
    color: "#EF4444",
    fontSize: 13,
    marginTop: -10,
    marginBottom: 10,
    marginLeft: 4,
    fontWeight: "500",
  },
});
