import { useAuth } from "@clerk/clerk-expo";
import { Redirect, Stack } from "expo-router";
// useAuth hook gives us access to the authentication state
// Redirect function/component allows us to programmatically navigate users
// Stack function/component sets up a stack navigator for nested routes

export default function AuthRoutesLayout() {
  const { isSignedIn } = useAuth();

  if (isSignedIn) {
    return <Redirect href={"/(tabs)/homePage"} />;
  }

  return <Stack />;
}
