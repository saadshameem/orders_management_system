/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
            "./public3/index.html",
            "./public3/allOrders.html",
            "./public3/newOrderForm.html",
            "./public3/example.html", 
            "./public3/main.js" 
],
  theme: {
    extend: {},
  },
  plugins: [require('flowbite/plugin'),
            require("daisyui")
          ],
}

