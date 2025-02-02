

const getAllOrders = async ()=> {
    const token = localStorage.getItem('token');

    if (!token) {
        console.error('JWT token not found.');
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

            const orders = data.orders;

            const tableContainer = document.createElement('div');
            tableContainer.classList.add('table-container');

            const fullscreenToggle = document.createElement('button');
            fullscreenToggle.textContent = 'Full Screen';
            fullscreenToggle.id = 'fullscreen-toggle';
            // fullscreenToggle.className = 'absolute top-20 right-0 bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded';

            tableContainer.appendChild(fullscreenToggle);

            const table = document.createElement('table');
            table.classList.add('table');
            table.innerHTML = `
                <tr>
                
                <th>Sr. No.</th>
                <th>Case. No</th>
                <th>Client's Firm Name</th>
                <th>Product Name</th>
                <th>Quantity</th>
                <th>PO. No</th>
                <th>Price</th>                  
                <th>Order Date</th>
                <th>Deadline Date</th>
                <th>Order Status</th>                          
                <th>Client's Name</th>
                <th>Client's Phone No.</th>
                <th>Sales Person's Name</th>
                <th>Sales Person's Id</th>
                <th>Priority</th>
                <th>Payment Status</th>
                <th>Remark</th>
                <th>Actions</th>
                <th>Image</th>
                </tr>
            `;

            orders.forEach((order, index) => {
                addTableRow(table, order, index + 1,);
            });

            tableContainer.appendChild(table);

            // Update content area with the table container
            const content = document.querySelector('.content');
            content.innerHTML = '';
            content.appendChild(tableContainer);

            fullscreenToggle.addEventListener('click', toggleFullscreen);
            document.addEventListener('fullscreenchange', handleFullscreenChange);

            function toggleFullscreen() {
                const content = document.querySelector('.content');

                if (!document.fullscreenElement) {
                    content.requestFullscreen();
                } else {
                    if (document.exitFullscreen) {
                        document.exitFullscreen();
                    }
                }
            }



            function handleFullscreenChange() {
                const content = document.querySelector('.content');
                const isFullscreen = !!document.fullscreenElement;

                if (isFullscreen) {
                    fullscreenToggle.style.display = 'none';
                } else {
                    fullscreenToggle.style.display = '';
                }
            }

        })
        .catch(error => {
            console.error('Error fetching all orders:', error);
        });
}

function toggleFullscreen() {
    const tableContainer = document.querySelector('.table-container');
    tableContainer.classList.toggle('fullscreen');
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
    if (status === 'all') {
        getAllOrders();
    } else {
        const token = localStorage.getItem('token');
        if (!token) {
            console.error('JWT token not found.');
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

                const content = document.querySelector('.content');
                content.innerHTML = '';

                if (!data || !data.orders || data.orders.length === 0) {
                    const message = document.createElement('p');
                    message.textContent = `No orders found with status: ${status}`;
                    content.appendChild(message);
                } else {
                    // Create a table container
                    const tableContainer = document.createElement('div');
                    tableContainer.classList.add('table-container');

                    const fullscreenToggle = document.createElement('button');
                    fullscreenToggle.textContent = 'Full Screen';
                    fullscreenToggle.id = 'fullscreen-toggle';
                    tableContainer.appendChild(fullscreenToggle);

                    const table = document.createElement('table');
                    table.classList.add('table');
                    table.innerHTML = `
                    <tr>
                    
                    <th>Sr. No.</th>
                    <th>Case. No</th>
                    <th>Client's Firm Name</th>
                    <th>Product Name</th>
                    <th>Quantity</th>
                    <th>PO. No</th>
                    <th>Price</th>                  
                    <th>Order Date</th>
                    <th>Deadline Date</th>
                    <th>Order Status</th>                          
                    <th>Client's Name</th>
                    <th>Client's Phone No.</th>
                    <th>Sales Person's Name</th>
                    <th>Sales Person's Id</th>
                    <th>Priority</th>
                    <th>Payment Status</th>
                    <th>Remark</th>
                    <th>Actions</th>
                    <th>Image</th>
                    </tr>
                `;

                    data.orders.forEach((order, index) => {
                        addTableRow(table, order, index + 1);
                    });

                    tableContainer.appendChild(table);

                    // Update content area with the table container
                    const content = document.querySelector('.content');
                    content.innerHTML = '';
                    content.appendChild(tableContainer);

                    fullscreenToggle.addEventListener('click', toggleFullscreen);
                    document.addEventListener('fullscreenchange', handleFullscreenChange);

                    function toggleFullscreen() {
                        const content = document.querySelector('.content');

                        if (!document.fullscreenElement) {
                            content.requestFullscreen();
                        } else {
                            if (document.exitFullscreen) {
                                document.exitFullscreen();
                            }
                        }
                    }



                    function handleFullscreenChange() {
                        const content = document.querySelector('.content');
                        const isFullscreen = !!document.fullscreenElement;

                        if (isFullscreen) {
                            fullscreenToggle.style.display = 'none';
                        } else {
                            fullscreenToggle.style.display = '';
                        }
                    }
                }
            })
            .catch(error => {
                console.error(`Error fetching ${status} orders:`, error);

            });
    }
}


