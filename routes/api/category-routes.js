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
      include: [{ model: Product, attributes: ["id"] }],
      //what attributes do you want from the product model?
    });
    res.status(200).json(categories);
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ error: "Failed to get categories" });
  }
  // find all categories
  // be sure to include its associated Products
});

router.get("/:id", async (req, res) => {
  try {
    const id = req.params.id;
    const category = await Category.findByPk(id, {
      include: [{ model: Product, attributes: ["product_name"] }],
      //what object is going to provide the id for one category?
    });
    res.status(200).json(category);
    if (!category) {
      res.status(404).json({ [ERROR]: "No category found with this id" });
    }
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ error: "Failed to get category with this id" });
  }
  // find one category by its `id` value
  // be sure to include its associated Products
});

router.post("/", async (req, res) => {
  try {
    const newCategory = await Category.create({
      category_name: req.body.category_name,
    });
    res.status(200).json(newCategory);
    //what object is being created?
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ error: "Failed to create new category" });
  }
  // create a new category
  //send a response back
});

//NEEDS FIXING
router.put("/:id", async (req, res) => {
  try {
    const id = req.params.id;
    const updatedCategory = await Category.update(
      { category_name: req.body.category_name },
      { where: id, returning: true }
    );
    res.status(200).json(updatedCategory);
    if (!updatedCategory) {
      res.status(404).json({ [ERROR]: "No category found with this id" });
    }
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ error: "Failed to get category with this id" });
  }

  // update a category by its `id` value
});

//ALSO NEEDS FIXING
router.delete("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const deletedCategory = await Category.destroy({ where: { id } });
    res.status(200).json(deletedCategory);
    if (!deletedCategory) {
      res.status(404).json({ [ERROR]: "No category found with this id" });
    }
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ error: "Failed to delete category" });
  }
});

// delete a category by its `id` value

module.exports = router;
