const pool = require("../db/connection");
const Orders = require("../db/orders");

exports.piechart = async (req, res) => {
  try {
    const results = await Orders.findOrderCount();

    const summaryData = {};
    results[0].forEach((item) => {
      summaryData[item.order_status] = item.count;
    });
    res.json(summaryData);
  } catch (error) {
    res.status(500).json(error);
  }
};

exports.productPiechart = async (req, res) => {
  try {
    const summaryData = {};
    const results = await Orders.findProductCount();
    results[0].forEach((item) => {
      summaryData[item.product_name] = item.count;
    });
    res.json(summaryData);
  } catch (error) {}
};

exports.salesPiechart = async (req, res) => {
  try {
    const { year, month } = req.query;
    const results = await Orders.salesPiechartDetails(year, month);
    const summaryData = {};
    results[0].forEach((item) => {
      summaryData[item.sales_person] = item.total_amount;
    });
    res.json(summaryData);
  } catch (error) {
    res.status(500).json(error);
  }
};

exports.getOrderStatisticsMonthly = async (req, res) => {
  const startDate = new Date(new Date().getFullYear(), 0, 1); // Start of the current year
  const endDate = new Date(new Date().getFullYear() + 1, 0, 1); // Start of the next year

  const results = await Orders.ordersStaticsMonthly(startDate, endDate);

  const monthlyData = [];
  for (let i = 1; i <= 12; i++) {
    const monthData = results[0].find((stat) => stat.month === i) || {
      month: i,
      receivedCount: 0,
      shippedCount: 0,
    };
    monthlyData.push(monthData);
  }
  res.status(200).json({ monthlyData });
};

exports.getOrderStatisticsDaily = async (req, res) => {
  try {
    const endDate = new Date();
    const startDate = new Date(endDate);
    startDate.setDate(startDate.getDate() - 14); // Start date is 14 days ago
    const dateArray = [];
    for (
      let date = new Date(startDate);
      date <= endDate;
      date.setDate(date.getDate() + 1)
    ) {
      dateArray.push(new Date(date));
    }

    const results = await Orders.shipedOrdersCount();
    const formattedData = dateArray.map((date) => {
      const matchingData = results.find(
        (stat) => new Date(stat.date).toDateString() === date.toDateString()
      );
      return {
        date: date.toDateString(),
        receivedCount: matchingData ? matchingData.receivedCount : 0,
        shippedCount: matchingData ? matchingData.shippedCount : 0,
      };
    });
    res.status(200).json({ orderStats: formattedData });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
