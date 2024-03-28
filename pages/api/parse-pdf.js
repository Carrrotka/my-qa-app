// pages/api/parse-pdf.js
import nextConnect from 'next-connect';
import multer from 'multer';
import fs from 'fs';
import pdfParse from 'pdf-parse';
const upload = multer({ dest: '/tmp' }); // Temporarily save files to /tmp
const handler = nextConnect();
async function processQA(text,name) {
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
    // pages/api/uploadPDF.js

    
  
    // Assuming you've processed the file and have the questions data
     // Your logic to process the uploaded file
  
    try {
        const { VercelKV, createClient } = require('@vercel/kv');
        require('dotenv').config();
        // Initialize Vercel KV with your namespace
        const kv = new createClient({ url: process.env.KV_REST_API_URL,token:process.env.KV_REST_API_TOKEN });
        await kv.set(name,jsonData)
      
    } catch (error) {
      console.error('Error storing questions in Vercel KV:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  
  
    return qaList;
  }


handler.use(upload.single('pdf'));

handler.post(async (req, res) => {
  try {
    const name = req.file.originalname.replace(".pdf","")
    console.log(req.file.path)
    const pdfBuffer = fs.readFileSync(req.file.path);
    const data = await pdfParse(pdfBuffer);
    // Process data.text to extract questions and answers
    processQA(data.text,name)
    // This part depends on the structure of your PDFs and how you want to extract Q&As
    //const questions = []; // Assume you've processed data.text to fill this array

    res.status(200);
  } catch (error) {
    console.error('Error parsing PDF:', error);
    console.log(req.file.path)
    console.error(req.file.path)
    res.status(500).send('Error parsing PDF');
  } finally {
    // Clean up: delete the temporarily saved file
    fs.unlinkSync(req.file.path);
  }
});

export const config = {
  api: {
    bodyParser: false, // Use multer for parsing multipart/form data
  },
};

export default handler;