const express = require('express');
const router = express.Router();
const auth_controller = require('../controllers/auth.controller');
const passport = require('passport');
const { ensureAuthenticated, forwardAuthenticated } = require('../config/auth');
var shopifyAPI = require('shopify-node-api');
var nonce = require('nonce')();
const cookie = require('cookie');

const {
  SHOPIFY_API_SECRET_KEY,
  SHOPIFY_API_KEY,
  HOST,
} = process.env;


router.get('/',forwardAuthenticated,function(req,res,next){
  const shop = req.query.shop;
      if (shop) {
        console.log(shop);
      var state=nonce();
      var Shopify = new shopifyAPI({
        shop: shop, // MYSHOP.myshopify.com
        shopify_api_key: SHOPIFY_API_KEY, // Your API key
        shopify_shared_secret: SHOPIFY_API_SECRET_KEY, // Your Shared Secret
        shopify_scope: 'write_products',
        redirect_uri: HOST+'/finish_auth',
        nonce:state , // you must provide a randomly selected value unique for each authorization request
      });
      res.cookie('state', state);
    var auth_url = Shopify.buildAuthURL();
    console.log(auth_url);
    res.redirect(auth_url);
    }else{
      return res.status(400).send('Missing shop parameter. Please add ?shop=your-development-shop.myshopify.com to your request');
    }
});
router.get('/finish_auth',forwardAuthenticated,function(req,res,next){
  const { shop, hmac, code, state } = req.query;
  const stateCookie = cookie.parse(req.headers.cookie).state;
  if (state !== stateCookie) {
    return res.status(403).send('Request origin cannot be verified');
  }
  var Shopify = new shopifyAPI({ shop: shop, // MYSHOP.myshopify.com
  shopify_api_key: SHOPIFY_API_KEY, // Your API key
  shopify_shared_secret: SHOPIFY_API_SECRET_KEY, // Your Shared Secret
  shopify_scope: 'write_products',
  redirect_uri: HOST+'/finish_auth',
  nonce: state}), // You need to pass in your config here
    query_params = req.query;
    console.log(query_params);
  Shopify.exchange_temporary_token(query_params, function(err, data){
    // This will return successful if the request was authentic from Shopify
    // Otherwise err will be non-null.
    // The module will automatically update your config with the new access token
    // It is also available here as data['access_token']
    console.log(data);
  });

  console.log('res');



  res.render('pages/public/home', {
                message:"Hello World",
                layout:'layout'
                })
});
module.exports = router;