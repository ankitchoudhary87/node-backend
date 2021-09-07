const ProductModel = require('../Models/ProductModel');
const CategoryModel = require('../Models/CategoryModel');
const slugify = require('slugify');
const path = require('path');
const fs = require('fs');

function createCategories(categories, parentId = null){
    const categoryList = [];
    let category;
    if(parentId == null){
        category = categories.filter(cat => cat.parentID == undefined);
    }else{
        category = categories.filter(cat => cat.parentID == parentId);
    }
    for(let cate of category){
        categoryList.push({
            _id: cate._id,
            name: cate.name,
            slug: cate.slug,
            children: createCategories(categories, cate._id)
        })
    }
    return categoryList;
}

exports.productList = (req, res) => {
    let sortby = req.params.sortcol;
    let sortvalue = req.params.sortval;
    let searchparams = req.params.searchkey;
    let searchp = {}
    if (searchparams && searchparams != '') {
        searchp = {
            $or: [
                { name: new RegExp(searchparams, "i") },
                { slug: new RegExp(searchparams, "i") }
            ]
        }
    } else {
        searchp = {}
    }
    // find all products and pass the searched criteria
    var query = ProductModel.find(searchp);
    // selecting the 'product name' and 'price' fields
    //query.select('name price');
    // limit our results to 5 items
    //query.limit(5);
    // sort by parameter passed from the frontend
    query.sort({ [sortby]: sortvalue });
    // execute the query at a later time
    query.exec( (err, productdata) => {
        if (err) {
            res.send({ message: err })
        } else {
            if (productdata) {
                res.send({ message: "product list fetched", productdata: productdata })
            } else {
                res.send({ message: "Data not found!" })
            }
        }
    })
}

exports.singleProductData = (req, res) => {
    const id = req.params.id;
    ProductModel.findById({ _id: id }, (err, productdata) => {
        if (err) {
            res.send({ message: err })
        } else {
            if (productdata) {
                res.send({ message: "product data fetched", productdata: productdata })
            } else {
                res.send({ message: "Product not found!" })
            }
        }
    })
}

exports.removeProduct = (req, res) => {
    const id = req.params.id;
    ProductModel.findById({ _id: id }, (err, data) => {
        if (err) {
            res.send({ message: err })
        } else {
            if (data) {
                /*if(data.image && data.image!==''){
                    let reqPath = path.join(__dirname, '../').replace(/\\/g, '/');
                    let filePathfinal = reqPath + 'login-and-register-frontend/public/category/' + data.image;
                }*/
                ProductModel.findByIdAndDelete({ _id: id }, (errnew) => {
                    if (errnew) {
                        res.send({ message: errnew })
                    } else {
                        /*if(data.image && data.image!==''){
                            fs.unlinkSync(filePathfinal);
                        }*/
                        res.send({ message: "Product deleted successfully!" })
                    }
                })
            } else {
                res.send({ message: "Product not found!" })
            }
        }

    })
}

exports.statusProduct = (req, res) => {
    const id = req.params.id;
    let statusval = '';
    ProductModel.findById({ _id: id }, (err, data) => {
        if (err) {
            res.send({ message: err })
        } else {
            if (data) {
                if (data.status === true) {
                    statusval = false;
                } else {
                    statusval = true;
                }
                let updatedproductdata = {
                    status: statusval
                }
                ProductModel.findOneAndUpdate({ _id: id }, updatedproductdata, { new: true }, (errnew, datanew) => {
                    if (errnew) {
                        res.send({ message: errnew })
                    } else {
                        res.send({ message: "Product status updated successfully", data: datanew });
                    }
                })
            } else {
                res.send({ message: "Product not found!" })
            }
        }

    })
}

exports.getSubcatListforDropdown = (req, res) => {
    CategoryModel.find({})
    .exec((error, categories) => {
        if(error){
            res.send({ message: error })
        }else{
            if(categories){
                const categoryList = createCategories(categories);
                res.send({ message: "category list fetched", catdata: categoryList })
            }
        }
    })
}