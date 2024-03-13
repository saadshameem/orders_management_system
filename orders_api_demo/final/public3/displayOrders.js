

function getAllOrders() {
    const token = localStorage.getItem('token'); // Assuming you store the token in localStorage

    if (!token) {
        console.error('JWT token not found.');
        // Handle the case where the token is not found (e.g., redirect to login page)
        return;
    }
    fetch('/api/v1/orders', {
        headers: {
            'Authorization': `Bearer ${token}`
        }
    })
        .then(response => response.json())
        .then(data => {
            console.log('Received all orders:', data);

            if (!data || !data.orders) {
                console.error('Invalid data received for all orders.');
                return;
            }
            // console.log('Here is the data:', data);

            const orders = data.orders;

            // Create a table container
            const tableContainer = document.createElement('div');
            tableContainer.classList.add('table-container');

            // Create a table to display orders
            const table = document.createElement('table');
            table.classList.add('table');
            table.innerHTML = `
                <tr>
                    <th>Image</th>
                    <th>Sr. No</th>
                    <th>Case. No</th>
                    <th>PO. No</th>
                    <th>Product Name</th>
                    <th>Price</th>
                    <th>Quantity</th>
                    <th>Order Date</th>
                    <th>Deadline Date</th>
                    <th>Client's Firm Name</th>
                    <th>Client's Name</th>
                    <th>Client's Phone No.</th>
                    <th>Sales Person's Name</th>
                    <th>Sales Person's Id</th>
                    <th>Order Status</th>
                    <th>Priority</th>
                    <th>Payment Status</th>
                    
                    <th>Actions</th>
                </tr>
            `;

            // Add rows to the table
            orders.forEach((order, index) => {
                // const caseNumber = generateCaseNumber(index + 1);
                addTableRow(table, order, index + 1,); //caseNumber
            });

            // Append table to the table container
            tableContainer.appendChild(table);

            // Update content area with the table container
            const content = document.querySelector('.content');
            content.innerHTML = '';
            content.appendChild(tableContainer);
        })
        .catch(error => {
            console.error('Error fetching all orders:', error);
            // You can display an error message to the user or handle the error as needed
        });
}



document.addEventListener('DOMContentLoaded', function () {
    const tabLinks = document.querySelectorAll('.tab-link');

    tabLinks.forEach(link => {
        link.addEventListener('click', function () {
            const status = this.dataset.status;
            fetchOrdersByStatus(status);
        });
    });


});


function fetchOrdersByStatus(status) {
    const token = localStorage.getItem('token'); // Assuming you store the token in localStorage

    if (!token) {
        console.error('JWT token not found.');
        // Handle the case where the token is not found (e.g., redirect to login page)
        return;
    }

    fetch(`/api/v1/orders/status/${status}`, {
        headers: {
            'Authorization': `Bearer ${token}`
        }
    })
        .then(response => response.json())
        .then(data => {
            console.log(`Received ${status} orders:`, data);

            // Clear previous content
            const content = document.querySelector('.content');
            content.innerHTML = '';

            if (!data || !data.orders || data.orders.length === 0) {
                // If no orders found, display a message or hide the table
                const message = document.createElement('p');
                message.textContent = `No orders found with status: ${status}`;
                content.appendChild(message);
            } else {
                // Create a table container
                const tableContainer = document.createElement('div');
                tableContainer.classList.add('table-container');

                // Create a table to display orders
                const table = document.createElement('table');
                table.classList.add('table');
                table.innerHTML = `
                    <tr>
                        <th>Sr. No</th>
                        <th>Case. No</th>
                        <th>PO. No</th>
                        <th>Product Name</th>
                        <th>Price</th>
                        <th>Quantity</th>
                        <th>Order Date</th>
                    <th>Deadline Date</th>
                        <th>Client's Firm Name</th>
                    <th>Client's Name</th>
                    <th>Client's Phone No.</th>
                        <th>Sales Person's Name</th>
                        <th>Sales Person Id</th>
                        <th>Order Status</th>
                        <th>Priority</th>
                        <th>Payment Status</th>
                        <th>Actions</th>
                    </tr>
                `;

                // Add rows to the table
                data.orders.forEach((order, index) => {
                    addTableRow(table, order, index + 1);
                });

                // Append table to the table container
                tableContainer.appendChild(table);

                // Update content area with the table container
                content.appendChild(tableContainer);
            }
        })
        .catch(error => {
            console.error(`Error fetching ${status} orders:`, error);
            // You can display an error message to the user or handle the error as needed
        });
}




