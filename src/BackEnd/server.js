require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const User = require("./Models/User");
const Post = require("./Models/Post");
const Category = require("./Models/Category");
const SubCategory = require("./Models/SubCategory");
const bcrypt = require("bcrypt");
const passport = require("passport");
const JWT = require("jsonwebtoken");
require("./passport/passportIsToken")(passport);
require("./passport/passport")(passport);

const app = express();

app.use(express.json());
app.use(passport.initialize());
app.use(passport.session());

app.listen(process.env.EXPRESS_PORT, err => {
  if (err) {
    console.log("Error running server on port process.env.EXPRESS_PORT");
  } else {
    console.log(
      `Server is running perfectly on port:${process.env.EXPRESS_PORT}`
    );
  }
});

mongoose
  .connect(process.env.URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useFindAndModify: false,
    useCreateIndex: true
  })
  .then(res => console.log("Db is connected"))
  .catch(err => console.log("Error connecting to Db"));

// CATEGORY_CRUD
// _____________________________________________________________________

app.post("/api/admin/add_category", (req, res) => {
  const category = new Category({
    _id: mongoose.Types.ObjectId(),
    title: req.body.title
  });
  category
    .save()
    .then(result => res.send(result))
    .catch(err => res.send(err));
});

app.delete("/api/admin/delete_categorie", (req, res) => {
  const id = req.params.id;
  Category.findByIdAndDelete({ _id: id })
    .then(result => res.send(result))
    .catch(err => res.send(err));
});

app.delete("/api/admin/delete_all_categories", (req, res) => {
  Category.deleteMany({})
    .then(result => res.send(result))
    .catch(err => res.send(err));
});

app.get("/api/get_all_categories", (req, res) => {
  Category.find({})
    .populate("subCategories")
    .then(result => res.send(result))
    .catch(err => res.send(err));
});

// SUBCATEGORY_CRUD
//___________________________________________________________________

app.post("/api/admin/add_subCategory", (req, res) => {
  const subCategory = new SubCategory({
    _id: mongoose.Types.ObjectId(),
    title: req.body.title,
    category: req.body.category_id
  });
  subCategory
    .save()
    .then(result => {
      Category.findOne({ _id: result.category })
        .then(foundCategory => {
          foundCategory.subCategories.push(result._id);
          foundCategory.save();
        })
        .catch(err => res.send(err));
      res.send(result);
    })
    .catch(err => res.send(err));
});

app.delete("/api/admin/delete_all_subs", (req, res) => {
  SubCategory.deleteMany({})
    .then(result => res.send(result))
    .catch(err => res.send(err));
});

app.get("/api/admin/get_all_subs", (req, res) => {
  SubCategory.find()
    .populate("category")
    .then(result => res.send(result))
    .catch(err => res.send(err));
});

//   Post_API
// __________________________________________________________________
// POSTS_FILTERING
// __________________________________________________________________

app.get("/api/filter_posts_by_category", (req, res) => {
  const categoryTitle = req.body.categoryTitle;
  const category = req.query.category;
  Category.findOne({ _id: category })
    .populate({
      path: "subCategories",
      populate: {
        path: "posts",
        populate: { path: "user", select: "-password -email" }
      }
    })
    .exec((err, result) => {
      if (err) {
        res.send(err);
      } else {
        const filtered = [];
        result.subCategories.map((subC, i) => {
          subC.posts.map((post, i) => {
            filtered.push(post);
          });
        });
        res.send(filtered);
        console.log("category only", filtered.length);
      }
    });
});

