/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
            "./public3/index.html",
            "./public3/home.html",
            "./public3/allOrders.html",
            "./public3/newOrderForm.html",
            "./public3/main.js",
            "./public3/user-home.html",
            "./public3/user-allOrders.html",
            "./public3/displayOrdersUser.js",
            
],
  theme: {
    extend: {},
    colors: {
      transparent: 'transparent',
      current: 'currentColor',
      'white': '#ffffff',
      'purple': '#3f3cbb',
      'midnight': '#121063',
      'metal': '#565584',
      'tahiti': '#3ab7bf',
      'silver': '#ecebff',
      'bubble-gum': '#ff77e9', 
      'bermuda': '#78dcca',
      'cherryRed': '#990011',
      'offWhite': '#FCF6F5',
      'babyBlue': '#8AAAE5',
      'blue': '#2F3C7E',
      'pastelPink': '#FBEAEB',
      'darkCharcoal': '#101820',
      'brightYellow': '#FEE715',
      'lightRed': '#F96167',
      'darkBlue': '#00246B', 
      'lightBlue': '#CADCFC',
      'skyBlue': '#89ABE3',
      'bubblegumPink': '#EA738D',
      'midnightBlue': '#1E2761',
      'royalBlue': '#408EC6',
      'burgundyRed': '#7A2048',
      'terracottaRed': '#B85042',
      'lightBeige': '#E7E8D1', 
      'mutedTeal': '#A7BEAE',
      'seafoamGreen': '#C4DFE6',
      'lightBlue': '#66A5AD',
      'deepPeriwinkle': '#735DA5',
      'softLilac': '#D3C5E5',
      'forestGreen': '#2C5F2D',
      'mossGreen': '#97BC62',
      'pastelOliveGreen': '#A1BE95',
      'emerald': '#10b981'

      
    },
  },
  plugins: [require('flowbite/plugin'),
            require("daisyui")
          ],
}

