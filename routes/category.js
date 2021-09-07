const express = require('express');
const app = express.Router();

const {addCategory, removeCategory, statusCategory, listCategory, singleCategoryData, updateCategory, getSubcatName, listCategorynew, getSubcatListforDropdown, getSubcatListforDropdownTest} = require('../Controller/CategoryController');

app.route('/addCat').post(addCategory);
app.route('/getAllCategory/:sortcol/:sortval').get(listCategorynew);
app.route('/getAllCategory/:sortcol/:sortval/:searchkey').get(listCategorynew);
app.route('/singleCategory/:id').get(singleCategoryData);
app.route('/editCategory/:id').put(updateCategory);
app.route('/removeCat/:id').delete(removeCategory);
app.route('/changeStatus/:id').put(statusCategory);
app.route('/getSubcat/:parentID').get(getSubcatName);
//app.route('/getSubcatList').get(getSubcatListforDropdown);

app.route('/getSubcatList').get(getSubcatListforDropdownTest);

app.route('/getSubcatListTest').get(getSubcatListforDropdownTest);

module.exports = app;
