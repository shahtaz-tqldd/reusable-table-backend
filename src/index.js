const express = require('express');
const cors = require('cors');
const app = express();
const port = process.env.PORT || 5000;

// === MIDDLEWARE ===
app.use(cors());
app.use(express.json());

const userdata = require('../data.json');

function countGenders(userdata) {
  const genderCounts = {};

  for (const user of userdata) {
    const gender = user.gender;
    if (genderCounts[gender]) {
      genderCounts[gender]++;
    } else {
      genderCounts[gender] = 1;
    }
  }

  return genderCounts;
}

// Root route
app.get('/', (req, res) => {
  res.send('<h3>Table server is running...</h3>');
});

app.get('/users', (req, res) => {
  // Parse the "page" query parameter, default to page 1 if not provided
  const page = parseInt(req.query.page) || 1;
  const itemsPerPage = parseInt(req.query.itemsPerPage) || 10;

  // Calculate the start and end indices for the current page
  const startIndex = (page - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;

  // Slice the user data array based on the calculated indices
  const usersOnPage = userdata.slice(startIndex, endIndex);

  const genderCounts = countGenders(userdata);

  const summarizedGenderData = Object.keys(genderCounts).map(gender => ({
    gender,
    count: genderCounts[gender],
  }));

  // Prepare response object with paginated user data
  const response = {
    page: page,
    per_page: itemsPerPage,
    total: userdata.length,
    total_pages: Math.ceil(userdata.length / itemsPerPage),
    data: usersOnPage,
    summarizedGenders: summarizedGenderData,
  };

  res.send(response);
});

// Start server
app.listen(port, () => {
  console.log(`Table server is running on port: ${port}`);
});
