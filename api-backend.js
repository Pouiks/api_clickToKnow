// Mini API Backend pour OneClickToKnow
// Déployez sur Vercel, Netlify, ou votre serveur

const express = require('express');
const cors = require('cors');
const app = express();

// Configuration
const OPENAI_API_KEY = 'sk-proj-VOTRE-CLE-ICI'; // Remplacez par votre vraie clé
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());

// Route pour expliquer du texte
app.post('/api/explain', async (req, res) => {
  try {
    const { text, language = 'fr' } = req.body;
    
    // Validation
    if (!text || text.trim().length === 0) {
      return res.status(400).json({ 
        error: 'Texte requis' 
      });
    }
    
    if (text.length > 1000) {
      return res.status(400).json({ 
        error: 'Texte trop long (max 1000 caractères)' 
      });
    }
    
    // Préparer le prompt
    const prompt = language.startsWith('fr') 
      ? `Expliquez ce que signifie le texte suivant de manière claire et concise : "${text}"`
      : `Explain what the following text means in a clear and concise way: "${text}"`;
    
    // Appeler OpenAI
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${OPENAI_API_KEY}`
      },
      body: JSON.stringify({
        model: 'gpt-3.5-turbo',
        messages: [
          {
            role: 'user',
            content: prompt
          }
        ],
        max_tokens: 300,
        temperature: 0.7
      })
    });
    
    if (!response.ok) {
      throw new Error(`OpenAI API error: ${response.status}`);
    }
    
    const data = await response.json();
    const explanation = data.choices[0].message.content;
    
    // Retourner la réponse
    res.json({
      success: true,
      explanation: explanation,
      originalText: text
    });
    
  } catch (error) {
    console.error('Erreur API:', error);
    res.status(500).json({
      error: 'Erreur lors de la génération de l\'explication',
      details: error.message
    });
  }
});

// Route de santé
app.get('/api/health', (req, res) => {
  res.json({ 
    status: 'OK', 
    service: 'OneClickToKnow API',
    timestamp: new Date().toISOString()
  });
});

// Route par défaut
app.get('/', (req, res) => {
  res.json({
    message: 'OneClickToKnow API',
    version: '1.0.0',
    endpoints: {
      explain: 'POST /api/explain',
      health: 'GET /api/health'
    }
  });
});

// Démarrer le serveur
app.listen(PORT, () => {
  console.log(`🚀 OneClickToKnow API démarrée sur le port ${PORT}`);
  console.log(`📍 http://localhost:${PORT}`);
});

module.exports = app;
