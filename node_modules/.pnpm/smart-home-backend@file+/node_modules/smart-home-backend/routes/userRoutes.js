const express = require("express");
const {
  register,
  login,
  getUsers,
  getUser,
  deleteUser,
  updateUser,
  addUser
} = require("../controllers/UserController");
const { checkRole } = require("../middlewares/authMiddleware");

const router = express.Router();

// Đăng ký
router.post("/register", checkRole("admin"), register);

// Đăng nhập
router.post("/login", login);

// Lấy danh sách người dùng (chỉ admin)
router.get("/", checkRole("admin"), getUsers);

// Lấy thông tin một người dùng
router.get("/:userId", getUser);

// Xóa người dùng (chỉ admin)
// router.delete("/:userId", checkRole("admin"), deleteUser);
router.delete("/:userId", deleteUser);

// Cập nhật thông tin người dùng
router.post("/update",updateUser)

//Thêm người dùng
router.post("/add", addUser);

module.exports = router;
