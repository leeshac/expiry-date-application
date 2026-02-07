import { SignedIn, SignedOut, useUser } from "@clerk/clerk-expo";
import { Link } from "expo-router";
import React, { useState } from "react";

import {
  Image,
  Keyboard,
  Modal,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View,
} from "react-native";
import FilterItems from "../components/FilterItems";
import ItemList from "../components/ItemList";

export default function Page() {
  const { user } = useUser();
  const today = new Date();
  const [filterVisible, setFilterVisible] = useState(false); //tracks state of whether filter is vis or not
  const [sortByExpiry, setSortByExpiry] = useState(false); //tracks state of whether sortbyexpiry is selected or not
  const [searchText, setSearchText] = useState(""); //tracks state of user input

  const formattedDate = today.toLocaleDateString("en-GB", {
    weekday: "long", // e.g. Friday
    day: "numeric", // e.g. 30
    month: "long", // e.g. 08
    year: "numeric", // e.g. 2025
  });

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <View style={{ flex: 1 }}>
        <SignedIn>
          <View style={styles.container}>
            {/*contains date and search bar */}
            <View>
              <Text style={styles.mainTitle}>{formattedDate}</Text>
              <View style={styles.containersearch}>
                <TextInput
                  placeholder="Search items..."
                  placeholderTextColor="#7f838d"
                  style={styles.searchBar}
                  value={searchText}
                  onChangeText={setSearchText}
                ></TextInput>
              </View>
            </View>

            {/*contains items, filtering, title */}
            <View>
              <View style={styles.containeritemsbar}>
                <Text style={styles.itemsText}>Items</Text>
                <View style={styles.containerfilterbar}>
                  <TouchableOpacity>
                    <Text style={styles.viewAllText}>
                      <Link href="../view/viewItems">View All</Link>
                    </Text>
                  </TouchableOpacity>

                  <TouchableOpacity onPress={() => setFilterVisible(true)}>
                    <Image
                      source={require("../../assets/images/icon_setting.png")}
                      style={styles.image}
                    />
                  </TouchableOpacity>

                  <Modal
                    visible={filterVisible} //determines visibility state tracker
                    transparent //makes model bg transparent instead of opaque
                    animationType="fade" //fade anim
                    onRequestClose={() => setFilterVisible(false)} //when closed change state to false
                  >
                    <FilterItems
                      closePopup={() => setFilterVisible(false)} //upon close, removes popup
                      onSortExpiry={() => {
                        setSortByExpiry(true); //triggers sorting in itemlist
                        setFilterVisible(false); //upon selecting, removes pop up
                      }}
                    />
                  </Modal>
                </View>
              </View>

              {/*contains list of items */}
              <View style={styles.containeritemlist}>
                <ItemList
                  sortByExpiry={sortByExpiry} //passing to itemlist as a prop
                  searchText={searchText}
                  interactive={false}
                />
              </View>
            </View>
          </View>
        </SignedIn>

        <SignedOut>
          <Link href="/(auth)/sign-in">
            <Text>Sign in</Text>
          </Link>
          <Link href="/(auth)/sign-up">
            <Text>Sign up</Text>
          </Link>
        </SignedOut>
      </View>
    </TouchableWithoutFeedback>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 20,
  },

  containersearch: {
    alignItems: "center",
  },

  containeritemsbar: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginTop: 25,
  },

  containerfilterbar: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 5,
    gap: 10,
  },

  containeritemlist: {
    marginTop: 15,
    height: 500,
  },

  mainTitle: {
    fontSize: 26,
    fontWeight: "bold",
    color: "#121E44",
  },

  searchBar: {
    width: "95%",
    height: 50,
    borderWidth: 2,
    borderColor: "#7f838d",
    borderRadius: 20,
    marginTop: 15,
    paddingHorizontal: 15,
    marginBottom: 15,
  },

  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
  },

  itemsText: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#121E44",
  },

  viewAllText: {
    fontSize: 15,
    fontWeight: "bold",
    color: "#7f838d",
  },

  image: {
    width: 20,
    height: 20,
  },
});
