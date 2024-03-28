const fs = require('fs');
const pdfParse = require('pdf-parse');

async function extractTextFromPDF(pdfPath) {
  const pdfBuffer = fs.readFileSync(pdfPath);
  
  try {
    const data = await pdfParse(pdfBuffer);
    console.log(data.text)
    return data.text; // This contains the text of the PDF
  } catch (error) {
    console.error("Error extracting text from PDF:", error);
    return null;
  }
}



function processQA(text) {
  // Pattern to match the question number followed by the question text, 
  // and then the answer options starting with letters.
  const qaPattern = /(\d+\..*?)(?=\d+\.|$)/gs;
  let match;
  const qaList = [];

  while ((match = qaPattern.exec(text)) !== null) {
    // Split the question block into lines
    const lines = match[0].trim().split('\n');
    // The first line is the question
    const question = lines[0];
    // The rest are the answers
    const answers = lines.slice(1);
    // Initialize correctAnswer variable
    let correctAnswers = [];

    // Process each answer, looking for the one marked with an asterisk after the starting letter
    const processedAnswers = answers.map(answer => {
      // Check if the asterisk is present after the starting letter
      if (answer.includes('*')) {
        // Extract the correct answer by removing the asterisk and trimming whitespace
        correctAnswers.push(answer.replace('*', '').trim());
        // Return the answer without the asterisk for uniformity
        return answer.replace('*', '').trim();
      }
      return answer.trim();
    });

    // Add the question, processed answers, and the correct answer to the list
    qaList.push({ question, answers: processedAnswers, correctAnswers });
  }

  // Convert the qaList to a JSON string
  const jsonData = JSON.stringify(qaList, null, 2);

  // Write the JSON string to a file
  fs.writeFileSync('qaOutput.json', jsonData, 'utf8');

  return qaList;
}

  (async () => {
    const pdfText = await extractTextFromPDF('daco2.pdf');
    const qaList = processQA(pdfText);
    console.log(qaList);
  })();