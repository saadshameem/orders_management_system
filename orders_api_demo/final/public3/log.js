document.addEventListener('DOMContentLoaded', () => {
    fetchOrderLogs();
  });
  
  function fetchOrderLogs() {
    const token = localStorage.getItem('token');

    if (!token) {
        console.error('JWT token not found.');
        return;
    }
    
    fetch('/api/v1/orders/order/Logs', {
        headers: {
            'Authorization': `Bearer ${token}`
        }
    })
    // fetch('/api/v1/orders/order/Logs')
      .then(response => response.json())
      .then(data => {
        const tableBody = document.querySelector('#orderLogsTable tbody');
        tableBody.innerHTML = ''; // Clear existing table rows
  
        data.forEach(log => {
          const row = document.createElement('tr');
          row.innerHTML = `
            <td>${log.id}</td>
            <td>${log.order_id}</td>
            <td>${log.user_id}</td>
            <td>${log.action}</td>
            
            <td>${new Date(log.timestamp).toLocaleString()}</td>
          `;
          tableBody.appendChild(row);
        });
      })
      .catch(error => console.error('Error fetching order logs:', error));
  }
  