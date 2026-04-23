# Firebase E-Commerce Web App

## Overview
This is a full-stack e-commerce web application built with React, TypeScript, Redux Toolkit, and Firebase.

The app allows users to browse products, manage a shopping cart, and place orders. Firebase is used for authentication and database management.

---

## Features

### Authentication
- User registration with email/password
- Login and logout functionality
- User data stored in Firestore

### Product Management
- Products stored in Firestore
- Create, update, and delete products
- Products displayed on the home page

### Shopping Cart
- Add/remove items from cart
- Cart state managed using Redux Toolkit
- Cart persists using sessionStorage

### Orders
- Checkout creates an order in Firestore
- Orders linked to authenticated user
- Order history page displays past orders
- Each order shows detailed items, quantities, and pricing

---

## Tech Stack

- React
- TypeScript
- Redux Toolkit
- Firebase Authentication
- Firebase Firestore
- Vite

---

## How to Run the Project

1. Clone the repository: git clone https://github.com/Bchen838/E-Commerce-App-with-Firebase/tree/main
2. Navigate into the project: cd e-commerce
3. Install dependencies: npm install
4. Start the development server: npm run dev

