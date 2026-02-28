import { useState } from "react";
import {
    Button,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from "react-native";
import { questions } from "../questions";

export default function QuizScreen({ navigation }) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [answers, setAnswers] = useState({});
  const [score, setScore] = useState(0);

  const currentQuestion = questions[currentIndex];

  const handleSelect = (choice) => {
    const correctAnswer = currentQuestion.answer;

    let updatedAnswers = { ...answers };

    // Checkbox type
    if (currentQuestion.type === "checkbox") {
      let selected = updatedAnswers[currentQuestion.id] || [];
      if (selected.includes(choice)) {
        selected = selected.filter((c) => c !== choice);
      } else {
        selected.push(choice);
      }
      updatedAnswers[currentQuestion.id] = selected;
    } else {
      updatedAnswers[currentQuestion.id] = choice;
    }

    setAnswers(updatedAnswers);
  };

  const calculateScore = () => {
    let total = 0;

    questions.forEach((q) => {
      const userAnswer = answers[q.id];

      if (q.type === "checkbox") {
        if (
          JSON.stringify(userAnswer?.sort()) ===
          JSON.stringify(q.answer.sort())
        ) {
          total++;
        }
      } else {
        if (userAnswer === q.answer) {
          total++;
        }
      }
    });

    return total;
  };

  const handleNext = () => {
    if (currentIndex < questions.length - 1) {
      setCurrentIndex(currentIndex + 1);
    } else {
      const finalScore = calculateScore();
      navigation.navigate("Result", { score: finalScore });
    }
  };

  const handlePrevious = () => {
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.question}>
        {currentIndex + 1}. {currentQuestion.question}
      </Text>

      {Object.keys(currentQuestion.choices).map((key) => {
        const isSelected =
          currentQuestion.type === "checkbox"
            ? answers[currentQuestion.id]?.includes(key)
            : answers[currentQuestion.id] === key;

        return (
          <TouchableOpacity
            key={key}
            style={[
              styles.choice,
              isSelected && styles.selectedChoice,
            ]}
            onPress={() => handleSelect(key)}
          >
            <Text>
              {key}. {currentQuestion.choices[key]}
            </Text>
          </TouchableOpacity>
        );
      })}

      <View style={styles.navButtons}>
        <Button title="Previous" onPress={handlePrevious} />
        <Button title="Next" onPress={handleNext} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, justifyContent: "center" },
  question: { fontSize: 20, marginBottom: 20 },
  choice: {
    padding: 10,
    marginVertical: 5,
    borderWidth: 1,
    borderRadius: 5,
  },
  selectedChoice: {
    backgroundColor: "#cde1f9",
  },
  navButtons: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 20,
  },
});