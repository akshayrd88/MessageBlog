

//require packages:
var express=require("express"),
    app=express();
    mongoose=require("mongoose"),
    bodyParser=require("body-parser"),
    cors=require("cors"),
    jwt=require("jsonwebtoken");
    String.prototype.toObjectId = function() {
        var ObjectId = (require('mongoose').Types.ObjectId);
        return new ObjectId(this.toString());
      };

    


//mongodb config:    
mongoose.connect("mongodb://localhost/angular_blog");
var userSchema=mongoose.Schema({
username:String,
password:String
});
var postSchema=mongoose.Schema({
    postTitle:String,
    postDescription:String,
    postComments:[{comments:String}],
    likedBy:[],
    postLike:{type:Number,default:0}
});
var userModel=mongoose.model("userModel",userSchema);
var postModel=mongoose.model("postModel",postSchema);

app.use(bodyParser.urlencoded({extended:false}))
app.use(bodyParser.json());
// app.use(express.static('dist'))
app.use(cors({
    origin:'http://localhost:4200',
    optionsSuccessStatus:200
}));


//routes:
app.post("/register",function(req,res){
    console.log(req.body)
    var username=req.body.username;
    var password=req.body.password;
    var userContent={username:username,password:password};
    userModel.create(userContent,function(err,data){
        if(err)
        {
            console.log(err)
        }
        else{
            res.send(data)
            // console.log(data)
        }
    })
})
app.get("/postslist",function(req,res){
    postModel.find({},function(err,data){
        if(err)
        {
            console.log(err);
        }
        else{
            res.send(data);
            
        }
    })
})
app.get("/posts/:id",function(req,res){
    postModel.findById(req.params.id,function(err,data){
        if(err)
        {
            console.log(err);
            res.send(err)
        }
        else{
            res.send(data)
            // console.log(data)
        }
    })
    
})


app.post("/createpost",function(req,res){
    console.log(req.body);
    var title=req.body.title;
    var description=req.body.description;
    var postContent={postTitle:title,postDescription:description};
    postModel.create(postContent,function(err,data){
        if(err)
        {
            console.log(err)
        }
        else{
            res.send(data);
            // console.log(data);
        }
    })
})

app.get("/posts/edit/:id",function(req,res){
    postModel.findById(req.params.id,function(err,data){
        if(err)
        {
            console.log(err);
            res.send(err)
        }
        else{
            res.send(data)
            // console.log(data)
        }
    })
    
})

app.put("/posts/update/:id",function(req,res){
    
    var postTitle=req.body.title;
    var postDescription=req.body.description;
    var updateContent={postTitle:postTitle,postDescription:postDescription};
    
    postModel.findByIdAndUpdate(req.params.id,updateContent,function(err,data){
        if(err)
        {
            console.log(err);
            res.send(err)
        }
        else{
            if(data)
            {
                res.send({success:true})
            }
           
        }
    })
    
})

app.delete("/posts/delete/:id",function(req,res){
    
  postModel.findByIdAndRemove(req.params.id,function(err,data){
    if(err)
    {
        console.log(err);
    }
    else
    {
        if(data)
        {
            res.send({success:true})
        }
    }
  })
})
app.post("/comments/add/:id",function(req,res){
    var comments=req.body.comments;
    postModel.findByIdAndUpdate(req.params.id,{$push:{postComments:{comments:comments}}},function(err,data){
        if(err)
        {
            console.log(err);
        }
        else
        {
            res.send({success:true})
        }
    })
})

app.get("/comments/view/:id",function(req,res){
    postModel.findById(req.params.id,function(err,data){
        if(err)
        {
            console.log(err);
        }
        else{
            res.send(data)  
        }
    })
})
app.post("/listcomments/add/:id",function(req,res){
    var comments=req.body.comments;
    postModel.update({_id:req.body.id},{$push:{postComments:{comments:comments}}},function(err,data){
        if(err)
        {
            console.log(err);
        }
        else
        {
            res.send({success:true})
        }
    })
})
app.get("/viewcomments/list/:id",function(req,res){
    console.log(req.params.id);
    postModel.findById(req.params.id,function(err,data){
        if(err)
        {
            console.log(err)
        }
        else{
            res.send(data);
            // console.log(data)
        }
    })
})
app.post("/posts/likes/:id",function(req,res){
    var uname=req.body.user;
    postModel.findById(req.params.id,function(err,data){
        if(err)
        {
            console.log(err)
        }
        else if(!data.likedBy.includes(uname)){
                postModel.findByIdAndUpdate(req.params.id,{$push:{likedBy:uname}},function(err,likeData){
                    if(err){
                        console.log(err)
                    }
                    else{
                        // console.log(data);
                        
                        postModel.findById(req.params.id,function(err,ldata){
                            if(err)
                            {
                                console.log(err);
                            }
                            else{
                                res.send({data:ldata,likes:ldata.likedBy.length});
                            }
                        })
                        
                    }
                })
            }
            else{
                res.send({message:"duplicate",likes:data.likedBy.length})
                
            }
           
   
    })
   
})

app.post("/listposts/likes/:id",function(req,res){
    var uname=req.body.user;
    postModel.findById(req.params.id,function(err,data){
        if(err)
        {
            console.log(err)
        }
        else if(!data.likedBy.includes(uname)){
                postModel.findByIdAndUpdate(req.params.id,{$push:{likedBy:uname}},function(err,likeData){
                    if(err){
                        console.log(err)
                    }
                    else{
                        // console.log(data);
                        
                        postModel.findById(req.params.id,function(err,ldata){
                            if(err)
                            {
                                console.log(err);
                            }
                            else{
                                res.send({data:ldata,likes:ldata.likedBy.length});
                            }
                        })
                        
                    }
                })
            }
            else{
                res.send({message:"you have already liked the post",likes:data.likedBy.length})
            } 
    })
   
})




app.post("/login",function(req,res){
       
    var username=req.body.username;
    var password=req.body.password;
    var loginContent={username:username,password:password};
    var token=jwt.sign({
                email:req.body.email
                },
                "marlabs-secret-key",{expiresIn:'1h'},
            );
   
    userModel.findOne(loginContent,function(err,data){
        if(err)
            {
                console.log(err)
                res.send({isLoggedIn:false,
                    msg:"login failed"})
            }
            else if(data){
                res.send({isLoggedIn:true,
                    msg:"login successful",
                token:token,
                username:username,
                    data:data});
                // console.log(data)
                
            } 
    })      
      
})




//server port:
    app.listen(8080,function(){
        console.log("Server started!!")
    })
