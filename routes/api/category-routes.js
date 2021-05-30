const router = require("express").Router();
const { Category, Product } = require("../../models");

// The `/api/categories` endpoint
//try/catchs in every route
//all routes return a response
//all routes to have logging
//all routes to have some form of validation

router.get("/", (req, res) => {
  // find all categories
  // be sure to include its associated Products
});

router.get("/:id", (req, res) => {
  // find one category by its `id` value
  // be sure to include its associated Products
});

router.post("/", (req, res) => {
  // create a new category
  //send a response back
});

router.put("/:id", (req, res) => {
  // update a category by its `id` value
});

router.delete("/:id", (req, res) => {
  // delete a category by its `id` value
});

module.exports = router;
