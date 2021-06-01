const router = require("express").Router();
const { Tag, Product, ProductTag } = require("../../models");

// The `/api/tags` endpoint
//TODO: Using product tags on this route
router.get("/", async (req, res) => {
  try {
    const tags = await Tag.findAll({
      include: [
        {
          model: Product,
          attributes: ["product_name", "price", "stock", "category_id"],
        },
      ],
    });
    res.status(200).json(tags);
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ error: "Failed to get tags" });
  }
  // find all tags
  // be sure to include its associated Product data
});

router.get("/:id", async (req, res) => {
  try {
    const id = req.params.id;
    const tag = await Tag.findByPk(id, {
      include: [
        {
          model: Product,
          attributes: ["product_name", "price", "stock", "category_id"],
        },
      ],
    });
    res.status(200).json(tag);
    if (!tag) {
      res.status(404).json({ [ERROR]: "No tag found with this id" });
    }
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ error: "Failed to retrieve tag with this id" });
  }
  // find a single tag by its `id`
  // be sure to include its associated Product data
});

router.post("/", async (req, res) => {
  try {
    const newTag = await Tag.create({
      tag_name: req.body.tag_name,
    });
    res.status(200).json(newTag);
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ error: "Failed to create new tag" });
  }
  // create a new tag
});

router.put("/:id", async (req, res) => {
  try {
    const tag_id = req.params.id;
    const updatedTagName = await Tag.update(
      { tag_name: req.body.name },
      { where: { tag_id }, returning: true }
    );
    res.status(200).json(updatedTagName);
    if (!updatedTagName) {
      res.status(404).json({ [ERROR]: "No tag found with this id" });
    }
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ error: "Failed to get tag with this id" });
  }
  // update a tag's name by its `id` value
});

router.delete("/:id", async (req, res) => {
  // delete on tag by its `id` value
});

module.exports = router;
