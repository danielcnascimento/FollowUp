import React, { useState, useReducer } from "react";
import {
  View,
  Text,
  ScrollView,
  KeyboardAvoidingView,
  StyleSheet,
  TouchableHighlight,
} from "react-native";
import TextField from "../components/customComp/TextField";
import SwitchSelector from "../components/screen Components/SwitchSelector";
import FinishButton from "../components/customComp/finishButton";
import colors from "../colors";
import DatePicker from "@react-native-community/datetimepicker";
import { SimpleLineIcons } from "@expo/vector-icons";
import moment from "moment";
import * as ImagePicker from "expo-image-picker";
import { useDispatch, useSelector } from "react-redux";
import * as actions from "../store/actions/format";
import ObservationField from "../components/screen Components/observitionField";
import DateCalender from "../components/customComp/dateCalender"

const INPUTS_VALUES = "INPUTS_VALUES";
const CHOICE = "CHOICE";
const PICTURE = "PICTURE";
const DATE = "DATE";

const inputReducer = (state, action) => {
  switch (action.type) {
    case INPUTS_VALUES:
      const updateValues = {
        ...state.inputValues,
        observation: action.value,
      };
      return {
        inputValues: updateValues,
      };

    case DATE:
      const updateDate = {
        ...state.inputValues,
        date: action.value,
      };
      return {
        inputValues: updateDate,
      };
    case CHOICE:
      const updateChoice = {
        ...state.inputValues,
        necessary: {
          value: action.value,
          color: action.color,
        },
      };
      return {
        inputValues: updateChoice,
      };
    case PICTURE:
      const updatePic = {
        ...state.inputValues,
        picture: action.value,
      };
      return {
        inputValues: updatePic,
      };
  }
  return state;
};

const necessary = ["yes", "maybe", " no"];

const Body02 = (props) => {
  const data = useSelector((state) => state.format);
  console.log(data);

  const [show, setShow] = useState(false);

  const [stateInputs, dispatchInputs] = useReducer(inputReducer, {
    inputValues: {
      date: moment().format("DD/MM/YYYY"),
      picture: "",
      observation: "",
      necessary: {
        value: "yes",
        color: "green",
      },
    },
  });

  console.log(stateInputs.inputValues.necessary)

  const choosePic = async () => {
    try {
      let result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.All,
        allowsEditing: true,
        aspect: [4, 3],
        quality: 1,
      });
      if (!result.cancelled) {
        dispatchInputs({
          type: PICTURE,
          value: result.uri,
        });
      }

      console.log(result);
    } catch (E) {
      console.log(E);
    }
  };

  const dispatch = useDispatch();

  // const finishHandler = () => {
  //   dispatch(
  //     actions.inputsPage2(
  //       stateInputs.inputValues.date,
  //       stateInputs.inputValues.picture,
  //       stateInputs.inputValues.observation,
  //       stateInputs.inputValues.necessary
  //     )
  //   );
  //   props.navigation.navigate("loading");
  // };

  return (
    <KeyboardAvoidingView
    behavior="height" style={{flex:1}}
    >
    
    <View style={styles.container}>
      <View style={styles.rowContain}>
        <View style={styles.background}>
          <Text style={{ fontSize: 30 }} onPress={() => setShow(true)}>
            {stateInputs.inputValues.date}
          </Text>
        </View>
        <TouchableHighlight style={styles.background} onPress={choosePic}>
          <View>
            <SimpleLineIcons name="picture" size={30} color="black" />
          </View>
        </TouchableHighlight>
      </View>

      {show && (
       

< DateCalender
             value={new Date()}
             open={setShow}
             newDate={value=>dispatchInputs({
      type: DATE,
      value: value,
    })
    }
           />
      )}

      <SwitchSelector
        option={necessary}
        onPress={(value) =>
          dispatchInputs({
            type: CHOICE,
            value: value.value,
            color: value.color,
          })
        }
      >
        is it necessary?
      </SwitchSelector>

      <ObservationField
        onChangeText={(text) =>
          dispatchInputs({
            type: INPUTS_VALUES,
            value: text,
          })
        }
      />
      {/* <TextField
        style={{
          height: "30%",
          marginBottom: 40,
        }}
        inputStyle={{ justifyContent: "flex-start" }}
      
      >
      
      </TextField> */}

     

      <FinishButton onPress={finishHandler} />
    </View>
  
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    justifyContent: "space-around",
    alignItems: "center",
    flex: 1,
  },

  background: {
    elevation: 5,
    borderRadius: 10,
    borderBottomColor: "black",
    borderTopColor: "white",
    borderWidth: 0.5,
    backgroundColor: colors.textBack,
    height: "30%",
    width: "40%",
    alignItems: "center",
    justifyContent: "center",
  },
  rowContain: {
    flexDirection: "row",
    width: "100%",
    alignItems: "center",
    justifyContent: "space-around",
  },
});
export default Body02;
