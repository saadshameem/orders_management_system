

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
            left: 'left',
            // bottom: '0%'
            fontSize: 10
        },

        tooltip: {
            trigger: 'item',
            formatter: '{a} <br/>{b} : {c} ({d}%)'
        },
        legend: {
            orient: 'vertical',
            left: 'right'

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
                    borderWidth: 1
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


            renderProductNameBarChart(data);


        })
        .catch(error => {
            console.error('Error fetching order status summary data:', error);
        });
}

function renderProductNameBarChart(data) {
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
            text: 'Distribution of Orders',
            subtext:'Product Name',
            left: 'center'
        },
        tooltip: {
            trigger: 'axis',
            axisPointer: {
                type: 'shadow'
            }
        },
        xAxis: {
            type: 'category',
            data: labels,
            axisLabel: {
                interval: 0, // Display all labels without skipping
                rotate: 25
            }
        },
        yAxis: {
            type: 'value'
        },
        series: [{
            data: counts,
            type: 'bar'
        }]
    };

    // Set the chart options and render the chart
    chart.setOption(options);
}




function salesPiechart(year, month) {
    const token = localStorage.getItem('token');
    if (!token) {
        console.error('JWT token not found.');
        return;
    }

    fetch(`/api/v1/orders/piechart/sales?year=${year}&month=${month}`, {  // Pass year and month as query parameters
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
            renderSalesPieChart(data);
        })
        .catch(error => {
            console.error('Error fetching order status summary data:', error);
        });
}


function renderSalesPieChart(data) {
    // Check if data is empty or not an object
    if (!data || typeof data !== 'object') {
        console.error('Invalid data received for order status summary.');
        return;
    }

    // Extract status labels and counts from the received data object
    const labels = Object.keys(data);
    const counts = Object.values(data);




    const chart = echarts.init(document.getElementById('salesChart'));
    const options = {
        title: {
            text: 'Sales Distribution ',
            subtext: 'Sales Persons Name',
            left: 'right',
            // top: '0%'
        },

        tooltip: {
            trigger: 'item',
            formatter: '{a} <br/>{b} : Rs.{c} ({d}%)'
        },
        legend: {
            orient: 'vertical',
            left: 'left'

        },
        series: [
            {
                name: 'Sales Person Name',
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
                    borderWidth: 1
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