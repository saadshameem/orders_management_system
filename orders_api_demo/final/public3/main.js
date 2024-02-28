



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

            const orders = data.orders;

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
                    <th>Days Elapsed</th>
                    <th>Firm Name</th>
                    <th>Customer Name</th>
                    <th>Sales Person</th>
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


function filterProductsByFirm() {

    const searchInput = document.getElementById('searchInput');
    // const searchButton = document.getElementById('searchButton');
    const firmName = searchInput.value.trim();

    console.log('Firm Name:', firmName); // Log the firmName variable


    const token = localStorage.getItem('token'); // Assuming you store the token in localStorage

    if (!token) {
        console.error('JWT token not found.');
        // Handle the case where the token is not found (e.g., redirect to login page)
        return;
    }

    // Make the API request with the firm name parameter
    fetch(`/api/v1/orders/filter-by-firm/${firmName}`, {
        headers: {
            'Authorization': `Bearer ${token}`
        }
    })
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.json();
        })
        .then(data => {
            console.log(`Received ${firmName} orders:`, data);

            if (!data || !data.orders) {
                console.error(`Invalid data received for ${firmName} orders.`);
                return;
            }

            const orders = data.orders;

            // Check if orders array is empty
            if (orders.length === 0) {
                // Display message if no orders found
                const container = document.createElement('div');
                container.classList.add('container');

                const msg = document.createElement('div'); // Corrected
                msg.classList.add('msg');
                msg.innerHTML = `<p class="text-gray-600">No orders found for "${firmName}".</p>`;

                container.appendChild(msg);

                const content = document.querySelector('.content');
                content.innerHTML = '';
                content.appendChild(container);
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
                        <th>Days Elapsed</th>
                        <th>Firm Name</th>
                        <th>Customer Name</th>
                        <th>Sales Person</th>
                        <th>Order Status</th>
                        <th>Priority</th>
                        <th>Payment Status</th>
                        <th>Actions</th>
                    </tr>
                `;

                // Add rows to the table
                orders.forEach((order, index) => {
                    addTableRow(table, order, index + 1);
                });

                // Append table to the table container
                tableContainer.appendChild(table);

                // Update content area with the table container
                const content = document.querySelector('.content');
                content.innerHTML = '';
                content.appendChild(tableContainer);
            }
        })

        .catch(error => {
            console.error(`Error fetching ${firmName} orders:`, error);
            // You can display an error message to the user or handle the error as needed
        });
};


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

            if (!data || !data.orders) {
                console.error(`No orders found with status: ${status}`);
                return;
            }

            const orders = data.orders;

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
                    <th>Days Elapsed</th>
                    <th>Firm Name</th>
                    <th>Customer Name</th>
                    <th>Sales Person</th>
                    <th>Order Status</th>
                    <th>Priority</th>
                    <th>Payment Status</th>
                    <th>Actions</th>
                </tr>
            `;

            // Add rows to the table
            orders.forEach((order, index) => {
                addTableRow(table, order, index + 1);
            });

            // Append table to the table container
            tableContainer.appendChild(table);

            // Update content area with the table container
            const content = document.querySelector('.content');
            content.innerHTML = '';
            content.appendChild(tableContainer);
        })
        .catch(error => {
            console.error(`Error fetching ${status} orders:`, error);
            // You can display an error message to the user or handle the error as needed
        });
}


// document.addEventListener('DOMContentLoaded', function () {

//     const token = localStorage.getItem('token');
//     if (!token) {
//         console.error('JWT token not found.');
//         return;
//     }
//     // Fetch data from backend API
//     fetch('/api/v1/orders/piechart/status-summary', {
//         headers: {
//             'Authorization': `Bearer ${token}`
//         }
//     })
//         .then(response => response.json())
//         .then(data => {
//             // Extract data for the pie chart
//             const orderStatusData = {
//                 labels: Object.keys(data), // Order status labels
//                 datasets: [{
//                     data: Object.values(data), // Order count for each status
//                     backgroundColor: ['#ff6384', '#36a2eb', '#ffce56'], // Color for each segment
//                 }]
//             };

