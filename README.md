# OneClickToKnow API

## Déploiement

1. Configurez votre clé OpenAI dans `api-backend.js` ligne 7
2. Déployez sur Vercel : `vercel --prod`
3. Récupérez l'URL de déploiement
4. Configurez l'URL dans l'extension `background.js` ligne 3

## Endpoints

- `POST /api/explain` - Explique du texte
- `GET /api/health` - Status de l'API
