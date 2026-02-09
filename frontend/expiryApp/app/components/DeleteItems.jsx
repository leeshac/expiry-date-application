import { useAuth } from "@clerk/clerk-expo";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";

const DeleteItems = ({ itemId, closePopup, removeItem }) => {
  const { getToken } = useAuth();
  const API_BASE_URL = process.env.EXPO_PUBLIC_API_URL;


  const DelItem = async () => {
    try {
      const token = await getToken({});
      const response = await fetch(`${API_BASE_URL}/del-item?id=${itemId}`, //sending id in the query string.
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      
      const data = await response.json();

      if (data.status === "success") {
        console.log("Item deleted!");
        removeItem(itemId);
        closePopup();
      } else {
        console.error("Delete failed:", data.error);
      }
    } catch (err) {
      console.error("Error deleting item:", err);
    }
  };

  return (
    <View style={styles.overlay}>
      <View style={styles.popup}>
        <Text style={styles.title}>Options</Text>

        <TouchableOpacity
          style={styles.option}
          onPress={DelItem} //should calll function that takes the item id and sends it to the endpoint /del-item
        >
          <Text style={styles.optionText}>Delete</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.closeButton} onPress={closePopup}>
          <Text style={styles.closeText}>Close</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default DeleteItems;

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
