import React, { createContext, useContext, useState } from "react";
import { questions as initialQuestions } from "./questions";

const QuizContext = createContext(undefined);

export function QuizProvider({ children }) {
  const [questions, setQuestions] = useState(initialQuestions);
  const [timerSeconds, setTimerSeconds] = useState(60);

  const addQuestion = (question) => {
    const nextId =
      questions.length > 0
        ? Math.max(...questions.map((q) => q.id || 0)) + 1
        : 1;

    const newQuestion = {
      ...question,
      id: nextId,
    };

    setQuestions([...questions, newQuestion]);
  };

  const updateQuestion = (updatedQuestion) => {
    setQuestions(
      questions.map((q) => (q.id === updatedQuestion.id ? updatedQuestion : q))
    );
  };

  const deleteQuestion = (id) => {
    setQuestions(questions.filter((q) => q.id !== id));
  };

  return (
    <QuizContext.Provider
      value={{
        questions,
        addQuestion,
        updateQuestion,
        deleteQuestion,
        timerSeconds,
        setTimerSeconds,
      }}
    >
      {children}
    </QuizContext.Provider>
  );
}

export function useQuiz() {
  const context = useContext(QuizContext);
  if (!context) {
    throw new Error("useQuiz must be used within a QuizProvider");
  }
  return context;
}

