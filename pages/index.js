import React, { useState, useEffect } from 'react';
// Assuming the styles object is already defined as per the provided context
const styles = {
  fileList: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    margin: '20px 0',
  },
  fileItem: {
    background: '#ffffff',
    padding: '10px 20px',
    margin: '5px 0',
    borderRadius: '5px',
    cursor: 'pointer',
    boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    transition: 'transform 0.2s, box-shadow 0.2s',
  },
  fileIcon: {
    marginRight: '10px',
  },
  container: {
    fontFamily: "'Arial', sans-serif",
    maxWidth: '600px',
    margin: '0 auto',
    padding: '20px',
    textAlign: 'center',
  },
  question: {
    background: '#f9f9f9',
    padding: '15px',
    borderRadius: '8px',
    boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
    margin: '20px 0',
  },
  answerList: {
    listStyleType: 'none',
    padding: 0,
  },
  answerItem: {
    background: '#fff',
    padding: '10px 15px',
    margin: '5px 0',
    borderRadius: '5px',
    cursor: 'pointer',
    boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
    transition: 'transform 0.2s',
  },
  correctAnswer: {
    color: '#4CAF50',
    fontWeight: 'bold',
  },
  incorrectAnswer: {
    color: '#FF0000',
    fontWeight: 'bold',
  },
  button: {
    padding: '10px 20px',
    margin: '10px',
    border: 'none',
    borderRadius: '5px',
    background: '#007bff',
    color: '#fff',
    cursor: 'pointer',
    transition: 'background-color 0.2s',
  },
  disabledButton: {
    background: '#ccc',
  },
};


// Assuming styles are already defined

export default function Home() {
  const [files, setFiles] = useState([]);
  const [selectedFile, setSelectedFile] = useState('');
  const [questions, setQuestions] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState([]);
  const [correctness, setCorrectness] = useState({});
  const [,forceUpdate] = useState();
  const fetchFiles = () => {
    fetch('/api/list')
      .then(res => res.json())
      .then(setFiles);

  };
  function reloadComponent(){
    forceUpdate({})
  }
  const uploadPDF = async () => {
    const fileInput = document.getElementById('pdfUpload');
    const file = fileInput.files[0];
    if (file) {
      const formData = new FormData();
      formData.append('pdf', file);
  
      try {
        const response = await fetch('/api/parse-pdf', {
          method: 'POST',
          body: formData,
        });
        const questions = await response.json();
        console.log(questions); // Do something with the questions
      } catch (error) {
        console.error('Error uploading PDF:', error);
      }
    }
    reloadComponent()
  };
  useEffect(() => {
    // Fetch the list of files
    fetchFiles();
  }, []);

  useEffect(() => {
    if (selectedFile) {
      // Fetch questions from the selected file
      fetch(`/api/questions?file=${selectedFile}`)
        .then(res => res.json())
        .then(data => {
          setQuestions(data);
          setCurrentIndex(0); // Reset to the first question
        });
    }
  }, [selectedFile]);

  
  // Function to handle random question selection
  const handleRandomQuestion = () => {
    if (questions.length > 0) {
      const randomIndex = Math.floor(Math.random() * questions.length);
      setCurrentIndex(randomIndex);
    }
  };

  // Function to handle back to file selection
  // Function to handle back to file selection
const handleBackToFileSelection = () => {
  setSelectedFile('');
  setQuestions([]); // Reset questions to an empty array
  setCurrentIndex(0); // Optionally reset the current index to 0
};
const handleAnswerSelect = (answer) => {
  // Toggle the selected state of the answer
  if (selectedAnswers.includes(answer)) {
    setSelectedAnswers(selectedAnswers.filter(a => a !== answer));
    // Remove the answer's correctness state if it's deselected
    const updatedCorrectness = { ...correctness };
    delete updatedCorrectness[answer];
    setCorrectness(updatedCorrectness);
  } else {
    setSelectedAnswers([...selectedAnswers, answer]);
    // Immediately check if the selected answer is correct and update the correctness state
    const isCorrect = currentQA.correctAnswers.includes(answer);
    setCorrectness({ ...correctness, [answer]: isCorrect });
  }
};
  // Ensure currentQA is defined before trying to access its properties
  const currentQA = questions && questions.length > 0 ? questions[currentIndex] : null;

  return (
    <div style={styles.container}>
      {/* Conditionally render the list of files only if no file has been selected */}
      {!selectedFile && (
        <div style={styles.fileList}>
          <h2>Files</h2>
          <ul>
            {files.map((file, index) => (
              <li key={index} style={styles.fileItem} onClick={() => setSelectedFile(file)}>
                {file}
              </li>
            ))}
          </ul>
<div>
  <input type="file" id="pdfUpload" accept="application/pdf" />
  <button onClick={uploadPDF}>Upload PDF</button>
  
  
</div>
        </div>
      )}
  
      {currentQA ? (
        <>
          <div style={styles.question}>
            <h1>{currentQA.question}</h1>
          </div>
          <ul style={styles.answerList}>
          {currentQA.answers.map((answer, index) => (
  <li
    key={index}
    style={{
      ...styles.answerItem,
      ...(correctness[answer] === true ? styles.correctAnswer : correctness[answer] === false ? styles.incorrectAnswer : {}),
    }}
    onClick={() => handleAnswerSelect(answer)}
  >
    {answer}
  </li>
))}
          </ul>
          <button
            onClick={() => setCurrentIndex(Math.max(currentIndex - 1, 0))}
            disabled={currentIndex === 0}
            style={{ ...styles.button, ...(currentIndex === 0 ? styles.disabledButton : {}) }}
          >
            Previous
          </button>
          <button
            onClick={() => setCurrentIndex(Math.min(currentIndex + 1, questions.length - 1))}
            disabled={currentIndex === questions.length - 1}
            style={{ ...styles.button, ...(currentIndex === questions.length - 1 ? styles.disabledButton : {}) }}
          >
            Next
          </button>
          <button onClick={handleRandomQuestion} style={styles.button}>
            Random
          </button>
          {/* Button for going back to file selection */}
          <button onClick={handleBackToFileSelection} style={styles.button}>
            Back to Files
          </button>
        </>
      ) : (
        <p>No questions available or selected question set is empty.</p>
      )}

      
    </div>
    
  );
      }