//             // Get canvas element
//             const ctx = document.getElementById('orderStatusChart').getContext('2d');

//             // Create pie chart
//             new Chart(ctx, {
//                 type: 'pie',
//                 data: orderStatusData,
//             });
//         })
//         .catch(error => {
//             console.error('Error fetching order status data:', error);
//         });
// });



function fetchOrderStatusSummary() {
    const token = localStorage.getItem('token');
    if (!token) {
        console.error('JWT token not found.');
        return;
    }

    fetch('/api/v1/orders/piechart/status-summary', {
        headers: {
            'Authorization': `Bearer ${token}`
        }
    })
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.json();
        })
        .then(data => {
            console.log('Received order status summary data:', data);


            renderOrderStatusPieChart(data);


        })
        .catch(error => {
            console.error('Error fetching order status summary data:', error);
        });
}

function renderOrderStatusPieChart(data) {
    // Check if data is empty or not an object
    if (!data || typeof data !== 'object') {
        console.error('Invalid data received for order status summary.');
        return;
    }

    // Extract status labels and counts from the received data object
    const labels = Object.keys(data);
    const counts = Object.values(data);

    // Render pie chart using Chart.js
    // var ctx = document.getElementById('orderStatusChart').getContext('2d');
    // var myChart = new Chart(ctx, {
    //     type: 'pie',
    //     data: {
    //         labels: labels,
    //         datasets: [{
    //             data: counts,
    //             backgroundColor: [
    //                 'rgba(255, 99, 132, 0.5)',
    //                 'rgba(54, 162, 235, 0.5)',
    //                 'rgba(255, 206, 86, 0.5)',
    //                 'rgba(75, 192, 192, 0.5)', // Add more colors if needed
    //             ],
    //             borderColor: [
    //                 'rgba(255, 99, 132, 1)',
    //                 'rgba(54, 162, 235, 1)',
    //                 'rgba(255, 206, 86, 1)',
    //                 'rgba(75, 192, 192, 1)', // Add more colors if needed
    //             ],
    //             borderWidth: 2
    //         }]
    //     },
    //     options: {
    //         responsive: true,
    //         maintainAspectRatio: false,
    //         animation: {
    //             duration: 2000, // Animation duration in milliseconds
    //             easing: 'easeInOutQuart' // Easing function for the animation
    //         },
    //         hover: {
    //             mode: 'nearest', // Interaction mode on hover
    //             intersect: true // Allow interaction with overlapping elements
    //         },
    //         tooltips: {
    //             enabled: true, // Enable tooltips
    //             mode: 'nearest', // Display mode of the tooltips
    //             intersect: false, // Allow tooltips to intersect with other elements
    //             position: 'nearest', // Position of the tooltips
    //             backgroundColor: 'rgba(0, 0, 0, 0.8)', // Background color of the tooltips
    //             titleFontColor: '#fff', // Font color of the tooltips title
    //             bodyFontColor: '#fff' // Font color of the tooltips body
    //         }
    //     }
    // });


    const chart = echarts.init(document.getElementById('orderStatusChart'));
    const options = {
        title: {
            text: 'Distribution of Orders ',
            subtext: 'Order Status',
            left: 'center',
            // top: '0%'
        },

        tooltip: {
            trigger: 'item',
            formatter: '{a} <br/>{b} : {c} ({d}%)'
        },
        legend: {
            orient: 'vertical',
    left: 'left'

        },
        series: [
            {
                name: 'Order Status',
                type: 'pie',
                radius: ['2%', '50%'],
                center: ['50%', '50%'],
                data: labels.map((label, index) => ({
                    value: counts[index],
                    name: label
                })),
                itemStyle: {
                    borderRadius: 10,
                    borderColor: '#fff',
                    borderWidth: 2
                },
                // label: {
                //     show: false,
                //     position: 'right'
                // },
                emphasis: {
                    // label: {
                    //     show: true,
                    //     fontSize: 20,
                    //     fontWeight: 'bold'
                    // },
                    itemStyle: {
                        shadowBlur: 10,
                        shadowOffsetX: 0,
                        shadowColor: 'rgba(0, 0, 0, 0.5)'
                    }
                },
                // labelLine: {
                //     show: false
                // },
            }
        ]
    };

    // Set the chart options and render the chart
    chart.setOption(options);
}


