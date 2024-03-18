



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

           

            const order = data.order;

            // Format deadline_date
            const deadlineDate = new Date(order.deadline_date);
            const formattedDeadlineDate = deadlineDate.toISOString().split('T')[0];

            // Create a form pre-filled with existing order details
            const form = document.createElement('form');
            form.innerHTML = `


            <div class="edit-form">
            <div class="edit-form-header">Edit Order</div>
            <div class="edit-form-row">
            <div class="edit-form-column">
                <label class="edit-form-label" for="caseNo" class="edit-form-label">Case No:</label>
                <input type="text" id="caseNo" name="caseNo" value="${order.case_no}" required class="edit-form-input">
            </div>
            <div class="edit-form-column">
                <label class="edit-form-label" for="poNo" class="edit-form-label">PO No:</label>
                <input type="text" id="poNo" name="poNo" value="${order.po_no}" required class="edit-form-input">
            </div>
        </div>
                

                <div class="edit-form-row">
                <div class="edit-form-column">
                <label class="edit-form-label" for="productName" class="edit-form-label">Product Name:</label>
                <select id="productName" name="productName" class="edit-form-input">
                    <option value="Piezometer" ${order.product_name === 'Piezometer' ? 'selected' : ''}>Piezometer</option>
                    <option value="CEMS" ${order.product_name === 'CEMS' ? 'selected' : ''}>CEMS</option>
                    <option value="AQMS" ${order.product_name === 'AQMS' ? 'selected' : ''}>AQMS</option>
                    <option value="Flow Meter" ${order.product_name === 'Flow Meter' ? 'selected' : ''}>Flow Meter</option>
                    <option value="Water Analyzer" ${order.product_name === 'Water Analyzer' ? 'selected' : ''}>Water Analyzer</option>
                    <option value="Multi Gas Analyzer" ${order.product_name === 'Multi Gas Analyzer' ? 'selected' : ''}>Multi Gas Analyzer</option>
                </select>
                </div>

                <div class="edit-form-column">
                <label class="edit-form-label" for="price" class="edit-form-label">Price:</label>
                <input type="text" id="price" name="price" value="${order.price}" required class="edit-form-input">
                </div>
                </div>


                <div class="edit-form-row">
                <div class="edit-form-column">
                <label class="edit-form-label" for="quantity">Quantity:</label>
                <input type="text" id="quantity" name="quantity" value="${order.quantity}" required class="edit-form-input">
                </div>

                <div class="edit-form-column">
                <label class="edit-form-label" for="date">Days to Deadline:</label>
        <input type="date" id="date" name="date" value="${formattedDeadlineDate}" required class="edit-form-input">
        </div>
        </div>


        <div class="edit-form-row">
        <div class="edit-form-column">
                <label class="edit-form-label" for="firmName">Firm Name:</label>
                <input type="text" id="firmName" name="firmName" value="${order.firm_name}" required class="edit-form-input">
                </div>

                <div class="edit-form-column">
                <label class="edit-form-label" for="customerName">Customer Name:</label>
                <input type="text" id="customerName" name="customerName" value="${order.customer_name}" required class="edit-form-input">
                </div>
                </div>


                <div class="edit-form-row">
                <div class="edit-form-column">
                        <label class="edit-form-label" for="customerPhoneNo">Customer Ph.:</label>
                        <input type="text" id="customerPhoneNo" name="customerPhoneNo" value="${order.customer_phone_no}" required class="edit-form-input">
                        </div>
        
                        <div class="edit-form-column">
                        <label class="edit-form-label" for="salesPerson">Sales Person:</label>
                        <input type="text" id="salesPerson" name="salesPerson" value="${order.sales_person}" required class="edit-form-input">
                        </div>
                        </div>


                


                <div class="edit-form-row">
                <div class="edit-form-column">
                <label class="edit-form-label" for="salesPersonId">Sales Per Id:</label>
                <input type="text" id="salesPersonId" name="salesPersonId" value="${order.sales_person_id}" required class="edit-form-input">
                </div>

                <div class="edit-form-column">
                <label class="edit-form-label" for="orderStatus">Order Status:</label>
                <select id="orderStatus" name="orderStatus" class="edit-form-input">
                    <option value="Trading" ${order.order_status === 'Trading' ? 'selected' : ''}>Trading</option>
                    <option value="Pending" ${order.order_status === 'Pending' ? 'selected' : ''}>Pending</option>
                    <option value="In Production" ${order.order_status === 'In Production' ? 'selected' : ''}>In Production</option>
                    <option value="Testing" ${order.order_status === 'Testing' ? 'selected' : ''}>Testing</option>
                    <option value="Packed" ${order.order_status === 'Packed' ? 'selected' : ''}>Packed</option>
                    <option value="Shipped" ${order.order_status === 'Shipped' ? 'selected' : ''}>Shipped</option>
                </select>
                </div>
                </div>

                <div class="edit-form-row">
                <div class="edit-form-column">
                <label class="edit-form-label" for="priority">Priority:</label>
                <input type="Number" id="priority" name="priority" value="${order.priority}" required class="edit-form-input">
                </div>
                <div class="edit-form-column">
                <label class="edit-form-label" for="paymentStatus">Payment Status:</label>
                <input type="text" id="paymentStatus" name="paymentStatus" value="${order.payment_status}" required class="edit-form-input">
                </div>
                </div>

                

                
                

                <div class="edit-form-footer">
            <button class="btn btn-outline btn-success" onclick="submitUpdatedOrder('${orderId}')">Update</button>
        </div>
    </div>
            `;

            // Update content area with the form
            const content = document.querySelector('.content');
            content.innerHTML = '';
            content.appendChild(form);
        })
        .catch(error => console.error('Error fetching order for editing:', error));
}



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


function goToHomepage() {
    window.location.href = 'index.html';
}

function goToAllOrders() {
    window.location.href = 'allOrders.html';
}

function goToNewOrderForm() {
    window.location.href = 'newOrderForm.html';
}



