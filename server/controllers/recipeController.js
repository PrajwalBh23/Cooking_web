require('../modules/database');
const Category = require('../modules/Category')
const Recipe = require('../modules/Recipe')


/**
 * Get / 
 * Homepage
 */

exports.homepage = async(req, res) => {
    
    try{

        const limiTNumber = 5;
        const categories = await Category.find({}).limit(limiTNumber); 
        const latest = await Recipe.find({}).sort({_id: -1}).limit(limiTNumber); 

        /*We get _id:-1 to get lastest ones means last ones*/

        const Indian = await Recipe.find({ 'category': 'Indian' }).limit(limiTNumber);
        const American = await Recipe.find({ 'category': 'American' }).limit(limiTNumber);
        const Thailand = await Recipe.find({ 'category': 'Thailand' }).limit(limiTNumber);
        const food = {Indian,latest,American,Thailand};

        res.render('index', { title:'Cooking Blog - Home',categories,food} );


    }catch(error){
        res.status(500).send({message: error.message || "Error occoured"})
    }
}


/**
 * Get / 
 * categories
 */

exports.exploreCategories = async(req, res) => {
    
    try{

        const limiTNumber = 20;
        const categories = await Category.find({}).limit(limiTNumber); 
        res.render('categories', { title:'Cooking Blog - Categories',categories} );
        
    }catch(error){
        res.status(500).send({message: error.message || "Error occoured"})
    }
}


/**
 * Get /recipe/:id
 * Recipe
 */

exports.exploreRecipe = async(req, res) => {
    
    try{

        let recipeId = req.params.id;
        const recipe = await Recipe.findById(recipeId)

        
        res.render('recipe', { title:'Cooking Blog - Recipe', recipe} );
        
    }catch(error){
        res.status(500).send({message: error.message || "Error occoured"})
    }
}



/**
 * Get / category/ :id
 * category by ID
 */

exports.exploreCategoriesById = async(req, res) => { 
    try {
      let categoryId = req.params.id;
      const limitNumber = 20;
      const categoryById = await Recipe.find({ 'category': categoryId }).limit(limitNumber);
      res.render('categories', { title: 'Cooking Blog - Categoreis', categoryById } );
    } catch (error) {
      res.status(500).send({message: error.message || "Error Occured" });
    }
} 
  
/**
 * Post / Search
 */

exports.searchRecipe = async(req, res) => { 
    
    try {
        
        let searchTerm = req.body.searchTerm;

        let recipe = await Recipe.find({ $text : {$search: searchTerm, $diacriticSensitive: true}});

        res.render('search', { title: 'Cooking Blog - Search', recipe } );
      } catch (error) {
        res.status(500).send({message: error.message || "Error Occured" });
      }
} 
  
/**
 * Explore latest
 */

exports.LatestRecipe = async(req, res) => { 
    
    try {
        
        const limiTNumber = 20;
        const recipe = await Recipe.find({}).sort({_id: -1}).limit(limiTNumber);

        res.render('latest', { title: 'Cooking Blog - Search', recipe } );
      } catch (error) {
        res.status(500).send({message: error.message || "Error Occured" });
      }
} 
  

/**
 * Showing random 
 */

exports.randomRecipe = async(req, res) => { 
    
    try {
        
        let count = await Recipe.find().countDocuments();
        let random = Math.floor(Math.random()*count);
        const recipe = await Recipe.findOne().skip(random).exec();

        res.render('randomRecipe', { title: 'Cooking Blog - Random Recipe', recipe } );
      } catch (error) {
        res.status(500).send({message: error.message || "Error Occured" });
      }
} 

/*
 * GET /submit-recipe
 * Submit Recipe
*/
exports.submitRecipe = async(req, res) => {
  const infoErrorsObj = req.flash('infoErrors');
  const infoSubmitObj = req.flash('infoSubmit');
  res.render('submitRecipe', { title: 'Cooking Blog - Submit Recipe', infoErrorsObj, infoSubmitObj  } );
}


