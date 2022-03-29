// dynamically adding the products to the database

require("dotenv").config();

const connectDB = require("./db/connect");
const Product = require("./models/product");

// json file with the list of products
const jsonProducts = require("./products.json");

const start = async () => {
  try {
    await connectDB(process.env.MONGO_URI);
    //deleting the existing products list
    await Product.deleteMany();
    //connecting to the json file with products
    await Product.create(jsonProducts);

    console.log("Success!!!");
    process.exit(0);
  } catch (error) {
    console.log(error);
    process.exit(1);
  }
};

start();
