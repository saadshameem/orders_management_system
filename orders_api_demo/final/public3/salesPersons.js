
function getAllPersons() {
    const token = localStorage.getItem('token'); 

    if (!token) {
        console.error('JWT token not found.');
        alert('Please login')
        window.location.href = "index.html";
        return;
    }
    fetch(`/api/v1/users/salesPersons`, {
        headers: {
            'Authorization': `Bearer ${token}`
        }
    })
        .then(response => response.json())
        .then(data => {
            console.log('Received all persons:', data);

            if (!data || !data.salesPersons) {
                console.error('Invalid data received for all orders.');
                return;
            }

            const persons = data.salesPersons;

            const tableContainer = document.createElement('div');
            tableContainer.classList.add('table-container');
            const table = document.createElement('table');
            table.classList.add('table');
            table.innerHTML = `
            <tr>
            
                <th>Sr. No</th>
                <th>Id</th>
                <th>Name</th>
               
                
                <th>Action</th>

                
                
                
                
            </tr>
        `;

            
        persons.forEach((person, index) => {
                addTableRow(table, person, index + 1);
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



function addTableRow(table, person, serialNumber){
    const row = table.insertRow();
    row.innerHTML += `
    <td class="font-semibold text-md">${serialNumber}</td>
    <td class = "font-semibold text-md">${person.id}</td>
    <td class = "font-semibold text-md">${person.name}</td>
   
    
   <td><button class="btn btn-primary btn-xs btn-warning" onclick="deletePerson('${person}')">Delete</button></td>
    

    `;
}



function deletePerson(personId){
    const token = localStorage.getItem('token')
    if(!token){
        console.error('JWT token not found')
        return;
    }

    fetch(`/api/v1/users/salesPersons/${personId}`,{
        method: 'DELETE',
        headers: {
            'Authorization': `Bearer ${token}`,
            'Content-type': 'application/json'
        }
    })
        .then(response =>{
            if(!response.ok){
                throw new Error('Failed to delete person');
            }
            return response.json()
        })
        .then(data =>{
            console.log('Person Deleted' );
            alert('Person deleted')
            getAllPersons()
        })
        .catch(error => {console.error('Error deleting person', error);
        alert(error.message)
    });
    

}