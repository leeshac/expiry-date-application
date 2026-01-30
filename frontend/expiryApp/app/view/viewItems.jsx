import { Link } from "expo-router";
import { useState } from "react";
import { Image, Modal, StyleSheet, TouchableOpacity, View } from "react-native";
import DeleteItems from "../components/DeleteItems";
import ItemList from "../components/ItemList";

const viewItems = () => {
  const [popupVisible, setPopupVisible] = useState(false);
  const [selectedId, setSelectedId] = useState(null); //tracks which item to delete
  const [itemsList, setItemsList] = useState([]); //tracks whether needs to refresh or not

  //modal implementation?
  const openPopup = (id) => {
    setSelectedId(id);
    setPopupVisible(true);
  };

  const closePopup = () => {
    setPopupVisible(false);
    setSelectedId(null);
  };

  //
  const removeItem = (id) => {
    setItemsList((prev) => prev.filter((item) => item.id !== id));
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity>
        <View>
          <Link href="../(tabs)/homePage">
            <Image
              source={require("../../assets/images/icon_back.png")}
              style={styles.image}
            />
          </Link>
        </View>
      </TouchableOpacity>

      <View style={styles.containeritemlist}>
        {/* pass updated state to itemlist */}
        <ItemList
          interactive={true}
          onItemPress={openPopup}
          itemsList={itemsList}
        />
      </View>

      <Modal
        visible={popupVisible}
        transparent={true}
        animationType="fade"
        onRequestClose={closePopup}
      >
        <DeleteItems
          itemId={selectedId}
          closePopup={closePopup}
          removeItem={removeItem}
        />
      </Modal>
    </View>
  );
};

export default viewItems;

const styles = StyleSheet.create({
  container: {
    padding: 20,
    backgroundColor: "#f2f2f2",
  },

  image: {
    height: 40,
    width: 40,
  },

  containeritemlist: {
    marginTop: 15,
    height: 900,
  },
});
