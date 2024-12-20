const deviceService = require("../services/DeviceService");
const axios = require("axios");
const qs = require("querystring");

// Điều khiển thiết bị
// exports.controlDevice = async (req, res) => {
//     try {
//         const { deviceID, action } = req.body;

//         if (!deviceID || !["on", "off"].includes(action)) {
//             return res.status(400).json({ error: "Tham số không hợp lệ. Vui lòng kiểm tra 'deviceID' hoặc 'action'." });
//         }

//         const devices = await deviceService.checkDeviceExists(deviceID);
//         if (devices.length === 0) {
//             return res.status(404).json({ error: "Thiết bị không tồn tại." });
//         }

//         const device = devices[0];
//         const esp32IP = device.esp32IP;

//         if (!esp32IP) {
//             return res.status(400).json({ error: "Địa chỉ IP ESP32 chưa được cấu hình cho thiết bị này." });
//         }

//         const esp32Url = `http://${esp32IP}/control?deviceID=${deviceID}&action=${action}`;
//         const response = await axios.get(esp32Url, { timeout: 5000 });

//         const status = action === "on" ? 1 : 0;
//         await deviceService.updateDeviceStatus(deviceID, status);
//         await deviceService.logDeviceAction(deviceID, action);

//         res.json({
//             message: "Thiết bị đã được điều khiển thành công.",
//             esp32Response: response.data,
//         });
//     } catch (error) {
//         console.error("Lỗi khi điều khiển thiết bị:", error.message);
//         res.status(500).json({ error: "Không thể kết nối với ESP32 hoặc lỗi hệ thống." });
//     }
// };

exports.controlDevice = async (req, res) => {
  try {
    const { deviceID, action } = req.body;
    const status = action === "on" ? 1 : 0;
    await deviceService.updateDeviceStatus(deviceID, status);
    await deviceService.logDeviceAction(deviceID, action);

    res.json({
      message: "Thiết bị đã được điều khiển thành công.",
    });
  } catch (error) {
    console.error("Lỗi khi điều khiển thiết bị:", error.message);
    res
      .status(500)
      .json({ error: "Không thể kết nối với ESP32 hoặc lỗi hệ thống." });
  }
};

// Thêm thiết bị mới vào phòng
exports.addDevice = async (req, res) => {
  try {
    const { name, status, roomID, esp32IP } = req.body;
    

    if (!name || roomID === undefined || !esp32IP) {
      return res.status(400).json({ error: "Thiếu thông tin thiết bị." });
    }

    const deviceID = await deviceService.addDevice(
      name,
      status,
      roomID,
      esp32IP
    );
    await deviceService.updateRoomDeviceCount(roomID, 1);

    res.json({
      message: "Thiết bị đã được thêm thành công!",
      deviceID: deviceID,
    });
  } catch (error) {
    console.error("Lỗi khi thêm thiết bị:", error.message);
    res.status(500).json({ error: "Lỗi hệ thống khi thêm thiết bị." });
  }
};

// Lấy lịch sử của từng điều khiển thiết bị
exports.getDeviceLogs = async (req, res) => {
  try {
    const deviceID = req.params.deviceID;
    const logs = await deviceService.getDeviceLogs(deviceID);
    res.json(logs);
  } catch (error) {
    console.error("Lỗi khi lấy lịch sử thiết bị:", error.message);
    res.status(500).json({ error: "Lỗi hệ thống khi lấy lịch sử thiết bị." });
  }
};

// Lấy trạng thái thiết bị
exports.getDeviceStatus = async (req, res) => {
  try {
    const deviceID = req.params.deviceID;
    const devices = await deviceService.getDeviceStatus(deviceID);

    if (devices.length === 0) {
      return res.status(404).json({ error: "Thiết bị không tồn tại." });
    }

    const device = devices[0];
    res.json({
      deviceID: device.id,
      name: device.name,
      status: device.status === 1 ? "on" : "off",
    });
  } catch (error) {
    console.error("Lỗi khi lấy trạng thái thiết bị:", error.message);
    res
      .status(500)
      .json({ error: "Lỗi hệ thống khi lấy trạng thái thiết bị." });
  }
};

// Nhận và lưu dữ liệu cảm biến từ ESP32
exports.saveSensorData = async (req, res) => {
  try {
    const { temperature, humidity } = req.body;

    if (temperature === undefined || humidity === undefined) {
      return res
        .status(400)
        .json({ error: "Thiếu dữ liệu nhiệt độ hoặc độ ẩm." });
    }

    await deviceService.saveSensorData(temperature, humidity);
    res.json({ message: "Dữ liệu cảm biến đã được lưu thành công." });
  } catch (error) {
    console.error("Lỗi khi lưu dữ liệu cảm biến:", error.message);
    res.status(500).json({ error: "Lỗi hệ thống khi lưu dữ liệu cảm biến." });
  }
};

// Lấy dữ liệu cảm biến
exports.getSensorData = async (req, res) => {
  try {
    const limit = parseInt(req.query.limit) || 10;
    const data = await deviceService.getSensorData(limit);
    res.json(data);
  } catch (error) {
    console.error("Lỗi khi lấy dữ liệu cảm biến:", error.message);
    res.status(500).json({ error: "Lỗi hệ thống khi lấy dữ liệu cảm biến." });
  }
};

