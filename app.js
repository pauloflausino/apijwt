require("dotenv-safe").config(); 
var jwt = require('jsonwebtoken');

var http = require('http'); 
const express = require('express');
const app = express();
var cookieParser = require('cookie-parser'); 
const bodyParser = require('body-parser');

app.use(bodyParser.urlencoded({ extended: true })); 
app.use(bodyParser.json());
app.use(cookieParser()); 

const users = [
    {id: 1, username: 'user1', password: 'password1'},
    {id: 2, username: 'user2', password: 'password2'}
];

app.get('/', (req, res, next) => {
    res.json({message: "Tudo ok por aqui! APP funcionando!"});
})

const authenticate = (username, password) => {
    const userAuth = users.find(u => u.username === username && u.password === password);
    return userAuth;
}

const generateToken = (user) => {
    const token = jwt.sign({ id: user.id, username: user.username}, process.env.SECRET)
    return token;
};

//authentication
/*
app.post('/login', (req, res, next) => {
    //esse teste abaixo deve ser feito no seu banco de dados
    if(req.body.user === 'luizinho' && req.body.pwd === '123'){
      //auth ok
      const id = 1; //esse id viria do banco de dados
      var token = jwt.sign({ id }, process.env.SECRET, {
        expiresIn: 300 // expires in 5min
      });
      return res.json({ auth: true, token: token });
    }
    
    res.status(500).json({message: 'Login inválido!'});
})
*/

app.post('/login', (req, res, next) => {  

    if(!req.body.user || !req.body.pwd) {
        return res.status(400).json({ error: 'Bad Request'});
    }

    const user = authenticate(req.body.user, req.body.pwd);

    if(user) {
        const token = generateToken(user);
        return res.status(200).json({ access_token: token});
    }else {
        return res.status(403).json({ error: 'Forbidden'});
    }
});

var server = http.createServer(app); 
server.listen(3000);
console.log("Servidor escutando na porta 3000...")