app.get("/api/filter_posts_by_category_&_sub", (req, res) => {
  const categoryTitle = req.body.category;
  const subCategoryTitle = req.body.subCategory;
  const categoryId = req.query.category;
  const subCategoryId = req.query.subCategory;
  Category.findOne({ _id: categoryId })
    .populate({
      path: "subCategories",
      match: { _id: subCategoryId },
      populate: {
        path: "posts",
        populate: "user"
      }
    })
    .then(result => {
      const filtered = [];
      result.subCategories.map((subC, i) => {
        if (subC._id == subCategoryId) {
          subC.posts.map((post, i) => {
            filtered.push(post);
          });
        }
      });

      console.log("category & sub", filtered.length);
      res.send(filtered);
    })
    .catch(err => res.send(err));
});

app.get("/api/filter_posts_by_category_&_title", (req, res) => {
  const categoryTitle = req.body.categoryTitle;
  const category = req.query.category;
  const postTitle = req.query.postTitle;
  const reg = new RegExp(postTitle, "gi");
  console.log(req.query);
  Category.findOne({ _id: category })
    .populate({
      path: "subCategories",
      populate: {
        path: "posts",
        populate: { path: "user", select: "-password -email -posts" }
      }
    })
    .exec((err, result) => {
      if (err) {
        res.send(err);
      } else {
        const filtered = [];
        result.subCategories.map((subC, i) => {
          subC.posts.map((post, i) => {
            if (post.postTitle.match(reg)) {
              filtered.push(post);
            }
          });
        });
        console.log("category & title", filtered.length);
        res.send(filtered);
      }
    });
});

app.get("/api/filter_posts_by_category_&_sub_&_title", (req, res) => {
  const categoryTitle = req.body.categoryTitle;
  const categoryId = req.query.category;
  const subCategoryId = req.query.subCategory;
  const subCategoryTitle = req.body.subCategoryTitle;
  const postTitle = req.query.postTitle;
  const reg = new RegExp(postTitle, "gi");
  Category.findOne({ _id: categoryId })
    .populate({
      path: "subCategories",
      match: { _id: subCategoryId },
      populate: {
        path: "posts",
        populate: "user"
      }
    })
    .then(result => {
      const filtered = [];
      result.subCategories.map((subC, i) => {
        if (subC._id == subCategoryId) {
          subC.posts.map((post, i) => {
            if (post.postTitle.match(reg)) {
              filtered.push(post);
            }
          });
        }
      });
      console.log("category & sub & title", filtered.length);
      res.send(filtered);
    })
    .catch(err => res.send(err));
});

app.get("/api/filter_by_title_in_all", (req, res) => {
  const postTitle = req.query.postTitle;
  Post.find({
    postTitle: { $regex: new RegExp(postTitle), $options: "i" }
  })
    .populate("user")
    .then(result => {
      console.log("title only", result);
      res.send(result);
    })
    .catch(err => res.send(err));
});

//  POSTS_CRUD
// __________________________________________________________________

app.post(
  "/api/add_post",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    const id = req.body.id;
    const post = new Post({
      _id: mongoose.Types.ObjectId(),
      user: id,
      postDate: Date.now(),
      postTitle: req.body.postTitle,
      phoneNumber: req.body.phoneNumber,
      subCategory: req.body.subCategory,
      postDescription: req.body.postDescription,
      postImages: req.body.postImages
    });
    post
      .save()
      .then(result => {
        User.findOne({ _id: id })
          .then(foundUser => {
            foundUser.posts.push(result._id);
            foundUser
              .save()
              .then(savingUser => {
                console.log(savingUser);
              })
              .catch(err => console.log(err));
          })
          .catch(err => res.send(err));

        SubCategory.findOne({ _id: result.subCategory })
          .then(foundSubCategory => {
            console.log(foundSubCategory);
            foundSubCategory.posts.push(result._id);
            foundSubCategory
              .save()
              .then(savingSubC => {
                console.log(savingSubC);
              })
              .catch(err => console.log(err));
            res.send(result);
          })
          .catch(err => console.log(err));
      })
      .catch(err => res.send(err));
  }
);

