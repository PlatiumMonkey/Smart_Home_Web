const db = require("../config/database");

// Hàm tạo phòng mới
exports.createRoom = (name, userID) => {
  const query = "INSERT INTO rooms (name, userID) VALUES (?, ?)";
  return new Promise((resolve, reject) => {
    db.query(query, [name, userID], (err, result) => {
      if (err) {
        return reject(err);
      }
      resolve(result.insertId); // Trả về ID của phòng vừa tạo
    });
  });
};

// Hàm lấy danh sách phòng
exports.getRooms = (userID) => {
  
  const query = "SELECT * FROM rooms WHERE userID = ?";
  return new Promise((resolve, reject) => {
    db.query(query, [userID], (err, results) => {
      if (err) {
        return reject(err);
      }
      resolve(results); // Trả về danh sách các phòng
    });
  });
};

// Hàm lấy danh sách phòng
exports.getAllRooms = () => {
  const query = "SELECT * FROM rooms";
  return new Promise((resolve, reject) => {
    db.query(query, (err, results) => {
      if (err) {
        return reject(err);
      }
      resolve(results); // Trả về danh sách các phòng
    });
  });
};

// Hàm lấy danh sách thiết bị trong phòng
exports.getDevicesByRoom = (roomID) => {
  const query = "SELECT * FROM devices WHERE roomID = ?";
  return new Promise((resolve, reject) => {
    db.query(query, [roomID], (err, results) => {
      if (err) {
        return reject(err);
      }
      resolve(results); // Trả về danh sách thiết bị
    });
  });
};

// Hàm cập nhật phòng
exports.UpdateRoom = (roomID, roomName) => {
  const query = "UPDATE rooms SET name =? WHERE id =?";
  return new Promise((resolve, reject) => {
    db.query(query, [roomName, roomID], (err) => {
      if (err) reject(err);
      else resolve();
    });
  });
};

exports.getRoomById=(roomID)=>{
  const query = "select name from rooms WHERE id =?";
  return new Promise((resolve, reject) => {
    db.query(query, [roomID], (err, results) => {
      if (err) {
        return reject(err);
      }
      resolve(results); 
    });
  });
}

// Hàm tạo phòng mới
exports.addRoom = (name,userID, numberDevices) => {
  const query = "INSERT INTO rooms (name,userID, numberDevices) VALUES (?, ?,?)";
  return new Promise((resolve, reject) => {
    db.query(query, [name,userID,numberDevices], (err, result) => {
      if (err) {
        return reject(err);
      }
      resolve(); // Trả về ID của phòng vừa tạo
    });
  });
};


//Xoá phòng
exports.deleteRoom = (roomID)=>{
  const query = "Delete from rooms where id = ?";
   return new Promise((resolve, reject) => {
    db.query(query, [roomID], (err, results) => {
      if (err) {
        return reject(err);
      }
      resolve(); 
    });
  });
}