import { useAuth } from "@clerk/clerk-expo";
import { useEffect, useState } from "react";
import {
  FlatList,
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

//defines a react component named ItemList
export default function ItemList({
  sortByExpiry,
  searchText,
  interactive,
  onItemPress,
}) {
  //recieves sortbyexpiry prop from homepage
  //defines a function named renderItems inside ItemList component
  //taking the item element out of dummyItems then the elements inside it are displayed
  const renderItem = ({ item }) => (
    <TouchableOpacity
      key={item.id}
      disabled={!interactive} //disables taps if false
      onPress={() => interactive && onItemPress(item.id)}
    >
      <View style={styles.containeritem}>
        <Image source={item.image} style={styles.itemImage} />
        <View style={styles.containeritemlabel}>
          <Text style={styles.itemExpiry}>EXP:{item.expiryDate}</Text>
          <Text style={styles.itemName}>{item.name}</Text>
        </View>
      </View>
    </TouchableOpacity>
  );

  const [itemsList, setItemsList] = useState([]);
  const { getToken } = useAuth();

  //useeffect tells us there is a side effect happening as a result of a state change
  useEffect(() => {
    //fetch items defines the action
    const fetchItems = async () => {
      try {
        const token = await getToken({});
        const response = await fetch("http://192.168.1.27:8000/items", {
          //JWT token for verifying the signed-in user on the backend
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`, //authentication for the jwt header(?)
          },
        });

        const data = await response.json(); //wait for the response
        console.log("Fetched data:", data);

        //if no items exist then just print that there is no items in logs.
        if (!data.items) {
          console.log("No items yet for this user");
          setItemsList([]);
          return;
        }
        // backend returns array of items with keys: id, name, expiry_date, image_url
        const formattedItems = data.items.map((item) => ({
          id: item.id,
          name: item.name,
          expiryDate: new Date(item.expiry_date).toLocaleDateString("en-GB"),
          image: { uri: item.image_url }, // use uri for React Native Image
        }));
        setItemsList(formattedItems);
      } catch (err) {
        console.error("Failed to fetch items:", err);
      }
    };

    fetchItems(); //run fetch items
  }, []);

  const displayedItems = itemsList
    .filter(
      (item) =>
        item.name.toLowerCase().includes((searchText || "").toLowerCase()) //filters by search
    )
    .sort((a, b) => {
      if (!sortByExpiry) return 0; // no sorting
      const dateA = new Date(a.expiryDate.split("/").reverse().join("-"));
      const dateB = new Date(b.expiryDate.split("/").reverse().join("-"));
      return dateA - dateB; //earlier date first
    });

  //return defines what is rendered
  //keyExtractor tells FlatList: “Use this value as the unique key for each item.”
  return (
    <FlatList
      data={displayedItems}
      keyExtractor={(item) => item.id.toString()}
      renderItem={renderItem}
      numColumns={3}
      columnWrapperStyle={{
        // spacing between items in a row
        justifyContent: "flex-start",
        marginBottom: 1,
      }}
      contentContainerStyle={{
        paddingBottom: 20,
      }}
    />
  );
}

const styles = StyleSheet.create({
  containeritem: {
    flex: 1,
    alignItems: "center",
    padding: 10,
    backgroundColor: "#f2f2f2",
    borderRadius: 10,
  },

  containeritemlabel: {
    width: 100,
    alignItems: "center",
    padding: 5,
    marginTop: 5,
    borderRadius: 15,
    backgroundColor: "#121E44",
    borderColor: "#121E44",
    borderWidth: 1,
  },

  itemImage: {
    width: 100,
    height: 100,
    alignItems: "center",
    borderRadius: 20,
    borderWidth: 1,
    borderColor: "#121E44",
  },
  itemName: {
    fontSize: 12,
    fontWeight: "bold",
    alignItems: "center",
    color: "#ffffffff",
  },
  itemExpiry: { fontSize: 10, color: "#ffffffff" },
});