// function addTableRow(table, order, serialNumber) {
//     const orderDate = new Date(order.createdAt);
//     const formattedDate = orderDate.toLocaleDateString('en-US', {
//         month: 'short',
//         day: '2-digit',
//         year: 'numeric'
//     });

//     const deadlineDate = new Date(order.deadline_date); // Assuming deadline_date is the field containing the deadline date
//     const currentDate = new Date();
//     const timeDifference = deadlineDate.getTime() - currentDate.getTime();
//     const daysDifference = Math.floor(timeDifference / (1000 * 3600 * 24));

//     const formattedDeadlineDate = deadlineDate.toLocaleDateString('en-US', {
//         month: 'short',
//         day: '2-digit',
//         year: 'numeric'
//     });



//     // console.log('Order Deadline Date:', deadlineDate);
//     // console.log('Current Date:', currentDate);
//     // console.log('Order Status:', order.order_status);

//     // Create table row with case number
//     const row = table.insertRow();

//      // Check if the deadline date has passed
//      if (deadlineDate < currentDate && order.order_status !== 'Shipped') {
//         // console.log('Deadline has passed and order is not shipped:', order.case_no);
//         // Apply red background color to the row
//         row.style.backgroundColor = '#e43838';
//     }

//     row.innerHTML = `
//         <td class="font-semibold text-md" >${serialNumber}</td>
//         <td class="font-semibold text-md" >${order.case_no}</td>
//         <td class="font-semibold text-md" >${order.po_no}</td>
//         <td class="font-semibold text-md" >${order.product_name}</td>
//         <td class="font-semibold text-md" >${order.price}</td>
//         <td class="font-semibold text-md" >${order.quantity}</td>
//         <td class="font-semibold text-md" >${formattedDate}</td>
//         <td class="font-semibold text-md" >${formattedDeadlineDate}</td>
//         <td class="font-semibold text-md" >${order.firm_name}</td>
//         <td class="font-semibold text-md" >${order.customer_name}</td>
//         <td class="font-semibold text-md" >${order.customer_phone_no}</td>
//         <td class="font-semibold text-md" >${order.sales_person}</td>
//         <td class="font-semibold text-md" >${order.sales_person_id}</td>
//         <td class="font-semibold text-md" >${order.order_status}</td>
//         <td class="font-semibold text-md" >${order.priority}</td>
//         <td class="font-semibold text-md" >${order.payment_status}</td>
//         <td class="">
//             <button class="btn btn-outline btn-info" onclick="editOrder('${order.id}')">Edit</button>
//             <button class="btn btn-outline btn-warning" onclick="deleteOrder('${order.id}')">Delete</button>
//         </td>
//     `;
// }




