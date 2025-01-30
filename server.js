import bodyParser from "body-parser";
import express from "express";
import pg from "pg";
import passport from "passport";
import bcrypt from "bcrypt";
import axios from "axios";
import session from "express-session";
import { Strategy } from "passport-local";
import env from "dotenv";

const app = express();
const port = 3000;
const { Client } = pg
env.config();






app.use(session(
  {
    secret:process.env.SESSION_SECRET,
    resave:false,
    saveUninitialized:true,
    
  }));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));



  app.use(passport.initialize());
  app.use(passport.session());


const db=new Client({
  user: process.env.DATABASE_USER,
  host: process.env.DATABASE_HOST,
  database: process.env.DATABASE_NAME, // Fixed here
  password: process.env.DATABASE_PWD,
  port: Number(process.env.DATABASE_PORT) || 5432,
  ssl: {
    rejectUnauthorized: false,  // ✅ Required for cloud PostgreSQL (e.g., Render)
  },
});


db.connect()
  .then(() => console.log("✅ Connected to PostgreSQL successfully"))
  .catch(err => console.error("❌ PostgreSQL connection error:", err));

app.get("/sign_up",async ( req,res)=>{
  res.render("sign_up.ejs");
})

app.get("/filter",(req,res)=>{
  if(req.isAuthenticated()){ 
    res.render("filter.ejs")
  }else{
    res.render("login.ejs")
  }
})


app.get("/add",(req,res)=>{
  res.render("add.ejs");
})

app.get("/home",(req,res)=>{
  res.render("home.ejs");
})


app.post("/filter",async(req,res)=>{
  const option=req.body.option;
  const startDate = req.body.startDate;
    const endDate = req.body.endDate;
    var category;
    const minAmount = req.body.minAmount;
    const maxAmount =req.body.maxAmount;
    
    try {
      if(option=="expense"){
        category=req.body.expenseOption;
      }else{
        category=req.body.incomeOption;
      }
      
      const response = await axios.get(`http://localhost:4000/filter?id=${req.user.id}&option=${option}&startDate=${startDate}&endDate=${endDate}&category=${category}&minAmount=${minAmount}&maxAmount=${maxAmount}`);
      
      res.render("fetch.ejs",{Name:req.user.name,Option:option,Response:response.data});
    }
      catch(err){
        console.log(err)
      }

})
 
app.get("/login", async (req, res) => {
    res.render("login.ejs");
  });



app.post("/", (req, res) => {
  const filterType = req.body.filterType || "all"; // Default to 'all' if not provided
  res.redirect(`/?filterType=${filterType}`);
});

app.get("/", async (req, res) => {
  if (req.isAuthenticated()) {
    const filterType = req.query.filterType || "all"; // Retrieve from query params
    const today = new Date();
    let startDate;
    let endDate;

    const params = [req.user.id];
    let query1 = "SELECT * FROM expenses WHERE user_id=$1";
    let query2 = "SELECT * FROM incomes WHERE user_id=$1";

    // Set dates based on the filterType
    if (filterType === "month") {
      startDate = new Date(today.getFullYear(), today.getMonth(), 1).toISOString().split("T")[0];
      endDate = new Date(today.getFullYear(), today.getMonth() + 1, 0).toISOString().split("T")[0];
    } else if (filterType === "year") {
      startDate = new Date(today.getFullYear(), 0, 1).toISOString().split("T")[0];
      endDate = new Date(today.getFullYear(), 11, 31).toISOString().split("T")[0];
    }

    if (startDate && endDate) {
      query1 += ` AND date >= $2 AND date < $3`;
      query2 += ` AND date >= $2 AND date < $3`;
      params.push(startDate, endDate);
    }

    try {
      const result1 = await db.query(query1, params);
      const result2 = await db.query(query2, params);
      const expense = result1.rows;
      const income = result2.rows;

      res.render("index.ejs", {
        Name: req.user.name,
        Expense: expense,
        Income: income,
        FilterType: filterType,
        startDate,
        endDate,
        Id: req.user.id,
        API:process.env.API
      });
    } catch (err) {
      console.error(err);
      res.status(500).send("Internal Server Error");
    }
  } else {
    res.redirect("/home");
  }
});


app.post("/sign_up", async (req, res) => {
  const name = req.body.name;
  const password = req.body.pwd;

  try {
    const existingUser = await db.query("SELECT * FROM users WHERE name=$1", [name]);
    if (existingUser.rows.length > 0) {
      res.send("<h1>Name already exists. Try a different name.</h1>");
    } else {
      bcrypt.hash(password, 10, async (err, hash) => {
        if (err) {
          console.log(err);
          res.status(500).send("Error hashing password");
        } else {
          await db.query("INSERT INTO users (name, pwd) VALUES ($1, $2)", [name, hash]);

          // Fetch the newly created user
          const result = await db.query("SELECT * FROM users WHERE name=$1", [name]);
          const user = result.rows[0];

          // Log in the user
          req.login(user, (err) => {
            if (err) {
              console.error(err);
              res.status(500).send("Error logging in");
            } else {
              res.redirect("/");
            }
          });
        }
      });
    }
  } catch (err) {
    console.error(err);
    res.status(500).send("Internal Server Error");
  }
});


app.post("/add",async(req,res)=>{
  const title=req.body.title[0];
  const id=req.user.id;
  const option=req.body.option;
  const date=req.body.title[1];
  if(option=="expense"){  
    const category=req.body.expenseOption;
  await db.query("INSERT INTO expenses(title,user_id,amount,date,category) VALUES($1,$2,$3,$4,$5)",[title,id,req.body.amount,date,category]);
  }else{
    const category=req.body.incomeOption;
    await db.query("INSERT INTO incomes(title,user_id,amount,date,category) VALUES($1,$2,$3,$4,$5)",[title,id,req.body.amount,date,category]);
  }
  res.redirect("/")
})

app.post("/delete/income",async(req,res)=>{
  try{
  const id=req.body.id;
  const result=await axios.delete(`http://localhost:4000/delete/income/${id}`);
   res.redirect("/");
  }catch(err){
    res.send(err);
  }
  
})



app.post("/delete/expense",async(req,res)=>{
  try{
  const id=req.body.id;
  const result=await axios.delete(`http://localhost:4000/delete/expense/${id}`);
   res.redirect("/");
  }catch(err){
    res.send(err);
  }
  
})

app.get("/logout", (req, res) => {
  req.logout(function (err) {
    if (err) {
      return next(err);
    }
    res.redirect("/");
  });
});


app.post(
  "/login",
  passport.authenticate("local", {
    successRedirect: "/",
    failureRedirect: "/login",
  })
);


passport.use("local",
  new Strategy({ usernameField: "name", passwordField: "pwd" },async function  verify(name,pwd,cb){
    
          try{
      const result=await db.query("SELECT * FROM users where name=$1 ",[name,])

      if(result.rows.length>0){
        const user = result.rows[0];
        const storedPassword = user.pwd;

        bcrypt.compare(pwd, storedPassword, function(err, result) {
    if(err){
      return cb(err);
    }   else{
    if(result){
      return cb(null,user)
    }else{
      return cb(null, false)
    }}
    });
        
      } else {
        return cb("User not found")
      }
    }catch(err){
      return cb(err);
    }


}))

passport.serializeUser((user,cb)=>{
   cb(null,user);
});

passport.deserializeUser((user,cb)=>{
  cb(null,user);
});

  app.listen(port, () => {
    console.log(`Server is running at http://localhost:${port}`);
  });