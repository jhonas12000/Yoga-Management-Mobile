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
    getCustomers,
    getSaleById,
    insertSale,
    updateSale,
} from "../database/database";
import { saveSaleToFirestore } from "../firebase/firestoreSync";

type CustomerOption = {
  id: number;
  firstName: string;
  lastName: string;
};

export default function SalesScreen() {
  const { id } = useLocalSearchParams<{ id?: string }>();

  const editingId = id ? Number(id) : null;
  const isEditing = editingId !== null;

  const [customers, setCustomers] = useState<CustomerOption[]>([]);

  const [form, setForm] = useState({
    customerId: "",
    saleDate: "",
    amount: "",
    paymentMethod: "Cash",
    notes: "",
  });

  const [showDatePicker, setShowDatePicker] = useState(false);

  useEffect(() => {
    async function loadCustomers() {
      try {
        const data = await getCustomers();
        setCustomers(data as CustomerOption[]);
      } catch (error) {
        console.error("Customer load error:", error);

        Alert.alert("Error", "Unable to load customers.");
      }
    }

    loadCustomers();
  }, []);

  useEffect(() => {
    async function loadSale() {
      if (!editingId) {
        return;
      }

      try {
        const sale: any = await getSaleById(editingId);

        if (sale) {
          setForm({
            customerId: sale.customerId.toString(),
            saleDate: sale.saleDate ?? "",
            amount: sale.amount.toString(),
            paymentMethod: sale.paymentMethod ?? "Cash",
            notes: sale.notes ?? "",
          });
        }
      } catch (error) {
        console.error("Sale load error:", error);

        Alert.alert("Error", "Unable to load sale.");
      }
    }

    loadSale();
  }, [editingId]);

  const handleChange = (field: keyof typeof form, value: string) => {
    setForm((previousForm) => ({
      ...previousForm,
      [field]: value,
    }));
  };

  const handleSubmit = async () => {
    if (!form.customerId) {
      Alert.alert("Missing Information", "Please select a customer.");
      return;
    }

    if (!form.saleDate) {
      Alert.alert("Missing Information", "Please select a sale date.");
      return;
    }

    if (!form.amount || Number(form.amount) <= 0) {
      Alert.alert("Invalid Amount", "Please enter a valid sale amount.");
      return;
    }

    try {
      if (editingId) {
        await updateSale(
          editingId,
          Number(form.customerId),
          form.saleDate,
          Number(form.amount),
          form.paymentMethod,
          form.notes,
        );

        await saveSaleToFirestore(editingId, {
          customerId: Number(form.customerId),
          saleDate: form.saleDate,
          amount: Number(form.amount),
          paymentMethod: form.paymentMethod,
          notes: form.notes,
        });
      } else {
        const result = await insertSale(
          Number(form.customerId),
          form.saleDate,
          Number(form.amount),
          form.paymentMethod,
          form.notes,
        );

        await saveSaleToFirestore(Number(result.lastInsertRowId), {
          customerId: Number(form.customerId),
          saleDate: form.saleDate,
          amount: Number(form.amount),
          paymentMethod: form.paymentMethod,
          notes: form.notes,
        });
      }

      router.replace("/sales-list");
    } catch (error: any) {
      console.error("Sale save error:", error);

      Alert.alert("Error", error?.message ?? "Unable to save sale.");
    }
  };

  const handleBack = () => {
    if (router.canGoBack()) {
      router.back();
    } else {
      router.replace("/sales-list");
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
              {isEditing ? "Edit Sale" : "Record Sale"}
            </Text>

            <Text style={styles.subtitle}>
              Enter customer payment information.
            </Text>
          </View>
        </View>

        <View style={styles.card}>
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

          <Text style={styles.label}>Sale Date</Text>

          <TouchableOpacity
            style={styles.input}
            onPress={() => setShowDatePicker(true)}
          >
            <Text
              style={[
                styles.dateText,
                !form.saleDate && styles.placeholderText,
              ]}
            >
              {form.saleDate || "Select Date"}
            </Text>
          </TouchableOpacity>

          {showDatePicker && (
            <DateTimePicker
              value={form.saleDate ? new Date(form.saleDate) : new Date()}
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

                  handleChange("saleDate", `${year}-${month}-${day}`);
                }
              }}
            />
          )}

          <Text style={styles.label}>Amount</Text>

          <TextInput
            style={styles.input}
            placeholder="0.00"
            keyboardType="decimal-pad"
            value={form.amount}
            onChangeText={(text) => handleChange("amount", text)}
          />

          <Text style={styles.label}>Payment Method</Text>

          <View style={styles.pickerContainer}>
            <Picker
              selectedValue={form.paymentMethod}
              onValueChange={(value) =>
                handleChange("paymentMethod", String(value))
              }
            >
              <Picker.Item label="Cash" value="Cash" />
              <Picker.Item label="Credit Card" value="Credit Card" />
              <Picker.Item label="Debit Card" value="Debit Card" />
              <Picker.Item label="Online" value="Online" />
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

          <TouchableOpacity style={styles.button} onPress={handleSubmit}>
            <MaterialIcons name="save" size={21} color="#FFFFFF" />

            <Text style={styles.buttonText}>
              {isEditing ? "Update Sale" : "Save Sale"}
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