function addTableRow(table, order, serialNumber) {
    const orderDate = new Date(order.createdAt);
    const currentDate = new Date();
    const timeDifference = currentDate.getTime() - orderDate.getTime();
    const daysDifference = Math.floor(timeDifference / (1000 * 3600 * 24));

    // Create table row with case number

    const row = table.insertRow();
    row.innerHTML = `
        <td class="font-semibold text-md" >${serialNumber}</td>
        <td class="font-semibold text-md" >${order.case_no}</td>
        <td class="font-semibold text-md" >${order.po_no}</td>
        <td class="font-semibold text-md" >${order.product_name}</td>
        <td class="font-semibold text-md" >${order.price}</td>
        <td class="font-semibold text-md" >${order.quantity}</td>
        <td class="font-semibold text-md" >${daysDifference}</td>
        <td class="font-semibold text-md" >${order.firm_name}</td>
        <td class="font-semibold text-md" >${order.customer_name}</td>
        <td class="font-semibold text-md" >${order.sales_person}</td>
        <td class="font-semibold text-md" >${order.order_status}</td>
        <td class="font-semibold text-md" >${order.priority}</td>
        <td class="font-semibold text-md" >${order.payment_status}</td>
        <td class="">
            <button id="edit" onclick="editOrder('${order._id}')">Edit</button>
            <button id="delete" onclick="deleteOrder('${order._id}')">Delete</button>
        </td>
    `;
}

// Function to open a form for creating a new order
function openNewOrderForm() {
    const form = document.createElement('form');
    form.innerHTML = `

        <label for="caseNo">Case No.:</label>
        <input type="text" id="caseNo" name="caseNo" required>

        <label for="poNo">PO No.:</label>
        <input type="text" id="poNo" name="poNo" required>

        <label for="productName">Product Name:</label>
        <input type="text" id="productName" name="productName" required>

        <label for="price">Price:</label>
        <input type="text" id="price" name="price" required>

        <label for="quantity">Quantity:</label>
        <input type="text" id="quantity" name="quantity" required>

        <label for="firmName">Firm Name:</label>
        <input type="text" id="firmName" name="firmName" required>

        <label for="customerName">Customer Name:</label>
        <input type="text" id="customerName" name="customerName" required>

        <label for="salesPerson">Sales Person:</label>
        <input type="text" id="salesPerson" name="salesPerson" required>

        <label for="orderStatus">Order Status:</label>
        <select id="orderStatus" name="orderStatus">
            <option value="Trading">Trading</option>
            <option value="Pending">Pending</option>
            <option value="In Production">In Production</option>
            <option value="Testing">Testing</option>
            <option value="Packed">Packed</option>
            <option value="Shipped">Shipped</option>
        </select>

        <label for="priority">Priority:</label>
        <input type="Number" id="priority" name="priority" required>

        <label for="paymentStatus">Payment Status:</label>
        <input type="text" id="paymentStatus" name="paymentStatus" required>

        <button class="btn btn-outline btn-success" onclick="submitNewOrder()">Submit</button>
    `;

    // Update content area with the form
    const content = document.querySelector('.content');
    content.innerHTML = '';
    content.appendChild(form);
}


function generateCaseNumber(orderCount) {
    const paddingLength = 5; // Length of padding for case number
    const casePrefix = 'CASE'; // Prefix for the case number

    // Generate padding based on order count
    const padding = '0'.repeat(paddingLength - String(orderCount).length);

    // Concatenate prefix and padding with order count
    return `${casePrefix}${padding}${orderCount}`;
}

