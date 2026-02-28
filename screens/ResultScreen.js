import AsyncStorage from "@react-native-async-storage/async-storage";
import { useEffect, useState } from "react";
import { Button, StyleSheet, Text, View } from "react-native";

export default function ResultScreen({ route, navigation }) {
  const { score } = route.params;
  const [highScore, setHighScore] = useState(0);

  useEffect(() => {
    loadHighScore();
  }, []);

  const loadHighScore = async () => {
    const savedScore = await AsyncStorage.getItem("highScore");
    const parsedScore = savedScore ? parseInt(savedScore) : 0;

    if (score > parsedScore) {
      await AsyncStorage.setItem("highScore", score.toString());
      setHighScore(score);
    } else {
      setHighScore(parsedScore);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Quiz Completed!</Text>
      <Text style={styles.score}>Your Score: {score}</Text>
      <Text style={styles.score}>Highest Score: {highScore}</Text>

      <Button
        title="Back to Home"
        onPress={() => navigation.navigate("Home")}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: "center", alignItems: "center" },
  title: { fontSize: 24, marginBottom: 20 },
  score: { fontSize: 18, marginVertical: 5 },
});