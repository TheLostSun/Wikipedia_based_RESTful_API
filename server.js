const express=require("express");
const bodyParser=require("body-parser");
const mongoose=require("mongoose");
const ejs=require("ejs");

const app=express();
mongoose.connect("mongodb://127.0.0.1:27017/wikiAPI");

app.use(express.static("public"));
app.use(bodyParser.urlencoded({extended:true}));
app.set('view engine','ejs');

const articleSchema=new mongoose.Schema({
    title:String,
    content:String
});

const Articles=mongoose.model("Item",articleSchema);

const REST=new Articles({
    title:"RESTful APIs",
    content:"REST is an arcitectural style for desigining APIs. It is the way/form that an API is created in. There are other architectectures as well like GraphQL, SOAP, FALCOR etc but REST is the most popular one!"
});
REST.save();

app.route('/articles')
  .get(function(req,res){
    Articles.find().then(function(foundArticles){
            console.log(foundArticles[0].title);
    })
})
  .post(function(req,res){
    const newArticle=new Articles({
        title:req.body.title,
        content:req.body.content
    });
    newArticle.save();
})
  .delete(function(){
    Articles.deleteMany().then(function(){console.log("Successfully deleted !");});
})
app.route("/articles/:title")
    .get(async function(req,res){
       const found=await Articles.findOne({title:req.params.title});
       if(found!==null)
            console.log("Article found "+ found.title);
        else
            console.log("Article not found!");
    })
    .put(async function(req,res){
        const found=await Articles.updateOne({title:req.params.title},{title:"Updated REST"});
       if(found!==null)
            console.log("Article found ");
        else
            console.log("Article not found!");
    })

app.listen(3000,function(){
    console.log("Server is running at port 3000");
});