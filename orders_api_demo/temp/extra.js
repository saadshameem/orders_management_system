
// Function to fetch order statistics for the specified interval

function fetchOrderStatistics(interval) {
    const token = localStorage.getItem('token'); // Assuming you store the token in localStorage

    if (!token) {
        console.error('JWT token not found.');
        // Handle the case where the token is not found (e.g., redirect to login page)
        return;
    }

    // Construct URL with interval parameter
    const url = `/api/v1/orders/chart/stats?interval=${interval}`;

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
            renderOrderStatisticsChart(data);
        })
        .catch(error => {
            console.error('Error fetching order statistics:', error);
            // You can display an error message to the user or handle the error as needed
        });
}

// Function to render the chart using ECharts

function renderOrderStatisticsChart(data) {
    // Extract data from the response
    const { allOrdersReceived, shippedOrders } = data;

    // Initialize ECharts instance
    const chart = echarts.init(document.getElementById('orderStatisticsChart'));

    // Define chart options
    const options = {
        title: {
            text: 'Order Statistics'
        },
        tooltip: {
            trigger: 'axis'
        },
        legend: {
            data: ['All Orders Received', 'Shipped Orders']
        },
        xAxis: {
            type: 'category',
            data: ['Week', 'Month', 'Year']
        },
        yAxis: {
            type: 'value'
        },
        series: [
            {
                name: 'All Orders Received',
                type: 'bar',
                data: [allOrdersReceived, allOrdersReceived, allOrdersReceived]
            },
            {
                name: 'Shipped Orders',
                type: 'bar',
                data: [shippedOrders, shippedOrders, shippedOrders]
            }
        ]
    };

    // Set chart options and render the chart
    chart.setOption(options);
}
// Fetch order statistics for the default interval (week) when the page loads
fetchOrderStatistics('week');

//////////////////////////////////////////======================================////////////////////////////////###################################
//////////////////////////////////////////======================================////////////////////////////////###################################
//////////////////////////////////////////======================================////////////////////////////////###################################

// Function to fetch aggregated order statistics for the year
function fetchOrderStatisticsYear() {
    const token = localStorage.getItem('token');
    if (!token) {
        console.error('JWT token not found.');
        return;
    }
    fetch(`/api/v1/orders/chart/stats`, {
        method: 'GET',
        headers: {
            'Authorization': `Bearer ${token}`
        }
    })
        .then(response => response.json())
        .then(data => {
            console.log('Received order statistics for the year:', data);
            renderOrderStatisticsYearChart(data);
        })
        .catch(error => {
            console.error('Error fetching order statistics:', error);
            // Handle error
        });
}

// Function to render the chart for aggregated order statistics for the year
function renderOrderStatisticsYearChart(data) {
    const orderStats = data.orderStats;
    const months = [];
    const orders = [];
    orderStats.forEach(stat => {
        months.push(stat._id); // Push month number to array
        orders.push(stat.count); // Push order count to array
    });

    // Initialize ECharts instance
    const chart = echarts.init(document.getElementById('orderStatisticsChart'));

    // Define chart options
    const options = {
        title: {
            text: 'Order Statistics for the Year'
        },
        tooltip: {
            trigger: 'axis'
        },
        xAxis: {
            type: 'category',
            data: months // Months as x-axis data
        },
        yAxis: {
            type: 'value'
        },
        series: [
            {
                name: 'Orders',
                type: 'bar',
                data: orders // Order counts as y-axis data
            }
        ]
    };

    // Set chart options and render the chart
    chart.setOption(options);
}

// Call the function to fetch order statistics for the year when the page loads
fetchOrderStatistics();


//////////////////////////////////////////======================================////////////////////////////////###################################
//////////////////////////////////////////======================================////////////////////////////////###################################
//////////////////////////////////////////======================================////////////////////////////////###################################

// Controller code to fetch order stast by interval- week, month, year
exports.getOrderStatistics = async (req, res) => {
    const { interval } = req.query;

    try {
        let startDate, endDate;

        // Determine start and end dates based on the interval
        switch (interval) {
            case 'week':
                startDate = new Date();
                startDate.setDate(startDate.getDate() - 7);
                endDate = new Date();
                break;
            case 'month':
                startDate = new Date();
                startDate.setMonth(startDate.getMonth() - 1);
                endDate = new Date();
                break;
            case 'year':
                startDate = new Date();
                startDate.setFullYear(startDate.getFullYear() - 1);
                endDate = new Date();
                break;
            default:
                return res.status(400).json({ error: 'Invalid interval' });
        }

        // Find orders within the specified interval
        const allOrdersReceived = await Order.count({
            where: {
                createdAt: {
                    [Op.between]: [startDate, endDate]
                }
            }
        });

        const shippedOrders = await Order.count({
            where: {
                createdAt: {
                    [Op.between]: [startDate, endDate]
                },
                order_status: 'shipped'
            }
        });

        res.status(200).json({ allOrdersReceived, shippedOrders });
    } catch (error) {
        console.error('Error fetching order statistics:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};


// Controller code to fetch the date on which order created or shipped order statistics
exports.getOrderStatistics = async (req, res) => {
    try {
        // Calculate start and end dates for the past 7 days
        const endDate = new Date();
        const startDate = new Date(endDate);
        startDate.setDate(startDate.getDate() - 6); // Start date is 7 days ago

        // Aggregate order statistics for each day of the past week
        const orderStats = await Order.findAll({
            attributes: [
                [sequelize.literal('DATE(createdAt)'), 'date'],
                [sequelize.literal('SUM(CASE WHEN order_status = "shipped" THEN 1 ELSE 0 END)'), 'shippedCount'],
                [sequelize.literal('COUNT(*)'), 'receivedCount']
            ],
            where: {
                createdAt: {
                    [Op.between]: [startDate, endDate]
                }
            },
            group: sequelize.literal('DATE(createdAt)'),
            raw: true
        });

        res.status(200).json({ orderStats });
    } catch (error) {
        console.error('Error fetching order statistics:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};


// Controller code to fetch the  month in which order created or shipped order statistics
exports.getOrderStatistics = async (req, res) => {
    try {
        // Get the start and end dates for the current year
        const startDate = new Date(new Date().getFullYear(), 0, 1); // Start of the current year
        const endDate = new Date(new Date().getFullYear() + 1, 0, 1); // Start of the next year

        // Aggregate order statistics for each month of the year
        const orderStats = await Order.findAll({
            attributes: [
                [sequelize.literal('MONTH(createdAt)'), 'month'],
                [sequelize.literal('COUNT(*)'), 'count']
            ],
            where: {
                createdAt: {
                    [Op.between]: [startDate, endDate]
                }
            },
            group: sequelize.literal('MONTH(createdAt)'),
            raw: true
        });

        const shippedOrders = await Order.findAll({
            attributes: [
                [sequelize.literal('MONTH(createdAt)'), 'month'],
                [sequelize.literal('COUNT(*)'), 'count']
            ],
            where: {
                createdAt: {
                    [Op.between]: [startDate, endDate]
                },
                order_status: 'shipped'
            },
            group: sequelize.literal('MONTH(createdAt)'),
            raw: true
        });

        res.status(200).json({ orderStats, shippedOrders });
    } catch (error) {
        console.error('Error fetching order statistics:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};