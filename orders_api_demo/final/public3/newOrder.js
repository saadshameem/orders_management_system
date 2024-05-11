// const { response } = require("express");


function handleFirmTypeChange() {
    const firmType = document.getElementById('firmType').value;
    const directFirmInput = document.getElementById('directFirmInput');
    const resellerInput = document.getElementById('resellerInput');

    if (firmType === 'Direct Party') {
        directFirmInput.style.display = 'block';
        resellerInput.style.display = 'none';
    } else if (firmType === 'Reseller') {
        directFirmInput.style.display = 'none';
        resellerInput.style.display = 'block';
        fetchResellers(); // Fetch resellers and populate the dropdown
    } else {
        directFirmInput.style.display = 'none';
        resellerInput.style.display = 'none';
    }
}


function fetchResellers() {

    const token = localStorage.getItem('token');
    if (!token) {
        console.error('JWT token not found.');
        alert('Please login');
        window.location.href = "index.html";
    }


    fetch('/api/v1/orders/firmType/reseller', {
        headers: {
            'Authorization': `Bearer ${token}`
        }
    })
        .then(response => response.json())
        .then(data => {
            const resellerDropdown = document.getElementById('reseller');
            resellerDropdown.innerHTML = '<option value="">Select Reseller</option>';
            data.firmNames.forEach(reseller => {
                const option = document.createElement('option');
                option.value = reseller;
                option.textContent = reseller;
                resellerDropdown.appendChild(option);
            });
        })
        .catch(error => {
            console.error('Error fetching product names:', error);
        });
}


function fetchUserName() {
    // Assuming the user's name is stored in localStorage after authentication
    return localStorage.getItem('name');
}
function fetchUserId() {
    // Assuming the user's name is stored in localStorage after authentication
    return localStorage.getItem('id');
}





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

    function checkEmptyField(fieldValue, fieldName) {
        if (!fieldValue.trim()) { // Check if the field value is empty or contains only whitespace
            console.error(`${fieldName} field is empty.`);
            alert(`${fieldName} field is empty.`); // Show error message in an alert box
            return true; // Return true if field is empty
        }
        return false; // Return false if field is not empty
    }

    const userName = fetchUserName();
    if (!userName) {
        alert('User name not available');
        return;
    }

    const userId = fetchUserId();
    if (!userId) {
        alert('User id not available');
        return;
    }

    // Get other form field values
    const poNo = document.getElementById('poNo').value;
    const productName = document.getElementById('productName').value;
    const price = document.getElementById('price').value;
    const quantity = document.getElementById('quantity').value;
    const date = document.getElementById('date').value;
    // const firmName = document.getElementById('firmName').value;
    const customerName = document.getElementById('customerName').value;
    const customerPhoneNo = document.getElementById('customerPhoneNo').value;
    // const salesPerson = document.getElementById('salesPerson').value;
    // const sales_person_id = document.getElementById('sales_person_id').value;
    const orderStatus = document.getElementById('orderStatus').value;
    const paymentStatus = document.getElementById('paymentStatus').value;
    const remark = document.getElementById('remark').value;
    // const priority = document.getElementById('priority').value;
    // Get selected sales person's ID
    // const salesPersonSelect = document.getElementById('salesPerson');
    // const salesPersonId = salesPersonSelect.value;
    // const salesPerson = salesPersonSelect.options[salesPersonSelect.selectedIndex].text;
    // Get image file
    const imageFileInput = document.getElementById('image');
    const imageFile = imageFileInput.files[0];

    const firmType = document.getElementById('firmType').value;

    if (firmType === 'Direct Party') {
        const directFirmName = document.getElementById('directFirmName').value.trim();
        if (!directFirmName) {
            alert('Please enter direct firm name');
            return;
        }
        firmInfo = directFirmName;
    } else if (firmType === 'Reseller') {
        const resellerId = document.getElementById('reseller').value;
        if (!resellerId) {
            alert('Please select a reseller');
            return;
        }
        firmInfo = resellerId;
    } else {
        alert('Please select a firm type');
        return;
    }



    // Check if a file is selected
    if (!imageFile) {
        console.error('No image file selected.');
        alert('No image file selected')
        return;
    }
    if (
        checkEmptyField(poNo, 'PO Number') ||
        checkEmptyField(productName, 'Product Name') ||
        checkEmptyField(price, 'Price') ||
        checkEmptyField(quantity, 'Quantity') ||
        checkEmptyField(date, 'Date') ||
        // checkEmptyField(firmName, 'Firm Name') ||
        checkEmptyField(customerName, 'Customer Name') ||
        checkEmptyField(customerPhoneNo, 'Customer Phone Number') ||
        // checkEmptyField(salesPerson, 'Sales Person') ||
        checkEmptyField(orderStatus, 'Order Status') ||
        checkEmptyField(paymentStatus, 'Payment Status')
    ) {
        return; // Exit the function if any field is empty
    }

    // Fetch the highest case number and priority
    // fetch('/api/v1/orders/newOrderDetails', {
    //     headers: {
    //         'Authorization': `Bearer ${localStorage.getItem('token')}`
    //     }
    // })
        // .then(response => response.json())
        // .then(data => {
        //     const highestCaseNumber = data.highestCaseNumber;
        //     const caseNo = generateCaseNumber(highestCaseNumber);
            // const priority = data.priority;


            const reader = new FileReader();

            reader.onload = function (event) {
                const imageBase64 = event.target.result;

                console.log('Base64-encoded image:', imageBase64);

                uploadOrderWithImage(imageBase64);
            };

            reader.readAsDataURL(imageFile);
        // })
        // .catch(error => {
        //     console.error('Error fetching highest case number:', error);
        //     alert('Error fetching case number')
        // });

    function uploadOrderWithImage(imageBase64) {

        const orderData = {
            po_no: poNo,
            // case_no: caseNo,
            product_name: productName,
            price: price,
            quantity: quantity,
            deadline_date: date,
            firm_type: firmType,
            firm_name: firmInfo,
            customer_name: customerName,
            customer_phone_no: customerPhoneNo,
            sales_person: userName,
            sales_person_id: userId,
            order_status: orderStatus,
            payment_status: paymentStatus,
            image: imageBase64,
            // priority: priority,
            remark: remark
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
                if (!response.ok) {
                    if (response.status === 413) {
                        throw new Error('Image size is too large. Size limit: 2mb');
                    } else {
                        throw new Error('Failed to create new order.');
                    }
                }
                return response.json();
            })
            .then(data => {
                console.log('New order created successfully.');
                alert("New order created successfully");
                goToAllOrders();
            })
            .catch(error => {
                console.error('Error creating new order:', error);
                alert('Failed to create new order. ' + error.message); // Show error message in an alert box
            });
    }
}



