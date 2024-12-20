// document.addEventListener("DOMContentLoaded", () => {
//     // Lấy tất cả các liên kết trong menu
//     const menuLinks = document.querySelectorAll(".menu a");

//     // Xác định trang hiện tại từ URL
//     const currentPage = window.location.pathname.split("/").pop() || "display5.html";

//     // Duyệt qua các liên kết và thêm lớp "active" cho nút hiện tại
//     menuLinks.forEach(link => {
//       const linkPage = link.getAttribute("href");
//       if (linkPage === currentPage) {
//         link.parentElement.classList.add("active");
//       } else {
//         link.parentElement.classList.remove("active");
//       }
//     });

//     // Khi nhấn vào một nút, điều hướng đến trang mới
//     menuLinks.forEach(link => {
//       link.addEventListener("click", (event) => {
//         event.preventDefault();
//         const targetPage = link.getAttribute("href");
//         window.location.href = targetPage;
//       });
//     });
//   });

const devicesContainer = document.querySelector(".device-container");

function changeRoom(roomID) {
  const room = document.querySelector(`.room-button[roomid='${roomID}']`);

  document.querySelectorAll(".room-button").forEach((aroom) => {
    aroom.style.backgroundColor = "#65bdc0"; // Màu mặc định
  });
  room.style.backgroundColor = "#ee777f";
  // Lấy danh sách thiết bị trong phòng
  fetch(`/api/rooms/${roomID}/devices`)
    .then((response) => response.json())
    .then((devices) => {
      // Hiển thị danh sách thiết bị trong phòng

      devicesContainer.innerHTML = "";

      devices.forEach((device) => {
        const deviceElement = document.createElement("div");
        deviceElement.className = "device-item";
        deviceElement.setAttribute("deviceid", device.id);

        if (device.status == 1) {
          deviceElement.style.backgroundColor = "#ee777f";
        } else {
          deviceElement.style.backgroundColor = "#65bdc0";
        }
        deviceElement.innerHTML = `
            <img src="./image/${device.id}.png" alt=" " />${device.name}
          `;
        deviceElement.onclick = () => {
          controlDevice(device.id); // Gọi hàm với device.id
        };
        devicesContainer.appendChild(deviceElement);
      });
      console.log(devices);
    })
    .catch((error) => {
      console.error("Lỗi khi lấy danh sách thiết bị:", error);
    });
}

function controlDevice(deviceID) {
  let device = document.querySelector(`.device-item[deviceid='${deviceID}']`);
  device.status = device.status == 1 ? 0 : 1;
  if (device.status == 1) {
    device.style.backgroundColor = "#65bdc0";
  } else {
    device.style.backgroundColor = "#ee777f";
  }

  fetch("/api/devices/control", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      deviceID: deviceID,
      action: device.status == 1 ? "on" : "off", // 'on' hoặc 'off'
    }),
  })
    .then((response) => {
      if (!response.ok) {
        throw new Error("Lỗi trong quá trình điều khiển thiết bị");
      }
      return response.json();
    })
    .then((data) => {
      console.log(data.message); // Hiển thị thông báo thành công
      // alert(data.message); // Hiển thị thông báo trên giao diện
    })
    .catch((error) => {
      console.error("Lỗi khi gửi yêu cầu điều khiển thiết bị:", error.message);
      alert("Không thể điều khiển thiết bị. Vui lòng thử lại sau.");
    });

    fetch("/api/devices/send-data", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        deviceID: deviceID,
        action: device.status == 1 ? "on" : "off", // 'on' hoặc 'off'
      }),
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error("Lỗi trong quá trình điều khiển thiết bị");
        }
        return response.json();
      })
      .then((data) => {
        console.log(data.message); // Hiển thị thông báo thành công
        // alert(data.message); // Hiển thị thông báo trên giao diện
      })
      .catch((error) => {
        console.error("Lỗi khi gửi yêu cầu điều khiển thiết bị:", error.message);
        
      });
}
