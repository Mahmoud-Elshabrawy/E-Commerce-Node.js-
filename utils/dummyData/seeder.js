const fs = require("fs");
const Product = require("../../models/productModel");
const dbConnection = require("../../config/database");
const dotenv = require("dotenv");
dotenv.config({ path: `${__dirname}/../../config.env` });

dbConnection();

const data = JSON.parse(fs.readFileSync(`${__dirname}/product.json`, "utf-8"));

const importData = async () => {
  try {
    await Product.create(data);
    console.log("Data Imported Successfully");
  } catch (err) {
    console.log(err);
  }
  process.exit();
};

const deleteData = async () => {
  try {
    await Product.deleteMany();
    console.log("Data Deleted Successfully");
  } catch (err) {
    console.log(err);
  }
  process.exit();
};

if(process.argv[2] === '-import') {
    importData()
} else if (process.argv[2] === '-delete') {
    deleteData()
}