app.get("/api/get_all_posts", (req, res) => {
  Post.find()
    .populate({ path: "user", select: "-posts" })
    .populate({ path: "likes", select: "userName" })
    .populate("subCategory")
    .then(result => res.send(result))
    .catch(err => res.send("ERROR getting all the posts"));
});

app.put(
  "/api/update_post",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    const id = req.body.id;
    Post.findOneAndUpdate({ _id: id }, { $set: req.body })
      .then(result => res.send(result))
      .catch(err => res.send(err));
  }
);

app.delete("/api/admin/delete_all_posts", (req, res) => {
  Post.remove()
    .then(result => res.send("successfult removed all the posts"))
    .catch("ERROR removing all the posts");
});

app.delete(
  "/api/delete_post",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    const id = req.query.id;
    // console.log(req.query.id);
    Post.findOneAndDelete({ _id: id })
      .then(result => res.send(result))
      .catch(err => res.send(err));
  }
);

app.delete("/api/admin/delete_user_posts", (req, res) => {
  const id = req.body.id;
  Post.deleteMany({ _id: id })
    .then(result => res.send("Successfuly removed user posts"))
    .catch(err => res.send("Error deleting user posts"));
});

app.put(
  "/api/add_like",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    const liker = req.user.id;
    const id = req.body.id;

    Post.findOne({ _id: id })
      .then(foundPost => {
        const alreadyMadeLike = foundPost.likers.map(el => {
          if (el == liker) {
            return true;
          }
        });
        if (!alreadyMadeLike.length) {
          foundPost.likers.push(liker);
          foundPost
            .save()
            .then(result => {
              console.log(result);
              res.send(result);
            })
            .catch(err => console.log(err))
            .catch(err => console.log(err));
        } else {
          console.log("already made a like ");
        }
      })
      .catch(err => res.send(err));
  }
);

// User_API
//   ________________________________________________________________

app.post("/api/register", (req, res) => {
  const user = new User({
    _id: mongoose.Types.ObjectId(),
    userName: req.body.userName,
    email: req.body.email,
    password: req.body.password,
    userImage: req.body.userImage,
    userDate: Date.now(),
    termsAccepted: req.body.termsAccepted
  });
  bcrypt
    .hash(req.body.password, 10)
    .then(hash => {
      user.password = hash;
      user
        .save()
        .then(result => {
          const token = JWT.sign(
            {
              iss: "myWebsite",
              sub: {
                id: result.id,
                userName: result.userName
              },
              iat: new Date().getTime(), // current time
              exp: new Date().setDate(new Date().getDate() + 1) // current time + 1 day ahead
            },
            process.env.SECRET
          );

          res.send(token);
        })
        .catch(err => {
          console.log(err);
          res.send(err);
        });
    })
    .catch(err => res.send("ERROR hashing password"));
});

app.get("/api/admin/get_all_users", (req, res) => {
  User.find()
    .then(result => res.send(result))
    .catch(err => res.send("Error finding all users"));
});

app.get("/api/get_user_by_id", (req, res) => {
  const id = req.query.id;
  User.findOne({ _id: id })
    .select("-email -password")
    .populate({
      path: "posts",
      populate: { path: "user", select: "-email -password -posts" }
    })
    .then(result => {
      console.log(result);
      res.send(result);
    })
    .catch(err => res.send(err));
});

app.get("/api/get_user_posts_by_title", (req, res) => {
  const id = req.query.id;
  const title = req.query.postTitle;
  User.findOne({ _id: id })
    .select("_id userName")
    .populate({
      path: "posts",
      populate: "user"
    })
    .then(result => {
      const filteredPosts = result.posts.filter(post =>
        post.postTitle.includes(title)
      );

      console.log(
        {
          _id: result._id,
          userName: result.userName,
          posts: filteredPosts
        },
        filteredPosts.length
      );
      res.send({
        _id: result._id,
        userName: result.userName,
        posts: filteredPosts
      });
    })
    .catch(err => {
      console.log(err);
      res.send(err);
    });
});

