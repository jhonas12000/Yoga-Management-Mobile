import React, { useEffect, useState } from "react";
import {
  SafeAreaView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { router } from "expo-router";
import MapView, { Marker } from "react-native-maps";
import * as Location from "expo-location";
import { MaterialIcons } from "@expo/vector-icons";

export default function MapScreen() {
  const [location, setLocation] =
    useState<Location.LocationObject | null>(null);

  useEffect(() => {
    async function loadLocation() {
      const { status } =
        await Location.requestForegroundPermissionsAsync();

      if (status !== "granted") {
        return;
      }

      const currentLocation =
        await Location.getCurrentPositionAsync({});

      setLocation(currentLocation);
    }

    loadLocation();
  }, []);

  const handleBack = () => {
    if (router.canGoBack()) {
      router.back();
    } else {
      router.replace("/");
    }
  };

  const latitude =
    location?.coords.latitude ?? 37.7749;

  const longitude =
    location?.coords.longitude ?? -122.4194;

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={handleBack}
        >
          <MaterialIcons
            name="arrow-back"
            size={25}
            color="#2E8B57"
          />
        </TouchableOpacity>

        <View>
          <Text style={styles.title}>
            Yoga Studio Map
          </Text>

          <Text style={styles.subtitle}>
            View your current location.
          </Text>
        </View>
      </View>

      <MapView
        style={styles.map}
        region={{
          latitude,
          longitude,
          latitudeDelta: 0.03,
          longitudeDelta: 0.03,
        }}
        showsUserLocation
        showsMyLocationButton
      >
        <Marker
          coordinate={{
            latitude,
            longitude,
          }}
          title="Current Location"
          description="Yoga Management Mobile"
        />
      </MapView>
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
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 14,
    backgroundColor: "#FFFFFF",
  },

  backButton: {
    width: 42,
    height: 42,
    borderRadius: 21,
    backgroundColor: "#F5F7FA",
    alignItems: "center",
    justifyContent: "center",
    marginRight: 12,
  },

  title: {
    fontSize: 22,
    fontWeight: "700",
    color: "#2E8B57",
  },

  subtitle: {
    marginTop: 3,
    color: "#666666",
    fontSize: 14,
  },

  map: {
    flex: 1,
  },
});