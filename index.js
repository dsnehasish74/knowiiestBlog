const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require('mongoose');
mongoose.connect(process.env.DBURL, {useNewUrlParser: true, useUnifiedTopology: true } );

const postSchema={
    title:String,
    body:String
}

const Post = mongoose.model("post",postSchema);

const app = express();

const port= process.env.PORT || 3000;

app.set("view engine", "ejs");
app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static("public"));


app.get("/",function(req,res){
    Post.find({},function(err,posts){
        res.render("index",{blog:posts});
    })
})

app.get("/posts/:id",function(req,res){
    const id=req.params.id;
    Post.find({},function(err,posts){
        const fullpost=posts[id];
        console.log(fullpost);
        res.render("fullblog.ejs",{blog: fullpost,other:posts,id:id});
    })
})

app.get("/compose",function(req,res){
    res.render("compose.ejs");
})

app.post("/compose",function(req,res){

    let title=req.body.title;
    let blog=req.body.blog;
    const post = new Post({
        title: title,
        body:blog
    });
    post.save(function(err){
        if(!err){
            res.redirect("/");
        }
    });
})

app.listen(port,function(){
    console.log("The server is running at port 3000");
})
