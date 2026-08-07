import React, { useEffect } from "react";
import {
  Alert,
  SafeAreaView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { router } from "expo-router";
import * as Notifications from "expo-notifications";
import { MaterialIcons } from "@expo/vector-icons";

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowBanner: true,
    shouldShowList: true,
    shouldPlaySound: true,
    shouldSetBadge: false,
  }),
});

export default function NotificationsScreen() {
  useEffect(() => {
    async function requestPermission() {
      const { status } =
        await Notifications.requestPermissionsAsync();

      if (status !== "granted") {
        Alert.alert(
          "Permission Required",
          "Notification permission was not granted."
        );
      }
    }

    requestPermission();
  }, []);

  const sendNotification = async () => {
    await Notifications.scheduleNotificationAsync({
      content: {
        title: "Yoga Class Reminder 🧘",
        body: "Your yoga class starts soon.",
        sound: true,
      },
      trigger: {
        type: Notifications.SchedulableTriggerInputTypes.TIME_INTERVAL,
        seconds: 3,
      },
    });

    Alert.alert(
      "Notification Scheduled",
      "You should receive a notification in about 3 seconds."
    );
  };

  const handleBack = () => {
    if (router.canGoBack()) {
      router.back();
    } else {
      router.replace("/");
    }
  };

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
            Notifications
          </Text>

          <Text style={styles.subtitle}>
            Test a local yoga reminder.
          </Text>
        </View>
      </View>

      <View style={styles.card}>
        <MaterialIcons
          name="notifications-active"
          size={70}
          color="#2E8B57"
        />

        <Text style={styles.cardTitle}>
          Yoga Class Reminder
        </Text>

        <Text style={styles.cardText}>
          Tap the button below to schedule a local
          notification.
        </Text>

        <TouchableOpacity
          style={styles.button}
          onPress={sendNotification}
        >
          <MaterialIcons
            name="notifications"
            size={22}
            color="#FFFFFF"
          />

          <Text style={styles.buttonText}>
            Send Test Notification
          </Text>
        </TouchableOpacity>
      </View>
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
    fontSize: 24,
    fontWeight: "700",
    color: "#2E8B57",
  },

  subtitle: {
    marginTop: 3,
    color: "#666666",
    fontSize: 14,
  },

  card: {
    backgroundColor: "#FFFFFF",
    margin: 20,
    padding: 28,
    borderRadius: 16,
    alignItems: "center",
    elevation: 3,
  },

  cardTitle: {
    marginTop: 16,
    fontSize: 22,
    fontWeight: "700",
    color: "#333333",
  },

  cardText: {
    marginTop: 10,
    fontSize: 15,
    color: "#666666",
    textAlign: "center",
    lineHeight: 22,
  },

  button: {
    marginTop: 24,
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#2E8B57",
    paddingHorizontal: 18,
    paddingVertical: 14,
    borderRadius: 10,
  },

  buttonText: {
    color: "#FFFFFF",
    fontWeight: "600",
    marginLeft: 8,
    fontSize: 15,
  },
});