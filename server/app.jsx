import { Server } from 'http';
import Express from 'express';
import React from 'react';
import { renderToString } from 'react-dom/server';
import { StaticRouter as Router, matchPath, Link } from 'react-router';

import App from '../app/components/Main/Main';

const routes = [
  '/',
  '/login',
  '/register',
];

const app = new Express();

app.set('view engine', 'ejs');
app.set('views', 'views');
app.use(Express.static('public'));

app.get('*', (req, res) => {
  const match = routes.reduce((acc, route) => matchPath(req.url, route, { exact: true }) || acc, null);
  const context = {};
  if (!match) {
    return res.status(404).send(renderToString(<NotFoundPage />));
  }
  const markup = renderToString(
    <Router context={context} location={req.url}>
      <App />
    </Router>,
    );
  if (context.url) {
    return res.redirect(302, context.url);
  }
  return res.render('index', { markup });
});


const port = process.env.PORT || 3000;
const server = new Server(app);

server.listen(port, (err) => {
  if (err) {
    return false;
  }
  return true;
});


const NotFoundPage = () => (
  <div className="not-found">
    <h1>404</h1>
    <h2>Page not found!</h2>
    <p>
      <Link to="/">Go back to the main page</Link>
    </p>
  </div>
  )
;
