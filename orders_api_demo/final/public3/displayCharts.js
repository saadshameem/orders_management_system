


// // Fetch daily order statistics
function fetchOrderStatistics() {
    const token = localStorage.getItem('token');
    if (!token) {
        console.error('JWT token not found.');
        return;
    }

    // Construct URL for fetching daily order statistics
    const url = `/api/v1/orders/chart/stats`;

    fetch(url, {
        method: 'GET',
        headers: {
            'Authorization': `Bearer ${token}`
        }
    })
    .then(response => response.json())
    .then(data => {
        console.log('Received order statistics:', data);
        // Render chart using received data
        renderOrderStatisticsChart(data.orderStats);
    })
    .catch(error => {
        console.error('Error fetching order statistics:', error);
    });
}

// // Adjust chart rendering logic for daily data
function renderOrderStatisticsChart(orderStats) {
    // Extract dates and counts from the received data
    const dates = orderStats.map(data => data.date);
    const receivedCounts = orderStats.map(data => data.receivedCount);
    const shippedCounts = orderStats.map(data => data.shippedCount);

    // Initialize ECharts instance
    const chart = echarts.init(document.getElementById('orderStatisticsChart'));

    // Define chart options
    const options = {
        title: {
            text: 'Daily Order Statistics'
        },
        tooltip: {
            trigger: 'axis'
        },
        legend: {
            data: ['Orders Received', 'Orders Shipped']
        },
        xAxis: {
            type: 'category',
            data: dates,
            axisLabel: {
                formatter: function (value) {
                    // Format the date using JavaScript's Date object
                    const date = new Date(value);
                    // Return the formatted date (e.g., 'Mar 01')
                    return `${date.toLocaleString('default', { month: 'short' })} ${date.getDate()}`;
                },
                interval: 0, // Display all labels without skipping
                rotate: 60
            }
        },
        yAxis: {
            type: 'value'
        },
        series: [
            {
                name: 'Orders Received',
                type: 'bar',
                data: receivedCounts
            },
            {
                name: 'Orders Shipped',
                type: 'bar',
                data: shippedCounts
            }
        ]
    };

    // Set chart options and render the chart
    chart.setOption(options);
}

// fetchOrderStatistics();

//Fetch monthly order stats
function fetchOrderStatisticsMonthly() {
    const token = localStorage.getItem('token'); // Assuming you store the token in localStorage

    if (!token) {
        console.error('JWT token not found.');
        // Handle the case where the token is not found (e.g., redirect to login page)
        return;
    }

    // Construct URL for fetching order statistics
    const url = `/api/v1/orders/chart/stats/monthly`;

    // Send HTTP request to server-side endpoint
    fetch(url, {
        method: 'GET',
        headers: {
            'Authorization': `Bearer ${token}`
        }
    })
        .then(response => response.json())
        .then(data => {
            console.log('Received order statistics:', data);
            // Render chart using received data
            renderOrderStatisticsChartMonthly(data.monthlyData);
        })
        .catch(error => {
            console.error('Error fetching order statistics:', error);
            // You can display an error message to the user or handle the error as needed
        });
}


function renderOrderStatisticsChartMonthly(monthlyData) {
    // Initialize ECharts instance
    const chart = echarts.init(document.getElementById('orderStatisticsChart'));

    // Extract month labels and received counts from the received data
    const months = monthlyData.map(data => `${data.month}`);
    const receivedCounts = monthlyData.map(data => data.receivedCount);
    const shippedCounts = monthlyData.map(data => data.shippedCount);
    // Define chart options
    const options = {
        title: {
            text: 'Monthly Order Statistics'
        },
        tooltip: {
            trigger: 'axis'
        },
        legend: {
            data: ['Orders Received', 'Orders Shipped'],
            
        },
        xAxis: {
            type: 'category',
            data: months
        },
        yAxis: {
            type: 'value'
        },
        series: [
            {
                name: 'Orders Received',
                type: 'bar',
                data: receivedCounts
            },
            {
                name: 'Orders Shipped',
                type: 'bar',
                data: shippedCounts
            }
        ]
    };

    // Set chart options and render the chart
    chart.setOption(options);
}

// fetchOrderStatisticsMonthly()

function switchChart() {
    const selectedChart = document.getElementById("chartType").value;
    if (selectedChart === "daily") {
        fetchOrderStatistics();
    } else if (selectedChart === "monthly") {
        fetchOrderStatisticsMonthly();
    }
}

fetchOrderStatistics();