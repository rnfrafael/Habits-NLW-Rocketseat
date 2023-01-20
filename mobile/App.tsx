import { StyleSheet, Text, View, StatusBar } from "react-native";
import Loading from "./src/components/Loading";
import {
  useFonts,
  Inter_400Regular,
  Inter_600SemiBold,
  Inter_800ExtraBold,
} from "@expo-google-fonts/inter";

export default function App() {
  let [fontsLoaded] = useFonts({
    Inter_400Regular,
    Inter_600SemiBold,
    Inter_800ExtraBold,
  });

  if (!fontsLoaded) {
    return (
      <View>
        <Loading />
      </View>
    );
  }
  return (
    <View style={styles.container}>
      <Text style={styles.text}>E esse Nitro chega quando?</Text>
      <StatusBar
        barStyle="light-content"
        backgroundColor="transparent"
        translucent
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "black",
    alignItems: "center",
    justifyContent: "center",
  },
  text: {
    color: "white",
    fontFamily: "Inter_800ExtraBold",
  },
});
