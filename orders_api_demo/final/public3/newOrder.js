

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


function submitNewOrder() {

    function checkEmptyField(fieldValue, fieldName) {
        if (!fieldValue.trim()) { 
            console.error(`${fieldName} field is empty.`);
            alert(`${fieldName} field is empty.`); 
            return true; 
        }
        return false; 
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
    const customerName = document.getElementById('customerName').value;
    const customerPhoneNo = document.getElementById('customerPhoneNo').value;
    
    const orderStatus = document.getElementById('orderStatus').value;
    const paymentStatus = document.getElementById('paymentStatus').value;
    const remark = document.getElementById('remark').value;
   
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
        checkEmptyField(customerName, 'Customer Name') ||
        checkEmptyField(customerPhoneNo, 'Customer Phone Number') ||
        checkEmptyField(orderStatus, 'Order Status') ||
        checkEmptyField(paymentStatus, 'Payment Status')
    ) {
        return; 
    }

            const reader = new FileReader();

            reader.onload = function (event) {
                const imageBase64 = event.target.result;

                console.log('Base64-encoded image:', imageBase64);

                uploadOrderWithImage(imageBase64);
            };

            reader.readAsDataURL(imageFile);
        
    function uploadOrderWithImage(imageBase64) {

        const orderData = {
            po_no: poNo,
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
            remark: remark
        };


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
        if (!response.ok) {
            const newOrdersBadge = document.getElementById('newOrdersBadge');
            
            console.error('Failed to reset new orders count');
        }
    })
    .catch(error => console.error('Error resetting new orders count:', error));
}