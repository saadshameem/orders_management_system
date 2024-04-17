



function showEditOrderForm(orderId) {
    // Call the function to populate the form with order details
    populateEditOrderForm(orderId);

    // Show the edit order form by changing its display property
    // document.getElementById('editOrderForm').style.display = 'block';
    const editOrderModal = document.getElementById('editOrderModal');
    editOrderModal.showModal();
}

 // Function to close the edit order modal
 function closeEditOrderModal() {
    const editOrderModal = document.getElementById('editOrderModal');
    editOrderModal.close();
  }

function populateEditOrderForm(orderId) {
    // Fetch order details and salespersons data
    Promise.all([
        fetch(`/api/v1/orders/${orderId}`, {
            headers: {
                'Authorization': `Bearer ${localStorage.getItem('token')}`
            }
        }),
        fetch('/api/v1/users/salesPersons', {
            headers: {
                'Authorization': `Bearer ${localStorage.getItem('token')}`
            }
        })
    ])
    .then(responses => Promise.all(responses.map(response => response.json())))
    .then(([orderData, salesPersonsData]) => {
        const order = orderData.order;
        const selectedSalesPersonId = order.sales_person_id;
        const salesPersonSelect = document.getElementById('salesPerson');

        // Populate sales persons dropdown
        salesPersonsData.salesPersons.forEach(salesPerson => {
            const option = document.createElement('option');
            option.value = salesPerson.id;
            option.textContent = salesPerson.name;
            salesPersonSelect.appendChild(option);

            // Check if current sales person is the selected one
            if (salesPerson.id === selectedSalesPersonId) {
                option.selected = true;
            }
        });

        const deadlineDate = new Date(order.deadline_date);
        const formattedDeadlineDate = deadlineDate.toISOString().split('T')[0];
        // Populate the edit order form fields with order details
        document.getElementById('orderId').value = order.id;
        document.getElementById('caseNo').value = order.case_no;
        document.getElementById('poNo').value = order.po_no;
        document.getElementById('price').value = order.price;
        document.getElementById('quantity').value = order.quantity;
        document.getElementById('date').value = formattedDeadlineDate;
        document.getElementById('firmName').value = order.firm_name;
        document.getElementById('customerName').value = order.customer_name;
        document.getElementById('customerPhoneNo').value = order.customer_phone_no;
        document.getElementById('orderStatus').value = order.order_status;
        document.getElementById('priority').value = order.priority;
        document.getElementById('paymentStatus').value = order.payment_status;
        document.getElementById('remark').value = order.remark;
    })
    .catch(error => {
        console.error('Error fetching data:', error);
        alert('Failed to fetch data');
    });
}




function submitEditedOrder() {
    const orderId = document.getElementById('orderId').value; // Get the order ID from a hidden input field
    // Get other form field values
    const poNo = document.getElementById('poNo').value;
    const caseNo = document.getElementById('caseNo').value;
    const price = document.getElementById('price').value;
    const quantity = document.getElementById('quantity').value;
    const date = document.getElementById('date').value;
    const firmName = document.getElementById('firmName').value;
    const customerName = document.getElementById('customerName').value;
    const customerPhoneNo = document.getElementById('customerPhoneNo').value;
    const orderStatus = document.getElementById('orderStatus').value;
    const priority = document.getElementById('priority').value;
    const paymentStatus = document.getElementById('paymentStatus').value;
    const remark = document.getElementById('remark').value;
    const newImageFile = document.getElementById('image').files[0];

    

    
    // Check if a file is selected
    if (!newImageFile) {
        console.error('No image file selected.');
        alert('No image file selected')
        return;
    }


    const salesPersonSelect = document.getElementById('salesPerson');
    const salesPersonId = salesPersonSelect.value;
    const salesPerson = salesPersonSelect.options[salesPersonSelect.selectedIndex].text;
    

    const reader = new FileReader();
    reader.onload = function (event) {
        const newImageBase64 = event.target.result;

        console.log('Base64-encoded image:', newImageBase64);

        // Construct the updated order data
        const updatedOrderData = {
            po_no: poNo,
            case_no: caseNo,
            price: price,
            quantity: quantity,
            deadline_date: date,
            firm_name: firmName,
            customer_name: customerName,
            customer_phone_no: customerPhoneNo,
            order_status: orderStatus,
            priority: priority,
            payment_status: paymentStatus,
            remark: remark,
            sales_person: salesPerson,
            sales_person_id: salesPersonId,
            image: newImageBase64
        };

        // Send a PUT request to update the order
        fetch(`/api/v1/orders/${orderId}`, {
            method: 'PATCH',
            headers: {
                'Authorization': `Bearer ${localStorage.getItem('token')}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(updatedOrderData)
        })
            .then(response => {
                if (!response.ok) {
                    throw new Error('Failed to update order');
                }
                return response.json();
            })
            .then(data => {
                console.log('Order updated successfully:', data);
                alert('Order updated successfully');
                goToAllOrders();
                // Redirect to all orders page or perform any other action
            })
            .catch(error => {
                console.error('Error updating order:', error);
                alert('Failed to update order');
            });
    }
    // Read the image file as a data URL (Base64-encoded)
reader.readAsDataURL(newImageFile);
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
            alert('Deleted Successfully')
            goToAllOrders(); // Refresh the orders table after deletion
        })
        .catch(error => console.error('Error deleting order:', error));
}


function goToAllOrders() {
window.location.href = 'allOrders.html';
}



function goToHomepage() {
    window.location.href = 'index.html';
}


function goToNewOrderForm() {
    window.location.href = 'newOrderForm.html';
}




function displayUserInfo() {
    const name = localStorage.getItem('name');

    const userInfoElement = document.getElementById('userInfo');
    if (name) {
        userInfoElement.innerHTML = `
                    <i class="fas fa-user fa-lg mr-2"></i>
                    <span class="text-lg font-semibold">${name}</span>
                    `;
    } else {
        userInfoElement.innerHTML = `
                    <i class="fas fa-user mr-2"></i>
                    <span class="text-lg font-semibold">Welcome</span>
                    `;
    }
}

displayUserInfo();


