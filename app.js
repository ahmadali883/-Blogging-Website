const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const mongoose=require("mongoose");

const homeStartingContent = "Lacus vel facilisis volutpat est velit egestas dui id ornare. Semper auctor neque vitae tempus quam. Sit amet cursus sit amet dictum sit amet justo. Viverra tellus in hac habitasse. Imperdiet proin fermentum leo vel orci porta. Donec ultrices tincidunt arcu non sodales neque sodales ut. Mattis molestie a iaculis at erat pellentesque adipiscing. Magnis dis parturient montes nascetur ridiculus mus mauris vitae ultricies. Adipiscing elit ut aliquam purus sit amet luctus venenatis lectus. Ultrices vitae auctor eu augue ut lectus arcu bibendum at. Odio euismod lacinia at quis risus sed vulputate odio ut. Cursus mattis molestie a iaculis at erat pellentesque adipiscing.";
const aboutContent = "Hac habitasse platea dictumst vestibulum rhoncus est pellentesque. Dictumst vestibulum rhoncus est pellentesque elit ullamcorper. Non diam phasellus vestibulum lorem sed. Platea dictumst quisque sagittis purus sit. Egestas sed sed risus pretium quam vulputate dignissim suspendisse. Mauris in aliquam sem fringilla. Semper risus in hendrerit gravida rutrum quisque non tellus orci. Amet massa vitae tortor condimentum lacinia quis vel eros. Enim ut tellus elementum sagittis vitae. Mauris ultrices eros in cursus turpis massa tincidunt dui.";
const contactContent = "Scelerisque eleifend donec pretium vulputate sapien. Rhoncus urna neque viverra justo nec ultrices. Arcu dui vivamus arcu felis bibendum. Consectetur adipiscing elit duis tristique. Risus viverra adipiscing at in tellus integer feugiat. Sapien nec sagittis aliquam malesuada bibendum arcu vitae. Consequat interdum varius sit amet mattis. Iaculis nunc sed augue lacus. Interdum posuere lorem ipsum dolor sit amet consectetur adipiscing elit. Pulvinar elementum integer enim neque. Ultrices gravida dictum fusce ut placerat orci nulla. Mauris in aliquam sem fringilla ut morbi tincidunt. Tortor posuere ac ut consequat semper viverra nam libero.";

const app = express();


app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static("public"));


mongoose.connect("mongodb+srv://ahmadalik883:OAdgPVELU0OjIlmm@cluster0.z9igter.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0").then(() => console.log('Connected to MongoDB'))
.catch(err => console.error('Could not connect to MongoDB', err));


const postDb = mongoose.model('post', new mongoose.Schema(
  { 
  title: {
    type:String,
    unique:true,
    required:true
  },
  content:{
    type:String,
    required:true
  }
 }
)
);


const createPost = async (post) => {
  const newPost = new postDb(post);
  try {
      const result = await newPost.save();
      console.log('Post Created:', result);
  } catch (err) {
      console.error('Error creating post:', err);
  }
};


const getPosts = async () => {
  try {
      const posts = await postDb.find();
      console.log('Users:', posts);
      return  posts;
  } catch (err) {
      console.error('Error fetching users:', err);
  }
};
// await MyModel.findOne();






app.get('/',async (req,res)=>{
  //await createPost();
  let posts=await getPosts();
  res.render('home',{paragraph:homeStartingContent,allPosts:posts});
});
app.get('/about',(req,res)=>{
res.render('about',{paragraph:aboutContent})
})

app.get('/contact',(req,res)=>{
  res.render('contact',{paragraph:contactContent})
  })

app.get('/compose',(req,res)=>{
  
  res.render('compose');
})
app.post('/compose',(req,res)=>{
  let post=req.body;
  createPost(post);


  res.redirect("/")
})

app.get('/posts/:postName',async(req,res)=>{
  let posts=await getPosts();
  let post=posts.find(post=>req.params.postName==post.title)
  if(post){
    res.render("post",{post:post});
  }else{
    res.send("Post Not Found");
  }
      
})

app.listen(process.env.PORT || 3000, function() {
  console.log("Server started on port 3000");
});