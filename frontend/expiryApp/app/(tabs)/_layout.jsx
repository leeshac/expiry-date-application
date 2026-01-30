import { useUser } from "@clerk/clerk-expo";
import { Redirect, Tabs } from "expo-router";
import { Image, View } from "react-native";

export default function Layout() {
  const { isSignedIn } = useUser();

  if (!isSignedIn) {
    return <Redirect href={"/(auth)/logIn"} />;
  }
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarStyle: {
          position: "absolute",
          bottom: 20,
          left: 20,
          right: 20,
          borderRadius: 30,
          marginHorizontal: 20,
          height: 60,
          backgroundColor: "#ffffffff", // tab bar background
          shadowColor: "#000", // shadow for iOS
          shadowOpacity: 0.1,
          shadowOffset: { width: 0, height: 2 },
          shadowRadius: 5,
          elevation: 10,
        },
        tabBarItemStyle: {
          height: 60,
          paddingVertical: 10,
          justifyContent: "center",
          alignItems: "center",
        },
        tabBarLabel: () => null,
      }}
    >
      <Tabs.Screen
        name="homePage"
        options={{
          title: "",
          tabBarIcon: ({ focused }) => (
            <View style={{ alignItems: "center" }}>
              <Image
                source={require("../../assets/images/icon_home.png")}
                style={{
                  width: 20,
                  height: 20,
                }}
              />
              {focused && (
                <View
                  style={{
                    width: 6,
                    height: 6,
                    borderRadius: 3,
                    backgroundColor: "red",
                    marginTop: 4,
                  }}
                />
              )}
            </View>
          ),
        }}
      />

      <Tabs.Screen
        name="addItem"
        options={{
          title: "",
          tabBarIcon: ({ focused }) => (
            <Image
              source={require("../../assets/images/icon_add_two.png")}
              style={{
                width: 20,
                height: 20,
              }}
            />
          ),
        }}
      />

      <Tabs.Screen
        name="settings"
        options={{
          title: "",
          tabBarIcon: ({ focused }) => (
            <View style={{ alignItems: "center" }}>
              <Image
                source={require("../../assets/images/icon_user.png")}
                style={{
                  width: 16,
                  height: 20,
                }}
              />
              {focused && (
                <View
                  style={{
                    width: 6,
                    height: 6,
                    borderRadius: 3,
                    backgroundColor: "red",
                    marginTop: 4,
                  }}
                />
              )}
            </View>
          ),
        }}
      />
    </Tabs>
  );
}
