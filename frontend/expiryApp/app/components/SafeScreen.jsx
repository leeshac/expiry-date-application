import React from "react";
import { View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";


const SafeScreen = ({ children }) => { 
  const insets = useSafeAreaInsets();

  return <View style={{ flex: 1, paddingTop: insets.top }}>{children}</View>;
};

export default SafeScreen;
//safe screen is a component that ensures content is displayed within the safe area of a device, avoiding notches and rounded corners.
//TODO: update