import React, { useReducer, useEffect, useState } from "react";
import { StatusBar } from "expo-status-bar";
import {
  View,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
  ImageBackground,
  Dimensions,
  SafeAreaView,
  Text,
  TextInput,
} from "react-native";
import TextField from "../components/customComp/TextField";
import SwitchSelector from "../components/screen Components/SwitchSelector";
import colors from "../colors";
import SwipeButton from "rn-swipe-button";
import { init, types, inputReducer } from "../store/reduces/createReducer";
import ApplicationModal from "../components/screen Components/ApplicationModal";
import { useDispatch, useSelector } from "react-redux";
import * as actions from "../store/actions/format";
import { important, necessary } from "../modals/itemsArray";
import ObservationField from "../components/screen Components/observitionField";
import DateCalender from "../components/customComp/dateCalender";
import NumberFormat from "@wwdrew/react-native-numeric-textinput";
import size from "../size";

const CreateScreen = (props) => {
  const [stateInput, dispatchInput] = useReducer(inputReducer, init);
  const dispatch = useDispatch();
  const state = useSelector((state) => state.firebase.profile);


  useEffect(() => {
    // clean useReducer from previous states
    const unsubscribe = props.navigation.addListener("focus", () => {
      dispatchInput({ type: types.CLEAN });
    });

    return unsubscribe;
  });

  useEffect(() => {
 //   send to firestore reducer 
    if (stateInput.swipe) {
      if (!stateInput.formIsValid) {
        alert("Don't leave field empty please");
        dispatchInput({ type: types.SWIPE, value: false });
        return;
      } else {
        dispatch(
          actions.inputsPage1(
            stateInput.inputValues.productName,
            stateInput.inputValues.application,
            stateInput.inputValues.spend,
            stateInput.inputValues.important
          )
        );
        dispatch(
          actions.inputsPage2(
            stateInput.inputValues.date,
            stateInput.inputValues.observation,
            stateInput.inputValues.necessary
          )
        );
        props.navigation.navigate("loading");
        dispatchInput({ type: types.SWIPE, value: false });
      }
    }
  }, [stateInput.swipe, stateInput.formIsValid]);

  //swip button function 
  const swiping = () => {
    dispatchInput({ type: types.SWIPE, value: true });
  };

  //input function
  const inputTextHolder = (inputIdentifier, text) => {
    let isValid = false;
    if (text.trim().length > 0) {
      isValid = true;
    }
    dispatchInput({
      type: types.INPUTS_VALUES,
      value: text,
      isValid: isValid,
      input: inputIdentifier,
    });
  };

  //currency function 
  const currencyInput = (text) => {
    let isValid = false;

    if (text.toString().length > 0) {
      isValid = true;
    }

    dispatchInput({
      type: types.SPENDS,
      value: text,
      isValid: isValid,
      code: state.currency.code,
    });
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "black" }}>
      <StatusBar hidden={true} />
      <ImageBackground
        source={require("../assets/icons/Rectangle.png")}
        resizeMode="stretch"
        style={{
          position: "absolute",
          left: 0,
          top: 100,

          width: Dimensions.get("window").width,
          height: size.height,
          //<600? size.height+130 :size.height+10,
        }}
      />
      <View
        style={{
          alignItems: "flex-end",

          fontFamily: "SpartanBold",
        }}
      >
        <Text style={{ color: "white", fontSize: 20 }}>Amount Spend</Text>
        <View style={{ width: 300, flexDirection: "row" }}>
          <Text style={{ color: "white", fontSize: 20, margin: 5 }}>
            {state.currency.code}{" "}
          </Text>

          <NumberFormat
            autoFocus={true}
            style={{
              color: "white",
              fontSize: 30,
              height: 50,
              width: 250,
              fontFamily: "SpartanBold",
            }}
            type="decimal"
            decimalPlaces={2}
            value={stateInput.inputValues.spend.value}
            onUpdate={(text) => currencyInput(text)}
            maxLength={11}
          />
        </View>
      </View>

      <ScrollView>
        <View style={styles.container}>
          <ApplicationModal
            onChangeItem={(item) =>
              dispatchInput({
                type: types.DROP,
                value: item,
              })
            }
          />

          <TextField
            onChangeText={inputTextHolder.bind(this, "productName")}
            value={stateInput.inputValues.productName}
            color={{ color: "black" }}
            contain={{ width: 300 , }}
          >
            Product Name
          </TextField>

          <View style={{ margin: 5 }}>
            <Text style={{ ...styles.title, fontSize: 20 }}>Date</Text>

            <View style={styles.background}>
              <TouchableOpacity
                onPress={() => dispatchInput({ type: types.SHOW, value: true })}
              >
                <Text style={{ fontSize: 20 }}>
                  {stateInput.inputValues.date}
                </Text>
              </TouchableOpacity>
            </View>

            {stateInput.show && (
              <DateCalender
                value={new Date()}
                open={(value) =>
                  dispatchInput({ type: types.SHOW, value: value })
                }
                newDate={(value) =>
                  dispatchInput({
                    type: types.DATE,
                    value: value,
                  })
                }
              />
            )}
          </View>

          <SwitchSelector
          init={stateInput.inputValues.important.init}
            option={important}
            onPress={(value) =>
              dispatchInput({
                type: types.CHOICE,
                value: value.value,
                color: value.color,
                name: "important",
              })
            }
          >
            is it important?
          </SwitchSelector>
          <SwitchSelector
          init={stateInput.inputValues.necessary.init}
            option={necessary}
            onPress={(value) =>
              dispatchInput({
                type: types.CHOICE,
                value: value.value,
                color: value.color,
                name: "necessary",
              })
            }
          >
            is it necessary?
          </SwitchSelector>

          <ObservationField
          value={stateInput.inputValues.observation }
            onChangeText={(text) =>
              dispatchInput({
                type: types.OBSERVATION,
                value: text,
              })
            }
          />
          <SwipeButton
            railFillBackgroundColor="white" //(Optional)npm install redux
            thumbIconBackgroundColor={colors.icons}
            railBackgroundColor="black" //(Optional)
            width={"90%"}
            titleFontSize={30}
            title="Finish"
            onSwipeSuccess={swiping}
            shouldResetAfterSuccess={true}
            titleColor="white"
          />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

let margin 
if (size.height < 550 )
{margin=350}
 else
  if (size.height<600)
{ margin=300}

const styles = StyleSheet.create({
  container: {
    marginBottom: margin? margin:120,
    
    margin: 10,
    height: Dimensions.get("screen").height,
  },
  title: {
    fontFamily: "SpartanBold",
    fontSize: 13,
    marginVertical: 5,
  },
  background: {
    borderRadius: 10,

    borderWidth: 1,
    backgroundColor: colors.textBack,
    height: 50,
    width: 200,
    alignItems: "center",
    justifyContent: "center",
  },
});
export default CreateScreen;
