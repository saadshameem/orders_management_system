
function getAllUsers() {
    const token = localStorage.getItem('token'); 

    if (!token) {
        console.error('JWT token not found.');
        alert('Please login')
        window.location.href = "index.html";
        return;
    }
    fetch('/api/v1/users', {
        headers: {
            'Authorization': `Bearer ${token}`
        }
    })
        .then(response => response.json())
        .then(data => {
            console.log('Received all users:', data);

            if (!data || !data.users) {
                console.error('Invalid data received for all orders.');
                return;
            }

            const users = data.users;

            const tableContainer = document.createElement('div');
            tableContainer.classList.add('table-container');
            const table = document.createElement('table');
            table.classList.add('table');
            table.innerHTML = `
            <tr>
            
                <th>Sr. No</th>
                <th>Name</th>
                <th>Email</th>
                <th>Role</th>
                
                ${determineSuperAdminStatus() ? '<th>Action</th>' : ''}

                
                
                
                
            </tr>
        `;

            
            const isSuperAdmin = determineSuperAdminStatus();
            users.forEach((user, index) => {
                addTableRow(table, user, index + 1,isSuperAdmin);
            });

            tableContainer.appendChild(table);
            const content = document.querySelector('.content');
                    content.innerHTML = '';
            content.appendChild(tableContainer);

        })
        .catch(error => {
            console.error('Error fetching all orders:', error);
        });
}



function addTableRow(table, user, serialNumber,isSuperAdmin){
    const row = table.insertRow();
    row.innerHTML += `
    <td class="font-semibold text-md">${serialNumber}</td>
    <td class = "font-semibold text-md">${user.name}</td>
    <td class = "font-semibold text-md">${user.email}</td>
    <td class = "font-semibold text-md">${user.role}</td>
    
    ${isSuperAdmin ? `<td><button class="btn btn-primary btn-xs btn-warning" onclick="deleteUser('${user.id}')">Delete</button></td>` : ''}
    

    `;
}

function determineSuperAdminStatus() {
    const role = localStorage.getItem('role');

    // Check if the user is a super admin based on their role
    return role === 'superAdmin';
}


function deleteUser(userId){
    const token = localStorage.getItem('token')
    if(!token){
        console.error('JWT token not found')
        return;
    }

    fetch(`/api/v1/users/${userId}`,{
        method: 'DELETE',
        headers: {
            'Authorization': `Bearer ${token}`,
            'Content-type': 'application/json'
        }
    })
        .then(response =>{
            if(!response.ok){
                throw new Error('Failed to delete user');
            }
            return response.json()
        })
        .then(data =>{
            console.log('User Deleted' );
            getAllUsers()
        })
        .catch(error => console.error('Error deleting user', error));
    

}