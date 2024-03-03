



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
    const formattedDate = orderDate.toLocaleDateString('en-US', {
        month: 'short',
        day: '2-digit',
        year: 'numeric'
    });

    const deadlineDate = new Date(order.deadline_date); // Assuming deadline_date is the field containing the deadline date
    const currentDate = new Date();
    const timeDifference = deadlineDate.getTime() - currentDate.getTime();
    const daysDifference = Math.floor(timeDifference / (1000 * 3600 * 24));

    // Create table row with case number
    const row = table.insertRow();

    // Check if the deadline date has passed
    if (deadlineDate < currentDate) {
        // Apply red background color to the row
        row.style.backgroundColor = 'red';
    }

    row.innerHTML = `
        <td class="font-semibold text-md" >${serialNumber}</td>
        <td class="font-semibold text-md" >${order.case_no}</td>
        <td class="font-semibold text-md" >${order.po_no}</td>
        <td class="font-semibold text-md" >${order.product_name}</td>
        <td class="font-semibold text-md" >${order.price}</td>
        <td class="font-semibold text-md" >${order.quantity}</td>
        <td class="font-semibold text-md" >${formattedDate}</td>
        <td class="font-semibold text-md" >${order.deadline_date}</td>
        <td class="font-semibold text-md" >${order.firm_name}</td>
        <td class="font-semibold text-md" >${order.customer_name}</td>
        <td class="font-semibold text-md" >${order.customer_phone_no}</td>
        <td class="font-semibold text-md" >${order.sales_person}</td>
        <td class="font-semibold text-md" >${order.sales_person_id}</td>
        <td class="font-semibold text-md" >${order.order_status}</td>
        <td class="font-semibold text-md" >${order.priority}</td>
        <td class="font-semibold text-md" >${order.payment_status}</td>
        <td class="">
            <button id="edit" onclick="editOrder('${order.id}')">Edit</button>
            <button id="delete" onclick="deleteOrder('${order.id}')">Delete</button>
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
        <select id="productName" name="productName">
        <option value="Piezometer">Piezometer</option>
        <option value="CEMS">CEMS</option>
        <option value="AQMS">AQMS</option>
        <option value="Flow Meter">Flow Meter</option>
        <option value="Water Analyzer">Water Analyzer</option>
        <option value="Multi Gas Analyzer">Multi Gas Analyzer</option>
        </select>

        <label for="price">Price:</label>
        <input type="text" id="price" name="price" required>

        <label for="quantity">Quantity:</label>
        <input type="text" id="quantity" name="quantity" required>

        <label for="date">Days to Deadline:</label>
        <input type="date" id="date" name="date" required>

        <label for="firmName">Firm Name:</label>
        <input type="text" id="firmName" name="firmName" required>

        <label for="customerName">Customer Name:</label>
        <input type="text" id="customerName" name="customerName" required>

        <label for="customerPhoneNo">Customer Phone No:</label>
        <input type="text" id="customerPhoneNo" name="customerPhoneNo" required>

        <label for="salesPerson">Sales Person:</label>
        <input type="text" id="salesPerson" name="salesPerson" required>
        
        <label for="salesPersonId">Sales Person Id:</label>
        <input type="text" id="salesPersonId" name="salesPersonId" required>

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
    const date = document.getElementById('date').value;
    const firmName = document.getElementById('firmName').value;
    const customerName = document.getElementById('customerName').value;
    const customerPhoneNo = document.getElementById('customerPhoneNo').value;
    const salesPerson = document.getElementById('salesPerson').value;
    const salesPersonId = document.getElementById('salesPersonId').value;
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
                deadline_date: date,
                firm_name: firmName,
                customer_name: customerName,
                customer_phone_no: customerPhoneNo,
                sales_person: salesPerson,
                sales_person_id: salesPersonId,
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

            if (!data || !data.order) {
                console.error('Invalid data received for editing order. Expected structure:', {
                    orders: {
                        id: '',
                        po_no: '',
                        case_no: '',
                        product_name: '',
                        price: '',
                        quantity: '',
                        deadline_date: '',
                        firm_name: '',
                        customer_name: '',
                        customer_phone_no: '',
                        sales_person: '',
                        sales_person_id: '',
                        order_status: '',
                        priority: '',
                        payment_status: ''
                    }
                });
                throw new Error('Invalid data received for editing order.');
            }

            const order = data.order;

            // Create a form pre-filled with existing order details
            const form = document.createElement('form');
            form.innerHTML = `


                <label for="caseNo">Case No:</label>
                <input type="text" id="caseNo" name="caseNo" value="${order.case_no}" required>

                <label for="poNo">PO No:</label>
                <input type="text" id="poNo" name="poNo" value="${order.po_no}" required>

                

                <label for="productName">Product Name:</label>
                <select id="productName" name="productName">
                    <option value="Piezometer" ${order.product_name === 'Piezometer' ? 'selected' : ''}>Piezometer</option>
                    <option value="CEMS" ${order.product_name === 'CEMS' ? 'selected' : ''}>CEMS</option>
                    <option value="AQMS" ${order.product_name === 'AQMS' ? 'selected' : ''}>AQMS</option>
                    <option value="Flow Meter" ${order.product_name === 'Flow Meter' ? 'selected' : ''}>Flow Meter</option>
                    <option value="Water Analyzer" ${order.product_name === 'Water Analyzer' ? 'selected' : ''}>Water Analyzer</option>
                    <option value="Multi Gas Analyzer" ${order.product_name === 'Multi Gas Analyzer' ? 'selected' : ''}>Multi Gas Analyzer</option>
                </select>

                <label for="price">Price:</label>
                <input type="text" id="price" name="price" value="${order.price}" required>

                <label for="quantity">Quantity:</label>
                <input type="text" id="quantity" name="quantity" value="${order.quantity}" required>

                <label for="date">Days to Deadline:</label>
                <input type="date" id="date" name="date" value="${order.deadline_date}" required>

                <label for="firmName">Firm Name:</label>
                <input type="text" id="firmName" name="firmName" value="${order.firm_name}" required>

                <label for="customerName">Customer Name:</label>
                <input type="text" id="customerName" name="customerName" value="${order.customer_name}" required>

                <label for="customerPhoneNo">Customer Phone No.:</label>
                <input type="text" id="customerPhoneNo" name="customerPhoneNo" value="${order.customer_phone_no}" required>

                <label for="salesPerson">Sales Person:</label>
                <input type="text" id="salesPerson" name="salesPerson" value="${order.sales_person}" required>

                <label for="salesPersonId">Sales Person Id:</label>
                <input type="text" id="salesPersonId" name="salesPersonId" value="${order.sales_person_id}" required>

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
    const date = document.getElementById('date').value;
    const firmName = document.getElementById('firmName').value;
    const customerName = document.getElementById('customerName').value;
    const customerPhoneNo = document.getElementById('customerPhoneNo').value;
    const salesPerson = document.getElementById('salesPerson').value;
    const salesPersonId = document.getElementById('salesPersonId').value;
    const orderStatus = document.getElementById('orderStatus').value;
    const priority = document.getElementById('priority').value;
    const paymentStatus = document.getElementById('paymentStatus').value;

    const updatedOrder = {
        case_no: caseNo,
        po_no: poNo,
        product_name: productName,
        price: price,
        quantity: quantity,
        deadline_date: date,
        firm_name: firmName,
        customer_name: customerName,
        customer_phone_no: customerPhoneNo,
        sales_person: salesPerson,
        sales_person_id: salesPersonId,
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
    const token = localStorage.getItem('token');

    if (!token) {
        console.error('JWT token not found.');
        return;
    }

    fetch(`/api/v1/orders/${orderId}`, {
        method: 'DELETE',
        headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
        }
    })
    .then(response => {
        if (!response.ok) {
            throw new Error('Failed to delete order');
        }
        return response.json();
    })
    .then(data => {
        console.log('Order deleted:', data.order);
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


  

  
//Fetch monthly order stats
// function fetchOrderStatisticsMonthly() {
//     const token = localStorage.getItem('token'); // Assuming you store the token in localStorage

//     if (!token) {
//         console.error('JWT token not found.');
//         // Handle the case where the token is not found (e.g., redirect to login page)
//         return;
//     }

//     // Construct URL for fetching order statistics
//     const url = `/api/v1/orders/chart/stats/monthly`;

//     // Send HTTP request to server-side endpoint
//     fetch(url, {
//         method: 'GET',
//         headers: {
//             'Authorization': `Bearer ${token}`
//         }
//     })
//         .then(response => response.json())
//         .then(data => {
//             console.log('Received order statistics:', data);
//             // Render chart using received data
//             renderOrderStatisticsChart(data.monthlyData);
//         })
//         .catch(error => {
//             console.error('Error fetching order statistics:', error);
//             // You can display an error message to the user or handle the error as needed
//         });
// }


// function renderOrderStatisticsChart(monthlyData) {
//     // Initialize ECharts instance
//     const chart = echarts.init(document.getElementById('orderStatisticsChart'));

//     // Extract month labels and received counts from the received data
//     const months = monthlyData.map(data => `${data.month}`);
//     const receivedCounts = monthlyData.map(data => data.receivedCount);
//     const shippedCounts = monthlyData.map(data => data.shippedCount);
//     // Define chart options
//     const options = {
//         title: {
//             text: 'Monthly Order Statistics'
//         },
//         tooltip: {
//             trigger: 'axis'
//         },
//         legend: {
//             data: ['Orders Received', 'Orders Shipped'],
            
//         },
//         xAxis: {
//             type: 'category',
//             data: months
//         },
//         yAxis: {
//             type: 'value'
//         },
//         series: [
//             {
//                 name: 'Orders Received',
//                 type: 'bar',
//                 data: receivedCounts
//             },
//             {
//                 name: 'Orders Shipped',
//                 type: 'bar',
//                 data: shippedCounts
//             }
//         ]
//     };

//     // Set chart options and render the chart
//     chart.setOption(options);
// }

// fetchOrderStatisticsMonthly()



// // Fetch daily order statistics
function fetchOrderStatistics() {
    const token = localStorage.getItem('token');
    if (!token) {
        console.error('JWT token not found.');
        return;
    }

    // Construct URL for fetching daily order statistics
    const url = `/api/v1/orders/chart/stats`;

    fetch(url, {
        method: 'GET',
        headers: {
            'Authorization': `Bearer ${token}`
        }
    })
    .then(response => response.json())
    .then(data => {
        console.log('Received order statistics:', data);
        // Render chart using received data
        renderOrderStatisticsChart(data.orderStats);
    })
    .catch(error => {
        console.error('Error fetching order statistics:', error);
    });
}

// // Adjust chart rendering logic for daily data
function renderOrderStatisticsChart(orderStats) {
    // Extract dates and counts from the received data
    const dates = orderStats.map(data => data.date);
    const receivedCounts = orderStats.map(data => data.receivedCount);
    const shippedCounts = orderStats.map(data => data.shippedCount);

    // Initialize ECharts instance
    const chart = echarts.init(document.getElementById('orderStatisticsChart'));

    // Define chart options
    const options = {
        title: {
            text: 'Daily Order Statistics'
        },
        tooltip: {
            trigger: 'axis'
        },
        legend: {
            data: ['Orders Received', 'Orders Shipped']
        },
        xAxis: {
            type: 'category',
            data: dates,
            axisLabel: {
                formatter: function (value) {
                    // Format the date using JavaScript's Date object
                    const date = new Date(value);
                    // Return the formatted date (e.g., 'Mar 01')
                    return `${date.toLocaleString('default', { month: 'short' })} ${date.getDate()}`;
                }
            }
        },
        yAxis: {
            type: 'value'
        },
        series: [
            {
                name: 'Orders Received',
                type: 'bar',
                data: receivedCounts
            },
            {
                name: 'Orders Shipped',
                type: 'bar',
                data: shippedCounts
            }
        ]
    };

    // Set chart options and render the chart
    chart.setOption(options);
}

// // Fetch daily order statistics when the page loads
fetchOrderStatistics();

// function switchChart() {
//     const selectedChart = document.getElementById("chartType").value;
//     if (selectedChart === "daily") {
//         fetchOrderStatistics();
//     } else if (selectedChart === "monthly") {
//         fetchOrderStatisticsMonthly();
//     }
// }
// fetchOrderStatisticsMonthly();



