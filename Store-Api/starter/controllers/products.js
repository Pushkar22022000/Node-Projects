const Product = require("../models/product");

// this is just for testing purposes
const getAllProductsStatic = async (req, res) => {
  const products = await Product.find({ price: { $gt: 30 } })
    .sort("price")
    .select("name price");
  res.status(200).json({ products, nbHits: products.length });
};

// main
const getAllProducts = async (req, res) => {
  const { featured, company, name, sort, fields, numericFilters } = req.query;
  // setup for searching a product
  // creating a query object to check for empty values
  const queryObject = {};
  //   for featured based search
  if (featured) {
    queryObject.featured = featured === "true" ? true : false;
  }
  //   for company based search
  if (company) {
    queryObject.company = company;
  }
  //   for name based search
  if (name) {
    queryObject.name = { $regex: name, $options: "i" };
  }

  // numeric filters
  if (numericFilters) {
    //   operator map is setting up value that user understands to mongoDb values
    const operatorMap = {
      ">": "$gt",
      ">=": "$gte",
      "=": "$eq",
      "<": "$lt",
      "<=": "$lte",
    };
    //   regular expression
    const regEx = /\b(<|>|>=|=|<|<=)\b/g;
    let filters = numericFilters.replace(
      regEx,
      (match) => `-${operatorMap[match]}-`
    );
    const options = ["price", "rating"];
    filters = filters.split(",").forEach((item) => {
      const [field, operator, value] = item.split("-");
      if (options.includes(field)) {
        queryObject[field] = { [operator]: Number(value) };
      }
    });
  }

  let result = Product.find(queryObject);
  // sort feature
  if (sort) {
    const sortList = sort.split(",").join(" ");
    result = result.sort(sortList);
  } else {
    result = result.sort("createdAt");
  }

  // for having results with specific fiels
  if (fields) {
    const fieldsList = fields.split(",").join(" ");
    result = result.select(fieldsList);
  }

  // pagination and limit functions
  const page = Number(req.query.page) || 1;
  const limit = Number(req.query.limit) || 10;
  const skip = (page - 1) * limit;
  result = result.skip(skip).limit(limit);

  const products = await result;
  res.status(200).json({ products, nbHits: products.length });
};

module.exports = { getAllProducts, getAllProductsStatic };