function addTableRow(table, order, serialNumber) {
    const orderDate = new Date(order.createdAt);
    const formattedDate = orderDate.toLocaleDateString('en-US', {
        month: 'short',
        day: '2-digit',
        year: 'numeric'
    });

    const deadlineDate = new Date(order.deadline_date);
    const currentDate = new Date();
    const timeDifference = deadlineDate.getTime() - currentDate.getTime();
    const daysDifference = Math.floor(timeDifference / (1000 * 3600 * 24));

    const formattedDeadlineDate = deadlineDate.toLocaleDateString('en-US', {
        month: 'short',
        day: '2-digit',
        year: 'numeric'
    });

    const row = table.insertRow();

    if (deadlineDate < currentDate && order.order_status !== 'Shipped') {
        row.style.backgroundColor = '#e43838';
        row.style.color = 'white';
    } else {
        row.style.backgroundColor = '#ffffff';
        row.style.color = '#000000';
    }


    row.innerHTML += `
        <td class="font-semibold text-md" >${serialNumber}</td>
        <td class="font-semibold text-md" >${order.case_no}</td>
        <td class="font-semibold text-md" >${order.firm_name}</td>
        <td class="font-semibold text-md" >${order.product_name}</td>
        <td class="font-semibold text-md" >${order.quantity}</td>
        <td class="font-semibold text-md" >${order.po_no}</td>
        <td class="font-semibold text-md" >${order.price}</td>
        <td class="font-semibold text-md" >${formattedDate}</td>
        <td class="font-semibold text-md" >${formattedDeadlineDate}</td>
        <td class="font-semibold text-md" >${order.order_status}</td>
        <td class="font-semibold text-md" >${order.customer_name}</td>
        <td class="font-semibold text-md" >${order.customer_phone_no}</td>
        <td class="font-semibold text-md" >${order.sales_person}</td>
        <td class="font-semibold text-md" >${order.sales_person_id}</td>
        <td class="font-semibold text-md" >${order.priority}</td>
        <td class="font-semibold text-md" >${order.payment_status}</td>
        <td class="font-semibold text-md" >${order.remark}</td>
        <td class="">
            <button class="btn btn-primary btn-xs btn-info " onclick="showEditOrderForm('${order.id}')">Edit</button>
            <button class="btn btn-sencondary btn-xs btn-warning" onclick="deleteOrder('${order.id}')">Delete</button>
            <button class="btn btn-primary btn-xs" onclick="viewOrderDetails('${order.id}')">View Details</button>

        </td>
    `;
    const imageCell = row.insertCell();
    // const image = document.createElement('img');
    // // image.src = `/uploads/${order.image}`;  // Assuming order.image contains the URL of the uploaded image
    // image.src = order.image; // Assuming order.image contains the relative path to the image file

    // image.alt = 'Order Image';
    // image.width = 100; // Adjust the width of the image as needed
    // imageCell.appendChild(image);

    const imageButton = document.createElement('button');
    imageButton.textContent = 'Show P.O';
    imageButton.classList.add('btn', 'btn-primary', 'btn-success', 'btn-xs');
    imageButton.addEventListener('click', () => {
        window.open(order.image, '_blank');
    })
    imageCell.appendChild(imageButton)

}

