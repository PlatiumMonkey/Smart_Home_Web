const roomList = document.querySelector(".room-list");
const addRoomButton = document
  .querySelector(".add-room")
  .addEventListener("click", openAddRoomModal);

const roomCards = document.querySelectorAll(".room-card:not(.add-room)");
roomCards.forEach((card) => {
  card.addEventListener("click", (e) => {
    const roomId = card.getAttribute("roomid");
    if (e.target.classList.contains("delete-btn")) {
      // deleteRoom(card);
    } else {
      openRoomEditModal(roomId);
    }
  });
});

function openRoomEditModal(roomId) {
  fetch(`/api/rooms/${roomId}`)
    .then((response) => response.json())
    .then((room) => {
      
      const modal = document.createElement("div");
      modal.className = "modal";
      modal.innerHTML = `
      <div class="modal-content">
                <h2>Edit Room</h2>
                <input type="text" name="name" value="${room[0].name}">

       
            <div class="modal-actions">
              <button class="save-btn">Save</button>
              <button class="cancel-btn">Cancel</button>
            </div>
        </div>
      `;
      document.body.appendChild(modal);
      modal.querySelector(".cancel-btn").addEventListener("click", () => {
        document.body.removeChild(modal);
      });

      modal.querySelector(".save-btn").addEventListener("click", () => {
        fetch("api/rooms/update", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            roomID: roomId,
            roomName: modal.querySelector('input[name="name"]').value,
          }),
        })
          .then((response) => {
            if (!response.ok) {
              throw new Error("Lỗi trong quá trình cập nhật phòng");
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

function openAddRoomModal() {
  const modal = document.createElement("div");
  modal.className = "modal";
  modal.innerHTML = `
            <div class="modal-content">
                <h2>Add New Room</h2>
                <input type="text" name="name" placeholder="Room name">
                <input type="text" name="numberDevices" placeholder="Number of devices">
                <input type="text" name="userID" placeholder="UserID">
                <div class="modal-actions">
                    <button class="save-btn">Add Room</button>
                    <button class="cancel-btn">Cancel</button>
                </div>
            </div>
        `;

  document.body.appendChild(modal);

  modal.querySelector(".save-btn").addEventListener("click", () => {
    fetch("/api/rooms/add", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: modal.querySelector('input[name="name"]').value,
          userID: modal.querySelector('input[name="userID"]').value,
          numberDevices: modal.querySelector('input[name="numberDevices"]').value,
          
        }),
      })
        .then((response) => {
          if (!response.ok) {
            throw new Error("Lỗi trong quá trình thêm thiết phòng");
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
    const roomCard = button.closest(".room-card");
    const roomId = roomCard.getAttribute("roomid");

    // Tạo hộp thoại xác nhận
    const confirmBox = document.createElement("div");
    confirmBox.classList.add("confirm-box");
    confirmBox.innerHTML = `
      <div class="confirm-content">
        <p>Are you sure you want to delete this room?</p>
        <div class="confirm-buttons">
          <button class="confirm-yes">Yes</button>
          <button class="confirm-no">No</button>
        </div>
      </div>
    `;
    document.body.appendChild(confirmBox);

    // Xử lý sự kiện bấm Yes hoặc No
    confirmBox.querySelector(".confirm-yes").addEventListener("click", () => {
      // Xóa room nếu bấm Yes
      deleteRoom(roomId);
      document.body.removeChild(confirmBox);
    });

    confirmBox.querySelector(".confirm-no").addEventListener("click", () => {
      // Đóng hộp thoại nếu bấm No
      document.body.removeChild(confirmBox);
    });
  });
});

// Hàm xóa room
function deleteRoom(roomId) {
  
  // Gửi yêu cầu xóa thiết bị đến server
  fetch(`/api/rooms/${roomId}`, {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
    },
  })
    .then((response) => {
      if (response.ok) {
        // Nếu thành công, xóa room khỏi giao diện
        const roomCard = document.querySelector(
          `.room-card[roomid="${roomId}"]`
        );
        if (roomCard) {
          roomCard.remove();
        }
      } else {
        alert("Failed to delete room. Please try again.");
      }
    })
    .catch((error) => {
      console.error("Error deleting room:", error);
      alert("An error occurred while deleting the room.");
    });
}