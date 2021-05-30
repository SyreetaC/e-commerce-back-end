const router = require("express").Router();
const { Category, Product } = require("../../models");
const { restore } = require("../../models/Product");

// The `/api/categories` endpoint
//try/catchs in every route
//all routes return a response
//all routes to have logging
//all routes to have some form of validation

router.get("/", async (req, res) => {
  try {
    const categories = await Category.findAll({
      include: [{ model: Product, attributes: [] }],
      //what attributes do you want from the product model?
    });
    res.status(200).json(categories);
  } catch (error) {
    res.status(500).json(error);
  }
  // find all categories
  // be sure to include its associated Products
});

router.get("/:id", async (req, res) => {
  try {
    const category = await Category.findOne({
      where: {},
      //what object is going to provide the id for one category?
      include: [{ model: Product, attributes: [] }],
    });
    res.status(200).json(category);
    if (!category) {
      res.status(404).json({ [ERROR]: "No category found with this id" });
    }
  } catch (error) {
    res.status(500).json(error);
  }
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