/**
 * POST /submit-recipe
 * Submit Recipe
*/
exports.submitRecipeOnPost = async(req, res) => {
  try {

    let imageUploadFile;
    let uploadPath;
    let newImageName;

    if(!req.files || Object.keys(req.files).length === 0){
      console.log('No Files where uploaded.');
    } else {

      imageUploadFile = req.files.image;
      newImageName = Date.now() + imageUploadFile.name;

      uploadPath = require('path').resolve('./') + '/public/uploads/' + newImageName;

      imageUploadFile.mv(uploadPath, function(err){
        if(err) return res.status(500).send(err);
      })

    }

    const newRecipe = new Recipe({
      name: req.body.name,
      description: req.body.description,
      email: req.body.email,
      ingredients: req.body.ingredients,
      category: req.body.category,
      image: newImageName
    });
    
    await newRecipe.save();

    req.flash('infoSubmit', 'Recipe has been added.')
    res.redirect('/submitRecipe');
  } catch (error) {
    // res.json(error);
    req.flash('infoErrors', error);
    res.redirect('/submitRecipe');
  }
}


// Delete Recipe
// async function deleteRecipe(){
//   try {
//     await Recipe.deleteOne({ name: 'New Recipe From Form' });
//   } catch (error) {
//     console.log(error);
//   }
// }
// deleteRecipe();


// Update Recipe
// async function updateRecipe(){
//   try {
//     const res = await Recipe.updateOne({ name: 'New Recipe' }, { name: 'New Recipe Updated' });
//     res.n; // Number of documents matched
//     res.nModified; // Number of documents modified
//   } catch (error) {
//     console.log(error);
//   }
// }
// updateRecipe();





/* Use to save the data * of category in the database for first time */
// async function insertDynamicCategoryData(){
//     try{
//         await Category.insertMany([
//             {
//                 "name":"Thai",
//                 "image":"Indianfood.jpg"
//             },
//             {
//                 "name":"Thai",
//                 "image":"Indianfood.jpg"
//             },
//             {
//                 "name":"Thai",
//                 "image":"Indianfood.jpg"
//             },
//             {
//                 "name":"Thai",
//                 "image":"Indianfood.jpg"
//             },
//             {
//                 "name":"Thai",
//                 "image":"Indianfood.jpg"
//             },{
//                 "name":"Thai",
//                 "image":"Indianfood.jpg"
//             },
//         ]);
//     }catch(error){
//         console.log('err' , + error)
//     }
// }

// insertDynamicCategoryData();



