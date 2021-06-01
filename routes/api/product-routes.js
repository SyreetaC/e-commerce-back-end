const { Router } = require("express");

const { Product, Category, Tag, ProductTag } = require("../../models");

const router = Router();
// The `/api/products` endpoint

// get all products
router.get("/", async (req, res) => {
  try {
    const products = await Product.findAll({
      include: [
        {
          model: Category,
          attributes: ["category_id", "category_name"],
        },
        {
          model: Tag,
          attributes: ["tag_id", "tag_name"],
        }, //DOES NOT SHOW TAG ID OR NAME!
      ],
    });
    res.status(200).json(products);
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ error: "Failed to get products" });
  }
  // find all products
  // be sure to include its associated Category and Tag data
});

// get one product
router.get("/:id", async (req, res) => {
  try {
    const id = req.params.id;
    const product = await Product.findByPk(id, {
      include: [
        {
          model: Category,
          attributes: ["category_id", "category_name"],
        },
        {
          model: Tag,
          attributes: ["tag_id", "tag_name"],
        },
      ],
      //NOT SHOWING TAG INFO
    });
    res.status(200).json(product);
    if (!product) {
      res.status(404).json({ [ERROR]: "No product found with this id" });
    }
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ error: "Failed to get product with this id" });
  }
  // find a single product by its `id`
  // be sure to include its associated Category and Tag data
});

//TO DO
// create new product
router.post("/", async (req, res) => {
  await Product.create({
    product_name: req.body.product_name,
    price: req.body.price,
    stock: req.body.stock,
    category_id: req.body.category_id,
    //need to link tag_id in here
  })
    .then((newProduct) => {
      // if there's product tags, we need to create pairings to bulk create in the ProductTag model
      if (req.body.tagIds.length) {
        const productTagIdArr = req.body.tagIds.map((tag_id) => {
          return {
            product_id: product.id,
            tag_id,
          };
        });
        return ProductTag.bulkCreate(productTagIdArr);
      }
      // if no product tags, just respond
      res.status(200).json(newProduct);
    })
    .then((productTagIds) => res.status(200).json(productTagIds))
    .catch((err) => {
      console.log(err);
      res.status(400).json(err);
    });
});

// update product
router.put("/:id", async (req, res) => {
  // update product data
  await Product.update(req.body, {
    where: {
      id: req.params.id,
    },
  })
    .then((product) => {
      // find all associated tags from ProductTag
      return ProductTag.findAll({ where: { product_id: req.params.id } });
    })
    .then((productTags) => {
      // get list of current tag_ids
      const productTagIds = productTags.map(({ tag_id }) => tag_id);
      // create filtered list of new tag_ids
      const newProductTags = req.body.tagIds
        .filter((tag_id) => !productTagIds.includes(tag_id))
        .map((tag_id) => {
          return {
            product_id: req.params.id,
            tag_id,
          };
        });
      // figure out which ones to remove
      const productTagsToRemove = productTags
        .filter(({ tag_id }) => !req.body.tagIds.includes(tag_id))
        .map(({ id }) => id);

      // run both actions
      return Promise.all([
        ProductTag.destroy({ where: { id: productTagsToRemove } }),
        ProductTag.bulkCreate(newProductTags),
      ]);
    })
    .then((updatedProductTags) => res.json(updatedProductTags))
    .catch((err) => {
      // console.log(err);
      res.status(400).json(err);
    });
});

router.delete("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const deletedProduct = await Product.destroy(id);
    res.status(200).json(deletedProduct);
    if (!deletedProduct) {
      res.status(404).json({ [ERROR]: "No product found with this id" });
    }
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ error: "Failed to delete product" });
  } // delete one product by its `id` value
});

module.exports = router;
