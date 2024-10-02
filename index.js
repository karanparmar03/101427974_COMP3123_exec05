const express = require('express');
const path = require('path');
const fs = require('fs');
const app = express();
const router = express.Router();

app.use(express.json()); // To parse JSON body data

/*
- Create new html file named home.html
- Add <h1> tag with message "Welcome to ExpressJs Tutorial"
- Return home.html page to client
*/
router.get('/home', (req, res) => {
  res.sendFile(path.join(__dirname, 'home.html'));
});

/*
- Return all details from user.json file to client as JSON format
*/
router.get('/profile', (req, res) => {
  fs.readFile(path.join(__dirname, 'user.json'), 'utf-8', (err, data) => {
    if (err) {
      return res.status(500).json({ message: 'Error reading user data' });
    }
    res.json(JSON.parse(data));
  });
});

/*
- Modify /login router to accept username and password as JSON body parameter
- Read data from user.json file
- Validate username and password and return respective response
*/
router.post('/login', (req, res) => {
  const { username, password } = req.body;
  fs.readFile(path.join(__dirname, 'user.json'), 'utf-8', (err, data) => {
    if (err) return res.status(500).json({ status: false, message: 'Server error' });
    const users = JSON.parse(data);
    const user = users.find(user => user.username === username);
    if (!user) return res.status(400).json({ status: false, message: 'User Name is invalid' });
    if (user.password !== password) return res.status(400).json({ status: false, message: 'Password is invalid' });
    res.json({ status: true, message: 'User Is valid' });
  });
});

/*
- Modify /logout route to accept username as parameter and display message in HTML format
*/
router.get('/logout/:username', (req, res) => {
  const { username } = req.params;
  res.send(`<b>${username} successfully logged out.</b>`);
});

/*
- Add error handling middleware to return a 500 page with message "Server Error"
*/
app.use((err, req, res, next) => {
  res.status(500).send('Server Error');
});

app.use('/', router);

app.listen(process.env.PORT || 8081, () => {
  console.log('Web Server is listening at port ' + (process.env.PORT || 8081));
});