// Function to fetch order details and display them in a modal
function viewOrderDetails(orderId) {
    const token = localStorage.getItem('token');
    if (!token) {
        console.error('JWT token not found.');
        return;
    }
    fetch(`/api/v1/orders/${orderId}`, {
        headers: {
            'Authorization': `Bearer ${token}`
        }
    })
    .then(response => response.json())
    .then(data => {
        // Display order details in a modal
        // Update the modal content with order details
        const modalTitle = document.getElementById('orderModalTitle');
        const modalBody = document.getElementById('orderModalBody');

        modalTitle.textContent = `Order Details - ${data.order.id}`;
        modalTitle.className = 'font-bold'
        modalBody.innerHTML = `
            <p>Case No: ${data.order.case_no}</p>
            <p>Firm Name: ${data.order.firm_name}</p>
            <p>Product Name: ${data.order.product_name}</p>
            <!-- Add more order details here -->
        `;

        // Show the modal
       const orderModal= document.getElementById('orderModal');
       orderModal.showModal();

        // $('#orderModal').modal('show');
    })
    .catch(error => {
        console.error('Error fetching order details:', error);
    });
}

function closeDetailsOrderModal() {
    const detailsOrderModal = document.getElementById('orderModal');
    detailsOrderModal.close();
  }




function generateCaseNumber(orderCount) {
    const paddingLength = 5; // Length of padding for case number
    const casePrefix = 'CASE'; // Prefix for the case number

    // Generate padding based on order count
    const padding = '0'.repeat(paddingLength - String(orderCount).length);

    // Concatenate prefix and padding with order count
    return `${casePrefix}${padding}${orderCount}`;
}

document.getElementById('applyFilterBtn').addEventListener('click', () => {
    const filterAttribute = document.getElementById('filterAttribute').value;
    const searchTerm = document.getElementById('searchTerm').value.trim();

    // Call function to fetch filtered orders
    fetchFilteredOrders(filterAttribute, searchTerm);
});

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

                const fullscreenToggle = document.createElement('button');
                fullscreenToggle.textContent = 'Full Screen';
                fullscreenToggle.id = 'fullscreen-toggle';
                tableContainer.appendChild(fullscreenToggle);

                const table = document.createElement('table');
                table.classList.add('table');
                table.innerHTML = `
                        <tr>
                        
                            <th>Sr. No.</th>
                            <th>Case. No</th>
                            <th>Client's Firm Name</th>
                            <th>Product Name</th>
                            <th>Quantity</th>
                            <th>PO. No</th>
                            <th>Price</th>                  
                            <th>Order Date</th>
                            <th>Deadline Date</th>
                            <th>Order Status</th>                          
                            <th>Client's Name</th>
                            <th>Client's Phone No.</th>
                            <th>Sales Person's Name</th>
                            <th>Sales Person's Id</th>
                            <th>Priority</th>
                            <th>Payment Status</th>
                            <th>Remark</th>
                            <th>Actions</th>
                            <th>Image</th>
                        </tr>
                    `;

                data.orders.forEach((order, index) => {
                    addTableRow(table, order, index + 1);
                });
                tableContainer.appendChild(table);

                // Update content area with the table container
                const content = document.querySelector('.content');
                content.innerHTML = '';
                content.appendChild(tableContainer);

                fullscreenToggle.addEventListener('click', toggleFullscreen);
                document.addEventListener('fullscreenchange', handleFullscreenChange);

                function toggleFullscreen() {
                    const content = document.querySelector('.content');

                    if (!document.fullscreenElement) {
                        content.requestFullscreen();
                    } else {
                        if (document.exitFullscreen) {
                            document.exitFullscreen();
                        }
                    }
                }



                function handleFullscreenChange() {
                    const content = document.querySelector('.content');
                    const isFullscreen = !!document.fullscreenElement;

                    if (isFullscreen) {
                        fullscreenToggle.style.display = 'none';
                    } else {
                        fullscreenToggle.style.display = '';
                    }
                }
            }
        })
        .catch(error => {
            console.error(`Error fetching  orders:`, error);

        });
}