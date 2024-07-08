require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
const sequelize = require('./config/database');
const userRoutes = require('./routes/user');
const orgRoutes = require('./routes/organisation');

const app = express();
app.use(bodyParser.json());

app.use('/auth', userRoutes);
app.use('/api', orgRoutes);

app.use((err, req, res, next) => {
  res.status(422).json({
    errors: err.errors.map(error => ({
      field: error.path,
      message: error.message,
    })),
  });
});

sequelize.sync()
  .then(() => {
    app.listen(process.env.PORT || 3000, () => {
      console.log(`Server is running on port ${process.env.PORT || 3000}`);
    });
  })
  .catch(err => console.log(err));
