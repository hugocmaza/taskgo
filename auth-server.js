/*
 * Servidor de autenticación mínimo y autocontenido para el Módulo 15.
 * Usa SOLO json-server (ya instalado) — sin dependencias extra.
 *
 * Expone:
 *   POST /register  { email, password }  -> { accessToken, user }
 *   POST /login     { email, password }  -> { accessToken, user }
 *   /tasks (y demás recursos de db.json) con el CRUD normal de json-server.
 *
 * Nota didáctica: el token es un JWT "de mentira" (payload en base64, sin firma real).
 * Sirve para practicar el flujo (guardar token, interceptor, guard). En producción se
 * usa un proveedor real (OAuth/OIDC) y almacenamiento seguro para el token.
 *
 *   node auth-server.js
 */
const jsonServer = require('json-server');

const server = jsonServer.create();
const router = jsonServer.router('db.json');
const db = router.db; // instancia lowdb con datos de db.json

server.use(jsonServer.defaults());
server.use(jsonServer.bodyParser);

function fakeToken(user) {
  const payload = Buffer.from(
    JSON.stringify({ sub: user.id, email: user.email, exp: Date.now() + 3600_000 }),
  ).toString('base64');
  return `demo.${payload}.signature`;
}

server.post('/register', (req, res) => {
  const { email, password } = req.body || {};
  if (!email || !password) return res.status(400).jsonp({ error: 'Faltan email o contraseña' });
  if (db.get('users').find({ email }).value()) {
    return res.status(400).jsonp({ error: 'El email ya está registrado' });
  }
  const user = db.get('users').insert({ email, password }).write();
  return res.status(201).jsonp({ accessToken: fakeToken(user), user: { id: user.id, email } });
});

server.post('/login', (req, res) => {
  const { email, password } = req.body || {};
  const user = db.get('users').find({ email }).value();
  if (!user || user.password !== password) {
    return res.status(400).jsonp({ error: 'Email o contraseña incorrectos' });
  }
  return res.jsonp({ accessToken: fakeToken(user), user: { id: user.id, email } });
});

server.use(router);
server.listen(3000, '0.0.0.0', () => console.log('Auth API (json-server) escuchando en :3000'));
