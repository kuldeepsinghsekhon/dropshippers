require('isomorphic-fetch');
const dotenv = require('dotenv');
const Koa = require('koa');
const next = require('next');
const { default: createShopifyAuth } = require('@shopify/koa-shopify-auth');
const { verifyRequest } = require('@shopify/koa-shopify-auth');
const session = require('koa-session');
var router = require('koa-router');
dotenv.config();
const _ = router();              //Instantiate the router

const port = parseInt(process.env.PORT, 10) || 3000;
const dev = process.env.NODE_ENV !== 'production';
const app = next({ dev });
const handle = app.getRequestHandler();

const { SHOPIFY_API_SECRET_KEY, SHOPIFY_API_KEY } = process.env;
//app.prepare().then(() => {
    const server = new Koa();
  server.use(session({ secure: true, sameSite: 'none' }, server));
  server.keys = [SHOPIFY_API_SECRET_KEY];
  var _ = router();              //Instantiate the router
_.get('/', getMessage);   // Define routes

function *getMessage() {
   this.body = "Hello world!";
};

server.use(_.routes());           //Use the routes defined using the router
//app.listen(3000)
  server.use(
    createShopifyAuth({
      apiKey: SHOPIFY_API_KEY,
      secret: SHOPIFY_API_SECRET_KEY,
      scopes: ['read_products'],
      afterAuth(ctx) {
        const { shop, accessToken } = ctx.session;

        ctx.redirect('/');
      },
    })
  );
  server.use(verifyRequest());
  // server.use(async (ctx) => {
  //   await handle(ctx.req, ctx.res);
  //   ctx.respond = false;
  //   ctx.res.body = "dfdsfs";
  //   return
  // });
  server.listen(port, () => {
    console.log(`> Ready on http://localhost:${port}`);
  });
//});
