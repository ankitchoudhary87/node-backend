const express = require('express')
//const conn  = require('../utils/dbConnection');
const app = express.Router();

const {createUser, loginUser, allUserList, singleUserDaata, userDelete, updateUser, changeUserStatus, forgotPassword} = require('../Controller/UserController');

app.route('/addUser').post(createUser);
app.route('/login').post(loginUser);
app.route('/userlist/:sortcol/:sortval').get(allUserList);
app.route('/userlist/:sortcol/:sortval/:searchkey').get(allUserList);
app.route('/userdata/:id').get(singleUserDaata);
app.route('/userdelete/:id').delete(userDelete);
app.route('/editUser/:userID').put(updateUser);
app.route('/changeStatus/:userID').put(changeUserStatus);
app.route('/forgot').post(forgotPassword);

/*
app.get('/register', (req, res) => {
    res.send("Signup API Called");
})
*/

module.exports = app;