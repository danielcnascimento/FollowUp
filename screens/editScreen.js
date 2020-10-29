import React, { useReducer, useState, useEffect, useContext } from "react";
import {
  View,
  Text,
  StyleSheet,
  Image,
  SafeAreaView,
  TextInput,
  //TouchableOpacity,
 Keyboard,
  Dimensions,
  ImageBackground,
  ScrollView,
} from "react-native";
import { useDispatch, useSelector } from "react-redux";
import { useFirestore, isLoaded } from "react-redux-firebase";
import colors from "../colors";
import * as actions from "../store/actions/format";
import {
  changeValidation,
  returnValidation,
} from "../store/actions/modalState";
import ModalComp from "../components/customComp/Modal";
import DateCalender from "../components/customComp/dateCalender";
import Lights from "../components/customComp/lights";
import DropDownComp from "../components/customComp/CustomDropDown";
import { InputModal, TextModal } from "../components/customComp/inputModal";
import WavyHeader from "../components/screen Components/wavyHeader";
import {
  inputReducer,
  INPUTS_VALUES,
  DATE,
  DROP,
  CHOICE,
  init,
  CHOICES,
} from "../store/reduces/editReducer";
import moment from "moment";
import Observation from "../components/screen Components/showMore";
import { AntDesign } from "@expo/vector-icons";
import {TouchableOpacity} from "react-native-gesture-handler"

const EditScreen = (props) => {
  const { dataId, id } = props.route.params;
  const optionsImportant = ["high", " average", "low"];
  const optionsNecessary = ["yes", "maybe", " no"];

  const firestore = useFirestore();
  const dispatch = useDispatch();
  const state = useSelector((state) => state.format.edit);
  const stateModal = useSelector((state) => state.modal);
  const [stateInputs, dispatchInputs] = useReducer(inputReducer, init(dataId));

  useEffect(() => {
    dispatch(actions.edit(stateInputs.inputValues));
  }, [stateInputs.inputValues]);

  const submit = async () => {
    if (!stateInputs.formIsValid) {
      alert("Don't leave field empty please");
      return;
    }

    try {
      await firestore.update(`Cards/${id}`, { format: state });
      props.navigation.navigate("updating", { id: id });
    } catch (e) {
      //console.log(e);
    }
  };

  const inputTextHolder = (inputIdentifier, text) => {
    let isValid = false;
    if (text.trim().length > 0 || inputIdentifier === "observation") {
      isValid = true;
    }

    dispatchInputs({
      type: INPUTS_VALUES,
      value: text,
      isValid: isValid,
      input: inputIdentifier,
    });
  };

  const pressHandler = (l) => {
    dispatchInputs({
      type: DROP,
      value: l.label,
      avatar: l.avatar,
    });
    dispatch(returnValidation());
  };
  useEffect(() => {
    Keyboard.addListener("keyboardDidShow", _keyboardDidShow);
    Keyboard.addListener("keyboardDidHide", _keyboardDidHide);

    //  Don't forget to cleanup with remove listeners
    return () => {
      Keyboard.removeListener("keyboardDidShow", _keyboardDidShow);
      Keyboard.removeListener("keyboardDidHide", _keyboardDidHide);
    };
  }, []);

  const _keyboardDidShow = () => {
    dispatch(changeValidation("image", true))
  }

  const _keyboardDidHide = () => {
    dispatch(returnValidation())
  }


  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "black" }}>
      <ImageBackground
        source={require("../assets/icons/Rectangle.png")}
        style={styles.svg}
      />
      <View
        style={{
          width: "100%",
          flexDirection: "row",
          justifyContent: "space-between",
          paddingHorizontal: 10,
          marginTop: 20,
        }}
      >
        <TouchableOpacity onPress={() => props.navigation.navigate("list")}>
          <AntDesign name="close" size={30} color="white" />
        </TouchableOpacity>
        <TouchableOpacity onPress={submit}>
          <AntDesign name="check" size={30} color="white" />
        </TouchableOpacity>
      </View>

      <View
        style={{
         alignItems:"flex-end",
          width: "100%",
          marginTop:20
          
        }}
      >

