const express = require('express');
const jwt = require('jsonwebtoken');
const session = require('express-session')
const customer_routes = require('./router/auth_users.js').authenticated;
const genl_routes = require('./router/general.js').general;
const { users } = require('./router/auth_users.js');

const app = express();

app.use(express.json());
const authenticatedUser = (username,password)=>{ //returns boolean
    //write code to check if username and password match the one we have in records.
        let validusers = users.filter((user) => {
            return (user.username === username && user.password === password);
        });
        // Return true if any valid user is found, otherwise false
        if (validusers.length > 0) {
            return true;
        } else {
            return false;
        }
    }
app.use("/customer",session({secret:"fingerprint_customer",resave: true, saveUninitialized: true}))

app.use("/customer/auth/*", function auth(req,res,next){
//Write the authenication mechanism here
    const username = req.body.username;
    const password = req.body.password;
    // Check if username or password is missing
    if (!username || !password) {
        return res.status(404).json({ message: "Error logging in" });
    }
    // Authenticate user
    if (authenticatedUser(username, password)) {
        // Generate JWT access token
        let accessToken = jwt.sign({
            data: password
        }, 'access', { expiresIn: 60 * 60 });
        // Store access token and username in session
        req.session.authorization = {
            accessToken, username
        }
        next()
    } else {
        return res.status(208).json({ message: "Invalid Login. Check username and password" });
    }
});
 
const PORT =5000;

app.use("/customer", customer_routes);
app.use("/", genl_routes);

app.listen(PORT,()=>console.log("Server is running"));
