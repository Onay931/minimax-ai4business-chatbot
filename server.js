const express = require('express');
const cors = require('cors');
const path = require('path');
const app = express();
const port = process.env.PORT || 3000;

// Environment variables
const DEEPSEEK_API_KEY = process.env.DEEPSEEK_API_KEY;
const DEEPSEEK_API_URL = "https://api.deepseek.com/v1/chat/completions";

// Middleware
app.use(express.json());
app.use(cors());

// Serve static files
app.use(express.static(path.join(__dirname)));

// API endpoint
app.post('/api/chat', async (req, res) => {
  try {
    const response = await fetch(DEEPSEEK_API_URL, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${DEEPSEEK_API_KEY}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        model: "deepseek-chat",
        messages: [
          { 
            role: "system", 
            content: `You are AI4BusinessGPT, a professional assistant for AI4Business South Africa.
                      Your role is to:
                      1. Provide accurate information about AI services
                      2. Promote custom AI solutions
                      3. Direct users to www.ai4business.coza
                      4. Maintain professional business tone
                      5. Focus on South African business needs`
          },
          { role: "user", content: req.body.query }
        ],
        temperature: 0.7,
        max_tokens: 500
      })
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(`API Error: ${response.status} - ${JSON.stringify(errorData)}`);
    }
    
    const data = await response.json();
    res.json({ response: data.choices[0].message.content });
  } catch (error) {
    console.error('API Error:', error);
    res.status(500).json({ 
      error: "API Error", 
      message: "I apologize, but I'm currently experiencing technical difficulties. Please contact us directly at info@ai4business.coza."
    });
  }
});

// Start server
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
  console.log(`Visit http://localhost:${port} to access the chatbot`);
});