/* Use to save the data * of Recipe in the database for first time */
// async function insertDynamicRecipeData(){
//     try{
//         await Recipe.insertMany([
//                   { 
//                     "name": "Mini pizzas",
//                     "description": `My mini pizzas are fantastic for those who struggle to get their kids to eat their veggies – the sauce is just brilliant because it’s jam-packed full of good stuff and the kids will never know! `,
//                     "ingredients": [
//                         "PIZZA DOUGH",
//                         "250 g strong white bread flour , or tipo 00, plus extra for dusting",
//                         "250 g wholemeal flour",
//                         "1 x 7 g sachet dried yeast",
//                         "fine semolina , for dusting",
//                         "HIDDEN VEG SAUCE",
//                         "1 onion",
//                         "100 g mushrooms",
//                         "1 stick of celery",
//                         "1 carrot",
//                         "1 clove of garlic",
//                         "3 sprigs of fresh oregano",
//                         "olive oil",
//                         "2 handfuls of baby spinach",
//                         "1 x 400 g tin of chopped tomatoes",
//                         "BASIC TOPPING",
//                         "2 x 125 g balls of mozzarella",
//                         "fresh oregano",
//                         "Parmesan cheese",
//                     ],
//                     "category": "American", 
//                     "image": "Mini pizzas.jpg"
//                   },
//                   { 
//                     "name": "Creamy rice pudding",
//                     "description": `You can top this pudding with any fresh fruit you like, mashed or whole, and occasionally I add a few small blobs of jam, too. I’ve used unsweetened almond milk here because my kids like the taste of it, but regular milk works just fine, too `,
//                     "ingredients": [
//                         "120 g risotto or pudding rice",
//                         "800 ml unsweetened almond milk , or regular milk, plus an extra splash",
//                         "4 tablespoons maple syrup or runny honey",
//                         "1 teaspoon vanilla paste , (or you can scrape out the seeds from a vanilla pod, if you have one)",
//                         "1 handful of blueberries",
//                         "1 ripe banana"
//                     ],
//                     "category": "American", 
//                     "image": "Creamy rice pudding.jpg"
//                   },
//                   { 
//                     "name": "Quick grilled pizza",
//                     "description": `YThere are so many variations on this wonderful dish – for me, it’s all about sumptuous fluffy rice with tang and seasoning. Classically there’d be some sort of smoky ribs or ham in the mix, but you can use the principle of this recipe to suit what you’ve got in the fridge and, of course, you can go veggie if you want to. It’s brilliant for embracing odds and ends from your veg drawer, and hopefully will help you to eat the rainbow. As with most stir-fries, this one is all in the prep, setting you up for fast and efficient cooking. You can absolutely make more portions, but it’s best to cook them no more than 2 portions at a time.  `,
//                     "ingredients": [
//                         "250 g strong bread flour",
//                         "2 teaspoons dried yeast",
//                         "1 teaspoon caster sugar",
//                         "olive oil",
//                         "2 cloves of garlic",
//                         "1 x 400 g tin of chopped tomatoes",
//                         "a few sprigs of fresh basil",
//                     ],
//                     "category": "American", 
//                     "image": "Quick grilled pizza.jpg"
//                   },
//                   { 
//                     "name": "Fried rice",
//                     "description": `There are so many variations on this wonderful dish – for me, it’s all about sumptuous fluffy rice with tang and seasoning. Classically there’d be some sort of smoky ribs or ham in the mix, but you can use the principle of this recipe to suit what you’ve got in the fridge and, of course, you can go veggie if you want to. It’s brilliant for embracing odds and ends from your veg drawer, and hopefully will help you to eat the rainbow. As with most stir-fries, this one is all in the prep, setting you up for fast and efficient cooking. You can absolutely make more portions, but it’s best to cook them no more than 2 portions at a time. `,
//                     "ingredients": [
//                         "150 g brown or basmati rice",
//                         "320 g crunchy veg , such as asparagus, baby corn, broccoli, leek, Chinese, red or white cabbage, pak choi, carrot",
//                         "1 clove of garlic",
//                         "2 cm piece of ginger",
//                         "1 large free-range egg",
//                         "olive oil",
//                         "1 chipolata",
//                         "1 rasher of smoked streaky bacon",
//                         "4 fresh or frozen raw peeled prawns",
//                         "1 teaspoon tikka paste",
//                         "1 tablespoon low-salt soy sauce",
//                         "1 teaspoon mixed seeds",
//                         "1 teaspoon chilli jam",
//                     ],
//                     "category": "American", 
//                     "image": "Fried rice.jpg"
//                   },
//                   { 
//                     "name": "Versatile veggie chilli",
//                     "description": `This is a hearty, delicious alternative to traditional chilli con carne that can be tweaked depending on what you have. Check out the tips below for inspiration. `,
//                     "ingredients": [
//                         "500 g sweet potatoes",
//                         "1 level teaspoon cayenne pepper , plus extra for sprinkling",
//                         "1 heaped teaspoon ground cumin , plus extra for sprinkling",
//                         "1 level teaspoon ground cinnamon , plus extra for sprinkling",
//                         "olive oil",
//                         "1 onion",
//                         "2 mixed-colour peppers",
//                         "2 cloves of garlic",
//                         "1 bunch of fresh coriander (30g)",
//                         "2 fresh mixed-colour chillies",
//                         "2 x 400 g tins of beans, such as kidney, chickpea, pinto, cannellini",
//                         "2 x 400 g tins of plum tomatoes",
//                         "lime or lemon juice, or vinegar , to taste",
//                     ],
//                     "category": "American", 
//                     "image": "Versatile veggie chilli.jpg"
//                   },
//                   { 
//                     "name": "Spicy squash soup",
//                     "description": `This spicy, warming and wholesome butternut squash soup is just what you need in winter `,
//                     "ingredients": [
//                         "1¼ litres organic chicken or vegetable stock",
//                         "6-7 lime leaves",
//                         "3 fresh red chillies , deseeded",
//                         "2 cloves garlic , peeled",
//                         "1 large thumb-sized piece fresh ginger , peeled",
//                         "3 sticks lemongrass , trimmed and squashed with the back of a knife",
//                         "sea salt",
//                         "freshly ground black pepper",
//                         "1 small bunch fresh coriander",
//                         "olive oil",
//                         "1 heaped teaspoon five-spice",
//                         "1 teaspoon ground cumin",
//                         "1 onion , peeled and finely sliced",
//                         "1 large butternut or acorn squash , halved, deseeded and cut into 1 inch chunks",
//                         "200 g basmati rice , washed",
//                         "2 x 400 ml tinned light coconut milk",
//                         "3-4 limes , juice of",
//                         "1 fresh red chilli , finely sliced, optional",
//                     ],
//                     "category": "American", 
//                     "image": "Spicy squash soup.jpg"
//                   },
//                 ]);
//     }catch(error){
//         console.log('err' , error)
//     }
// }

// insertDynamicRecipeData();