const express = require("express");
const { createRoom, getRooms, getDevicesByRoom,updateRoom, getRoomById,addRoom,deleteRoom } = require("../controllers/RoomController");
const { checkRole } = require("../middlewares/authMiddleware");

const router = express.Router();

// Route tạo phòng mới
// router.post("/add", checkRole("user"), createRoom);

// Route lấy danh sách phòng
router.get("/", checkRole("user"), getRooms);

// Route lấy danh sách thiết bị trong phòng
// router.get("/:roomID/devices", checkRole("user"), getDevicesByRoom);
router.get("/:roomID/devices", getDevicesByRoom);

router.post("/update",updateRoom)

router.get("/:roomID",getRoomById)

router.post("/add",addRoom)

router.delete("/:roomID",deleteRoom)

module.exports = router;
