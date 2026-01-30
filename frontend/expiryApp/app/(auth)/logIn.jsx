import { useSignIn } from "@clerk/clerk-expo";
import { Link, useRouter } from "expo-router";
import React from "react";

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

export default function Page() {
  const { signIn, setActive, isLoaded } = useSignIn();
  const router = useRouter();

  const [emailAddress, setEmailAddress] = React.useState("");
  const [password, setPassword] = React.useState("");

  // Handle the submission of the sign-in form
  const onSignInPress = async () => {
    if (!isLoaded) return;

    // Start the sign-in process using the email and password provided
    try {
      const signInAttempt = await signIn.create({
        identifier: emailAddress,
        password,
      });

      // If sign-in process is complete, set the created session as active
      // and redirect the user
      if (signInAttempt.status === "complete") {
        await setActive({ session: signInAttempt.createdSessionId });
        router.replace("/");
      } else {
        // If the status isn't complete, check why. User might need to
        // complete further steps.
        console.error(JSON.stringify(signInAttempt, null, 2));
      }
    } catch (err) {
      // See https://clerk.com/docs/custom-flows/error-handling
      // for more info on error handling
      console.error(JSON.stringify(err, null, 2));
    }
  };

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <View style={styles.container}>
        <Text style={styles.title}>Log In</Text>

        <Image
          source={require("../../assets/images/login.png")}
          style={styles.image}
        />

        {/* Email input */}
        <TextInput
          autoCapitalize="none"
          value={emailAddress}
          placeholder="Enter email..."
          onChangeText={(emailAddress) => setEmailAddress(emailAddress)}
          placeholderTextColor="#555"
          style={styles.input}
        />

        {/* Password input */}
        <TextInput
          value={password}
          placeholder="Enter password..."
          secureTextEntry={true}
          onChangeText={(password) => setPassword(password)}
          placeholderTextColor="#555"
          style={styles.input}
        />

        {/* Log In button */}
        <TouchableOpacity style={styles.Button} onPress={onSignInPress}>
          <Text style={styles.buttonText}>Log In</Text>
        </TouchableOpacity>

        <Link href="/signUp" style={styles.signUpLink}>
          Don't have an account? Sign up here
        </Link>
      </View>
    </TouchableWithoutFeedback>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#ffffff",
    paddingHorizontal: 20,
  },
  image: {
    width: 300,
    height: 300,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
    color: "#121E44",
  },
  input: {
    width: "100%",
    height: 50,
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 10,
    paddingHorizontal: 15,
    marginBottom: 15,
    //add colour for placeholder text
  },
  signUpLink: {
    color: "#3A56AF",
    marginBottom: 30,
  },
  Button: {
    width: "50%",
    backgroundColor: "#6377B9",
    borderRadius: 10,
    alignItems: "center",
    paddingVertical: 12,
    marginBottom: 15,
  },
  buttonText: {
    color: "#ffffff",
    fontWeight: "bold",
    fontSize: 16,
  },
});
