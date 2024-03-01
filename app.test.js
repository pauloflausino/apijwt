// app.test.js
const request = require('supertest');
const app = require('./app');

/**Ao invés de banco estou usando um array de usuários emulando registros de um Database  */
const users = [
    {id: 1, username: 'user1', password: 'password1'},
    {id: 2, username: 'user2', password: 'password2'},
    {id: 3, username: 'usuario', password: 'senha'},
];


const authenticate = (username, password) => {
    const userAuth = users.find(u => u.username === username && u.password === password);
    return userAuth;
}

const generateToken = (user) => {
    const token = jwt.sign({ id: user.id, username: user.username}, process.env.SECRET)
    return token;
};

test('GET /users/:id', async () => {
    const response = await request(app).get('/users/1');
    expect(response.status).toBe(200);
    expect(response.body).toEqual({ id: '1', name: 'John Doe' });
});

test('GET ROUTE INDEX', async () => {
    const response = await request(app).get('');
    expect(response.status).toBe(200);
});

test('POST /login retorna token JWT para credenciais válidas', async () => {
    const response = await request(app).post('/login').send({ username: 'usuario', password: 'senha' });

    // Verifica se a resposta foi bem-sucedida (status 200)
    expect(response.status).toBe(200);

    // Verifica se a resposta contém um token JWT válido
    expect(response.body).toHaveProperty('access_token');
    const token = response.body.access_token;
    // Aqui você pode adicionar mais asserções para validar o token JWT, se necessário
});

// Teste para o endpoint de login com credenciais inválidas
test('POST /login retorna status 403 para credenciais inválidas', async () => {
    const response = await request(app)
      .post('/login')
      .send({ username: 'usuario', password: 'senhaerrada' })
      
       expect(response.status).toBe(403);
      
       expect(response.body.message).toBe('Credenciais inválidas');
      
  });
  
  // Teste para a rota protegida com token válido
  test('GET /recurso-protegido retorna mensagem de sucesso com token válido', async () => {
    const token = jwt.sign({ username: 'usuario' }, secretKey, { expiresIn: '1h' });
    await request(app)
      .get('/recurso-protegido')
      .set('Authorization', token)
      .expect(200)
      .then(response => {
        expect(response.body.message).toBe('Recurso protegido acessado com sucesso');
      });
  });
  
  // Teste para a rota protegida sem um token válido
  test('GET /recurso-protegido retorna status 403 sem token válido', async () => {
    await request(app)
      .get('/recurso-protegido')
      .expect(403)
      .then(response => {
        expect(response.body.message).toBe('Token não fornecido');
      });
  });

  test('LOGOUT', async () => {
    const response = await request(app).post('/logout');
    expect(response.status).toBe(200);
});