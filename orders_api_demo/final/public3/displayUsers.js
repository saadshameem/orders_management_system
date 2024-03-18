function getAllUsers() {
    const token = localStorage.getItem('token'); // Assuming you store the token in localStorage

    if (!token) {
        console.error('JWT token not found.');
        // Handle the case where the token is not found (e.g., redirect to login page)
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

            // Clear existing content
            const content = document.querySelector('.content');
            content.innerHTML = '';

            // Loop through each user and create a card for them
            users.forEach(user => {
                const card = createUserCard(user);
                content.appendChild(card);
            });
        })
        .catch(error => {
            console.error('Error fetching all orders:', error);
            // You can display an error message to the user or handle the error as needed
        });
}

function createUserCard(user) {
    // Create card container
    const card = document.createElement('div');
    card.classList.add('user-card');

    // Populate card with user details
    card.innerHTML = `
        <div class="user-info">
            <p><strong>ID:</strong> ${user.id}</p>
            <p><strong>Name:</strong> ${user.name}</p>
            <p><strong>Email:</strong> ${user.email}</p>
            <p><strong>Role:</strong> ${user.role}</p>
        </div>
    `;

    return card;
}
