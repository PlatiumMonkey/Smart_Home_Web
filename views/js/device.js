const deviceList = document.querySelector(".device-list");

document
  .querySelector(".add-device")
  .addEventListener("click", openAddDeviceModal);

const deviceCards = document.querySelectorAll(".device-card:not(.add-device)");
deviceCards.forEach((card) => {
  const deviceId = card.getAttribute("deviceid");
  card.addEventListener("click", (e) => {
    if (e.target.classList.contains("delete-btn")) {
      // deleteDevice(deviceId);
    } else {
      openDeviceEditModal(deviceId);
    }
  });
});

function openDeviceEditModal(deviceId) {
  fetch(`/api/devices/${deviceId}`)
    .then((response) => response.json())
    .then((device) => {
      
      const modal = document.createElement("div");
      modal.className = "modal";
      modal.innerHTML = `
            <div class="modal-content">
                <h2>Edit Device</h2>
                <input type="text" name="name" value="${device[0].name}">
                
                <select name="status">
    <option value="1" ${device[0].status === 1 ? "selected" : ""}>off</option>
    <option value="0" ${device[0].status === 0 ? "selected" : ""}>on</option>
</select>
                <input type="text" name="ESPIP" value="${device[0].esp32IP}">
                <div class="modal-actions">
                    <button class="save-btn">Save</button>
                    <button class="cancel-btn">Cancel</button>
                </div>
            </div>`;
      document.body.appendChild(modal);
      modal.querySelector(".cancel-btn").addEventListener("click", () => {
        console.log(modal.querySelector('input[name="ESPIP"]').value);
        document.body.removeChild(modal);
      });
      modal.querySelector(".save-btn").addEventListener("click", () => {
        fetch("/api/devices/update", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            id: device[0].id,
            name: modal.querySelector('input[name="name"]').value,
            status: modal.querySelector('select[name="status"]').value,
            esp32IP: modal.querySelector('input[name="ESPIP"]').value,
          }),
        })
          .then((response) => {
            if (!response.ok) {
              throw new Error("Lỗi trong quá trình cập nhật thiết bị");
            }
            return response.json();
          })
          .then((data) => {
            console.log(data.message); // Hiển thị thông báo thành công
            alert(data.message); // Hiển thị thông báo trên giao diện
            document.body.removeChild(modal);
          })
          .catch((error) => {
            console.error("Lỗi khi gửi yêu cầu update:", error.message);
          });
      });
    });
}


function openAddDeviceModal() {
  const modal = document.createElement("div");
  modal.className = "modal";
  modal.innerHTML = `
            <div class="modal-content">
                <h2>Add New Device</h2>
                <input type="text" name="name" placeholder="Name">
                <select name="status">
                    <option value="1">on</option>
                    <option value="0">off</option>
                </select>
                <input type="text" name="roomID" placeholder="RoomID">
                <input type="text" name="ESPIP" placeholder="ESP32 IP">
                
                <div class="modal-actions">
                    <button class="save-btn">Add Device</button>
                    <button class="cancel-btn">Cancel</button>
                </div>
            </div>
        `;

  document.body.appendChild(modal);

  modal.querySelector(".save-btn").addEventListener("click", () => {
    fetch("/api/devices/add-device", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        name: modal.querySelector('input[name="name"]').value,
        status: modal.querySelector('select[name="status"]').value,
        roomID: modal.querySelector('input[name="roomID"]').value,
        esp32IP: modal.querySelector('input[name="ESPIP"]').value,
      }),
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error("Lỗi trong quá trình thêm thiết bị");
        }
        return response.json();
      })
      .then((data) => {
        console.log(data.message); // Hiển thị thông báo thành công
        alert(data.message); // Hiển thị thông báo trên giao diện
        document.body.removeChild(modal);
      })
      .catch((error) => {
        console.error("Lỗi khi gửi yêu cầu:", error.message);
      });
  });

  modal.querySelector(".cancel-btn").addEventListener("click", () => {
    document.body.removeChild(modal);
  });
}

// Lấy tất cả các nút delete-btn
const deleteButtons = document.querySelectorAll(".delete-btn");

deleteButtons.forEach((button) => {
  button.addEventListener("click", (event) => {
    const deviceCard = button.closest(".device-card");
    const deviceId = deviceCard.getAttribute("deviceid");

    // Tạo hộp thoại xác nhận
    const confirmBox = document.createElement("div");
    confirmBox.classList.add("confirm-box");
    confirmBox.innerHTML = `
      <div class="confirm-content">
        <p>Are you sure you want to delete this device?</p>
        <div class="confirm-buttons">
          <button class="confirm-yes">Yes</button>
          <button class="confirm-no">No</button>
        </div>
      </div>
    `;
    document.body.appendChild(confirmBox);

    // Xử lý sự kiện bấm Yes hoặc No
    confirmBox.querySelector(".confirm-yes").addEventListener("click", () => {
      // Xóa thiết bị nếu bấm Yes
      deleteDevice(deviceId);
      document.body.removeChild(confirmBox);
    });

    confirmBox.querySelector(".confirm-no").addEventListener("click", () => {
      // Đóng hộp thoại nếu bấm No
      document.body.removeChild(confirmBox);
    });
  });
});

// Hàm xóa thiết bị
function deleteDevice(deviceId) {
  
  // Gửi yêu cầu xóa thiết bị đến server
  fetch(`/api/devices/${deviceId}`, {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
    },
  })
    .then((response) => {
      if (response.ok) {
        // Nếu thành công, xóa thiết bị khỏi giao diện
        const deviceCard = document.querySelector(
          `.device-card[deviceid="${deviceId}"]`
        );
        if (deviceCard) {
          deviceCard.remove();
        }
      } else {
        alert("Failed to delete device. Please try again.");
      }
    })
    .catch((error) => {
      console.error("Error deleting device:", error);
      alert("An error occurred while deleting the device.");
    });
}
