const router = require("express").Router();
const { Category, Product } = require("../../models");
const { restore } = require("../../models/Product");

// The `/api/categories` endpoint

router.get("/", async (req, res) => {
  try {
    const categories = await Category.findAll({
      include: [
        {
          model: Product,
          attributes: ["id", "product_name", "price", "stock"],
        },
      ],
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
      include: [
        {
          model: Product,
          attributes: ["id", "product_name", "price", "stock"],
        },
      ],
    });
    res.status(200).json(category);
    if (!category) {
      res.status(404).json({ error: "No category found with this id" });
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
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ error: "Failed to create new category" });
  }
  // create a new category
  //send a response back
});

router.put("/:id", async (req, res) => {
  try {
    const category_id = req.params.id;
    const updatedCategory = await Category.update(
      { category_name: req.body.category_name },
      { where: { category_id }, returning: true }
    );
    res.status(200).json(updatedCategory);
    if (!updatedCategory) {
      res.status(404).json({ error: "No category found with this id" });
    }
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ error: "Failed to get category with this id" });
  }

  // update a category by its `id` value
});

router.delete("/:id", async (req, res) => {
  try {
    const category_id = req.params.id;
    const deletedCategory = await Category.destroy({ where: { category_id } });
    if (!deletedCategory) {
      return res.status(404).json({ error: "No category found with this id" });
    }
    res.status(200).json(deletedCategory);
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ error: "Failed to delete category" });
  } // delete a category by its `id` value
});

module.exports = router;
