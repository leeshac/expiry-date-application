import React from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";

const FilterItems = ({ closePopup, onSortExpiry }) => {
  const sortOptions = ["Expiry Date", "Newest First", "Oldest First", "A-Z"];

  return (
    <View style={styles.overlay}>
      <View style={styles.popup}>
        <Text style={styles.title}>Sort By</Text>

        <TouchableOpacity
          style={styles.option}
          onPress={onSortExpiry} //calls HomePage function
        >
          <Text style={styles.optionText}>Expiry Date</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.closeButton} onPress={closePopup}>
          <Text style={styles.closeText}>Close</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default FilterItems;

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.5)",
    justifyContent: "center",
    alignItems: "center",
  },
  popup: {
    backgroundColor: "white",
    width: "50%",
    padding: 20,
    borderRadius: 12,
    elevation: 5,
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 20,
    alignSelf: "center",
  },
  option: {
    paddingVertical: 10,
  },
  optionText: {
    fontSize: 15,
    fontWeight: "bold",
    color: "#7f838d",
    alignSelf: "center",
  },
  closeButton: {
    marginTop: 15,
    alignSelf: "center",
  },
  closeText: {
    color: "red",
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 10,
    marginTop: 15,
  },
});
