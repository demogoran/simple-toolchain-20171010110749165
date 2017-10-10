const Cloudant = require('cloudant');
const util = require('util');
const settings={
    "username": "39e7e522-162e-424c-b9cd-ed467065804c-bluemix",
    "password": "0c4d93b1b4abaf6eb1d3a92bb589b0f9d54a6b36b0d469724d3ebcf269f196e8",
    "host": "39e7e522-162e-424c-b9cd-ed467065804c-bluemix.cloudant.com",
    "port": 443,
    "url": "https://39e7e522-162e-424c-b9cd-ed467065804c-bluemix:0c4d93b1b4abaf6eb1d3a92bb589b0f9d54a6b36b0d469724d3ebcf269f196e8@39e7e522-162e-424c-b9cd-ed467065804c-bluemix.cloudant.com"
}
const cloudant = Cloudant({account:settings.username, password:settings.password});
const imagesdb = cloudant.db.use('imagesdb');
imagesdb.update = function(obj, key, callback){
    const db = imagesdb;
    console.log(key);
    db.get(key, function (error, existing){ 
        if(!error) obj._rev = existing._rev;
        db.insert(obj, key, callback);
    });
}

module.exports.addNewImage=async (dataobj)=>{
    return await util.promisify(imagesdb.insert)(dataobj);
}
module.exports.getAllImages=async ()=>{
    let results=await util.promisify(imagesdb.list)({include_docs:true});
    return results.rows.map(x=>x.doc);
}
module.exports.getImageByID=async (id)=>{
    let results=await util.promisify(imagesdb.get)(id);
    console.log(results);
    return results;
}
module.exports.updateImageByID=async (data, id)=>{
    let results=await util.promisify(imagesdb.update)(data, id);
    console.log(results);
    return results;
}