import React from "react";
import { ActivityIndicator, StyleSheet, Text, View } from "react-native";

const LoadingItem = ({ message = "Loading..." }) => {
  return (
    <View style={styles.container}>
      <ActivityIndicator size="large" color="#b7bfef" />
      <Text style={styles.text}>{message}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#ffffff",
  },
  text: {
    marginTop: 12,
    fontSize: 20,
    color: "#333",
  },
});

export default LoadingItem;
