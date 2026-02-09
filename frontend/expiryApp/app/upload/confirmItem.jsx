import { useAuth } from "@clerk/clerk-expo";
import { Feather } from "@expo/vector-icons"; // pencil icon
import { useLocalSearchParams, useRouter } from "expo-router";
import React, { useState } from "react";

import {
  Image,
  Keyboard,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View,
} from "react-native";

import DateTimePickerModal from "react-native-modal-datetime-picker";

const ConfirmItem = () => {
  const router = useRouter();
  const params = useLocalSearchParams();
  const { imageUri, results } = params;
  const uriString = Array.isArray(imageUri) ? imageUri[0] : imageUri;
  const { getToken } = useAuth();

  const backendExpiryDate = Array.isArray(results)
    ? results[0]
    : results || "2025-12-31";
  const [year, month, day] = backendExpiryDate.split("-").map(Number);
  const parsedDate = new Date(year, month - 1, day);

  const [itemName, setItemName] = useState("");
  const [expiryDate, setExpiryDate] = useState(parsedDate);
  const [isDatePickerVisible, setDatePickerVisibility] = useState(false);

  const showDatePicker = () => setDatePickerVisibility(true);
  const hideDatePicker = () => setDatePickerVisibility(false);

  const API_BASE_URL = process.env.EXPO_PUBLIC_API_URL;

  // Update expiry date when user picks a date
  const handleConfirm = (date) => {
    setExpiryDate(date);
    hideDatePicker();
  };

  const confirmItem = async () => {
    console.log("Getting token...");
    const token = await getToken({});
    console.log("Confirmed token...", token);

    const item = {
      name: itemName || "",
      expiry_date: expiryDate.toISOString().split("T")[0],
      image_url: uriString || "",
    };

    console.log(
      "Items: ",
      item["name"],
      item["expiry_date"],
      item["image_url"]
    );

    try {
      const response = await fetch(`${API_BASE_URL}/add-item`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`, //send JWT here
        },
        body: JSON.stringify(item), //sending as JSON
      });

      console.log("Raw response status:", response.status);
      const data = await response.json();
      console.log("Backend response data:", data);

      router.replace("../(tabs)/homePage");
    } catch (error) {
      console.error("Error adding item:", error);
    }
  };

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <View style={styles.container}>
        <Image source={{ uri: uriString }} style={styles.image} />
        <View style={styles.expiryContainer}>
          <Text style={styles.expiryText}>
            Expiry Date: {expiryDate.toLocaleDateString("en-GB")}
          </Text>
          <TouchableOpacity onPress={showDatePicker} style={styles.icon}>
            <Feather name="edit-2" size={20} color="#6377B9" />
          </TouchableOpacity>
        </View>
        <DateTimePickerModal
          isVisible={isDatePickerVisible}
          mode="date"
          date={expiryDate}
          onConfirm={handleConfirm}
          onCancel={hideDatePicker}
          display="spinner" // shows the wheel picker
        />
        <TextInput
          style={styles.input}
          placeholder="Enter item name"
          value={itemName}
          onChangeText={setItemName}
        />

        {/* and make sure to route back to homepage after confirming */}
        <TouchableOpacity style={styles.confirmButton} onPress={confirmItem}>
          <Text style={styles.buttonText}>Confirm</Text>
        </TouchableOpacity>
      </View>
    </TouchableWithoutFeedback>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#fff",
  },
  image: { width: 300, height: 300, borderRadius: 8, marginBottom: 20 },
  expiryContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 20,
  },
  expiryText: { fontSize: 18, marginRight: 8 },
  icon: { padding: 4 },
  input: {
    width: "80%",
    height: 60,
    borderColor: "#ccc",
    borderWidth: 1,
    borderRadius: 10,
    padding: 12,
    marginBottom: 30,
    fontSize: 18,
  },
  confirmButton: {
    width: "70%",
    backgroundColor: "#6377B9",
    borderRadius: 30,
    alignItems: "center",
    paddingVertical: 20,
    marginBottom: 20,
  },
  buttonText: { color: "#ffffff", fontWeight: "bold", fontSize: 16 },
});

export default ConfirmItem;
