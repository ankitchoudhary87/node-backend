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
//console.log(category);
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

exports.listCategorynew = async (req, res) => {
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
    await CategoryModel.find(searchp, async (err, user) => {
        if (err) {
            res.send({ message: err })
        } else {
            if (user) {
                let categoryList = [];
                for (let cate of user) {
                    var objcat = {};
                    var subcatname;
                    if (cate.parentID && cate.parentID !== '') {
                        //const subdata = await CategoryModel.find({ _id: cate.parentID }).select({ "name": 1, "_id": 0 });
                        await CategoryModel.find({ _id: cate.parentID }, (errnew, subdata) => {
                            const arrayToObject3 = Object.fromEntries(subdata.map(item => ["name", item.name]));
                            if (subdata) {
                                objcat = {
                                    _id: cate._id,
                                    name: cate.name,
                                    slug: cate.slug,
                                    status: cate.status,
                                    parentID: cate.parentID,
                                    image: cate.image,
                                    datecreated: cate.datecreated,
                                    subcatname: arrayToObject3
                                }
                                categoryList.push(objcat);
                            }
                        }).select({ "name": 1, "_id": 0 });
                    } else {
                        objcat = {
                            _id: cate._id,
                            name: cate.name,
                            slug: cate.slug,
                            status: cate.status,
                            parentID: cate.parentID,
                            image: cate.image,
                            datecreated: cate.datecreated,
                            subcatname: ''
                        }
                        categoryList.push(objcat);
                    }
                }
                res.send({ message: "category list fetched", catdata: categoryList })
            } else {
                res.send({ message: "Data not found!" })
            }
        }
    }).sort({ [sortby]: sortvalue })
}

exports.listCategory = (req, res) => {
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
    // find all athletes that play tennis
    var query = CategoryModel.find(searchp);
    // selecting the 'name' and 'age' fields
    //query.select('name age');
    // limit our results to 5 items
    //query.limit(5);
    // sort by age
    query.sort({ [sortby]: sortvalue });
    // execute the query at a later time
    query.exec(function (err, catdata) {
        if (err) {
            res.send({ message: err })
        } else {
            if (catdata) {
                //var categoryList = createCategories(catdata);
                res.send({ message: "category list fetched", catdata: catdata })
            } else {
                res.send({ message: "Data not found!" })
            }
        }
    })
}

exports.singleCategoryData = (req, res) => {
    const id = req.params.id;
    CategoryModel.findById({ _id: id }, (err, catdata) => {
        if (err) {
            res.send({ message: err })
        } else {
            if (catdata) {
                res.send({ message: "category data fetched", catdata: catdata })
            } else {
                res.send({ message: "Category not found!" })
            }
        }
    })
}

exports.addCategory = (req, res) => {
    const name = req.body.name;
    const parentID = req.body.parentID;
    let image = '';
    if (!req.body.dp || req.body.dp === '') {
        image = "";
    } else {
        var pp = req.files.dp;
        image = new Date().getTime() + '_' + pp.name;
    }
    let slug = slugify(req.body.name);
    CategoryModel.findOne({ slug: slug }, (err, data) => {
        if (err) {
            res.send({ message: err })
        } else {
            if (data) {
                res.send({ message: "Category Name already exist. Please enter another Category Name!" })
            } else {
                const catdata = new CategoryModel({
                    name,
                    slug
                })
                if(image && image!=='' && image!==undefined){
                    catdata.image = image
                }
                if(parentID && parentID!=='' && parentID!==undefined){
                    catdata.parentID = parentID
                }
                catdata.save((errnew) => {
                    if (errnew) {
                        res.send({ message: errnew })
                    } else {
                        if (!req.body.dp || req.body.dp === '') {
                            res.send({ message: "Category created Successfully." });
                        } else {
                            let reqPath = path.join(__dirname, '../').replace(/\\/g, '/');
                            pp.mv(reqPath + 'login-and-register-frontend/public/category/' + image, (errimg) => {
                                if (errimg) {
                                    res.send({ message: "Error while upload image" })
                                } else {
                                    res.send({ message: "Category created Successfully." });
                                }
                            })
                        }
                    }
                })
            }
        }

    })
}

exports.updateCategory = (req, res) => {
    const id = req.params.id;
    let image = '';
    if (req.body.dp && req.body.dp !== '') {
        image = req.body.dp;
    } else {
        var pp = req.files.dp;
        image = new Date().getTime() + '_' + pp.name;
    }
    const name = req.body.name;
    const parentID = req.body.parentID;
    let slug = slugify(req.body.name);

    CategoryModel.findOne({ _id: id }, (err, data) => {
        if (err) {
            res.send({ message: err })
        } else {
            if (data) {
                const catdata = {
                    name,
                    slug
                }
                if(image && image!=='' && image!=='undefined'){
                    catdata.image = image
                }
                if(parentID && parentID!=='' && parentID!=='undefined'){
                    catdata.parentID = parentID
                }
                CategoryModel.findOneAndUpdate({ _id: id }, catdata, { new: true }, (errnew, newdata) => {
                    if (errnew) {
                        res.send({ message: errnew })
                    } else {
                        if (req.body.dp && req.body.dp !== '') {
                            res.send({ message: "Category updated successfully", data: newdata });
                        } else {
                            let reqPath = path.join(__dirname, '../').replace(/\\/g, '/');
                            if(data.image && data.image!==''){
                                let filePathfinal = reqPath + 'login-and-register-frontend/public/category/' + data.image;
                                fs.unlinkSync(filePathfinal);
                            }                            
                            pp.mv(reqPath + 'login-and-register-frontend/public/category/' + image, (errimg) => {
                                if (errimg) {
                                    res.send({ message: "Error while upload image" })
                                } else {
                                    res.send({ message: "Category updated successfully", data: newdata });
                                }
                            })
                        }
                    }
                })
            } else {
                res.send({ message: "Data not found" })
            }
        }

    })
}

