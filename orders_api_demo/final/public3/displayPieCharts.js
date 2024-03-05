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

function productNamePiechart() {
    const token = localStorage.getItem('token');
    if (!token) {
        console.error('JWT token not found.');
        return;
    }

    fetch('/api/v1/orders/piechart/productName', {
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


            renderProductNamePieChart(data);


        })
        .catch(error => {
            console.error('Error fetching order status summary data:', error);
        });
}

function renderProductNamePieChart(data) {
    // Check if data is empty or not an object
    if (!data || typeof data !== 'object') {
        console.error('Invalid data received for order status summary.');
        return;
    }

    // Extract status labels and counts from the received data object
    const labels = Object.keys(data);
    const counts = Object.values(data);




    const chart = echarts.init(document.getElementById('productNameChart'));
    const options = {
        title: {
            text: 'Distribution of Orders ',
            subtext: 'Product Name',
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
                name: 'Product Name',
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