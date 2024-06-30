const express = require("express");
const cors=require("cors")
const app = express();
app.use(express.json());
app.use(cors())
require("dotenv").config();
const sqlite3 = require("sqlite3");
const { open } = require("sqlite");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const path = require("path");
const { env } = require("process");
const dbPath = path.join(__dirname, "userReviews.db");
let db = null;

const initializeDbAndServer = async () => {
  try {
    // Open SQLite database connection
    db = await open({
      filename: dbPath,
      driver: sqlite3.Database,
    });

    // Create new tables
    // const createUsersTableQuery = `
    //   CREATE TABLE IF NOT EXISTS users (
    //     id INTEGER PRIMARY KEY AUTOINCREMENT,
    //     email TEXT UNIQUE NOT NULL,
    //     password TEXT NOT NULL,
    //     username TEXT NOT NULL
    //   );
    // `;

    // const createReviewsTableQuery = `
    //   CREATE TABLE IF NOT EXISTS reviews (
    //     id INTEGER PRIMARY KEY AUTOINCREMENT,
    //     rating INTEGER NOT NULL,
    //     description TEXT NOT NULL,
    //     username TEXT NOT NULL,
    //     email TEXT NOT NULL,
    //     brewery_id TEXT NOT NULL,
    //     brewery_name TEXT NOT NULL,
    //     FOREIGN KEY (username, email) REFERENCES users(username, email)
    //   );
    // `;

    // await db.exec(createUsersTableQuery);
    // await db.exec(createReviewsTableQuery);

    // Retrieve and log all table names
    const getTablesQuery = `
      SELECT name FROM sqlite_master WHERE type='table';
    `;
    const tables = await db.all(getTablesQuery);
    console.log("Tables in the database:", tables.map(table => table.name));
   

    // Start the server
    app.listen(3000, () => {
      console.log("Server is running...");
    });
  } catch (e) {
    console.log(`DB Error: ${e.message}`);
    process.exit(1);
  }
};

initializeDbAndServer();


// Registration endpoint
app.post("/register/", async (request, response) => {
  const { email, password, username } = request.body;

  // Check if the user already exists
  const selectUserQuery = `
    SELECT *
    FROM users
    WHERE email = ?;
  `;
  const dbUser = await db.get(selectUserQuery, email);

  if (dbUser !== undefined) {
    response.status(400).json({ error: "User already exists" });
  } else {
    // Validate password length
    if (password.length < 6) {
      response.status(400).json({ error: "Password is too short" });
    } else {
      // Hash the password and insert the user
      const hashedPassword = await bcrypt.hash(password, 10);
      const insertQuery = `
        INSERT INTO users (email, password, username)
        VALUES (?, ?, ?);
      `;
      await db.run(insertQuery, email, hashedPassword, username);
      response.json({ message: "User created successfully" });
    }
  }
});

// Login endpoint
app.post("/login/", async (request, response) => {
  const { email, password } = request.body;

  // Check if the user exists
  const selectUserQuery = `
    SELECT *
    FROM users
    WHERE email = ?;
  `;
  const dbUser = await db.get(selectUserQuery, email);

  if (dbUser === undefined) {
    response.status(400).json({ error: "You need to signup before login" });
  } else {
    // Verify the password
    const isCorrectPassword = await bcrypt.compare(password, dbUser.password);

    if (!isCorrectPassword) {
      response.status(400).json({ error: "Invalid password" });
    } else {
      // Generate and send JWT token on successful login
      const payload = { email: email, username: dbUser.username };
      // console.log(payload)
      const jwtToken = jwt.sign(payload, process.env.SECRET_KEY);
      response.status(200).json({ jwtToken });
    }
  }
});



// Get all users
app.get("/users", async (request, response) => {
  try {
    const getUsersQuery = `
      SELECT *
      FROM users;
    `;
    const users = await db.all(getUsersQuery);
    response.status(200).json(users);
  } catch (error) {
    response.status(500).json({ error: error.message });
  }
});



