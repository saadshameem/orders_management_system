
function getAllProducts() {
    const token = localStorage.getItem('token'); 

    if (!token) {
        console.error('JWT token not found.');
        alert('Please login')
        window.location.href = "index.html";
        return;
    }
    fetch(`/api/v1/orders/products/productName`, {
        headers: {
            'Authorization': `Bearer ${token}`
        }
    })
        .then(response => response.json())
        .then(data => {
            console.log('Received all products:', data);

            if (!data || !data.productNames) {
                console.error('Invalid data received for all orders.');
                return;
            }

            const products = data.productNames;

            const tableContainer = document.createElement('div');
            tableContainer.classList.add('table-container');
            const table = document.createElement('table');
            table.classList.add('table');
            table.innerHTML = `
            <tr>
            
                <th>Sr. No</th>
                <th>Name</th>
               
                
                <th>Action</th>

                
                
                
                
            </tr>
        `;

            
        products.forEach((product, index) => {
                addTableRow(table, product, index + 1);
            });

            tableContainer.appendChild(table);
            const content = document.querySelector('.content');
                    content.innerHTML = '';
            content.appendChild(tableContainer);

        })
        .catch(error => {
            console.error('Error fetching all orders:', error);
        });
}



function addTableRow(table, product, serialNumber){
    const row = table.insertRow();
    row.innerHTML += `
    <td class="font-semibold text-md">${serialNumber}</td>
    <td class = "font-semibold text-md">${product}</td>
   
    
   <td><button class="btn btn-primary btn-xs btn-warning" onclick="deleteProduct('${product}')">Delete</button></td>
    

    `;
}



function deleteProduct(productId){
    const token = localStorage.getItem('token')
    if(!token){
        console.error('JWT token not found')
        return;
    }

    fetch(`/api/v1/orders/products/productName/${productId}`,{
        method: 'DELETE',
        headers: {
            'Authorization': `Bearer ${token}`,
            'Content-type': 'application/json'
        }
    })
        .then(response =>{
            if(!response.ok){
                throw new Error('Failed to delete product');
            }
            return response.json()
        })
        .then(data =>{
            console.log('Product Deleted' );
            getAllProducts()
        })
        .catch(error => console.error('Error deleting product', error));
    

}