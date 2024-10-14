import axios from "axios";

const BASE_URL = "https://localhost:7075/api";

export const getQuestions = async () => {
  try {
    const response = await axios.get(`${BASE_URL}/Question/QuestionList`);
    return response.data;
  } catch (error) {
    console.error("Failed to fetch question", error);
    return null;
  }
};

export const addQuestion = async (newQuestion) => {
  try {
    const response = await axios.post(
      `${BASE_URL}/Question/AddQuestion`,
      newQuestion
    );
    return response.data;
  } catch (error) {
    console.error("Failed to fetch question", error);
  }
};

export const updateQuestion = async (updatedQuestion) => {
  return await axios.put(
    `${BASE_URL}/Question/EditQuestion/?id=${updatedQuestion.questionID}`,
    updatedQuestion
  );
};

export const deleteQuestion = async (questionID) => {
  return await axios.delete(
    `${BASE_URL}/Question/DeleteQuestion/?id=${questionID}`
  );
};

export const getAnswers = async () => {
  try {
    const response = await axios.get(`${BASE_URL}/Answer/AnswerList`);
    return response.data;
  } catch (error) {
    console.error("Failed to fetch question", error);
    return null;
  }
};

export const submitAnswers = async (selectedAnswers) => {
  try {
    const response = await axios.post(
      `${BASE_URL}/Answer/CheckAnswer`,
      selectedAnswers
    );
    return response;
  } catch (error) {
    console.error("Error submitting answers:", error);
    return null;
  }
};
