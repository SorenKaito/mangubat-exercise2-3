import { useEffect, useState } from "react";
import {
    Button,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from "react-native";
import { useQuiz } from "../QuizContext";

export default function QuizScreen({ navigation }) {
  const { questions, timerSeconds } = useQuiz();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [answers, setAnswers] = useState({});
  const [score, setScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState(timerSeconds);
  const [hasSubmitted, setHasSubmitted] = useState(false);

  const currentQuestion = questions[currentIndex];

  useEffect(() => {
    setTimeLeft(timerSeconds);
    setCurrentIndex(0);
    setAnswers({});
    setScore(0);
    setHasSubmitted(false);
  }, [timerSeconds]);

  useEffect(() => {
    if (hasSubmitted) {
      return;
    }

    if (timeLeft <= 0) {
      const finalScore = calculateScore();
      setScore(finalScore);
      setHasSubmitted(true);
      navigation.navigate("Result", { score: finalScore });
      return;
    }

    const intervalId = setInterval(() => {
      setTimeLeft((prev) => prev - 1);
    }, 1000);

    return () => clearInterval(intervalId);
  }, [timeLeft, hasSubmitted, answers]);

  const formatTime = (seconds) => {
    const safeSeconds = Math.max(0, seconds);
    const minutes = Math.floor(safeSeconds / 60);
    const remainingSeconds = safeSeconds % 60;
    const paddedMinutes = String(minutes).padStart(2, "0");
    const paddedSeconds = String(remainingSeconds).padStart(2, "0");
    return `${paddedMinutes}:${paddedSeconds}`;
  };

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
      setScore(finalScore);
      setHasSubmitted(true);
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
      <Text style={styles.timer}>Time left: {formatTime(timeLeft)}</Text>
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
  timer: { fontSize: 18, marginBottom: 12, textAlign: "center" },
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