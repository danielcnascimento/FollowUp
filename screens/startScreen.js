import React, { useEffect, useState } from "react";
import { View, Text, StyleSheet } from "react-native";
import { TouchableOpacity } from "react-native-gesture-handler";
import { FontAwesome5, Fontisto } from "@expo/vector-icons";
import * as actions from "../store/actions/filter";
import { useDispatch, useSelector } from "react-redux";
import {
  currentMonth,
  findMonth,
} from "../components/functional components/LoadingMonth";

import Cart from "../assets/cart.svg";
import BSH from "../components/customComp/bottomSheetHeader";
import BottomSheet from "reanimated-bottom-sheet";
import {
  useFirebase,
  isLoaded,
  useFirestoreConnect,
  isEmpty,
} from "react-redux-firebase";

import size from "../size";



const startScreen = (props) => {
  const { navigation } = props;
  const dispatch = useDispatch();
  const firebase = useFirebase();
  const state = useSelector((state) => state.firebase.profile);
  const filterState = useSelector((state) => state.filter);
  const cards = useSelector(({ fireStore: { ordered } }) => ordered.Cards);
  const auth = useSelector((state) => state.firebase.auth);
  let snapPosition= size.height<550 ? 50:60

  useEffect(() => {
    // add a refresh token to profile
    if (!state.refreshToken) {
      {
        firebase.updateProfile({
          refreshToken: auth.stsTokenManager.refreshToken,
        });
      }
    }

    // get the firestore cards and compare it what the month the user is
    //using the app so it only return the cards of current month
    if (filterState.loaded) {
      const cm = currentMonth();
      
      const items = findMonth(cards, cm.thisMonth);
dispatch(actions.selectedMonth(cm.thisMonth))
dispatch(actions.rawMonths(items));
      dispatch(actions.filterByMonths(items, cm.current, cm.thisMonth));
    }
  });

  const navigateToCreate = () => {
    navigation.navigate("create", { country: state.currency.country });
  };

  const logOut = () => {
    firebase.logout();
  };

  return (
    <View style={styles.contain}>
 
      <Text style={{ fontSize: 25, fontFamily: "Spartan" }}>
        Welcome Back
        <Text style={{ fontSize: 25, fontFamily: "SpartanBold" }}>
          {state.displayName ? state.displayName : state.username} !
        </Text>
      </Text>
      <Cart width={size.height<550 ?"250":"300"} height="250" />
      <TouchableOpacity onPress={navigateToCreate}>
        <View style={styles.button}>
          <FontAwesome5 name="wallet" size={40} color="black" />
          <Text style={styles.title}>Buy</Text>
        </View>
      </TouchableOpacity>
      <TouchableOpacity onPress={() => props.navigation.navigate("list")}>
        <Fontisto name="arrow-swap" size={24} color="black" />
      </TouchableOpacity>

      <BottomSheet
        snapPoints={[snapPosition, 180]}
        renderContent={() => {
          return (
            <View style={styles.buttonsContain}>
              <Button
                name="cog"
                title="Settings"
                onPress={() => props.navigation.navigate("setting")}
              />
              <Button name="door-open" title="Leave" onPress={() => logOut()} />
            </View>
          );
        }}
        renderHeader={() => (
          <View
            style={{
              backgroundColor: "white",
              paddingTop: 10,
              paddingBottom: 20,
              borderTopLeftRadius: 100,
              borderTopRightRadius: 100,
              alignItems: "center",
            }}
          >
            <View style={styles.panelHandle} />
          </View>
        )}
        initialSnap={0}
      />
    </View>
  );
};

// button component 

const Button = (props) => (
  <TouchableOpacity onPress={props.onPress} style={{ alignItems: "center" }}>
    <FontAwesome5 name={props.name} size={35} color="black" />
    <Text style={styles.title}>{props.title}</Text>
  </TouchableOpacity>
);

const styles = StyleSheet.create({
  contain: {
    width: size.width,
    height: size.height,
    justifyContent: "space-evenly",
    alignItems: "center",
  },

  button: {
    width:size.width<350 ? 100 :120,
    height:size.height<550 ?85: 100,
    elevation: 3,
    borderTopLeftRadius: 40,
    borderBottomEndRadius: 40,
    justifyContent: "center",
    alignItems: "center",
  },
  title: {
    fontSize: 20,
    fontFamily: "SpartanBold",
  },
  buttonsContain: {
    height: "100%",
    backgroundColor: "white",
    flexDirection: "row",
    justifyContent: "space-around",
    paddingVertical: 20,
  },
  panelHandle: {
    width: 40,
    height: 5,
    borderRadius: 4,
    backgroundColor: "black",
    marginBottom: 10,
  },
});
export default startScreen;

