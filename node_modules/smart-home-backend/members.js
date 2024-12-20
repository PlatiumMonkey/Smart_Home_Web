document.addEventListener('DOMContentLoaded', () => {
    const memberList = document.querySelector('.member-list');
    const addMemberButton = document.querySelector('.add-member');
    let members = [
        {
            name: 'Annie Gulberg',
            role: 'Owner',
            status: 'At home',
            room: 'Bedroom 1',
            color: 'red'
        },
        {
            name: 'John Gulberg', 
            role: 'Owner',
            status: 'At home',
            room: 'Bedroom 1',
            color: 'teal'
        },
        {
            name: 'Marie Gulberg',
            role: 'Owner 3',
            status: 'Out',
            room: 'Bedroom 2',
            color: 'navy'
        }
    ];

    function renderMembers() {
        memberList.innerHTML = members.map(member => `
            <div class="member-card ${member.color}">
                <div class="member-card-above">
                    <div class="profile-pic"></div>
                    <h2>${member.name}</h2>
                    <p>${member.role}</p>
                </div>
                <div class="member-card-under">
                    <p>Status: ${member.status}</p>
                    <p>${member.room}</p>
                </div>
            </div>
        `).join('') + `
            <div class="add-member">
                <span>+</span>
            </div>
        `;
        setupMemberCardListeners();
    }

    function setupMemberCardListeners() {
        const memberCards = document.querySelectorAll('.member-card:not(.add-member)');
        memberCards.forEach(card => {
            card.addEventListener('click', () => openMemberEditModal(card));
        });

        document.querySelector('.add-member').addEventListener('click', openAddMemberModal);
    }

    function openMemberEditModal(card) {
        const name = card.querySelector('h2').textContent;
        const member = members.find(m => m.name === name);
        
        const modal = document.createElement('div');
        modal.className = 'modal';
        modal.innerHTML = `
            <div class="modal-content">
                <h2>Edit Member</h2>
                <input type="text" name="name" value="${member.name}">
                <input type="text" name="role" value="${member.role}">
                <select name="status">
                    <option value="At home" ${member.status === 'At home' ? 'selected' : ''}>At home</option>
                    <option value="Out" ${member.status === 'Out' ? 'selected' : ''}>Out</option>
                </select>
                <input type="text" name="room" value="${member.room}">
                <div class="modal-actions">
                    <button class="save-btn">Save</button>
                    <button class="cancel-btn">Cancel</button>
                </div>
            </div>
        `;

        document.body.appendChild(modal);

        modal.querySelector('.save-btn').addEventListener('click', () => {
            const newName = modal.querySelector('input[name="name"]').value;
            const newRole = modal.querySelector('input[name="role"]').value;
            const newStatus = modal.querySelector('select[name="status"]').value;
            const newRoom = modal.querySelector('input[name="room"]').value;

            const index = members.findIndex(m => m.name === name);
            members[index] = {...members[index], name: newName, role: newRole, status: newStatus, room: newRoom};
            
            renderMembers();
            document.body.removeChild(modal);
        });

        modal.querySelector('.cancel-btn').addEventListener('click', () => {
            document.body.removeChild(modal);
        });
    }

    function openAddMemberModal() {
        const modal = document.createElement('div');
        modal.className = 'modal';
        modal.innerHTML = `
            <div class="modal-content">
                <h2>Add New Member</h2>
                <input type="text" name="name" placeholder="Name">
                <input type="text" name="role" placeholder="Role">
                <select name="status">
                    <option value="At home">At home</option>
                    <option value="Out">Out</option>
                </select>
                <input type="text" name="room" placeholder="Room">
                <select name="color">
                    <option value="red">Red</option>
                    <option value="teal">Teal</option>
                    <option value="navy">Navy</option>
                </select>
                <div class="modal-actions">
                    <button class="save-btn">Add Member</button>
                    <button class="cancel-btn">Cancel</button>
                </div>
            </div>
        `;

        document.body.appendChild(modal);

        modal.querySelector('.save-btn').addEventListener('click', () => {
            const newMember = {
                name: modal.querySelector('input[name="name"]').value,
                role: modal.querySelector('input[name="role"]').value,
                status: modal.querySelector('select[name="status"]').value,
                room: modal.querySelector('input[name="room"]').value,
                color: modal.querySelector('select[name="color"]').value
            };

            members.push(newMember);
            renderMembers();
            document.body.removeChild(modal);
        });

        modal.querySelector('.cancel-btn').addEventListener('click', () => {
            document.body.removeChild(modal);
        });
    }

    renderMembers();
});