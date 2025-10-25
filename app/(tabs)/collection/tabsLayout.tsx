import { createMaterialTopTabNavigator } from "@react-navigation/material-top-tabs";
import { SafeAreaView } from "react-native-safe-area-context";

import DexScreen from "./dex";
import CollectionScreen from "./index";

const Tab = createMaterialTopTabNavigator();

export default function CollectionTabs() {
  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "#2a75bb" }}>
      <Tab.Navigator
        screenOptions={{
          tabBarActiveTintColor: "#ffcb05",
          tabBarIndicatorStyle: { backgroundColor: "#ffcb05" },
          tabBarStyle: { backgroundColor: "#2a75bb" },
        }}
      >
        <Tab.Screen
          name="index"
          component={CollectionScreen}
          options={{ title: "Collection" }}
        />
        <Tab.Screen
          name="dex"
          component={DexScreen}
          options={{ title: "Dex" }}
        />
      </Tab.Navigator>
    </SafeAreaView>
  );
}
