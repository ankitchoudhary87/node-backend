const express = require('express')
const app = express.Router();

const {productList, singleProductData, removeProduct, statusProduct, getSubcatListforDropdown, addProducts, updateProduct} = require('../Controller/ProductController');

//app.route('/addProduct').post(addProducts);
//app.route('/editProduct/:id').put(updateProduct);
app.route('/getAllProduct/:sortcol/:sortval').get(productList);
app.route('/getAllProduct/:sortcol/:sortval/:searchkey').get(productList);
app.route('/singleProduct/:id').get(singleProductData);
app.route('/removeProd/:id').delete(removeProduct);
app.route('/changeStatus/:id').put(statusProduct);
app.route('/getSubcatList').get(getSubcatListforDropdown);

/*
app.get('/register', (req, res) => {
    res.send("Signup API Called");
})
*/

module.exports = app;