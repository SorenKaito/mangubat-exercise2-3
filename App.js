import { NavigationContainer } from "@react-navigation/native";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { QuizProvider } from "./QuizContext";
import HomeScreen from "./screens/HomeScreen";
import QuizScreen from "./screens/QuizScreen";
import ResultScreen from "./screens/ResultScreen";
import QuizSettingsScreen from "./screens/QuizSettingsScreen";

const Tab = createBottomTabNavigator();
const Stack = createNativeStackNavigator();

function PreviewQuizStack() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="Home" component={HomeScreen} />
      <Stack.Screen name="Quiz" component={QuizScreen} />
      <Stack.Screen name="Result" component={ResultScreen} />
    </Stack.Navigator>
  );
}

export default function App() {
  return (
    <QuizProvider>
      <NavigationContainer>
        <Tab.Navigator>
          <Tab.Screen
            name="Preview Quiz"
            component={PreviewQuizStack}
            options={{ headerShown: false }}
          />
          <Tab.Screen name="Quiz Settings" component={QuizSettingsScreen} />
        </Tab.Navigator>
      </NavigationContainer>
    </QuizProvider>
  );
}
