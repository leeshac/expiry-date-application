import { useSignUp } from "@clerk/clerk-expo";
import { Link, useRouter } from "expo-router";
import React from "react";
import {
  Keyboard,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View,
  Image,
} from "react-native";

export default function SignUpScreen() {
  const { isLoaded, signUp, setActive } = useSignUp();
  const router = useRouter();

  const [emailAddress, setEmailAddress] = React.useState("");
  const [password, setPassword] = React.useState("");
  const [pendingVerification, setPendingVerification] = React.useState(false);
  const [code, setCode] = React.useState("");

  // Handle submission of sign-up form
  const onSignUpPress = async () => {
    if (!isLoaded) return;

    // Start sign-up process using email and password provided
    try {
      await signUp.create({
        emailAddress,
        password,
      });

      // Send user an email with verification code
      await signUp.prepareEmailAddressVerification({ strategy: "email_code" });

      // Set 'pendingVerification' to true to display second form
      // and capture OTP code
      setPendingVerification(true);
    } catch (err) {
      // See https://clerk.com/docs/custom-flows/error-handling
      // for more info on error handling
      console.error(JSON.stringify(err, null, 2));
    }
  };

  // Handle submission of verification form
  const onVerifyPress = async () => {
    if (!isLoaded) return;

    try {
      // Use the code the user provided to attempt verification
      const signUpAttempt = await signUp.attemptEmailAddressVerification({
        code,
      });

      // If verification was completed, set the session to active
      // and redirect the user
      if (signUpAttempt.status === "complete") {
        await setActive({ session: signUpAttempt.createdSessionId });
        router.replace("/");
      } else {
        // If the status is not complete, check why. User may need to
        // complete further steps.
        console.error(JSON.stringify(signUpAttempt, null, 2));
      }
    } catch (err) {
      // See https://clerk.com/docs/custom-flows/error-handling
      // for more info on error handling
      console.error(JSON.stringify(err, null, 2));
    }
  };

  if (pendingVerification) {
    return (
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <View style={styles.container}>
          <>
            <Text style={styles.title}>Verify your email</Text>

            <TextInput
              value={code}
              placeholder="Enter code..."
              keyboardType="number-pad"
              onChangeText={(code) => setCode(code)}
              style={styles.input}
            />

            {/* Verify button */}
            <TouchableOpacity style={styles.Button} onPress={onVerifyPress}>
              <Text style={styles.buttonText}>Verify</Text>
            </TouchableOpacity>
          </>
        </View>
      </TouchableWithoutFeedback>
    );
  }

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <View style={styles.container}>
        <>
          <Text style={styles.title}>Sign Up</Text>

          <Image
            source={require("../../assets/images/auth.png")}
            style={styles.image}
          />

          {/* Email input */}
          <TextInput
            autoCapitalize="none"
            value={emailAddress}
            placeholder="Enter email..."
            onChangeText={(email) => setEmailAddress(email)}
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

          {/* Sign Up button */}
          <TouchableOpacity style={styles.Button} onPress={onSignUpPress}>
            <Text style={styles.buttonText}>Create Account</Text>
          </TouchableOpacity>

          <Link href="/logIn" style={styles.logInLink}>
            Already have an account? Log in here
          </Link>
        </>
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
  logInLink: {
    color: "#3A56AF",
    marginBottom: 30,
  },
});