<TextInput
          style={{  color: "white",  ...styles.title, fontSize: 25,paddingBottom:50  }}
          onChangeText={inputTextHolder.bind(this, "productName")}
          value={stateInputs.inputValues.productName}
        />
         {/* <TouchableOpacity
          onPress={() => dispatch(changeValidation("productName", true))}
        >
         <Text style={{ ...styles.title, color: "white", fontSize: 25 }}>
            {stateInputs.inputValues.productName}
          </Text>
        </TouchableOpacity> */}

      </View>

      {stateModal.image?null:<View style={styles.imageContainer}>
      <View style={styles.content}></View> 

        <View style={{ elevation: 10, marginTop: 5 }}>
          <TouchableOpacity
            onPress={() => dispatch(changeValidation("Application", true))}
          >
            <Image
              style={styles.image}
              source={{ uri: stateInputs.inputValues.application.avatar }}
            />
          </TouchableOpacity>
        </View>
      </View>}

      <View />
      <ScrollView>
      
        <View style={styles.container}>
       
          <View style={styles.card}>
            <TextModal
              title="Application"
              text={stateInputs.inputValues.application.value}
              type="Application"
            />
          

            <TextModal
              title="Date"
              text={stateInputs.inputValues.date}
              type="date"
            />

            {stateModal.date ? (
              <DateCalender
                value={moment(
                  stateInputs.inputValues.date,
                  "DD/MM/YYYY"
                ).toDate()}
              
                newDate={(value) =>
                  dispatchInputs({
                    type: DATE,
                    value: value,
                  })
                }
              />
            ) : null}
            <View style={styles.spendContain}>
              <Text style={styles.title}>Spend</Text>
              <TextInput
                style={{ fontFamily: "SpartanBold", fontSize: 15 }}
                onChangeText={inputTextHolder.bind(this, "spend")}
                keyboardType="number-pad"
                value={stateInputs.inputValues.spend}
                
              />
            </View>
            <ModalComp
              visible={
                stateModal.Application
                  ? stateModal.Application
                  : stateModal.openModals.Application
              }
              onPress={pressHandler}
              onRequestClose={() => dispatch(returnValidation())}
            />
          </View>
          <View style={styles.card2}>
            <Lights
              title="Important "
              color={stateInputs.inputValues.important.color}
            >
              <DropDownComp
                option={optionsImportant}
                value={stateInputs.inputValues.important.value}
                onValueChange={(value) =>
                  dispatchInputs({
                    type: CHOICES,
                    value: value.value,
                    color: value.color,
                  })
                }
              />
            </Lights>

            <Lights
              title="Necessary"
              color={stateInputs.inputValues.necessary.color}
            >
              <DropDownComp
                option={optionsNecessary}
                value={stateInputs.inputValues.necessary.value}
                onValueChange={(value) =>
                  dispatchInputs({
                    type: CHOICE,
                    value: value.value,
                    color: value.color,
                  })
                }
              />
            </Lights>
          </View>
          <View style={styles.card3}>
            <Observation observation={stateInputs.inputValues.observation}>
              <TextInput
                style={{ ...styles.title, fontSize: 15 }}
                onChangeText={inputTextHolder.bind(this, "observation")}
                value={stateInputs.inputValues.observation}
            
              />
            </Observation>
          </View>
        </View>
      </ScrollView>
    
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {

    justifyContent: "center",
    alignItems: "center",
    height: Dimensions.get("window").height,
  },
  svg: {
    
      position: "absolute",
      left: 0,
      top: 110,
      width: Dimensions.get("screen").width,
      height: Dimensions.get("screen").height,
    
  },
  card: {
    width: "80%",
    height: "30%",
    elevation: 10,
    borderRadius: 20,
    backgroundColor: "white",
    paddingHorizontal: 20,
    paddingVertical: 20,
    marginVertical: 10,

  },
  card2: {
    width: "80%",
    height: "20%",
    elevation: 10,
    borderRadius: 20,
    backgroundColor: "white",
    flexDirection: "row",
    justifyContent: "space-evenly",
    marginVertical: 10,
  },
  card3: {
    width: "80%",
    height: "20%",
    elevation: 10,
    borderRadius: 20,
    backgroundColor: "white",
    paddingHorizontal: 20,
    paddingVertical: 20,
    marginVertical: 10,
  },
  title: {
    fontFamily: "SpartanBold",
    fontSize: 13,
    marginVertical: 5,
  },
  imageContainer: {
    position: "absolute",
    left: 25,
    top: 60,
  },
  image: {
    width: 100,
    height: 100,
    borderRadius: 30,
  },
  rowContain: {
    flexDirection: "row",
    width: "100%",
    // height: "20%",

    marginTop: 10,
    borderBottomWidth: 1,
    paddingBottom: 20,
    justifyContent: "space-between",
  },
  spendContain: {
    justifyContent: "space-between",
    flexDirection: "row",
    width: "50%",
    paddingVertical: 10,
    borderBottomWidth: 1,
  },
  
});
export default EditScreen;
