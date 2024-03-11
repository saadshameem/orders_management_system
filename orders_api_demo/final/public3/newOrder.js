

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

// function submitNewOrder() {
//     // Get other form field values
//     const poNo = document.getElementById('poNo').value;
//     const productName = document.getElementById('productName').value;
//     const price = document.getElementById('price').value;
//     const quantity = document.getElementById('quantity').value;
//     const date = document.getElementById('date').value;
//     const firmName = document.getElementById('firmName').value;
//     const customerName = document.getElementById('customerName').value;
//     const customerPhoneNo = document.getElementById('customerPhoneNo').value;
//     const salesPerson = document.getElementById('salesPerson').value;
//     const salesPersonId = document.getElementById('salesPersonId').value;
//     const orderStatus = document.getElementById('orderStatus').value;
//     const paymentStatus = document.getElementById('paymentStatus').value;
    
//     // Get image file
//     const imageFile = document.getElementById('image').files[0];
//     const token = localStorage.getItem('token');

//     if (!token) {
//         console.error('JWT token not found.');
//         // Handle the case where the token is not found (e.g., redirect to login page)
//         return;
//     }

//     // Fetch the current orders to determine the new priority
//     fetch('/api/v1/orders', {
//         headers: {
//             'Authorization': `Bearer ${token}`
//         }
//     })
//     .then(response => response.json())
//     .then(data => {
//         const priority = data.orders.length + 1;
//         const caseNo = generateCaseNumber(data.orders.length + 1);

//         const newOrder = {
//             po_no: poNo,
//             case_no: caseNo,
//             product_name: productName,
//             price: price,
//             quantity: quantity,
//             deadline_date: date,
//             firm_name: firmName,
//             customer_name: customerName,
//             customer_phone_no: customerPhoneNo,
//             sales_person: salesPerson,
//             sales_person_id: salesPersonId,
//             order_status: orderStatus,
//             payment_status: paymentStatus,
//             priority: priority // Set priority
//         };

//         const formData = new FormData();
//         formData.append('image', imageFile);
//         formData.append('orderDetails', JSON.stringify(newOrder));

//         return fetch('/api/v1/orders', {
//             method: 'POST',
//             headers: {
//                 'Authorization': `Bearer ${token}`,
//             },
//             body: formData
//         });
//     })
//     .then(response => response.json())
//     .then(data => {
//         console.log('New order created:', data.order);
//         // goToAllOrders() // Refresh the orders table after creating a new order
//         // Optionally, you can display a success message or redirect to the orders page
//     })
//     .catch(error => console.error('Error creating new order:', error));
// }
