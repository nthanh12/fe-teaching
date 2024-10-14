import React, { useEffect, useState } from "react";
import { getQuestions, getAnswers, submitAnswers } from "../services/api";
import "../App.css";

const QuestionList = () => {
  const [questions, setQuestions] = useState([]);
  const [answers, setAnswers] = useState([]);
  const [selectedAnswers, setSelectedAnswers] = useState({});
  const [results, setResults] = useState({});
  const [resultsVisible, setResultsVisible] = useState(false);
  const [score, setScore] = useState(0); // Thêm biến lưu điểm
  const answerLabels = ["A", "B", "C", "D", "E", "F"];
  const [feedbackMessage, setFeedbackMessage] = useState("");

  useEffect(() => {
    const fetchQuestions = async () => {
      const response = await getQuestions();
      if (response && response.statusCode === 200) {
        setQuestions(response.data);
      } else {
        console.error("Error fetching questions:", response);
        setQuestions([]);
      }
    };

    const fetchAnswers = async () => {
      const response = await getAnswers();
      if (response && response.statusCode === 200) {
        setAnswers(response.data);
      } else {
        console.error("Error fetching answers:", response);
        setAnswers([]);
      }
    };

    fetchQuestions();
    fetchAnswers();
  }, []);

  const handleAnswerChange = (questionID, answerID) => {
    setSelectedAnswers({
      ...selectedAnswers,
      [questionID]: answerID,
    });
  };

  const handleSubmit = async () => {
    const confirmSubmission = window.confirm(
      "Bạn có chắc chắn muốn nộp bài không?"
    );

    if (!confirmSubmission) {
      return;
    }

    if (Object.keys(selectedAnswers).length === 0) {
      alert("Vui lòng chọn ít nhất một câu trả lời trước khi nộp bài.");
      return;
    }

    const response = await submitAnswers(selectedAnswers);
    if (response && response.status === 200) {
      console.log("Response from server:", response.data.data);
      setResults(response.data.data);
      setResultsVisible(true);

      // Tính điểm theo công thức mới
      const correctAnswersCount = Object.values(response.data.data).filter(
        (value) => value
      ).length;
      const totalQuestionsCount = questions.length;

      // Tính điểm và làm tròn
      const totalScore =
        Math.round((correctAnswersCount / totalQuestionsCount) * 10 * 10) / 10;

      setScore(totalScore);

      if (totalScore >= 4) {
        setFeedbackMessage("Bạn đã vượt qua bài thi!");
      } else {
        setFeedbackMessage("Bạn chưa tài đâu, học thêm đi! (Mặt nhếch)");
      }
    } else {
      console.error("Error submitting answers:", response);
      setResults({});
      setScore(0);
      setResultsVisible(false);
    }
  };

  return (
    <div className="container">
      <h1>Bài thi dành cho mấy nhỏ hỗn</h1>

      {resultsVisible && (
        <div>
          <h3 className="result-point">Điểm số: {score}</h3>
          <p>{feedbackMessage}</p> {/* Hiển thị thông báo phản hồi */}
        </div>
      )}

      <ul>
        {questions.map((question, index) => (
          <li key={question.questionID}>
            <p>
              <strong>Câu {index + 1}:</strong> {question.questionText}
            </p>
            <ul className="answer-list">
              {answers
                .filter((answer) => answer.questionID === question.questionID)
                .map((answer, answerIndex) => (
                  <li key={answer.answerID}>
                    <label>
                      <input
                        type="radio"
                        name={`question-${question.questionID}`}
                        value={answer.answerID}
                        checked={
                          selectedAnswers[question.questionID] ===
                          answer.answerID
                        }
                        onChange={() =>
                          handleAnswerChange(
                            question.questionID,
                            answer.answerID
                          )
                        }
                      />
                      {answerLabels[answerIndex]}. {answer.answerText}
                    </label>
                  </li>
                ))}
            </ul>
            {resultsVisible && (
              <div>
                <strong>Kết quả: </strong>
                {results[question.questionID] ? "Đúng" : "Sai"}
              </div>
            )}
          </li>
        ))}
      </ul>
      <button onClick={handleSubmit}>Nộp bài</button>
    </div>
  );
};

export default QuestionList;