exports.removeCategory = (req, res) => {
    const id = req.params.id;
    CategoryModel.findById({ _id: id }, (err, data) => {
        if (err) {
            res.send({ message: err })
        } else {
            if (data) {
                if(data.image && data.image!==''){
                    let reqPath = path.join(__dirname, '../').replace(/\\/g, '/');
                    let filePathfinal = reqPath + 'login-and-register-frontend/public/category/' + data.image;
                }
                CategoryModel.findByIdAndDelete({ _id: id }, (errnew) => {
                    if (errnew) {
                        res.send({ message: errnew })
                    } else {
                        if(data.image && data.image!==''){
                            fs.unlinkSync(filePathfinal);
                        }
                        res.send({ message: "Category deleted successfully!" })
                    }
                })
            } else {
                res.send({ message: "Category not found!" })
            }
        }

    })
}

exports.statusCategory = (req, res) => {
    const id = req.params.id;
    let statusval = '';
    CategoryModel.findById({ _id: id }, (err, data) => {
        if (err) {
            res.send({ message: err })
        } else {
            if (data) {
                if (data.status === true) {
                    statusval = false;
                } else {
                    statusval = true;
                }
                let updatedcategorydata = {
                    status: statusval
                }
                CategoryModel.findOneAndUpdate({ _id: id }, updatedcategorydata, { new: true }, (errnew, datanew) => {
                    if (errnew) {
                        res.send({ message: errnew })
                    } else {
                        res.send({ message: "Category status updated successfully", data: datanew });
                    }
                })
            } else {
                res.send({ message: "Category not found!" })
            }
        }

    })
}

exports.getSubcatName = (req, res) => {
    const parentid = req.params.parentID;
    CategoryModel.findById({ _id: parentid }, (err, parentdata) => {
        if (err) {
            res.send({ message: err })
        } else {
            if (parentdata) {
                res.send({ message: "Subcategory found", subcatname: parentdata })
            } else {
                res.send({ message: "Subcategory not found" })
            }
        }
    }).select({ "name": 1, "_id": 0 })
}

exports.getSubcatListforDropdown = async (req, res) => {
    /*var query = CategoryModel.find({parentID:''});
    query.exec(function (err, catdata) {
        if (err) {
            res.send({ message: err })
        } else {
            if (catdata) {
                res.send({ message: "category list fetched", catdata: catdata })
            } else {
                res.send({ message: "Data not found!" })
            }
        }
    })*/
    await CategoryModel.find({}, async (err, user) => {
        if (err) {
            res.send({ message: err })
        } else {
            if (user) {
                let categoryList = [];
                for (let cate of user) {
                    var objcat = {};
                    if (cate.parentID && cate.parentID !== '') {
                        //const subdata = await CategoryModel.find({ _id: cate.parentID }).select({ "name": 1, "_id": 0 });
                        await CategoryModel.find({ _id: cate.parentID }, (errnew, subdata) => {
                            const arrayToObject4 = Object.fromEntries(subdata.map(item => ["parentname", item.name]));
                            if (subdata) {
                                objcat = {
                                    _id: cate._id,
                                    name: cate.name,
                                    slug: cate.slug,
                                    status: cate.status,
                                    parentID: cate.parentID,
                                    image: cate.image,
                                    datecreated: cate.datecreated,
                                    subcatname: arrayToObject4
                                }
                                categoryList.push(objcat);
                            }
                        }).select({ "name": 1, "_id": 0 });
                    } else {
                        objcat = {
                            _id: cate._id,
                            name: cate.name,
                            slug: cate.slug,
                            status: cate.status,
                            parentID: cate.parentID,
                            image: cate.image,
                            datecreated: cate.datecreated,
                            subcatname: { "parentname": "" }
                        }
                        categoryList.push(objcat);
                    }
                }
                res.send({ message: "category list fetched", catdata: categoryList })
            } else {
                res.send({ message: "Data not found!" })
            }
        }
    })
}

function Subcaterec(parentid = 0, submark = '') {
    var query = CategoryModel.find({ parentID: parentid });
    query.exec(function (err, catdata) {
        if (catdata) {

            return catdata
        }
    });
}

exports.getSubcatListforDropdownTest = (req, res) => {
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
