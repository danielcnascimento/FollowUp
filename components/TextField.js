import React from "react";
import { TextInput, StyleSheet, View, Text } from "react-native";
import colors from "../colors";
import styled from "styled-components";

const TextField = (props) => {
  

  return(
<View style={{ ...styles.container,...props.style}} >
    <Text    style={styles.text}>
{props.children}
    </Text>
    <View style={styles.inputs}>
      <TextInput style={{padding:5, fontSize:30}} 
        onChangeText={props.onChangeText}
        value={props.value }
        
        
      />
    </View>
     
</View>
       
        )
  ;
};

const styles = StyleSheet.create({
  container:{
    width: "80%",
    height: "10%",

  },
  text:{
    fontSize:30,
  marginLeft:15,
  fontFamily:'Piedra' }
   ,
  inputs: {
   margin:15,
    elevation: 5,
    borderRadius: 10,
    borderBottomColor: "black",
    borderTopColor: "white",
    borderWidth: 0.5,
    backgroundColor: colors.textBack,
  height:"100%"
  },
});
export default TextField;
