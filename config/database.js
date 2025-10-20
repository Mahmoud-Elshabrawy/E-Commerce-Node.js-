const mongoose = require("mongoose");

const dbConnection = () => {
  mongoose
    .connect(process.env.DB_URI)
    .then((conn) => {
      console.log(`DB Connected Successfully: ${conn.connection.host}`);
    })
    .catch((err) => {
      console.log("Can't Connect to DB", err);
    });
};

module.exports = dbConnection