

// Function to open a form for creating a new order
// function openNewOrderForm() {
//     const form = document.createElement('form');
//     form.innerHTML = `

//         <label for="caseNo">Case No.:</label>
//         <input type="text" id="caseNo" name="caseNo" required>

//         <label for="poNo">PO No.:</label>
//         <input type="text" id="poNo" name="poNo" required>

        

//         <label for="productName">Product Name:</label>
//         <select id="productName" name="productName">
//         <option value="Piezometer">Piezometer</option>
//         <option value="CEMS">CEMS</option>
//         <option value="AQMS">AQMS</option>
//         <option value="Flow Meter">Flow Meter</option>
//         <option value="Water Analyzer">Water Analyzer</option>
//         <option value="Multi Gas Analyzer">Multi Gas Analyzer</option>
//         </select>

//         <label for="price">Price:</label>
//         <input type="text" id="price" name="price" required>

//         <label for="quantity">Quantity:</label>
//         <input type="text" id="quantity" name="quantity" required>

//         <label for="date">Days to Deadline:</label>
//         <input type="date" id="date" name="date" required>

//         <label for="firmName">Firm Name:</label>
//         <input type="text" id="firmName" name="firmName" required>

//         <label for="customerName">Customer Name:</label>
//         <input type="text" id="customerName" name="customerName" required>

//         <label for="customerPhoneNo">Customer Phone No:</label>
//         <input type="text" id="customerPhoneNo" name="customerPhoneNo" required>

//         <label for="salesPerson">Sales Person:</label>
//         <input type="text" id="salesPerson" name="salesPerson" required>
        
//         <label for="salesPersonId">Sales Person Id:</label>
//         <input type="text" id="salesPersonId" name="salesPersonId" required>

//         <label for="orderStatus">Order Status:</label>
//         <select id="orderStatus" name="orderStatus">
//             <option value="Trading">Trading</option>
//             <option value="Pending">Pending</option>
//             <option value="In Production">In Production</option>
//             <option value="Testing">Testing</option>
//             <option value="Packed">Packed</option>
//             <option value="Shipped">Shipped</option>
//         </select>

//         <label for="priority">Priority:</label>
//         <input type="Number" id="priority" name="priority" required>

//         <label for="paymentStatus">Payment Status:</label>
//         <input type="text" id="paymentStatus" name="paymentStatus" required>

        
   

//         <button class="btn btn-outline btn-success" onclick="submitNewOrder()">Submit</button>
//     `;

//     // Update content area with the form
//     const content = document.querySelector('.content');
//     content.innerHTML = '';
//     content.appendChild(form);
// }


