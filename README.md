# Currency converter

## A DuckDuckGo currency converter clone with multi-converter support on a single page.

Demo version: https://ddg-currency-converter-clone.netlify.app

This is a web application written in React allowing user to get exchange rates and convert currencies based on user's input amount, along with the functionality to add multiple converters to the same page to make the conversion more convenient instead of switching between multiple tabs.

## What I implemented

- Custom dropdown select component: search input, keyboard accessibility
- Convert a given amount from base currency to target currency and vice versa
- Custom hook to store recent fetched exchange rates in sessionStorage
- The add button to add more currency converters

## Tools used

- React, Vite
- Exchange rate API: [Fixer](https://apilayer.com/marketplace/fixer-api)
- Icons (svg): [Material Icons](https://mui.com/material-ui/material-icons/)

## Installation

1. Fork the main branch and clone the repository

```BASH
git clone https://github.com/your-username/currency-converter.git
```

2. Install dependencies

```BASH
npm install
```

3. Get an API key from Fixer API

You can get a free API key from [Fixer official website](https://fixer.io/) or through [APILayer](https://apilayer.com/marketplace/fixer-api). Once you have your API key, place the API URL and API key in a .env file (see .env.example).

4. Run the app in development mode

```BASH
npm run dev
```
