const db = require("../config/database");
const axios = require("axios");

module.exports = {
  checkDeviceExists: (deviceID) => {
    const query = "SELECT * FROM devices WHERE id = ?";
    return new Promise((resolve, reject) => {
      db.query(query, [deviceID], (err, results) => {
        if (err) reject(err);
        else resolve(results);
      });
    });
  },

  updateDeviceStatus: (deviceID, status) => {
    const query = "UPDATE devices SET status = ? WHERE id = ?";
    return new Promise((resolve, reject) => {
      db.query(query, [status, deviceID], (err) => {
        if (err) reject(err);
        else resolve();
      });
    });
  },

  logDeviceAction: (deviceID, action) => {
    const query = "INSERT INTO Data (deviceID, action) VALUES (?, ?)";
    return new Promise((resolve, reject) => {
      db.query(query, [deviceID, action], (err) => {
        if (err) reject(err);
        else resolve();
      });
    });
  },

  addDevice: (name, status, roomID, esp32IP) => {
    const query =
      "INSERT INTO devices (name, status, roomID, esp32IP) VALUES (?, ?, ?, ?)";
    return new Promise((resolve, reject) => {
      db.query(query, [name, status || 0, roomID, esp32IP], (err, result) => {
        if (err) reject(err);
        else resolve(result.insertId);
      });
    });
  },

  updateRoomDeviceCount: (roomID, increment = 1) => {
    const query = `
            UPDATE rooms
            SET numberDevices = GREATEST(numberDevices + ?, 0)
            WHERE id = ?`;
    return new Promise((resolve, reject) => {
      db.query(query, [increment, roomID], (err) => {
        if (err) reject(err);
        else resolve();
      });
    });
  },

  deleteDevice: (deviceID) => {
    const query = "DELETE FROM devices WHERE id = ?";
    return new Promise((resolve, reject) => {
      db.query(query, [deviceID], (err) => {
        if (err) reject(err);
        else resolve();
      });
    });
  },

  getAllDeviceLogs: () => {
    const query = "SELECT * FROM Data ORDER BY timestamp DESC"; // Truy vấn tất cả dữ liệu
    return new Promise((resolve, reject) => {
      db.query(query, (err, results) => {
        if (err) reject(err); // Trả về lỗi nếu có
        else resolve(results); // Trả về kết quả
      });
    });
  },

  getDeviceLogs: (deviceID) => {
    const query =
      "SELECT * FROM Data WHERE deviceID = ? ORDER BY timestamp DESC";
    return new Promise((resolve, reject) => {
      db.query(query, [deviceID], (err, results) => {
        if (err) reject(err);
        else resolve(results);
      });
    });
  },

  getDeviceStatus: (deviceID) => {
    const query = "SELECT * FROM devices WHERE id = ?";
    return new Promise((resolve, reject) => {
      db.query(query, [deviceID], (err, results) => {
        if (err) reject(err);
        else resolve(results);
      });
    });
  },

  saveSensorData: (temperature, humidity) => {
    const query =
      "INSERT INTO sensor_data (temperature, humidity) VALUES (?, ?)";
    return new Promise((resolve, reject) => {
      db.query(query, [temperature, humidity], (err) => {
        if (err) reject(err);
        else resolve();
      });
    });
  },

  getSensorData: (limit) => {
    const query = "SELECT * FROM sensor_data ORDER BY timestamp DESC LIMIT ?";
    return new Promise((resolve, reject) => {
      db.query(query, [limit], (err, results) => {
        if (err) reject(err);
        else resolve(results);
      });
    });
  },

  getDevicesByRoom: (roomID) => {
    const query = "SELECT * FROM devices WHERE roomID = ?";
    return new Promise((resolve, reject) => {
      db.query(query, [roomID], (err, results) => {
        if (err) reject(err);
        else resolve(results);
      });
    });
  },

  getLatestTemperatureAndHumidity: () => {
    const query = "SELECT * FROM sensor_data ORDER BY timestamp DESC LIMIT 1";
    return new Promise((resolve, reject) => {
      db.query(query, (err, results) => {
        if (err) reject(err);
        else resolve(results);
      });
    });
  },

  getAllDevices: () => {
    const query = "SELECT * FROM devices";
    return new Promise((resolve, reject) => {
      db.query(query, (err, results) => {
        if (err) reject(err);
        else resolve(results);
      });
    });
  },

  getDevice: (deviceID) => {
    const query = "SELECT * FROM devices where id = ?";
    return new Promise((resolve, reject) => {
      db.query(query, [deviceID], (err, results) => {
        if (err) reject(err);
        else resolve(results);
      });
    });
  },

  updateDevice: (deviceID, deviceName, deviceStatus, ESPIP) => {
    const query =
      "UPDATE devices SET name =?, status =?, esp32IP =? WHERE id =?";
    return new Promise((resolve, reject) => {
      db.query(query, [deviceName, deviceStatus, ESPIP, deviceID], (err) => {
        if (err) reject(err);
        else resolve();
      });
    });
  },
  updateAllDevices: (devices) => {
    const promises = devices.map((device) => {
      const query = "UPDATE devices SET status = ? WHERE id = ?";
      return new Promise((resolve, reject) => {
        db.query(query, [device.status, device.id], (err) => {
          if (err) reject(err);
          else resolve();
        });
      });
    });

    return Promise.all(promises);
  },

  updateDeviceStatus: (id,status)=>{
    
    console.log(id)
    console.log(status)
    const query =
      "UPDATE devices SET status =? WHERE id =?";
    return new Promise((resolve, reject) => {
      db.query(query, [status,id], (err) => {
        if (err) reject(err);
        else resolve();
      });
    });
  }
};