app.get("/api/login_by_email", (req, res) => {
  const email = req.query.email;
  const passwordGiven = req.query.password;
  User.findOne({ email: email })
    .then(foundUser => {
      if (foundUser) {
        const { password } = foundUser;
        bcrypt
          .compare(passwordGiven, password)
          .then(foundPass => {
            if (foundPass) {
              res.send(foundPass);
            } else {
              res.send(foundPass);
            }
          })
          .catch(err => res.send(err));
      } else {
        res.send("No user found");
      }
    })
    .catch(err => res.send(err));
});

app.get("/api/login_by_userName", (req, res) => {
  const userName = req.query.userName;
  const passwordGiven = req.query.password;
  User.findOne({ userName: userName })
    .then(foundUser => {
      console.log(req.query);
      console.log(foundUser);
      if (foundUser) {
        const { password } = foundUser;
        bcrypt
          .compare(passwordGiven, password)
          .then(foundPass => {
            if (foundPass) {
              res.send(foundPass);
            } else {
              res.send(foundPass);
            }
          })
          .catch(err => res.send(err));
      } else {
        res.send("No user found");
      }
    })
    .catch(err => res.send(err));
});

app.get(
  "/get_users",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    User.find().then(usersFound => {
      if (!userFound) {
        res.send(usersFound);
      }
      if (userFound) {
        res.send(usersFound);
      }
    });
    console.log(req.user);
  }
);

app.post(
  "/api/login",
  passport.authenticate("local", { session: false }),
  (req, res) => {
    const token = JWT.sign(
      {
        iss: "myWebsite",
        sub: {
          id: req.user._id,
          userName: req.user.userName
        },
        iat: new Date().getTime(), // current time
        exp: new Date().setDate(new Date().getDate() + 1) // current time + 1 day ahead
      },
      "mysecret"
    );
    res.send(token);
  }
);

app.get("/api/admin/get_user_by_posts_number", (req, res) => {
  const postsNumberQuery = req.body.postsNumberQuery;
  User.find({ numberOfPosts: { $gte: postsNumberQuery } })
    .then(result => res.send(result))
    .catch(err => res.send("Error finding user by posts number"));
});

app.delete("/api/admin/delete_all_users", (req, res) => {
  User.deleteMany()
    .then(result => res.send("All Users deleted succefully"))
    .catch(err => res.send("Error deleting all users"));
});

app.delete("/api/delete_user/:id", (req, res) => {
  const id = req.params.id;
  User.findOneAndDelete({ _id: id })
    .then(result => res.send("Successfuly removed user"))
    .catch(err => res.send("Error removing user"));
});

app.put(
  "/api/update_user",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    const id = req.body.id;
    const oldPassword = req.body.oldPassword;
    const password = req.body.newPassword;

    if (oldPassword && password) {
      bcrypt.hash(password, 10, (err, hash) => {
        if (err) {
          res.send(err);
        } else {
          req.body.password = hash;

          User.findOne({ _id: id })
            .then(result => {
              bcrypt.compare(oldPassword, result.password, (err, isMatch) => {
                if (err) {
                  res.send(err);
                }
                if (isMatch) {
                  User.findOneAndUpdate({ _id: id }, { $set: req.body })
                    .then(updatedUser => {
                      res.send(updatedUser);
                    })
                    .catch(updateErr => res.send(updateErr));
                }
                if (!isMatch) {
                  res.send(isMatch);
                }
              });
            })
            .catch(err => res.send(err));
        }
      });
    }
    if (!oldPassword && !password) {
      User.findByIdAndUpdate({ _id: id }, { $set: req.body })
        .then(result => {
          res.send(result);
        })
        .catch(err => res.send(err));
    }
  }
);

// ____________________________________________________________________
// const db = mongoose.connection;
// db.once("open", () => console.log("db is conencted perfectly"));
// db.on("error", () => console.log("error connecting to db"));
