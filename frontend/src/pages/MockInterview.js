import React, { useState, useEffect } from 'react';
import '../index.css';

const MockInterview = ({ onNavigate }) => {
  const [interviews, setInterviews] = useState([]);
  const [selectedInterview, setSelectedInterview] = useState(null);
  const [questions, setQuestions] = useState([]);
  const [expandedQuestionId, setExpandedQuestionId] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Fetch interviews on load
  useEffect(() => {
    const token = localStorage.getItem('nn_access');
    if (!token) {
      if (onNavigate) onNavigate('login');
      return;
    }
    fetchInterviews(token);
  }, [onNavigate]);

  const fetchInterviews = async (token) => {
    try {
      setLoading(true);
      const res = await fetch('http://127.0.0.1:8000/api/mockinterviews/', {
        headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' },
      });
      if (!res.ok) throw new Error('Failed to fetch interviews');
      const data = await res.json();
      setInterviews(Array.isArray(data) ? data : []);
      setError(null);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const fetchInterviewQuestions = async (interviewId) => {
    const token = localStorage.getItem('nn_access');
    try {
      setLoading(true);
      const res = await fetch(
        `http://127.0.0.1:8000/api/mockinterviews/${interviewId}/questions/`,
        {
          headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' },
        }
      );
      if (!res.ok) throw new Error('Failed to fetch interview questions');
      const data = await res.json();
      setQuestions(data.questions || []);
      setError(null);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleInterviewSelect = (interview) => {
    setSelectedInterview(interview);
    fetchInterviewQuestions(interview.id);
  };

  const handleBack = () => {
    setSelectedInterview(null);
    setQuestions([]);
    setExpandedQuestionId(null);
  };

  const toggleQuestion = (questionId) => {
    setExpandedQuestionId(expandedQuestionId === questionId ? null : questionId);
  };

  return (
    <div className="container" style={{ padding: '20px' }}>
      <h1>🎤 Mock Interview</h1>

      {error && <div style={{ color: 'red', marginBottom: '10px' }}>Error: {error}</div>}

      {!selectedInterview ? (
        <>
          <h2>Available Interviews</h2>
          {loading ? (
            <p>Loading interviews...</p>
          ) : interviews.length === 0 ? (
            <p>No interviews available.</p>
          ) : (
            <div style={{ display: 'grid', gap: '10px' }}>
              {interviews.map((interview) => (
                <div
                  key={interview.id}
                  style={{
                    border: '1px solid #ddd',
                    padding: '15px',
                    borderRadius: '5px',
                    cursor: 'pointer',
                    backgroundColor: '#f0f8ff',
                  }}
                  onClick={() => handleInterviewSelect(interview)}
                >
                  <h3>{interview.title}</h3>
                  <p>{interview.description || 'No description'}</p>
                  <small>Questions: {interview.questions?.length || 0}</small>
                </div>
              ))}
            </div>
          )}
        </>
      ) : (
        <>
          <h2>{selectedInterview.title}</h2>
          <p>{selectedInterview.description}</p>
          <div style={{ marginBottom: '20px' }}>
            <strong>Questions: {questions.length}</strong>
          </div>

          {loading ? (
            <p>Loading questions...</p>
          ) : (
            <div>
              {questions.map((question, idx) => (
                <div
                  key={question.id}
                  style={{
                    marginBottom: '15px',
                    padding: '15px',
                    border: '1px solid #ccc',
                    borderRadius: '5px',
                    backgroundColor: '#fffbf0',
                  }}
                >
                  <div
                    onClick={() => toggleQuestion(question.id)}
                    style={{
                      cursor: 'pointer',
                      fontWeight: 'bold',
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                    }}
                  >
                    <span>Q{idx + 1}. {question.text}</span>
                    <span>{expandedQuestionId === question.id ? '▼' : '▶'}</span>
                  </div>
                  {expandedQuestionId === question.id && (
                    <div style={{ marginTop: '10px', padding: '10px', backgroundColor: '#f5f5f5', borderRadius: '3px' }}>
                      <p>
                        <strong>Suggested Answer:</strong>
                      </p>
                      <p>{question.suggested_answer || 'No suggested answer provided.'}</p>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}

          <button
            onClick={handleBack}
            style={{
              marginTop: '20px',
              padding: '10px 20px',
              fontSize: '16px',
              backgroundColor: '#2196F3',
              color: 'white',
              border: 'none',
              borderRadius: '5px',
              cursor: 'pointer',
            }}
          >
            Back
          </button>
        </>
      )}
    </div>
  );
};

export default MockInterview;
