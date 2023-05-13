const express = require('express');
const router = express.Router();
const recipeCONTROLLER = require('../controllers/recipeController')

/*
* App routes different pages
*/
router.get('/', recipeCONTROLLER.homepage);
router.get('/recipe/:id', recipeCONTROLLER.exploreRecipe);
router.get('/categories', recipeCONTROLLER.exploreCategories);
router.get('/categories/:id', recipeCONTROLLER.exploreCategoriesById);
router.post('/search', recipeCONTROLLER.searchRecipe);
router.get('/latest', recipeCONTROLLER.LatestRecipe);
router.get('/randomRecipe', recipeCONTROLLER.randomRecipe);
router.get('/submitRecipe', recipeCONTROLLER.submitRecipe);
router.post('/submitRecipe', recipeCONTROLLER.submitRecipeOnPost);

module.exports = router;