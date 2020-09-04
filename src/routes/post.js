const express = require("express");
const checkAuth = require("../middlewares/check-auth");
const fileExtract = require("../middlewares/file");

const Post = require("../model/post");

const router = express.Router();

router.post("/api/posts", checkAuth, fileExtract, (req, res, next) => {
  const url = req.protocol + "://" + req.get("host");
  const post = new Post({
    title: req.body.title,
    content: req.body.content,
    imagePath: url + "/images/" + req.file.filename,
    creator: req.userData.userId,
  });
  post
    .save()
    .then((createdPost) => {
      res.status(201).json({
        message: "post added successfully",
        postI: {
          id: createdPost._id,
          title: createdPost.title,
          content: createdPost.content,
          imagePath: createdPost.imagePath,
        },
      });
    })
    .catch((error) => {
      res.status(500).json({
        message: "creating post failed",
      });
    });
});

router.get("/api/posts", (req, res, next) => {
  const pageSize = +req.query.pagesize;
  const currentPage = +req.query.page;
  const postQuerry = Post.find();
  let fetchedPosts;
  if (pageSize && currentPage) {
    postQuerry.skip(pageSize * (currentPage - 1)).limit(pageSize);
  }

  postQuerry
    .find()
    .then((documents) => {
      fetchedPosts = documents;
      return Post.estimatedDocumentCount();
    })
    .then((count) => {
      res.status(200).json({
        message: "Posts fetched successfuly",
        posts: fetchedPosts,
        maxPosts: count,
      });
    })
    .catch((error) => {
      res.status(500).json({ mesage: "fetching post failed" });
    });
});

router.put("/api/posts/:id", checkAuth, fileExtract, (req, res, next) => {
  let imagePath = req.body.imagePath;
  if (req.file) {
    const url = req.protocol + "://" + req.get("host");
    imagePath = url + "/images/" + req.file.filename;
  }
  const post = new Post({
    _id: req.body.id,
    title: req.body.title,
    content: req.body.content,
    imagePath: imagePath,
    creator: req.userData.userId,
  });
  Post.updateOne({ _id: req.params.id, creator: req.userData.userId }, post)
    .then((result) => {
      if (result.n > 0) {
        res.status(200).json({ mesage: "update successful" });
      } else {
        res.status(401).json({ mesage: "update unsuccessful" });
      }
    })
    .catch((error) => {
      res.status(500).json({
        message: "couldn't update post",
      });
    });
});

router.get("/api/posts/:id", (req, res, next) => {
  Post.findById(req.params.id).then((post) => {
    if (post) {
      res.status(200).json(post);
    } else {
      res.status(404).json({ message: "posts not found" });
    }
  });
});

router.delete("/api/posts/:id", checkAuth, (req, res, next) => {
  Post.deleteOne({ _id: req.params.id, creator: req.userData.userId }).then(
    (result) => {
      if (result.n > 0) {
        res.status(200).json({ mesage: "delete successful" });
      } else {
        res.status(401).json({ mesage: "delete unsuccessful" });
      }
    }
  );
});

module.exports = router;
