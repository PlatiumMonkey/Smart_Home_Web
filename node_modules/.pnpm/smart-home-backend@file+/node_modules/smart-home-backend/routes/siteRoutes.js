const express = require("express");
const router = express.Router();
const userService = require("../services/UserService");
const roomsService = require("../services/RoomService");
const devicesService = require("../services/DeviceService");


router.get("/home", (req, res) => {
  res.render("home");
});

router.get("/accounts", async (req, res) => {
  data = await userService.getAllUsers();
  res.render("accounts", { data });
});

router.get("/viewrooms", async (req, res) => {
  let devicesInRoom = await roomsService.getDevicesByRoom(1);
  let rooms = await roomsService.getAllRooms();
  res.render("viewRooms",{rooms,devicesInRoom});
});

router.get("/statistics", (req, res) => {
  res.render("statistics");
});

router.get("/devices", async (req, res) => {
  let devices = await devicesService.getAllDevices();
  res.render("devices", { devices });
});

router.get("/rooms", async(req,res)=>{
  let rooms = await roomsService.getAllRooms();
  res.render("rooms",{rooms})
})

router.post("/test-api",(req,res)=>{
  console.log(req.body)
  res.send("hello");
})
module.exports = router;
