const express = require('express');
const router = express.Router();
const auth_controller = require('../controllers/auth.controller');
const passport = require('passport');
const { ensureAuthenticated, forwardAuthenticated } = require('../config/auth');
var shopifyAPI = require('shopify-node-api');
const {
  SHOPIFY_API_SECRET_KEY,
  SHOPIFY_API_KEY,
  HOST,
} = process.env;

var Shopify = new shopifyAPI({
  shop: 'MYSHOP', // MYSHOP.myshopify.com
  shopify_api_key: SHOPIFY_API_KEY, // Your API key
  shopify_shared_secret: SHOPIFY_API_SECRET_KEY, // Your Shared Secret
  shopify_scope: 'write_products',
  redirect_uri: HOST+'/finish_auth',
  nonce: '' // you must provide a randomly selected value unique for each authorization request
});
router.get('/',forwardAuthenticated,function(req,res,next){
  var auth_url = Shopify.buildAuthURL();

res.redirect(auth_url);
 
});
router.get('/finish_auth',forwardAuthenticated,function(req,res,next){
  console.log(req);
  console.log('res');
  console.log(res);


  res.render('pages/public/home', {
                message:"Hello World",
                layout:'layout'
                })
});
module.exports = router;