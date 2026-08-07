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
  getCustomers,
  deleteCustomer,
} from "../database/database";

export default function CustomerListScreen() {
  const [search, setSearch] = useState("");
  const [customers, setCustomers] = useState<any[]>([]);

  useFocusEffect(
    useCallback(() => {
      async function loadCustomers() {
        try {
          const data = await getCustomers();
          setCustomers(data as any[]);
        } catch (error) {
          console.error(error);
        }
      }

      loadCustomers();
    }, [])
  );

  const filteredCustomers = customers.filter((item) =>
    `${item.firstName} ${item.lastName}`
      .toLowerCase()
      .includes(search.toLowerCase())
  );

  const handleDelete = (customer: any) => {
    Alert.alert(
      "Delete Customer",
      `Are you sure you want to delete ${customer.firstName} ${customer.lastName}?`,
      [
        {
          text: "Cancel",
          style: "cancel",
        },
        {
          text: "Delete",
          style: "destructive",
          onPress: async () => {
            await deleteCustomer(customer.id);

            const data = await getCustomers();
            setCustomers(data as any[]);
          },
        },
      ]
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView>

        <View style={styles.header}>
          <Text style={styles.title}>Customers</Text>

          <TouchableOpacity
            style={styles.addButton}
            onPress={() => router.push("/customers")}
          >
            <MaterialIcons
              name="add"
              size={22}
              color="#fff"
            />
            <Text style={styles.addText}>Add</Text>
          </TouchableOpacity>
        </View>

        <TextInput
          placeholder="Search customers..."
          placeholderTextColor="#999"
          value={search}
          onChangeText={setSearch}
          style={styles.searchInput}
        />

        {filteredCustomers.map((item) => (
          <View
            key={item.id}
            style={styles.card}
          >
            <View style={styles.avatar}>
              <MaterialIcons
                name="person"
                size={34}
                color="#2E8B57"
              />
            </View>

            <View style={{ flex: 1 }}>
              <Text style={styles.name}>
                {item.firstName} {item.lastName}
              </Text>

              <Text style={styles.email}>
                {item.email}
              </Text>

              <Text style={styles.phone}>
                {item.phone}
              </Text>
            </View>

            <View style={styles.actions}>
              <TouchableOpacity
                onPress={() =>
                  router.push({
                    pathname: "/customers",
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
                onPress={() =>
                  handleDelete(item)
                }
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
    color: "#fff",
    marginLeft: 4,
    fontWeight: "600",
  },

  searchInput: {
    backgroundColor: "#fff",
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
    backgroundColor: "#fff",
    marginHorizontal: 16,
    marginBottom: 14,
    borderRadius: 14,
    padding: 16,
    flexDirection: "row",
    alignItems: "center",
    elevation: 3,
  },

  avatar: {
    marginRight: 14,
  },

  name: {
    fontSize: 18,
    fontWeight: "700",
  },

  email: {
    color: "#666",
    marginTop: 3,
  },

  phone: {
    marginTop: 4,
    color: "#2E8B57",
    fontWeight: "600",
  },

  actions: {
    flexDirection: "row",
    alignItems: "center",
  },
});