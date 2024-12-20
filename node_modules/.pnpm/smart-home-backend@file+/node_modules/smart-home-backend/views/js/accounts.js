const memberList = document.querySelector(".member-list");
const addMemberButton = document
  .querySelector(".add-member")
  .addEventListener("click", openAddMemberModal);

const memberCards = document.querySelectorAll(".member-card:not(.add-member)");
memberCards.forEach((card) => {
  const accountId = card.getAttribute("accountid");

  card.addEventListener("click", (e) => {
    if (e.target.classList.contains("delete-btn")) {
      // deleteDevice(deviceId);
    } else {
      openAccountEditModal(accountId);
    }
  });

})
  

function openAccountEditModal(accountId) {
  fetch(`/api/users/${accountId}`)
    .then((response) => response.json())
    .then((account) => {
     
      const modal = document.createElement("div");
      modal.className = "modal";
      modal.innerHTML = `
      <div class="modal-content">
          <h2>Edit Member</h2>
          <p style="font-size:15px;">Username:</p>
          <input class="username" type="text" name="name" value="${account[0].username}">
          <p style="font-size:15px;">Role:</p>
          <input class="role" type="text" name="role" value="${account[0].role}">
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
        fetch("/api/users/update", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            id: accountId,
            username: modal.querySelector(".username").value,
            role: modal.querySelector(".role").value,
          }),
        })
          .then((response) => {
            if (!response.ok) {
              throw new Error("Lỗi trong quá trình cập nhật người dùng");
            }
            return response.json();
          })
          .then((data) => {
            console.log(data.message); // Hiển thị thông báo thành công
             alert(data.message); // Hiển thị thông báo trên giao diện
          })
          .catch((error) => {
            console.error("Lỗi khi gửi yêu cầu update:", error.message);
          });
      });
    })
    .catch((error) => {
      console.error("Lỗi khi lấy danh sách thiết bị:", error);
    });

 
}

function openAddMemberModal() {
  const modal = document.createElement("div");
  modal.className = "modal";
  modal.innerHTML = `
            <div class="modal-content">
                <h2>Add New Member</h2>
                <input type="text" name="username" placeholder="username">
                <select name="role">
                    <option value="user">user</option>
                    <option value="admin">admin</option>
                </select>
                <input type="text" name="password" placeholder="password">
                <div class="modal-actions">
                    <button class="save-btn">Add Member</button>
                    <button class="cancel-btn">Cancel</button>
                </div>
            </div>
        `;

  document.body.appendChild(modal);

    

    modal.querySelector(".save-btn").addEventListener("click", () => {
      fetch("/api/users/add", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          username: modal.querySelector('input[name="username"]').value,
          password: modal.querySelector('input[name="password"]').value,
          role: modal.querySelector('select[name="role"]').value,
        }),
      })
        .then((response) => {
          if (!response.ok) {
            throw new Error("Lỗi trong quá trình thêm người dùng");
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
        }
      
      );
    })

 
  modal.querySelector(".cancel-btn").addEventListener("click", () => {
    document.body.removeChild(modal);
  
  });
}




// Lấy tất cả các nút delete-btn
const deleteButtons = document.querySelectorAll(".delete-btn");

deleteButtons.forEach((button) => {
  button.addEventListener("click", (event) => {
    const accountCard = button.closest(".member-card");
    const accountId = accountCard.getAttribute("accountid");

    // Tạo hộp thoại xác nhận
    const confirmBox = document.createElement("div");
    confirmBox.classList.add("confirm-box");
    confirmBox.innerHTML = `
      <div class="confirm-content">
        <p>Are you sure you want to delete this account?</p>
        <div class="confirm-buttons">
          <button class="confirm-yes">Yes</button>
          <button class="confirm-no">No</button>
        </div>
      </div>
    `;
    document.body.appendChild(confirmBox);

    // Xử lý sự kiện bấm Yes hoặc No
    confirmBox.querySelector(".confirm-yes").addEventListener("click", () => {
      // Xóa account nếu bấm Yes
      deleteAccount(accountId);
      document.body.removeChild(confirmBox);
    });

    confirmBox.querySelector(".confirm-no").addEventListener("click", () => {
      // Đóng hộp thoại nếu bấm No
      document.body.removeChild(confirmBox);
    });
  });
});

// Hàm xóa account
function deleteAccount(accountId) {
  
  // Gửi yêu cầu xóa thiết bị đến server
  fetch(`/api/users/${accountId}`, {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
    },
  })
    .then((response) => {
      if (response.ok) {
        // Nếu thành công, xóa account khỏi giao diện
        const memberCard = document.querySelector(
          `.member-card[accountid="${accountId}"]`
        );
        if (memberCard) {
          memberCard.remove();
        }
      } else {
        alert("Failed to delete account. Please try again.");
      }
    })
    .catch((error) => {
      console.error("Error deleting account:", error);
      alert("An error occurred while deleting the account.");
    });
}