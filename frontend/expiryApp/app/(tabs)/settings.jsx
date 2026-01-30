import React, { useState } from "react";
import {
  Keyboard,
  StyleSheet,
  Switch,
  Text,
  TextInput,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View,
} from "react-native";
import SignOutButton from "../components/SignOutButton";

const Settings = () => {
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);
  const [reminderDays, setReminderDays] = useState("3");

  const handleApplyChanges = () => {
    console.log("Notifications:", notificationsEnabled);
    console.log("Reminder days:", reminderDays);
    // Add your logic to save these settings
  };

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <View style={styles.container}>
        <Text style={styles.title}>Settings</Text>

        <View style={styles.containerNotif}>
          <Text style={styles.containerNotiTitle}>Notifications</Text>

          <View style={styles.containerSubNotif}>
            <Text>Enable Notifications</Text>
            <Switch
              value={notificationsEnabled}
              onValueChange={(value) => setNotificationsEnabled(value)}
              trackColor={{ false: '#767577', true: '#6377B9' }}
            />
          </View>
          <View style={styles.containerSubNotif}>
            <Text style={styles.label}>Remind me</Text>
            <TextInput
              style={styles.input}
              keyboardType="numeric"
              value={reminderDays}
              onChangeText={setReminderDays}
            />
            <Text style={styles.label}>days before expiry</Text>
          </View>

          <TouchableOpacity
            style={styles.applyButton}
            onPress={handleApplyChanges}
          >
            <Text style={styles.applyButtonText}>Apply Changes</Text>
          </TouchableOpacity>
        </View>

        <View>
          <TouchableOpacity>
            <SignOutButton />
          </TouchableOpacity>
        </View>
      </View>
    </TouchableWithoutFeedback>
  );
};
export default Settings;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "space-evenly",
    alignItems: "center",
  },

  containerNotif: {
    flexDirection: "column",
    padding: 20,
    marginHorizontal: 10,
    borderRadius: 12,
    borderWidth: 3,
    borderColor: "#121E44",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 4,
    elevation: 1,
  },

  applyButton: {
    marginTop: 10,
    backgroundColor: "#6377B9",
    paddingVertical: 10,
    paddingHorizontal: 10,
    borderRadius: 8,
    alignSelf: "center",
    width: "50%",
  },

  applyButtonText: {
    color: "#fff",
    fontSize: 14,
    fontWeight: "bold",
  },

  containerNotiTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 20,
  },

  containerSubNotif: {
    flexDirection: "row",
    width: "100%",
    alignItems: "center",
    justifyContent: "space-between",
    height: 60,
    borderWidth: 3,
    borderColor: "#ccc",
    borderRadius: 10,
    padding: 15,
    marginBottom: 10,
  },

  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
    color: "#121E44",
  },

  input:{
    fontSize: 24,
  }
});