// Fetch new orders count from backend
function fetchNewOrdersCount() {
    const token = localStorage.getItem('token');
    if (!token) {
        console.error('JWT token not found.');
        alert('Please login');
        window.location.href = "index.html";
    }
    fetch('/api/v1/orders/new/count', {
        headers: {
            'Authorization': `Bearer ${token}`
        }
    })
        .then(response => response.json())
        .then(data => {
            // Update badge with new orders count
            const newOrdersBadge = document.getElementById('newOrdersBadge');
            newOrdersBadge.textContent = `${data.orders[0].new_orders_count}`;
        })
        .catch(error => console.error('Error fetching new orders count:', error));
}

fetchNewOrdersCount();


function showNewOrders() {
    fetch('/api/v1/orders/new/count/details', {
        headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
    })
    .then(response => response.json())
    .then(data => {
        const orders = data.orders;
        const modalTitle = document.getElementById('newOrderModalTitle');
        const modalBody = document.getElementById('newOrderModalBody');

        // Set modal title
        modalTitle.textContent = `New Order Details`;
        modalTitle.className = 'font-bold'

        // Create table structure
        const table = document.createElement('table');
        table.classList.add('table');

        // Create table header
        const tableHeader = table.createTHead();
        const headerRow = tableHeader.insertRow();
        headerRow.innerHTML = `
            <th>Case No.</th>
            <th>Product Name</th>
            <th>Firm Name</th>
            <th>Sales Person's Name</th>
            <!-- Add other table headers as needed -->
        `;

        // Create table body
        const tableBody = table.createTBody();
        orders.forEach(order => {
            const row = tableBody.insertRow();
            row.innerHTML = `
                <td>${order.case_no}</td>
                <td>${order.product_name}</td>
                <td>${order.firm_name}</td>
                <td>${order.sales_person}</td>
                <!-- Add other table cells as needed -->
            `;
        });

        // Clear modal body and append the table
        modalBody.innerHTML = '';
        modalBody.appendChild(table);

        // Show the modal
        const orderModal = document.getElementById('newOrderModal');
        orderModal.showModal();

        resetNewOrdersCount();
    })
    .catch(error => {
        console.error('Error fetching order details:', error);
    });
}

function closeNewOrderModal() {
    const newOrderModal = document.getElementById('newOrderModal');
    newOrderModal.close();
  }

  function resetNewOrdersCount() {
    fetch('/api/v1/orders/new/count/reset', {
        method: 'POST',
        headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
    })
    .then(response => {
        if (response.ok) {
            // Update the new orders count displayed on the badge
            const newOrdersBadge = document.getElementById('newOrdersBadge');
            // newOrdersBadge.textContent = 'New Orders (0)';
            // newOrdersBadge.textContent = `${data.orders[0].newOrderCount}`;
        } else {
            console.error('Failed to reset new orders count');
        }
    })
    .catch(error => console.error('Error resetting new orders count:', error));
}