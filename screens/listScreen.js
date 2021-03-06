import React, { useRef, useState, useEffect , useCallback} from "react";
import {
  View,
  FlatList,
  StyleSheet,
  Text,
  TouchableOpacity,
  ScrollView,
  Image,
  BackHandler,
} from "react-native";
import Card from "../components/customComp/Card";
import colors from "../colors";
import BottomSheet from "reanimated-bottom-sheet";
import DetailsScreen from "./deatilsScreen";
import ToolTip from "../components/customComp/tooltip";
import ListIcons from "../components/screen Components/listIcons";
import Selectable from "../components/screen Components/Selectable";
import { months } from "../modals/itemsArray";
import { useSelector } from "react-redux";
import BSH from "../components/customComp/bottomSheetHeader";
import { MyContext } from "../context";
import { MaterialIcons } from "@expo/vector-icons";
import { Spartan_300Light } from "@expo-google-fonts/spartan";

const ListScreen = (props) => {
  // const { position, index } = props.route.params;
  const [cardsData, setData] = useState();
  const [positionX, setPositionX] = useState(0);
  //header filter array
  const [filter, setFilter] = useState();
  const [refScroll, setRefScroll] = useState();
  // shows toast from months/important/necessary/price
  const [showToast, setShowToast] = useState({ value: false, title: "" });
  const [store, setStore] = useState({ ["storing"]: [] });
  const filterState = useSelector((state) => state.filter);
  const state = useSelector((state) => state.format);

  //bottomSheet ref
  const ref = useRef();
 

  const pressed = (item) => {
    ref.current.snapTo(1);
    //item that got pressed data
    setData({
      data: item.format,
      id: item.id,
    });
  };


  //change scrollView position to current month

  useEffect(() => {
    if (refScroll) {
      const time = setTimeout(() => {
        refScroll.scrollTo({ x: filterState.currentMonth.position });
      }, 200);
      return () => clearTimeout(time);
    }
  
  }, [refScroll]);


  //handle back button to return to top stack
  useEffect(() => {
    const onBackPress = () => {
      props.navigation.popToTop();
      return true;
    };
    BackHandler.addEventListener("hardwareBackPress", onBackPress);
    return () =>
      BackHandler.removeEventListener("hardwareBackPress", onBackPress);
  }, [BackHandler]);


  //render if there is no items to filter 
  const EmptyImage = () => (
    <View style={{ alignItems: "center", paddingTop: 100 }}>
      <Image
        source={require("../assets/caja.png")}
        style={{ width: 100, height: 100 }}
      />
      <Text style={{ fontFamily: "SpartanBold", fontSize: 20, color: "black" }}>
        It's Empty , Filter Again !
      </Text>
    </View>
  );

  return (
    <View style={styles.container}>
      <MyContext.Provider value={store}>
        <View style={styles.iconsContainer}>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            style={{ flex: 1 }}
            ref={(ref) => setRefScroll(ref)}
            contentContainerStyle={{
              width: filter ? "100%" : null,
              justifyContent: "center",
            }}
            onScroll={(event) => {
              if (!filter) setPositionX(event.nativeEvent.contentOffset.x);
            }}
          >
            <Selectable
              filter={filter}
              array={months}
              navigation={props.navigation}
              indexOfMonth={filterState.currentMonth.index}
              store={setStore}
            />
          </ScrollView>
        </View>

        <ListIcons
          refScroll={refScroll}
          filterItem={setFilter}
          showToast={setShowToast}
          positionX={positionX}
        />
      </MyContext.Provider>
      <FlatList
        // refreshControl={<RefreshControl
        //  refreshing={refreshing} onRefresh={onRefresh}
        // />}
        style={{ flex: 1 }}
        data={filter ? filterState.filter.data : filterState.months}
        keyExtractor={(item, index) => index.toString()}
        ListEmptyComponent={<EmptyImage />}
        renderItem={(itemData) => {
          if(itemData.item.year){
            return( 
              <View style={{ width:"100%", justifyContent:"center", alignItems:"center", backgroundColor:"#EFEFEF", marginVertical:5}}>
                <Text style={{fontFamily:"SpartanBold"}}>{itemData.item.year} </Text>
              </View>
            )
          }
        
        return(
          
          <>
            <TouchableOpacity onPress={() => pressed(itemData.item)}>
              <Card
                product={itemData.item.format.productName}
                picture={itemData.item.format.application.avatar}
                price={itemData.item.format.spend}
              />
            </TouchableOpacity>
          </>
        )}}
      />
      <ToolTip />
      {showToast.value && (
        <View style={styles.toast}>
          <Text style={styles.title}> {showToast.title} </Text>
        </View>
      )}
      <BottomSheet
        ref={ref}
        snapPoints={[500, 350, 0]}
        renderContent={() => {
          {
            if (cardsData)
              return (
                <DetailsScreen
                  data={cardsData.data}
                  id={cardsData.id}
                  refTo={ref}
                  navigation={props.navigation}
                />
              );
          }
          return <View />;
        }}
        renderHeader={() => <BSH />}
        initialSnap={2}
      />
      <View style={styles.fab}>
        <TouchableOpacity onPress={() => props.navigation.navigate("create")}>
          <MaterialIcons name="add-shopping-cart" size={24} color="white" />
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
    //marginTop  : 20,
  },
  fab: {
    width: 60,
    height: 60,
    borderRadius: 100,
    position: "absolute",
    bottom: 10,
    right: 10,
    justifyContent: "center",
    alignItems: "center",

    backgroundColor: colors.fab,
  },

  iconsContainer: {
    width: "100%",
    flexDirection: "row",
    justifyContent: "space-around",
    height: "10%",
    alignItems: "center",
    marginTop: 35,
  },
  toast: {
    position: "absolute",
    right: 150,
    bottom: 20,
    width: "40%",
    height: 50,
    backgroundColor: "black",
    borderRadius: 40,
    opacity: 5,
    justifyContent: "center",
    alignItems: "center",
  },
  title: {
    fontFamily: "SpartanBold",
    fontSize: 15,
    color: "white",
  },
});
export default ListScreen;
