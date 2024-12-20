const RoomService = require("../services/RoomService");

// API tạo phòng mới
exports.createRoom = async (req, res) => {
  try {
    const { name, userID } = req.body;

    if (!name || !userID) {
      return res
        .status(400)
        .json({ error: "Tên phòng và userID là bắt buộc." });
    }

    const roomID = await RoomService.createRoom(name, userID);
    res.status(201).json({
      message: "Phòng đã được tạo thành công!",
      roomID,
    });
  } catch (err) {
    console.error("Lỗi khi tạo phòng:", err);
    res.status(500).json({ error: "Lỗi hệ thống." });
  }
};

// API lấy danh sách phòng
exports.getRooms = async (req, res) => {
  try {
    const userID = req.user.id; // Lấy ID của user từ token JWT

    const rooms = await RoomService.getRooms(userID);
    // const rooms = await RoomService.getRooms();

    res.status(200).json(rooms);
  } catch (err) {
    console.error("Lỗi khi lấy danh sách phòng:", err);
    res.status(500).json({ error: "Lỗi hệ thống." });
  }
};

// API lấy danh sách thiết bị trong phòng
exports.getDevicesByRoom = async (req, res) => {
  try {
    const roomID = req.params.roomID;

    const devices = await RoomService.getDevicesByRoom(roomID);
    res.status(200).json(devices);
  } catch (err) {
    console.error("Lỗi khi lấy danh sách thiết bị:", err);
    res.status(500).json({ error: "Lỗi hệ thống." });
  }
};

exports.updateRoom = async (req, res) => {
  try {
    const { roomID, roomName } = req.body;
    await RoomService.UpdateRoom(roomID, roomName);
    res.json({ message: "Cập nhật thành công!" });
  } catch {
    console.error("Lỗi khi cập nhật phòng:", err);
    res.status(500).json({ error: "Lỗi hệ thống." });
  }
};

exports.getRoomById = async (req, res) => {
  try {
    let roomID = req.params.roomID;
    let room = await RoomService.getRoomById(roomID);
    res.status(200).json(room);
  } catch {
    console.error("Lỗi khi lấy thông tin phòng", err);
    res.status(500).json({ error: "Lỗi hệ thống." });
  }
};

// API tạo phòng mới
exports.addRoom = async (req, res) => {
  try {
    const { name,userID, numberRooms } = req.body;

    await RoomService.addRoom(name,userID, numberRooms);
    res.status(201).json({
      message: "Phòng đã được tạo thành công!",
    });
  } catch (err) {
    console.error("Lỗi khi tạo phòng:", err);
    res.status(500).json({ error: "Lỗi hệ thống." });
  }
};


// Xoá phòng
exports.deleteRoom=async(req,res)=>{
  try{
    let roomID = req.params.roomID;
    await RoomService.deleteRoom(roomID);
    res.json({massage: "Xóa phòng thành công"})
  }
  catch{
    console.error("Lỗi khi xóa phòng:", err);
    res.status(500).json({ error: "Lỗi hệ thống." });
  }
}
