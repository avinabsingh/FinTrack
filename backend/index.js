require("dotenv").config();

const express = require("express");
const mongoose = require("mongoose");
const session = require("express-session");
const passport = require("passport");
const LocalStrategy = require("passport-local").Strategy;
const bcrypt = require("bcrypt");
const cors = require("cors");
const multer = require("multer");
const fs = require("fs");
const csv = require("csv-parser");
const Transaction = require("./models/Transaction");
const axios = require("axios");  
const User = require("./models/User");
const UploadedFile = require("./models/UploadedFile");
const { Parser } = require("json2csv");

const app = express();
const port = 8080;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(cors({
  origin: "http://localhost:5173",
  credentials: true
}));

app.use(session({
  secret: "fintracksecret",
  resave: false,
  saveUninitialized: false
}));

app.use(passport.initialize());
app.use(passport.session());


mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log("MongoDB connected"))
  .catch(err => console.log(err));



passport.use(new LocalStrategy(
  async (username, password, done) => {
    try {
      const user = await User.findOne({ username });

      if (!user) {
        return done(null, false, { message: "User not found" });
      }

      const isMatch = await user.comparePassword(password);

      if (!isMatch) {
        return done(null, false, { message: "Incorrect password" });
      }

      return done(null, user);

    } catch (err) {
      return done(err);
    }
  }
));

passport.serializeUser((user, done) => {
  done(null, user.id);
});

passport.deserializeUser(async (id, done) => {
  const user = await User.findById(id);
  done(null, user);
});

const upload = multer({
  dest: "uploads/",
  fileFilter: (req, file, cb) => {
    if (file.mimetype === "text/csv") {
      cb(null, true);
    } else {
      cb(new Error("Only CSV files allowed"), false);
    }
  }
});

function isAuthenticated(req, res, next) {
  if (req.isAuthenticated()) {
    return next();
  }
  return res.status(401).json({ message: "Unauthorized" });
}

app.post("/upload-csv", isAuthenticated, upload.single("file"), async (req, res) => {

  if (!req.file) {
    return res.status(400).json({ message: "No file uploaded" });
  }

  try {

    
    const uploadedFile = await UploadedFile.create({
      user: req.user._id,
      filename: req.file.originalname,
      path: req.file.path
    });

    const results = [];

    
    fs.createReadStream(req.file.path)
      .pipe(csv())
      .on("data", (data) => {
        if (!data.date || !data.category || !data.amount || !data.type) return;
        if (!["Income", "Expense"].includes(data.type)) return;

        results.push({
          user: req.user._id,
          file: uploadedFile._id,  
          date: new Date(data.date),
          category: data.category,
          amount: Number(data.amount),
          type: data.type
        });
      })
      .on("end", async () => {

        
        await Transaction.insertMany(results);

        res.status(200).json({
          message: "Transactions uploaded successfully",
          count: results.length
        });
      });

  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Upload failed" });
  }
});


// =======================
// ANALYTICS ROUTES
// =======================

app.get("/analysis/summary", isAuthenticated, async (req, res) => {
  try {
    const response = await axios.post(
      "http://127.0.0.1:8000/summary",
      { userId: req.user._id.toString() }
    );

    res.json(response.data);

  } catch (err) {
    console.error("SUMMARY ERROR:", err.response?.data || err.message);
    res.status(500).json({
      error: err.response?.data || err.message
    });
  }
});


app.get("/analysis/categories", isAuthenticated, async (req, res) => {
  try {
    const response = await axios.post(
      "http://127.0.0.1:8000/categories",
      { userId: req.user._id.toString() }
    );

    res.json(response.data);

  } catch (err) {
    console.error("CATEGORIES ERROR:", err.response?.data || err.message);
    res.status(500).json({
      error: err.response?.data || err.message
    });
  }
});


app.get("/analysis/stats", isAuthenticated, async (req, res) => {
  try {
    const response = await axios.post(
      "http://127.0.0.1:8000/stats",
      { userId: req.user._id.toString() }
    );

    res.json(response.data);

  } catch (err) {
    console.error("STATS ERROR:", err.response?.data || err.message);
    res.status(500).json({
      error: err.response?.data || err.message
    });
  }
});


app.post("/signup", async (req, res) => {
  try {
    const { username, password } = req.body;

    const existingUser = await User.findOne({ username });

    if (existingUser) {
      return res.status(400).json({ message: "User already exists" });
    }

    const newUser = new User({ username, password });

    await newUser.save();

    res.status(201).json({ message: "User registered successfully" });

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
});


app.post("/login",
  passport.authenticate("local"),
  (req, res) => {
    res.json({ message: "Login successful", user: req.user });
  }
);

app.get("/dashboard", (req, res) => {
  if (req.isAuthenticated()) {
    return res.json({ message: "Welcome to dashboard", user: req.user });
  }
  res.status(401).json({ message: "Not authenticated" });
});

app.get("/files", isAuthenticated, async (req, res) => {
  try {
    const files = await UploadedFile.find({ user: req.user._id })
      .sort({ uploadedAt: -1 });

    res.json(files);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to fetch files" });
  }
});


app.delete("/files/:id", isAuthenticated, async (req, res) => {
  try {
    const file = await UploadedFile.findOne({
      _id: req.params.id,
      user: req.user._id
    });

    if (!file) {
      return res.status(404).json({ message: "File not found" });
    }

    await Transaction.deleteMany({ file: file._id });

    if (fs.existsSync(file.path)) {
      fs.unlinkSync(file.path);
    }

    await UploadedFile.deleteOne({ _id: file._id });

    res.json({ message: "File and related transactions deleted successfully" });

  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Delete failed" });
  }
});

app.get("/download/transactions", isAuthenticated, async (req, res) => {
  try {
    const transactions = await Transaction.find(
      { user: req.user._id },
      { _id: 0, user: 0, file: 0 }
    );

    if (!transactions.length) {
      return res.status(400).json({ message: "No transactions found" });
    }

    const parser = new Parser();
    const csvData = parser.parse(transactions);

    res.header("Content-Type", "text/csv");
    res.attachment("transactions.csv");
    res.send(csvData);

  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Download failed" });
  }
});

app.get("/download/summary", isAuthenticated, async (req, res) => {
  try {
    const transactions = await Transaction.find({ user: req.user._id });

    if (!transactions.length) {
      return res.status(400).json({ message: "No transactions found" });
    }

    let income = 0;
    let expense = 0;

    transactions.forEach(t => {
      if (t.type === "Income") income += t.amount;
      if (t.type === "Expense") expense += t.amount;
    });

    const summary = {
      totalIncome: income,
      totalExpense: expense,
      savings: income - expense
    };

    res.header("Content-Type", "application/json");
    res.attachment("summary.json");
    res.send(JSON.stringify(summary, null, 2));

  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Download failed" });
  }
});




app.get("/logout", (req, res) => {
  req.logout(() => {
    res.json({ message: "Logged out successfully" });
  });
});

app.get("/auth-status", (req, res) => {
  if (req.isAuthenticated()) {
    return res.json({ authenticated: true, user: req.user });
  }
  res.json({ authenticated: false });
});



app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