// Function to submit a new order
function submitNewOrder() {
    const poNo = document.getElementById('poNo').value;
    const productName = document.getElementById('productName').value;
    const price = document.getElementById('price').value;
    const quantity = document.getElementById('quantity').value;
    const firmName = document.getElementById('firmName').value;
    const customerName = document.getElementById('customerName').value;
    const salesPerson = document.getElementById('salesPerson').value;
    const orderStatus = document.getElementById('orderStatus').value;
    const paymentStatus = document.getElementById('paymentStatus').value;

    // Fetch the current orders to determine the new priority

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
            const priority = data.orders.length + 1;
            // const caseNo = data.orders.length + 1; // Set priority to the length of orders array + 1
            const caseNo = generateCaseNumber(data.orders.length + 1);

            const newOrder = {
                po_no: poNo,
                case_no: caseNo,
                product_name: productName,
                price: price,
                quantity: quantity,
                firm_name: firmName,
                customer_name: customerName,
                sales_person: salesPerson,
                order_status: orderStatus,
                payment_status: paymentStatus,
                priority: priority // Set priority
            };

            return fetch('/api/v1/orders', {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(newOrder)
            });
        })
        .then(response => response.json())
        .then(data => {
            console.log('New order created:', data.order);
            goToAllOrders() // Refresh the orders table after creating a new order
            // Optionally, you can display a success message or redirect to the orders page
        })
        .catch(error => console.error('Error creating new order:', error));
}

// Function to edit an existing order (if needed)
function editOrder(orderId) {
    const token = localStorage.getItem('token'); // Assuming you store the token in localStorage

    if (!token) {
        console.error('JWT token not found.');
        // Handle the case where the token is not found (e.g., redirect to login page)
        return;
    }
    fetch(`/api/v1/orders/${orderId}`, {
        headers: {
            'Authorization': `Bearer ${token}`,
            'Cache-Control': 'no-cache',
            'Pragma': 'no-cache'
        }
    })
        .then(response => {
            console.log('Response status:', response.status);
            console.log('Response headers:', response.headers);

            if (!response.ok) {
                throw new Error(`Failed to fetch order for editing. Status: ${response.status}`);
            }

            return response.json();
        })
        .then(data => {
            console.log('Received data for editing order:', data);

            if (!data || !data.orders) {
                console.error('Invalid data received for editing order. Expected structure:', {
                    orders: {
                        _id: '',
                        po_no: '',
                        case_no: '',
                        product_name: '',
                        price: '',
                        quantity: '',
                        firm_name: '',
                        customer_name: '',
                        sales_person: '',
                        order_status: '',
                        priority: '',
                        payment_status: ''
                    }
                });
                throw new Error('Invalid data received for editing order.');
            }

            const order = data.orders;

            // Create a form pre-filled with existing order details
            const form = document.createElement('form');
            form.innerHTML = `


                <label for="caseNo">Case No:</label>
                <input type="text" id="caseNo" name="caseNo" value="${order.case_no}" required>

                <label for="poNo">PO No:</label>
                <input type="text" id="poNo" name="poNo" value="${order.po_no}" required>

                <label for="productName">Product Name:</label>
                <input type="text" id="productName" name="productName" value="${order.product_name}" required>

                <label for="price">Price:</label>
                <input type="text" id="price" name="price" value="${order.price}" required>

                <label for="quantity">Quantity:</label>
                <input type="text" id="quantity" name="quantity" value="${order.quantity}" required>

                <label for="firmName">Firm Name:</label>
                <input type="text" id="firmName" name="firmName" value="${order.firm_name}" required>

                <label for="customerName">Customer Name:</label>
                <input type="text" id="customerName" name="customerName" value="${order.customer_name}" required>

                <label for="salesPerson">Sales Person:</label>
                <input type="text" id="salesPerson" name="salesPerson" value="${order.sales_person}" required>

                <label for="orderStatus">Order Status:</label>
                <select id="orderStatus" name="orderStatus">
                    <option value="Trading" ${order.order_status === 'Trading' ? 'selected' : ''}>Trading</option>
                    <option value="Pending" ${order.order_status === 'Pending' ? 'selected' : ''}>Pending</option>
                    <option value="In Production" ${order.order_status === 'In Production' ? 'selected' : ''}>In Production</option>
                    <option value="Testing" ${order.order_status === 'Testing' ? 'selected' : ''}>Testing</option>
                    <option value="Packed" ${order.order_status === 'Packed' ? 'selected' : ''}>Packed</option>
                    <option value="Shipped" ${order.order_status === 'Shipped' ? 'selected' : ''}>Shipped</option>
                </select>

                <label for="priority">Priority:</label>
                <input type="Number" id="priority" name="priority" value="${order.priority}" required>

                <label for="paymentStatus">Payment Status:</label>
                <input type="text" id="paymentStatus" name="paymentStatus" value="${order.payment_status}" required>

                <button class="btn btn-outline btn-success mt-5" onclick="submitUpdatedOrder('${orderId}')">Update</button>
            `;

            // Update content area with the form
            const content = document.querySelector('.content');
            content.innerHTML = '';
            content.appendChild(form);
        })
        .catch(error => console.error('Error fetching order for editing:', error));
}

