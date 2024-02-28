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


/**Ao invés de banco estou usando um array de usuários emulando registros de um Database  */
const users = [
    {id: 1, username: 'user1', password: 'password1'},
    {id: 2, username: 'user2', password: 'password2'}
];


const authenticate = (username, password) => {
    const userAuth = users.find(u => u.username === username && u.password === password);
    return userAuth;
}

const generateToken = (user) => {
    const token = jwt.sign({ id: user.id, username: user.username}, process.env.SECRET)
    return token;
};

app.get('/', (req, res, next) => {
    res.json({message: "Tudo ok por aqui! APP funcionando!"});
})

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

app.post('/logout', function(req, res) {
    res.json({ auth: false, token: null });
})

var server = http.createServer(app); 
server.listen(3000);
console.log("Servidor escutando na porta 3000...")