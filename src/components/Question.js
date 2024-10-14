import React, { useEffect, useState } from "react";
import {
  getQuestions,
  addQuestion,
  updateQuestion,
  deleteQuestion,
} from "../services/api"; // Nhập các hàm từ API
import "bootstrap/dist/css/bootstrap.min.css"; // Import Bootstrap

const Question = () => {
  const [questions, setQuestions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [openDialog, setOpenDialog] = useState(false);
  const [newQuestion, setNewQuestion] = useState("");
  const [editingQuestion, setEditingQuestion] = useState(null);

  useEffect(() => {
    fetchQuestions();
  }, []);

  const fetchQuestions = async () => {
    try {
      const rs = await getQuestions();
      setQuestions(rs.data);
    } catch (error) {
      console.error("Error fetching questions:", error);
      setError("Có lỗi xảy ra khi tải danh sách câu hỏi.");
    } finally {
      setLoading(false);
    }
  };

  const handleDialogOpen = (question = null) => {
    if (question) {
      setEditingQuestion(question);
      setNewQuestion(question.questionText);
    } else {
      setEditingQuestion(null);
      setNewQuestion("");
    }
    setOpenDialog(true);
  };

  const handleDialogClose = () => {
    setOpenDialog(false);
    setNewQuestion("");
    setEditingQuestion(null);
  };

  const handleAddOrEditQuestion = async () => {
    if (editingQuestion) {
      await updateExistingQuestion();
    } else {
      await createNewQuestion();
    }
    handleDialogClose();
  };

  const createNewQuestion = async () => {
    try {
      const newQuestionData = { questionText: newQuestion };
      await addQuestion(newQuestionData);
      fetchQuestions(); // Cập nhật danh sách câu hỏi sau khi thêm
    } catch (error) {
      console.error("Error adding question:", error);
    }
  };

  const updateExistingQuestion = async () => {
    try {
      const updatedQuestionData = {
        ...editingQuestion,
        questionText: newQuestion,
      };
      await updateQuestion(updatedQuestionData);
      fetchQuestions(); // Cập nhật danh sách câu hỏi sau khi cập nhật
    } catch (error) {
      console.error("Error updating question:", error);
    }
  };

  const handleDeleteQuestion = async (questionID) => {
    try {
      await deleteQuestion(questionID);
      fetchQuestions(); // Cập nhật danh sách câu hỏi sau khi xóa
    } catch (error) {
      console.error("Error deleting question:", error);
    }
  };

  if (loading) {
    return <div>Loading...</div>; // Hiển thị thông báo tải
  }

  if (error) {
    return <div>{error}</div>;
  }

  return (
    <div className="container mt-4">
      <h1 className="mb-4">Danh sách câu hỏi</h1>
      <ul className="list-group mb-4">
        {questions.map((question, index) => (
          <li
            key={question.questionID}
            className="list-group-item d-flex justify-content-between align-items-center"
          >
            <h6>
              Câu {index + 1}: {question.questionText}
            </h6>
            <div>
              <button
                className="btn btn-warning btn-sm mx-1"
                onClick={() => handleDialogOpen(question)}
              >
                Sửa
              </button>
              <button
                className="btn btn-danger btn-sm"
                onClick={() => handleDeleteQuestion(question.questionID)}
              >
                Xóa
              </button>
            </div>
          </li>
        ))}
      </ul>
      <button className="btn btn-primary" onClick={() => handleDialogOpen()}>
        Thêm câu hỏi
      </button>

      {openDialog && (
        <div
          className="modal show"
          style={{ display: "block", backgroundColor: "rgba(0,0,0,0.5)" }}
        >
          <div className="modal-dialog">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">
                  {editingQuestion ? "Cập nhật câu hỏi" : "Thêm câu hỏi mới"}
                </h5>
              </div>
              <div className="modal-body">
                <input
                  type="text"
                  className="form-control"
                  placeholder="Nội dung câu hỏi"
                  value={newQuestion}
                  onChange={(e) => setNewQuestion(e.target.value)}
                />
              </div>
              <div className="modal-footer">
                <button
                  className="btn btn-primary"
                  onClick={handleAddOrEditQuestion}
                >
                  {editingQuestion ? "Cập nhật" : "Thêm"}
                </button>
                <button
                  className="btn btn-secondary"
                  onClick={handleDialogClose}
                >
                  Hủy
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Question;
