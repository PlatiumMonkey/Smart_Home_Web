require("dotenv").config();
const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const session = require('express-session');
const path = require("path");

const app = express();
const PORT = 5000;

const userRoutes = require("./routes/userRoutes");
const deviceRoutes = require("./routes/deviceRoutes");
const roomRoutes = require("./routes/roomRoutes");
const siteRoutes = require("./routes/siteRoutes");
const authRoutes = require("./routes/authRoutes");
const homeRoutes = require("./routes/siteRoutes");

// Cấu hình session
app.use(session({
  secret: process.env.SESSION_SECRET || "defaultSecretKey", // Mã bí mật để mã hóa session
  resave: false,  // Không lưu lại session mỗi khi có yêu cầu
  saveUninitialized: true,  // Lưu session ngay cả khi không có thông tin
  cookie: { secure: app.get("env") === "production" },
}));

// Middleware
app.use(bodyParser.json());
app.use(cors());
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static(path.join(__dirname,"views"))); // Cấu hình thư mục public để chứa các tài nguyên như CSS, JS, hình ảnh
app.set('views', path.join(__dirname, 'views')); // Thư mục chứa file .ejs
app.set('view engine', 'ejs'); // Thiết lập EJS làm view engine


// debug url
app.use((req, res, next) => {
  console.log(`[${new Date().toISOString()}] Request URL: ${req.url}`);
  next();
});

// Routes
app.use("/", authRoutes); // Route cho trang login, register, forgot password, reset password
app.use("/api/users", userRoutes);
app.use("/api/devices", deviceRoutes);
app.use("/api/rooms", roomRoutes);
app.use("/",siteRoutes);
app.use("/home", homeRoutes);

// Xử lý route không tồn tại
app.use((req, res) => {
  res.status(404).render('404', { message: 'Trang không tồn tại' }); // Tạo file 404.ejs trong thư mục views
});

// Start server
app.listen(PORT, () => {
  console.log(`Server đang chạy tại http://localhost:${PORT}`);
});
