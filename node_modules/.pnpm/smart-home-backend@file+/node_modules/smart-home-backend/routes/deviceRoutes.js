const express = require("express");
const {
  controlDevice,
  getDeviceLogs,
  getDeviceStatus,
  saveSensorData,
  getSensorData,
  addDevice,
  deleteDevice,
  getAllDeviceLogs,
  getDeviceInfo,
  updateDevice,
  ControlDevice,
  updateAlldevices,
  updateDeviceStatus
} = require("../controllers/DeviceController");
const { checkRole } = require("../middlewares/authMiddleware");
const router = express.Router();
const {
  getLatestTemperatureAndHumidity,
} = require("../controllers/DeviceController");

// Route điều khiển thiết bị
// router.post("/control", checkRole("user"), controlDevice);
router.post("/control", controlDevice);

// gửi data đến esp32
router.post("/send-data", ControlDevice);

// Định nghĩa route thêm thiết bị
// router.post("/add-device", checkRole("user"), addDevice);
router.post("/add-device", addDevice);

// Route lấy lịch sử điều khiển của tất cả thiết bị
router.get("/logs/all", checkRole("user"), getAllDeviceLogs);

// Route lấy lịch sử điều khiển thiết bị
router.get("/:deviceID/logs", checkRole("user"), getDeviceLogs);

// Route lấy trạng thái thiết bị
router.get("/:deviceID/status", checkRole("user"), getDeviceStatus);

// Route lưu dữ liệu cảm biến
router.post("/add-sensor-data", saveSensorData);

// Route lấy dữ liệu cảm biến
router.get("/sensor-data", getSensorData);

// Route lấy danh sách thiết bị theo phòng
router.get(
  "/rooms/:roomID/devices",
  checkRole("user"),
  require("../controllers/DeviceController").getDevicesByRoom
);

// Route để lấy nhiệt độ và độ ẩm mới nhất
router.get(
  "/latest-temperature-humidity",
  checkRole("user"),
  getLatestTemperatureAndHumidity
);

// Route xóa thiết bị trong phòng
router.delete("/:deviceID", checkRole("user"), deleteDevice);

// Route lấy thông tin một thiết bị
router.get("/:deviceID", getDeviceInfo);

router.post("/update", updateDevice);

router.post("/update-all", updateAlldevices);

router.post("/update-status",updateDeviceStatus)

module.exports = router;
