const UserModel = require('../Models/UserModel');
const asyncHandler = require('../utility/asyncHandler');
const bcrypt = require('bcrypt')
const saltRounds = 10;
const nodemailer = require('nodemailer');
var transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: 'paribaliyan2013',
        pass: 'AmP878513!@#'
    }
});

exports.createUser = async (req, res) => {
    const { f_name, l_name, email, phone, password, usertype } = req.body;
    const decryptedPass = await bcrypt.hash(password, saltRounds);
    UserModel.findOne({ email: email }, (err, user) => {
        if (err) {
            res.send({ message: err })
        } else {
            if (user) {
                res.send({ message: "User already registerd. Please use another email!" })
            } else {
                const userdata = new UserModel({
                    first_name: f_name,
                    last_name: l_name,
                    email: email,
                    phone: phone,
                    password: decryptedPass,
                    user_type: usertype
                })
                userdata.save((errnew) => {
                    if (errnew) {
                        res.send({ message: errnew })
                    } else {
                        res.send({ message: "User Successfully Registered." });
                    }
                })
            }
        }
    })
}

exports.loginUser = async (req, res) => {
    const { email, password } = req.body;
    UserModel.findOne({ email: email }, async (err, user) => {
        if (err) {
            res.send({ message: err })
        } else {
            if (user) {
                if (user.status == true) {
                    const comparison = await bcrypt.compare(password, user.password);
                    if (comparison) {
                        res.send({ message: "Login Successfully", user: user })
                    } else {
                        res.send({ message: "Password didn't match" })
                    }
                } else {
                    res.send({ message: "Account is not Active Yet. Please contact Administrator!" })
                }
            } else {
                res.send({ message: "User not registered!" })
            }
        }
    })
}

exports.allUserList = (req, res) => {
    let sortby = req.params.sortcol;
    let sortvalue = req.params.sortval;
    let searchparams = req.params.searchkey;
    let searchp = {}
    if (searchparams && searchparams != '') {
        searchp = {
            $or: [
                { first_name: new RegExp(searchparams, "i") },
                { last_name: new RegExp(searchparams, "i") },
                { email: new RegExp(searchparams, "i") },
                { phone: new RegExp(searchparams, "i") }
            ]
        }
    } else {
        searchp = {}
    }
    //console.log(searchp)
    UserModel.find(searchp, (err, userdata) => {
        if (err) {
            res.send({ message: err })
        } else {
            if (userdata) {
                res.send({ message: "user list fetched", userdata: userdata })
            } else {
                res.send({ message: "Data not found!" })
            }
        }
    }).sort({ [sortby]: sortvalue })
}

exports.singleUserDaata = (req, res) => {
    const userid = req.params.id;
    UserModel.findById({ _id: userid }, (err, userdata) => {
        if (err) {
            res.send({ message: err })
        } else {
            if (userdata) {
                res.send({ message: "user data fetched", userdata: userdata })
            } else {
                res.send({ message: "User not found!" })
            }
        }
    })
}

exports.userDelete = (req, res) => {
    const userid = req.params.id;
    UserModel.findById({ _id: userid }, (err, userdata) => {
        if (err) {
            res.send({ message: err })
        } else {
            if (userdata) {
                UserModel.findByIdAndDelete({ _id: userid }, (errnew, docs) => {
                    if (errnew) {
                        res.send({ message: errnew })
                    } else {
                        res.send({ message: "user deleted successfully" })
                    }
                });
            } else {
                res.send({ message: "User not found!" })
            }
        }
    })
}



exports.updateUser = (req, res) => {
    let decryptedPass = '';
    const userid = req.params.userID;
    const { f_name, l_name, email, phone, usertype, password } = req.body;
    UserModel.findById({ _id: userid }, async (err, userdata) => {
        if (err) {
            res.send({ message: err })
        } else {
            if (userdata) {
                if (password && password !== '') {
                    decryptedPass = await bcrypt.hash(password, saltRounds);
                } else {
                    decryptedPass = userdata.password;
                }
                let updateduserdata = {
                    first_name: f_name,
                    last_name: l_name,
                    email: email,
                    phone: phone,
                    password: decryptedPass,
                    user_type: usertype
                }
                UserModel.findOneAndUpdate({ _id: userid }, updateduserdata, { new: true }, (errnew, result) => {
                    if (errnew) {
                        res.send({ message: errnew })
                    } else {
                        res.send({ message: "user updated successfully", data: result });
                    }
                })
            } else {
                res.send({ message: "User not found!" })
            }
        }
    })
}


exports.changeUserStatus = (req, res) => {
    const userid = req.params.userID;
    let statusval = '';
    UserModel.findById({ _id: userid }, (err, userdata) => {
        if (err) {
            res.send({ message: err })
        } else {
            if (userdata) {
                if (userdata.status === true) {
                    statusval = false;
                } else {
                    statusval = true;
                }
                let updateduserdata = {
                    status: statusval
                }
                UserModel.findOneAndUpdate({ _id: userid }, updateduserdata, { new: true }, (errnew, result) => {
                    if (errnew) {
                        res.send({ message: errnew })
                    } else {
                        res.send({ message: "user status updated successfully", data: result });
                    }
                })
            } else {
                res.send({ message: "User not found!" })
            }
        }
    })
}

exports.forgotPassword = async (req, res) => {
    const { email } = req.body;
    UserModel.findOne({ email: email }, async (err, user) => {
        if (err) {
            res.send({ message: err })
        } else {
            if (user) {
                if (user.status == true) {
                    const r = (Math.random() + 1).toString(36).substring(5);
                    const decryptedPass = await bcrypt.hash(r, saltRounds);
                    let updatedpassword = {
                        password: decryptedPass
                    }
                    UserModel.findOneAndUpdate({ _id: user._id }, updatedpassword, { new: true }, (errnew, result) => {
                        if (errnew) {
                            res.send({ message: errnew })
                        } else {
                            // Send Password to registedred Email ID
                            var mailOptions = {
                                from: 'no-reply@gmail.com',
                                to: user.email,
                                // to: 'myfriend@yahoo.com, myotherfriend@yahoo.com',
                                subject: 'Forgot Password - Node App',
                                //text: 'That was easy!'
                                html: '<p>Hello, Please find the new password below:<br>' + r + '</p>'
                            };
                            // Sent Email
                            transporter.sendMail(mailOptions, function(errorlatest, info){
                                if (errorlatest) {
                                    res.send({ message: errorlatest.response })
                                } else {
                                  res.send({ message: "New Password sent to your registered email address. Please check your email.", data: result });
                                }
                            });
                        }
                    })
                } else {
                    res.send({ message: "Account is not Active Yet. Please contact Administrator!" })
                }
            } else {
                res.send({ message: "User not registered!" })
            }
        }
    })
}