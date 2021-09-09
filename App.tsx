import React, { useEffect } from "react";
import { Text, View } from "react-native";
import { Welcome } from "./src/pages/Welcome";
import AppLoading from "expo-app-loading";
import fonts from "./src/styles/fonts";
import Routes from "./src/routes";
import * as Notifications from 'expo-notifications';
import {
  useFonts,
  Jost_400Regular,
  Jost_600SemiBold
} from "@expo-google-fonts/jost";
import { PlantProps } from "./src/libs/storage";
import AsyncStorage from "@react-native-async-storage/async-storage";

export default function App() {
  const [fontsLoaded] = useFonts({
    Jost_400Regular,
    Jost_600SemiBold
  })

  // useEffect(() => {
    // const subscription = Notifications.addNotificationReceivedListener(
    //   async notification => {
    //     const data = notification.request.content.data.plant as PlantProps;
    //     console.log(data);
    //   }
    // )
    // return () => subscription.remove();

  //   async function notifications() {
  //     const data = await Notifications.getAllScheduledNotificationsAsync();
  //     await Notifications.cancelAllScheduledNotificationsAsync();
  //     console.log(data);
  //     AsyncStorage.removeItem("@plantmanager:plants");
  //   }
  //   notifications();
  // }, []);

  if (!fontsLoaded) return <AppLoading />

  return (
    <Routes />
  );
}
