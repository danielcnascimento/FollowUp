import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import body01 from "../screens/body01";
import body02 from "../screens/body02";
import list from "../screens/listScreen";
import details from "../screens/deatilsScreen";
import start from "../screens/startScreen"
import loadScreen from "../screens/loadingScreen"
import editScreen from "../screens/editScreen"

const screenNavigator = (props) => {
  
  const BodyStack = createStackNavigator();
  return (
    <NavigationContainer>
      <BodyStack.Navigator >
      <BodyStack.Screen name="start" component={start} options={{ header: () => null}} />
        <BodyStack.Screen name="list" component={list} options={{ header: () => null}} />
        <BodyStack.Screen name="details" component={details} options={{ header: () => null}} />
        <BodyStack.Screen name="body01" component={body01}  options={{ header: () => null}}/>
        <BodyStack.Screen name="body02" component={body02} options={{ header: () => null}}/>
        <BodyStack.Screen name="loading" component={loadScreen} options={{ header: () => null}} />
        <BodyStack.Screen name="Edit" component={editScreen} />
      </BodyStack.Navigator>
    </NavigationContainer>
  );
};

export default screenNavigator;
