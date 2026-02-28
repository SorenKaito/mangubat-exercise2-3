import React, { useState } from "react";
import {
  Button,
  FlatList,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { useQuiz } from "../QuizContext";

export default function QuizSettingsScreen() {
  const {
    questions,
    addQuestion,
    updateQuestion,
    deleteQuestion,
    timerSeconds,
    setTimerSeconds,
  } = useQuiz();

  const [localTimer, setLocalTimer] = useState(String(timerSeconds));
  const [editingQuestion, setEditingQuestion] = useState(null);
  const [form, setForm] = useState({
    question: "",
    type: "multiple",
    choiceA: "",
    choiceB: "",
    choiceC: "",
    choiceD: "",
    answer: "",
  });

  const handleSaveTimer = () => {
    const parsed = parseInt(localTimer, 10);
    if (!isNaN(parsed) && parsed >= 0) {
      setTimerSeconds(parsed);
    }
  };

  const startAdd = () => {
    setEditingQuestion({ isNew: true });
    setForm({
      question: "",
      type: "multiple",
      choiceA: "",
      choiceB: "",
      choiceC: "",
      choiceD: "",
      answer: "",
    });
  };

  const startEdit = (question) => {
    setEditingQuestion({ ...question, isNew: false });
    setForm({
      question: question.question,
      type: question.type,
      choiceA: question.choices.A || "",
      choiceB: question.choices.B || "",
      choiceC: question.choices.C || "",
      choiceD: question.choices.D || "",
      answer:
        Array.isArray(question.answer) && question.type === "checkbox"
          ? question.answer.join(",")
          : question.answer,
    });
  };

  const handleChange = (field, value) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const handleSaveQuestion = () => {
    if (!form.question.trim()) {
      return;
    }

    const choices = {};
    if (form.choiceA.trim()) choices.A = form.choiceA.trim();
    if (form.choiceB.trim()) choices.B = form.choiceB.trim();
    if (form.choiceC.trim()) choices.C = form.choiceC.trim();
    if (form.choiceD.trim()) choices.D = form.choiceD.trim();

    let answerValue = form.answer;
    if (form.type === "checkbox") {
      answerValue = form.answer
        .split(",")
        .map((value) => value.trim())
        .filter(Boolean);
    }

    const questionPayload = {
      id: editingQuestion && !editingQuestion.isNew ? editingQuestion.id : undefined,
      type: form.type,
      question: form.question.trim(),
      choices,
      answer: answerValue,
    };

    if (editingQuestion && editingQuestion.isNew) {
      addQuestion(questionPayload);
    } else if (editingQuestion) {
      updateQuestion(questionPayload);
    }

    setEditingQuestion(null);
  };

  const renderItem = ({ item }) => (
    <View style={styles.listItem}>
      <Text style={styles.listQuestion}>{item.question}</Text>
      <View style={styles.listButtons}>
        <Button title="Edit" onPress={() => startEdit(item)} />
        <Button
          title="Delete"
          color="red"
          onPress={() => deleteQuestion(item.id)}
        />
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.sectionTitle}>Quiz Timer (seconds)</Text>
      <View style={styles.timerRow}>
        <TextInput
          style={styles.timerInput}
          keyboardType="numeric"
          value={localTimer}
          onChangeText={setLocalTimer}
        />
        <Button title="Save Timer" onPress={handleSaveTimer} />
      </View>
      <Text style={styles.currentTimer}>
        Current timer: {timerSeconds} seconds
      </Text>

      <View style={styles.separator} />

      <View style={styles.headerRow}>
        <Text style={styles.sectionTitle}>Quiz Items</Text>
        <TouchableOpacity style={styles.addButton} onPress={startAdd}>
          <Text style={styles.addButtonText}>+ Add Question</Text>
        </TouchableOpacity>
      </View>

      <FlatList
        data={questions}
        keyExtractor={(item) => String(item.id)}
        renderItem={renderItem}
        style={styles.list}
      />

      {editingQuestion && (
        <View style={styles.editor}>
          <Text style={styles.sectionTitle}>
            {editingQuestion.isNew ? "Add Question" : "Edit Question"}
          </Text>
          <TextInput
            style={styles.input}
            placeholder="Question text"
            value={form.question}
            onChangeText={(text) => handleChange("question", text)}
          />
          <TextInput
            style={styles.input}
            placeholder='Type (e.g., "multiple", "truefalse", "checkbox")'
            value={form.type}
            onChangeText={(text) => handleChange("type", text)}
          />
          <TextInput
            style={styles.input}
            placeholder="Choice A"
            value={form.choiceA}
            onChangeText={(text) => handleChange("choiceA", text)}
          />
          <TextInput
            style={styles.input}
            placeholder="Choice B"
            value={form.choiceB}
            onChangeText={(text) => handleChange("choiceB", text)}
          />
          <TextInput
            style={styles.input}
            placeholder="Choice C"
            value={form.choiceC}
            onChangeText={(text) => handleChange("choiceC", text)}
          />
          <TextInput
            style={styles.input}
            placeholder="Choice D"
            value={form.choiceD}
            onChangeText={(text) => handleChange("choiceD", text)}
          />
          <TextInput
            style={styles.input}
            placeholder='Answer (e.g., "A" or "A,B" for checkbox)'
            value={form.answer}
            onChangeText={(text) => handleChange("answer", text)}
          />
          <View style={styles.editorButtons}>
            <Button title="Save" onPress={handleSaveQuestion} />
            <Button
              title="Cancel"
              color="gray"
              onPress={() => setEditingQuestion(null)}
            />
          </View>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16 },
  sectionTitle: { fontSize: 18, fontWeight: "bold", marginBottom: 8 },
  timerRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 4,
    gap: 8,
  },
  timerInput: {
    borderWidth: 1,
    borderColor: "#ccc",
    padding: 8,
    borderRadius: 4,
    width: 100,
  },
  currentTimer: { marginBottom: 16 },
  separator: {
    height: 1,
    backgroundColor: "#ddd",
    marginVertical: 12,
  },
  headerRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 8,
  },
  addButton: {
    backgroundColor: "#007bff",
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 4,
  },
  addButtonText: { color: "white", fontWeight: "bold" },
  list: { flex: 1, marginBottom: 8 },
  listItem: {
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
  },
  listQuestion: { fontSize: 16, marginBottom: 4 },
  listButtons: {
    flexDirection: "row",
    justifyContent: "flex-start",
    gap: 8,
  },
  editor: {
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: "#ddd",
    gap: 8,
  },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    padding: 8,
    borderRadius: 4,
  },
  editorButtons: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 8,
  },
});