// Lấy danh sách thiết bị theo phòng
exports.getDevicesByRoom = async (req, res) => {
  try {
    const roomID = req.params.roomID;
    const devices = await deviceService.getDevicesByRoom(roomID);
    res.json(devices);
  } catch (error) {
    console.error("Lỗi khi lấy danh sách thiết bị:", error.message);
    res.status(500).json({ error: "Lỗi hệ thống khi lấy danh sách thiết bị." });
  }
};

// Lấy nhiệt độ và độ ẩm mới nhất
exports.getLatestTemperatureAndHumidity = async (req, res) => {
  try {
    const data = await deviceService.getLatestTemperatureAndHumidity();
    if (data.length === 0) {
      return res
        .status(404)
        .json({ error: "Không có dữ liệu nhiệt độ và độ ẩm." });
    }
    res.json(data[0]);
  } catch (error) {
    console.error("Lỗi khi lấy dữ liệu cảm biến mới nhất:", error.message);
    res
      .status(500)
      .json({ error: "Lỗi hệ thống khi lấy dữ liệu nhiệt độ và độ ẩm." });
  }
};

/// Xóa thiết bị
exports.deleteDevice = async (req, res) => {
  try {
    const deviceID = req.params.deviceID;

    const devices = await deviceService.checkDeviceExists(deviceID);
    if (devices.length === 0) {
      return res.status(404).json({ error: "Thiết bị không tồn tại." });
    }

    const roomID = devices[0].roomID;

    await deviceService.deleteDevice(deviceID);
    await deviceService.updateRoomDeviceCount(roomID, -1);

    res.json({ message: "Thiết bị đã được xóa thành công." });
  } catch (error) {
    console.error("Lỗi khi xóa thiết bị:", error.message);
    res.status(500).json({ error: "Lỗi hệ thống khi xóa thiết bị." });
  }
};

// Lấy lịch sử điều khiển của tất cả thiết bị
exports.getAllDeviceLogs = async (req, res) => {
  try {
    const logs = await deviceService.getAllDeviceLogs(); // Gọi service để lấy dữ liệu
    res.json(logs); // Trả về JSON
  } catch (error) {
    console.error("Lỗi khi lấy lịch sử của tất cả thiết bị:", error.message);
    res
      .status(500)
      .json({ error: "Lỗi hệ thống khi lấy lịch sử của tất cả thiết bị." });
  }
};

// Lấy thông tin 1 thiết bị
exports.getDeviceInfo = async (req, res) => {
  try {
    const deviceID = req.params.deviceID;
    const device = await deviceService.getDevice(deviceID); // Gọi service để lấy dữ liệu
    res.json(device); // Trả về JSON
  } catch (error) {
    console.error("Lỗi khi lấy thông tin thiết bị:", error.message);
    res.status(500).json({ error: "Lỗi hệ thống khi lấy thông tin thiết bị." });
  }
};

exports.updateDevice = async (req, res) => {
  try {
    const { id, name, status, esp32IP } = req.body;
    await deviceService.updateDevice(id, name, status, esp32IP);
    res.json({ message: "Cập nhật thành công!" });
  } catch (error) {
    console.error("Lỗi khi cập nhật thiết bị:", error.message);
    res.status(500).send("Lỗi hệ thống.");
  }
};

const esp32Url = "http://192.168.1.59/toggle-light/server";

exports.ControlDevice = async (req, res) => {
  const { deviceID, action } = req.body; // Nhận dữ liệu từ yêu cầu của client
  const status = action === "on" ? 1 : 0;

  // Tạo dữ liệu theo định dạng x-www-form-urlencoded
  const data = qs.stringify({
    id: deviceID,
    status: status,
  });

  try {
    // Gửi yêu cầu POST đến ESP32
    const response = await axios.post(esp32Url, data, {
      headers: {
        "Content-Type": "application/x-www-form-urlencoded", // Định dạng dữ liệu
      },
    });

    console.log("Response from ESP32:", response.data);
    res.status(200).send("Device controlled successfully"); // Phản hồi về cho client
  } catch (error) {
    console.error("Error sending data to ESP32:", error.message);
    res.status(500).send("Failed to control device");
  }
};

exports.updateAlldevices = async (req, res) => {
  try {
    let data = req.body.lights;
    let temperature = req.body.temperature;
    let humidity = req.body.humidity;
    await deviceService.updateAllDevices(data);
    await deviceService.saveSensorData(temperature, humidity);
    res.json({ message: "Cập nhật thành công!" });
  } catch (error) {
    console.error("Lỗi khi cập nhật thiết bị:", error.message);
    res.status(500).send("Lỗi hệ thống.");
  }
};

exports.updateDeviceStatus = async (req, res) => {
  try {
    let id = req.body.id;
    let status = req.body.status;
    await deviceService.updateDeviceStatus(id, status);
    res.json({ message: "Cập nhật trạng thái thiết bị thành công" });
  } catch (error) {
    console.error("Lỗi khi cập nhật trạng thái:", error.message);
    res.status(500).send("Lỗi hệ thống.");
  }
};
