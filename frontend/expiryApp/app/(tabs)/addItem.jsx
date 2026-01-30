import * as ImagePicker from "expo-image-picker";
import { useRouter } from "expo-router";
import { useState } from "react";
import {
  Alert,
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

export default function AddItem() {
  const [imageUri, setImageUri] = useState(null); //trackes state of the url of image
  const router = useRouter();

  //request camera permission
  //async allows several requests to run at once
  //waits for approval, if not alert shows a message
  const requestCameraPermission = async () => {
    const { status } = await ImagePicker.requestCameraPermissionsAsync();
    if (status !== "granted") {
      Alert.alert(
        "Permission required",
        "Camera access is needed to take photos."
      );
    }
  };

  //take a photo
  //no editing allowed
  //image quality set to maximum (1 = highest, 0 = lowest)
  const takePhoto = async () => {
    await requestCameraPermission();
    let result = await ImagePicker.launchCameraAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: false,
      quality: 1,
    });

    if (!result.canceled) {
      setImageUri(result.assets[0].uri);
    }
  };

  //pick from gallery
  const pickFromGallery = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: false,
      quality: 1,
    });

    if (!result.canceled) {
      setImageUri(result.assets[0].uri);
    }
  };

  //proceed is tapped then image is sent to backend, should be sent through fastapi and trigger the expiry_process.py script
  const proceed = async () => {
    //send imgurl to backend here through file string($binary)
    console.log("Proceeding with image:", imageUri);
    //then while script is running navigate to the loading screen
    router.push("../upload/loadingItem", { imageUri });

    try {
      const fileType = imageUri.split(".").pop().toLowerCase(); //extracts the file extension from image 'jpg' or 'png'
      const mimeType = fileType === "png" ? "image/png" : "image/jpeg"; //converts to MIME type
      //if fileType is 'image/png', name becomes 'image.png'; otherwise 'image.jpg'.
      const formData = new FormData();
      formData.append("file", {
        uri: imageUri, //URI from camera/gallery
        type: mimeType,
        name: `image.${fileType}`,
      });

      const response = await fetch(
        "http://192.168.1.27:8000/process-expiry-date",
        {
          method: "POST",
          body: formData,
          headers: {
            "Content-Type": "multipart/form-data", //tells the backend: "I'm sending a file (not JSON). It contains multiple parts
          },
        }
      );

      //waits response from backend, backend sends JSON so we use .json() to parse it
      const data = await response.json();
      console.log("Backend response:", data);

      //then navigate to the confirm screen, once script is done the response should be sent to confirmItem screen
      router.push({
        pathname: "../upload/confirmItem",
        params: {
          //sending image + results over
          imageUri: imageUri,
          results: data.results,
        },
      });
    } catch (error) {
      console.error("Error uploading image:", error);
    }
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity style={styles.customButton} onPress={takePhoto}>
        <Text style={styles.buttonText}>Take Photo</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.customButton} onPress={pickFromGallery}>
        <Text style={styles.buttonText}>Pick from Gallery</Text>
      </TouchableOpacity>

      {imageUri && (
        <>
          {/* Image preview */}
          <Image source={{ uri: imageUri }} style={styles.image} />

          {/* Conditionally rendered proceed button */}
          <TouchableOpacity style={styles.proceedButton} onPress={proceed}>
            <Text style={styles.proceedText}>Proceed</Text>
          </TouchableOpacity>
        </>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 16,
  },
  image: { width: 300, height: 300, marginTop: 20, borderRadius: 8 },

  customButton: {
    width: "70%",
    height: 60,
    backgroundColor: "#6377B9",
    borderRadius: 30,
    alignItems: "center",
    paddingVertical: 20,
    marginBottom: 30,
  },
  buttonText: {
    color: "#ffffff",
    fontWeight: "bold",
    fontSize: 16,
  },

  proceedButton: {
    width: "70%",
    backgroundColor: "#6377B9",
    borderRadius: 30,
    alignItems: "center",
    paddingVertical: 20,
    marginBottom: 15,
    marginTop: 20,
  },

  proceedText: {
    color: "#ffffff",
    fontWeight: "bold",
    fontSize: 16,
  },
});
