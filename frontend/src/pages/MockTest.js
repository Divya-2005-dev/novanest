import React, { useState, useEffect } from 'react';
import '../index.css';

const MockTest = ({ onNavigate }) => {
  const [tests, setTests] = useState([]);
  const [selectedTest, setSelectedTest] = useState(null);
  const [questions, setQuestions] = useState([]);
  const [answers, setAnswers] = useState({});
  const [submitted, setSubmitted] = useState(false);
  const [score, setScore] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Fetch tests on load
  useEffect(() => {
    const token = localStorage.getItem('nn_access');
    if (!token) {
      if (onNavigate) onNavigate('login');
      return;
    }
    fetchTests(token);
  }, [onNavigate]);

  const fetchTests = async (token) => {
    try {
      setLoading(true);
      const res = await fetch('http://127.0.0.1:8000/api/mocktests/', {
        headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' },
      });
      if (!res.ok) throw new Error('Failed to fetch tests');
      const data = await res.json();
      setTests(Array.isArray(data) ? data : []);
      setError(null);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const fetchTestQuestions = async (testId) => {
    const token = localStorage.getItem('nn_access');
    try {
      setLoading(true);
      const res = await fetch(`http://127.0.0.1:8000/api/mocktests/${testId}/questions/`, {
        headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' },
      });
      if (!res.ok) throw new Error('Failed to fetch questions');
      const data = await res.json();
      setQuestions(data.questions || []);
      setAnswers({});
      setSubmitted(false);
      setScore(null);
      setError(null);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleTestSelect = (test) => {
    setSelectedTest(test);
    fetchTestQuestions(test.id);
  };

  const handleAnswerChange = (questionId, optionIndex) => {
    setAnswers({ ...answers, [questionId]: optionIndex });
  };

  const handleSubmit = async () => {
    const token = localStorage.getItem('nn_access');
    try {
      setLoading(true);
      const res = await fetch('http://127.0.0.1:8000/api/mocktests/submit/', {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          test: selectedTest.id,
          answers: answers,
        }),
      });
      if (!res.ok) throw new Error('Failed to submit test');
      const data = await res.json();
      setScore(data.score);
      setSubmitted(true);
      setError(null);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleBack = () => {
    setSelectedTest(null);
    setQuestions([]);
    setAnswers({});
    setSubmitted(false);
    setScore(null);
  };

  return (
    <div className="container" style={{ padding: '20px' }}>
      <h1>📝 Mock Test</h1>

      {error && <div style={{ color: 'red', marginBottom: '10px' }}>Error: {error}</div>}

      {!selectedTest ? (
        <>
          <h2>Available Tests</h2>
          {loading ? (
            <p>Loading tests...</p>
          ) : tests.length === 0 ? (
            <p>No tests available.</p>
          ) : (
            <div style={{ display: 'grid', gap: '10px' }}>
              {tests.map((test) => (
                <div
                  key={test.id}
                  style={{
                    border: '1px solid #ddd',
                    padding: '15px',
                    borderRadius: '5px',
                    cursor: 'pointer',
                    backgroundColor: '#f9f9f9',
                  }}
                  onClick={() => handleTestSelect(test)}
                >
                  <h3>{test.title}</h3>
                  <p>{test.description || 'No description'}</p>
                </div>
              ))}
            </div>
          )}
        </>
      ) : submitted ? (
        <div style={{ textAlign: 'center', marginTop: '20px' }}>
          <h2>Test Submitted ✓</h2>
          <div style={{ fontSize: '48px', fontWeight: 'bold', color: '#4CAF50', margin: '20px 0' }}>
            Score: {score !== null ? score.toFixed(2) : 'N/A'}%
          </div>
          <button onClick={handleBack} style={{ padding: '10px 20px', fontSize: '16px' }}>
            Back to Tests
          </button>
        </div>
      ) : (
        <>
          <h2>{selectedTest.title}</h2>
          <p>{selectedTest.description}</p>
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
                    marginBottom: '25px',
                    padding: '15px',
                    border: '1px solid #ddd',
                    borderRadius: '5px',
                    backgroundColor: '#fafafa',
                  }}
                >
                  <h4>Q{idx + 1}. {question.text}</h4>
                  <div style={{ marginLeft: '20px' }}>
                    {question.options.map((option, optIdx) => (
                      <label key={optIdx} style={{ display: 'block', marginBottom: '10px' }}>
                        <input
                          type="radio"
                          name={`question_${question.id}`}
                          checked={answers[question.id] === optIdx}
                          onChange={() => handleAnswerChange(question.id, optIdx)}
                        />
                        <span style={{ marginLeft: '8px' }}>{option}</span>
                      </label>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          )}

          <div style={{ marginTop: '20px', display: 'flex', gap: '10px' }}>
            <button onClick={handleBack} style={{ padding: '10px 20px', fontSize: '16px' }}>
              Back
            </button>
            <button
              onClick={handleSubmit}
              disabled={loading}
              style={{
                padding: '10px 20px',
                fontSize: '16px',
                backgroundColor: '#4CAF50',
                color: 'white',
                border: 'none',
                borderRadius: '5px',
                cursor: 'pointer',
              }}
            >
              {loading ? 'Submitting...' : 'Submit Test'}
            </button>
          </div>
        </>
      )}
    </div>
  );
};

export default MockTest;