// Function to submit updated order details
function submitUpdatedOrder(orderId) {
    const caseNo = document.getElementById('caseNo').value;
    const poNo = document.getElementById('poNo').value;
    const productName = document.getElementById('productName').value;
    const price = document.getElementById('price').value;
    const quantity = document.getElementById('quantity').value;
    const firmName = document.getElementById('firmName').value;
    const customerName = document.getElementById('customerName').value;
    const salesPerson = document.getElementById('salesPerson').value;
    const orderStatus = document.getElementById('orderStatus').value;
    const priority = document.getElementById('priority').value;
    const paymentStatus = document.getElementById('paymentStatus').value;

    const updatedOrder = {
        case_no: caseNo,
        po_no: poNo,
        product_name: productName,
        price: price,
        quantity: quantity,
        firm_name: firmName,
        customer_name: customerName,
        sales_person: salesPerson,
        order_status: orderStatus,
        priority: priority,
        payment_status: paymentStatus
    };

    const token = localStorage.getItem('token'); // Assuming you store the token in localStorage

    if (!token) {
        console.error('JWT token not found.');
        // Handle the case where the token is not found (e.g., redirect to login page)
        return;
    }

    fetch(`/api/v1/orders/${orderId}`, {
        method: 'PATCH',
        headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(updatedOrder)
    })
        .then(response => response.json())
        .then(data => {
            console.log('Order updated:', data.order);
            // Optionally, you can display a success message or redirect to the orders page
            goToAllOrders(); // Refresh the orders table after updating

        })
        .catch(error => console.error('Error updating order:', error));
}

// Function to delete an existing order
function deleteOrder(orderId) {

    const token = localStorage.getItem('token'); // Assuming you store the token in localStorage

    if (!token) {
        console.error('JWT token not found.');
        // Handle the case where the token is not found (e.g., redirect to login page)
        return;
    }
    fetch(`/api/v1/orders/${orderId}`, {
        method: 'DELETE',
        headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
        }
    })
        .then(response => response.json())
        .then(data => {
            console.log('Order deleted:', data.order);
            // Optionally, you can update the UI to remove the deleted order
            goToAllOrders(); // Refresh the orders table after deletion

        })
        .catch(error => console.error('Error deleting order:', error));
}
// JavaScript for handling navigation

function goToHomepage() {
    window.location.href = 'index.html';
}

function goToAllOrders() {
    window.location.href = 'allOrders.html';
}

function goToNewOrderForm() {
    window.location.href = 'newOrderForm.html';
}