function addTableRow(table, order, serialNumber) {
    const orderDate = new Date(order.createdAt);
    const formattedDate = orderDate.toLocaleDateString('en-US', {
        month: 'short',
        day: '2-digit',
        year: 'numeric'
    });

    const deadlineDate = new Date(order.deadline_date); // Assuming deadline_date is the field containing the deadline date
    const currentDate = new Date();
    const timeDifference = deadlineDate.getTime() - currentDate.getTime();
    const daysDifference = Math.floor(timeDifference / (1000 * 3600 * 24));

    const formattedDeadlineDate = deadlineDate.toLocaleDateString('en-US', {
        month: 'short',
        day: '2-digit',
        year: 'numeric'
    });

    // Create table row with case number
    const row = table.insertRow();

    // Check if the deadline date has passed
    if (deadlineDate < currentDate && order.order_status !== 'Shipped') {
        // Apply red background color to the row
        row.style.backgroundColor = '#e43838';
    }

    // Create an image element for displaying the uploaded image
    const imageCell = row.insertCell();
    const image = document.createElement('img');
    image.src = order.image; // Assuming order.image contains the URL of the uploaded image
    image.alt = 'Order Image';
    image.width = 100; // Adjust the width of the image as needed
    imageCell.appendChild(image);

    row.innerHTML += `
        <td class="font-semibold text-md" >${serialNumber}</td>
        
        <td class="font-semibold text-md" >${order.case_no}</td>
        <td class="font-semibold text-md" >${order.po_no}</td>
        <td class="font-semibold text-md" >${order.product_name}</td>
        <td class="font-semibold text-md" >${order.price}</td>
        <td class="font-semibold text-md" >${order.quantity}</td>
        <td class="font-semibold text-md" >${formattedDate}</td>
        <td class="font-semibold text-md" >${formattedDeadlineDate}</td>
        <td class="font-semibold text-md" >${order.firm_name}</td>
        <td class="font-semibold text-md" >${order.customer_name}</td>
        <td class="font-semibold text-md" >${order.customer_phone_no}</td>
        <td class="font-semibold text-md" >${order.sales_person}</td>
        <td class="font-semibold text-md" >${order.sales_person_id}</td>
        <td class="font-semibold text-md" >${order.order_status}</td>
        <td class="font-semibold text-md" >${order.priority}</td>
        <td class="font-semibold text-md" >${order.payment_status}</td>
        <td class="">
            <button class="btn btn-outline btn-info" onclick="editOrder('${order.id}')">Edit</button>
            <button class="btn btn-outline btn-warning" onclick="deleteOrder('${order.id}')">Delete</button>
        </td>
    `;
}







function generateCaseNumber(orderCount) {
    const paddingLength = 5; // Length of padding for case number
    const casePrefix = 'CASE'; // Prefix for the case number

    // Generate padding based on order count
    const padding = '0'.repeat(paddingLength - String(orderCount).length);

    // Concatenate prefix and padding with order count
    return `${casePrefix}${padding}${orderCount}`;
}

// JavaScript code to handle filter logic
document.getElementById('applyFilterBtn').addEventListener('click', () => {
    const filterAttribute = document.getElementById('filterAttribute').value;
    const searchTerm = document.getElementById('searchTerm').value.trim();

    // Call function to fetch filtered orders
    fetchFilteredOrders(filterAttribute, searchTerm);
});

// Function to fetch filtered orders
function fetchFilteredOrders(filterAttribute, searchTerm) {

    const token = localStorage.getItem('token');

    if (!token) {
        console.error('JWT token not found.');

        return;
    }

    const url = `/api/v1/orders/filter/search?attribute=${filterAttribute}&search=${searchTerm}`;
    fetch(url, {
        method: 'GET',
        headers: {
            'Authorization': `Bearer ${token}`
        }
    })
        .then(response => response.json())
        .then(data => {
            console.log(`Received orders:`, data);
            const content = document.querySelector('.content');
            content.innerHTML = '';

            if (!data || !data.orders || data.orders.length === 0) {

                const message = document.createElement('p');
                message.textContent = `No orders found `;
                content.appendChild(message);
            } else {
                // Create a table container
                const tableContainer = document.createElement('div');
                tableContainer.classList.add('table-container');

                // Create a table to display orders
                const table = document.createElement('table');
                table.classList.add('table');
                table.innerHTML = `
                        <tr>
                            <th>Serial Number</th>
                            <th>Case. No</th>
                            <th>PO. No</th>
                            <th>Product Name</th>
                            <th>Price</th>
                            <th>Quantity</th>
                            <th>Order Date</th>
                            <th>Days to Deadline</th>
                            <th>Client's Firm Name</th>
                            <th>Client's Name</th>
                            <th>Client's Phone No.</th>
                            <th>Sales Person's Name</th>
                            <th>Sales Person's Id</th>
                            <th>Order Status</th>
                            <th>Priority</th>
                            <th>Payment Status</th>
                            <th>Actions</th>
                        </tr>
                    `;

                // Add rows to the table
                data.orders.forEach((order, index) => {
                    addTableRow(table, order, index + 1);
                });
                tableContainer.appendChild(table);
                content.appendChild(tableContainer);
            }
        })
        .catch(error => {
            console.error(`Error fetching  orders:`, error);

        });
}