function generateCaseNumber(orderCount) {
    const paddingLength = 5; // Length of padding for case number
    const casePrefix = 'CASE'; // Prefix for the case number

    // Generate padding based on order count
    const padding = '0'.repeat(paddingLength - String(orderCount).length);

    // Concatenate prefix and padding with order count
    return `${casePrefix}${padding}${orderCount}`;
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
//     const imageFileInput = document.getElementById('image');
//     const imageFile = imageFileInput.files[0];

//     // Check if a file is selected
//     if (!imageFile) {
//         console.error('No image file selected.');
//         return;
//     }

//      // Fetch the current orders to determine the new priority and case number
//      fetch('/api/v1/orders', {
//         headers: {
//             'Authorization': `Bearer ${localStorage.getItem('token')}`
//         }
//     })
//     .then(response => response.json())
//     .then(data => {
//         const priority = data.orders.length + 1;
//         const caseNo = generateCaseNumber(data.orders.length + 1);

//         // Create a new FileReader object
//         const reader = new FileReader();

//         // Define the onload event handler
//         reader.onload = function(event) {
//             // Extract the Base64-encoded image data from the FileReader result
//             const imageBase64 = event.target.result;

//             // Log the Base64-encoded image data (for verification purposes)
//             console.log('Base64-encoded image:', imageBase64);

//             // Now you can proceed to send the imageBase64 and order details to the server
//             uploadOrderWithImage(imageBase64, caseNo, priority);
//         };

//         // Read the image file as a data URL (Base64-encoded)
//         reader.readAsDataURL(imageFile);
//     })
//     .catch(error => {
//         console.error('Error fetching existing orders:', error);
//     });

//     function uploadOrderWithImage(imageBase64, caseNo, priority) {
        
        
//         const orderData = {
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
//             image: imageBase64,
//             priority: priority // Set priority
//         };

//         // Send the order data to the server
//         // You can use fetch or another method to send the data to your server
//         // Make sure to adjust the URL and request method according to your server API

//         const url = '/api/v1/orders'; // Example URL where you want to submit the order
//         const token = localStorage.getItem('token'); // Assuming you have a token stored in localStorage

//         fetch(url, {
//             method: 'POST',
//             headers: {
//                 'Authorization': `Bearer ${token}`,
//                 'Content-Type': 'application/json'
//             },
//             body: JSON.stringify(orderData) // Send the order data in the request body
//         })
//         .then(response => {
//             if (response.ok) {
//                 console.log('New order created successfully.');
//             } else {
//                 console.error('Failed to create new order.');
//             }
//         })
//         .catch(error => {
//             console.error('Error creating new order:', error);
//         });
//     }
// }




function submitNewOrder() {
    // Get other form field values
    const poNo = document.getElementById('poNo').value;
    const productName = document.getElementById('productName').value;
    const price = document.getElementById('price').value;
    const quantity = document.getElementById('quantity').value;
    const date = document.getElementById('date').value;
    const firmName = document.getElementById('firmName').value;
    const customerName = document.getElementById('customerName').value;
    const customerPhoneNo = document.getElementById('customerPhoneNo').value;
    const salesPerson = document.getElementById('salesPerson').value;
    // const sales_person_id = document.getElementById('sales_person_id').value;
    const orderStatus = document.getElementById('orderStatus').value;
    const paymentStatus = document.getElementById('paymentStatus').value;

    // Get image file
    const imageFileInput = document.getElementById('image');
    const imageFile = imageFileInput.files[0];

    // Check if a file is selected
    if (!imageFile) {
        console.error('No image file selected.');
        return;
    }

    // Fetch the highest case number and priority
    fetch('/api/v1/orders/newOrderDetails', {
        headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
    })
    .then(response => response.json())
    .then(data => {
        const highestCaseNumber = data.highestCaseNumber;
        const caseNo = generateCaseNumber(highestCaseNumber + 1);
        const priority = data.priority;

        // Create a new FileReader object
        const reader = new FileReader();

        // Define the onload event handler
        reader.onload = function(event) {
            // Extract the Base64-encoded image data from the FileReader result
            const imageBase64 = event.target.result;

            // Log the Base64-encoded image data (for verification purposes)
            console.log('Base64-encoded image:', imageBase64);

            // send the imageBase64 and order details to the server
            uploadOrderWithImage(imageBase64, caseNo, priority);
        };

        // Read the image file as a data URL (Base64-encoded)
        reader.readAsDataURL(imageFile);
    })
    .catch(error => {
        console.error('Error fetching highest case number:', error);
    });

    function uploadOrderWithImage(imageBase64, caseNo, priority) {
        const orderData = {
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
            // sales_person_id: sales_person_id,
            order_status: orderStatus,
            payment_status: paymentStatus,
            image: imageBase64,
            priority: priority
        };

        // Send the order data to the server
        
        const url = '/api/v1/orders';
        const token = localStorage.getItem('token');

        fetch(url, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(orderData)
        })
        .then(response => { 
            if (response.ok) {
                console.log('New order created successfully.');
                alert("New order created successfully");
                goToAllOrders();
            } else {
                console.error('Failed to create new order.');
                // alert('Image file too large. Image file should not exceed 5 mb')
            }
        })
        .catch(error => {
            console.error('Error creating new order:', error);
        });
    }
}