// Middleware to verify JWT token
const authenticateToken = (request, response, next) => {
  const authHeader = request.headers["authorization"];
  let jwtToken = null;

  if (authHeader !== undefined) {
    jwtToken = authHeader.split(" ")[1];

    jwt.verify(jwtToken, process.env.SECRET_KEY, (error, user) => {
      if (error) {
        response.status(401).send("Invalid JWT Token");
      } else {
        // Attach the user object to req
        request.user = user; 
        // console.log(user);  
        next();
      }
    });
  } else {
    response.status(401).send("Invalid JWT Token");
  }
};



const API_BASE_URL = 'https://api.openbrewerydb.org/v1/breweries';


// Get brewery details by ID
app.get('/brewery/:id', authenticateToken, async (req, res) => {
  const { id } = req.params;

  try {
    const response = await fetch(`${API_BASE_URL}/${id}`);
    if (!response.ok) {
      return res.status(response.status).json({ error: "Failed to fetch brewery details" });
    }
    const brewery = await response.json();
    res.json(brewery);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get average rating for a brewery by ID
app.get('/brewery/:id/average-rating', authenticateToken, async (req, res) => {
  const { id } = req.params;

  try {
    const getAverageRatingQuery = `
      SELECT AVG(rating) as averageRating
      FROM reviews
      WHERE brewery_id = ?;
    `;
    const result = await db.get(getAverageRatingQuery, id);

    if (result) {
      res.json({ averageRating: result.averageRating });
    } else {
      res.status(404).json({ error: "No reviews found for this brewery" });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});



// Search breweries by city
app.get('/breweries/by_city/:city', authenticateToken, async (req, res) => {
  const city = req.params.city;
  // console.log(city)
  const response = await fetch(`${API_BASE_URL}?by_city=${city}&per_page=10`);
  const breweries = await response.json();
  res.json(breweries);
});

// Search breweries by name
app.get('/breweries/by_name/:name', authenticateToken, async (req, res) => {
  const name = req.params.name;
  const response = await fetch(`${API_BASE_URL}?by_name=${name}&per_page=10`);
  const breweries = await response.json();
  res.json(breweries);
});

// Search breweries by type
app.get('/breweries/by_type/:type',authenticateToken, async (req, res) => {
  const type = req.params.type;
  const response = await fetch(`${API_BASE_URL}?by_type=${type}&per_page=10`);
  const breweries = await response.json();
  res.json(breweries);
});

app.post("/brewery/:id/review", authenticateToken, async (req, res) => {
  const { id } = req.params;
  const { rating, description } = req.body;
  const { email, username } = req.user;

  
  const response = await fetch(`https://api.openbrewerydb.org/v1/breweries/${id}`);
  const brewery = await response.json();
  const brewery_name = brewery.name;

  // Check if the user has already reviewed this brewery
  const checkReviewQuery = `
    SELECT * FROM reviews WHERE username = ? AND email = ? AND brewery_id = ?;
  `;
  const existingReview = await db.get(checkReviewQuery, username, email, id);

  if (existingReview) {
    // Update the existing review
    const updateReviewQuery = `
      UPDATE reviews
      SET rating = ?, description = ?
      WHERE username = ? AND email = ? AND brewery_id = ?;
    `;
    await db.run(updateReviewQuery, rating, description, username, email, id);
    res.json({ message: "Review updated successfully" });
  } else {
    // Insert a new review
    const insertReviewQuery = `
      INSERT INTO reviews (rating, description, username, email, brewery_id, brewery_name)
      VALUES (?, ?, ?, ?, ?, ?);
    `;
    await db.run(insertReviewQuery, rating, description, username, email, id, brewery_name);
    res.json({ message: "Review added successfully" });
  }
});


// Get all reviews for a specific brewery
app.get("/brewery/:id/reviews", authenticateToken, async (req, res) => {
  const { id } = req.params;
  //console.log(id)

  try {
    const getReviewsQuery = `
      SELECT *
      FROM reviews
      WHERE brewery_id = ?;
    `;
    const reviews = await db.all(getReviewsQuery, id);
    res.status(200).json(reviews);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});




// Get username from DB
app.get('/user', authenticateToken, (req, res) => {
  const { username } = req.user;  
  res.json({ username }); 
});
