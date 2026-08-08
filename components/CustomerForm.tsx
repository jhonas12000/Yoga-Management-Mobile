import { MaterialIcons } from "@expo/vector-icons";
import { Picker } from "@react-native-picker/picker";
import { router, useLocalSearchParams } from "expo-router";
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
    findDuplicateCustomerContact,
    getCustomerById,
    insertCustomer,
    updateCustomer,
} from "../database/database";

import { saveCustomerToFirestore } from "../firebase/firestoreSync";

const emptyForm = {
  firstName: "",
  lastName: "",
  address: "",
  phone: "",
  email: "",
  preferredContact: "email",
};

export default function CustomerForm() {
  const params = useLocalSearchParams<{ id?: string }>();

  const customerId = params.id ? Number(params.id) : null;

  const isEditing = customerId !== null && !Number.isNaN(customerId);

  const [form, setForm] = useState(emptyForm);

  const [errors, setErrors] = useState({
    firstName: "",
    lastName: "",
    phone: "",
    email: "",
  });

  const [loading, setLoading] = useState(isEditing);
  const [saving, setSaving] = useState(false);

  // ---------------------------------------------------
  // LOAD CUSTOMER WHEN EDITING
  // ---------------------------------------------------
  useEffect(() => {
    async function loadCustomer() {
      if (!isEditing || customerId === null || Number.isNaN(customerId)) {
        setLoading(false);
        return;
      }

      try {
        const customer = await getCustomerById(customerId);

        if (!customer) {
          Alert.alert("Not Found", "The customer could not be found.", [
            {
              text: "OK",
              onPress: () => router.replace("/customer-list"),
            },
          ]);

          return;
        }

        setForm({
          firstName: customer.firstName ?? "",
          lastName: customer.lastName ?? "",
          address: customer.address ?? "",
          phone: customer.phone ?? "",
          email: customer.email ?? "",
          preferredContact: customer.preferredContact ?? "email",
        });
      } catch (error) {
        console.error("Customer load error:", error);

        Alert.alert("Error", "Failed to load the customer.");
      } finally {
        setLoading(false);
      }
    }

    loadCustomer();
  }, [customerId, isEditing]);

  // ---------------------------------------------------
  // HANDLE FORM CHANGES
  // ---------------------------------------------------
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

  // ---------------------------------------------------
  // SUBMIT FORM
  // ---------------------------------------------------
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

    let isValid = true;

    if (!firstName) {
      newErrors.firstName = "First Name is required.";
      isValid = false;
    }

    if (!lastName) {
      newErrors.lastName = "Last Name is required.";
      isValid = false;
    }

    const phoneDigits = phone.replace(/\D/g, "");

    if (!phone) {
      newErrors.phone = "Phone number is required.";
      isValid = false;
    } else if (
      !/^[+\d\s()-]+$/.test(phone) ||
      phoneDigits.length < 7 ||
      phoneDigits.length > 15
    ) {
      newErrors.phone = "Enter a valid phone number.";
      isValid = false;
    }

    if (!email) {
      newErrors.email = "Email is required.";
      isValid = false;
    } else if (!/^\S+@\S+\.\S+$/.test(email)) {
      newErrors.email = "Enter a valid email address.";
      isValid = false;
    }

    setErrors(newErrors);

    if (!isValid) {
      return;
    }

    const duplicateContact = await findDuplicateCustomerContact(
      phone,
      email,
      isEditing ? (customerId ?? undefined) : undefined,
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

      // ------------------------------------------------
      // EDIT CUSTOMER
      // ------------------------------------------------
      if (isEditing && customerId !== null) {
        const existingCustomer = await getCustomerById(customerId);

        await updateCustomer(
          customerId,
          firstName,
          lastName,
          form.address.trim(),
          phone,
          email,
          form.preferredContact,
        );

        await saveCustomerToFirestore(
          customerId,
          {
            firstName,
            lastName,
            address: form.address.trim(),
            phone,
            email,
            preferredContact: form.preferredContact,
          },
          existingCustomer?.phone,
          existingCustomer?.email,
        );

        Alert.alert("Success", "Customer updated successfully!", [
          {
            text: "OK",
            onPress: () => router.replace("/customer-list"),
          },
        ]);
      }

      // ------------------------------------------------
      // ADD CUSTOMER
      // ------------------------------------------------
      else {
        // Save locally in SQLite
        const result = await insertCustomer(
          firstName,
          lastName,
          form.address.trim(),
          phone,
          email,
          form.preferredContact,
        );

        // Save in Firebase Firestore
        await saveCustomerToFirestore(Number(result.lastInsertRowId), {
          firstName,
          lastName,
          address: form.address.trim(),
          phone,
          email,
          preferredContact: form.preferredContact,
          createdAt: new Date().toISOString(),
        });

        Alert.alert("Success", "Customer saved successfully!", [
          {
            text: "OK",
            onPress: () => router.replace("/customer-list"),
          },
        ]);
      }
    } catch (error) {
      console.error("Customer save error:", error);

      Alert.alert(
        "Error",
        isEditing ? "Failed to update customer." : "Failed to save customer.",
      );
    } finally {
      setSaving(false);
    }
  };

  // ---------------------------------------------------
  // LOADING
  // ---------------------------------------------------
  if (loading) {
    return (
      <View style={styles.container}>
        <Text style={styles.loadingText}>Loading customer...</Text>
      </View>
    );
  }

  // ---------------------------------------------------
  // FORM
  // ---------------------------------------------------
  return (
    <View style={styles.container}>
      <Text style={styles.title}>
        {isEditing ? "Edit Customer" : "Add Customer"}
      </Text>

      {/* FIRST NAME */}

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

      {/* LAST NAME */}

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

      {/* ADDRESS */}

      <Text style={styles.label}>Address</Text>

      <TextInput
        style={styles.input}
        placeholder="Address"
        value={form.address}
        onChangeText={(text) => handleChange("address", text)}
      />

      {/* PHONE */}

      <Text style={styles.label}>Phone</Text>

      <View
        style={[styles.inputWithIcon, errors.phone ? styles.inputError : null]}
      >
        <MaterialIcons
          name="phone"
          size={20}
          color="#6B7280"
          style={styles.inputIcon}
        />
        <TextInput
          style={styles.inputWithIconText}
          placeholder="Phone"
          keyboardType="phone-pad"
          value={form.phone}
          onChangeText={(text) => handleChange("phone", text)}
        />
      </View>

      {errors.phone ? (
        <Text style={styles.errorText}>{errors.phone}</Text>
      ) : null}

      {/* EMAIL */}

      <Text style={styles.label}>Email</Text>

      <View
        style={[styles.inputWithIcon, errors.email ? styles.inputError : null]}
      >
        <MaterialIcons
          name="email"
          size={20}
          color="#6B7280"
          style={styles.inputIcon}
        />
        <TextInput
          style={styles.inputWithIconText}
          placeholder="Email"
          keyboardType="email-address"
          autoCapitalize="none"
          value={form.email}
          onChangeText={(text) => handleChange("email", text)}
        />
      </View>

      {errors.email ? (
        <Text style={styles.errorText}>{errors.email}</Text>
      ) : null}

      {/* PREFERRED CONTACT */}

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

      {/* BUTTON */}

      <TouchableOpacity
        style={[styles.button, saving ? styles.disabledButton : null]}
        onPress={handleSubmit}
        disabled={saving}
      >
        <Text style={styles.buttonText}>
          {saving
            ? "Saving..."
            : isEditing
              ? "Update Customer"
              : "Add Customer"}
        </Text>
      </TouchableOpacity>
    </View>
  );
}

// -----------------------------------------------------
// STYLES
// -----------------------------------------------------

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

  inputWithIcon: {
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#D1D5DB",
    borderRadius: 10,
    paddingHorizontal: 12,
    marginBottom: 15,
    backgroundColor: "#FFFFFF",
  },

  inputIcon: {
    marginRight: 8,
  },

  inputWithIconText: {
    flex: 1,
    paddingVertical: 12,
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
