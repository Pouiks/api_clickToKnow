// Mini API Backend pour OneClickToKnow
// Déployez sur Vercel, Netlify, ou votre serveur

// Charger les variables d'environnement depuis .env (pour le développement local)
require('dotenv').config();

const express = require('express');
const cors = require('cors');
const app = express();

// Configuration
// ✅ Variable d'environnement
const OPENAI_API_KEY = process.env.OPENAI_API_KEY; // Remplacez par votre vraie clé
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());

// Route pour la politique de confidentialité
app.get('/privacy', (req, res) => {
  res.send(`
    <!DOCTYPE html>
    <html lang="fr">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Politique de Confidentialité - OneClickToKnow</title>
        <style>
            body {
                font-family: Arial, sans-serif;
                max-width: 800px;
                margin: 0 auto;
                padding: 20px;
                line-height: 1.6;
                background: #f5f5f5;
            }
            .container {
                background: white;
                padding: 30px;
                border-radius: 10px;
                box-shadow: 0 2px 10px rgba(0,0,0,0.1);
            }
            h1, h2 { color: #333; }
            h1 { color: #667eea; }
        </style>
    </head>
    <body>
        <div class="container">
            <h1>Politique de Confidentialité - OneClickToKnow</h1>
            <p><strong>Dernière mise à jour :</strong> 4 octobre 2025</p>
            
            <h2>1. Données collectées</h2>
            <p>Notre extension OneClickToKnow ne collecte aucune donnée personnelle identifiable.</p>
            
            <h2>2. Traitement du texte</h2>
            <p>Lorsque vous sélectionnez du texte et demandez une explication :</p>
            <ul>
                <li>Le texte sélectionné est envoyé temporairement à notre API</li>
                <li>Aucune donnée personnelle n'est transmise</li>
                <li>Le texte n'est pas stocké de manière permanente</li>
            </ul>
            
            <h2>3. Utilisation des données</h2>
            <p>Le texte sélectionné est uniquement utilisé pour générer une explication via l'IA.</p>
            
            <h2>4. Partage des données</h2>
            <p>Nous ne partageons aucune donnée avec des tiers.</p>
            
            <h2>5. Sécurité</h2>
            <p>Toutes les communications sont sécurisées via HTTPS.</p>
            
            <h2>6. Contact</h2>
            <p>Pour toute question : support@oneclicktoknow.com</p>
        </div>
    </body>
    </html>
  `);
});
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
