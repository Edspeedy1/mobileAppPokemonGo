import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import { withLayoutContext } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';

const TopTabs = withLayoutContext(createMaterialTopTabNavigator().Navigator);

export default function CollectionLayout() {
  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#2a75bb' }}>
      <TopTabs
        screenOptions={{
          tabBarActiveTintColor: '#ffcb05',
          tabBarIndicatorStyle: { backgroundColor: '#ffcb05' },
          tabBarStyle: { backgroundColor: '#2a75bb' },
        }}
      >
        <TopTabs.Screen name="index" options={{ title: 'Collection' }} />
        <TopTabs.Screen name="dex" options={{ title: 'Dex' }} />
      </TopTabs>
    </SafeAreaView>
  );
}
