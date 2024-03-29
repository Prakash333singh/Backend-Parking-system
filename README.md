# Designing a Comprehensive Parking System for Chandigarh

# Introduction:
Chandigarh, a bustling city, faces a significant challenge when it comes to efficient parking management. To address this issue, i have undertaken the development of a state-of-the-art parking system that leverages modern technology to streamline parking processes. This system is designed to cater to both administrators responsible for parking management and the general public seeking convenient parking solutions.

# Project Overview:
This project aims to create a robust and scalable parking system using **Node.js, Express, and MongoDB** as the backend stack. It includes various features and functionalities to cater to the needs of both administrators and parking lot users. Here's an overview of the key components:

# Backend Technologies:
- **Node.js**: The server-side JavaScript runtime for building scalable and efficient network applications.
- **Express**: A minimal and flexible Node.js web application framework that simplifies the creation of robust APIs.
- **MongoDB**: A NoSQL database for storing parking lot and user-related data efficiently.
Features and Functionality:

# Administrator Module:
- **Registration**: Admins can register parking lot heads, ensuring authorized personnel manage parking facilities.
- **Authentication**: JWT and bcrypt are employed for secure authentication, allowing only authorized personnel access to admin features.
- **Lot Management**: Admins can create, update, and delete parking lots, as well as assign/unassign parking lots to heads.
- **Head Management**: Admins can fetch single and all parking lot heads, as well as delete head accounts when necessary.

# Head Module:
- **Login/Logout**: Heads can securely log in and out of their accounts, ensuring only authorized personnel access head-specific functionalities.
- **Vehicle Entry/Exit**: Heads can record vehicle entries and exits, facilitating efficient parking management.
- **Parking Lot Information**: Access real-time information about available parking lots and their current occupancy.
- **Financial Tracking**: Obtain data on the total revenue generated from all parking lots under their supervision.

# Parking Lot Module:
- **Creation**: Admins can create new parking lots, specifying location, capacity, and other details.
- **Management**: Admins can fetch, update, and delete individual parking lots.
- **Revenue Tracking**: Obtain real-time information on the total money collected across all parking lots.

# Middleware:
- **Admin Authentication Middleware**: Ensures that only authenticated administrators can access admin-specific routes.
- **Head Authentication Middleware**: Secures head-specific routes, allowing only authorized heads to access them.
  
# Testing:
- The system is rigorously tested using **Postman**, covering various scenarios and edge cases to ensure reliability and functionality.
  
# API Endpoints:
The API endpoints are organized using **Express routers** for modularity and readability, with routes and controllers carefully designed for each module.

- **Admin Module Endpoints (AdminRouter)**:<br />

POST /api/admin/lot-head/register -> Register a new parking lot head.<br />
GET /api/admin/lot-head/:id -> Fetch information about a specific parking lot head.<br />
GET /api/admin/lot-head/ -> Fetch information about all parking lot heads.<br />
DELETE /api/admin/lot-head/:id -> Delete a parking lot head.<br />
PATCH /api/admin/lot-head/:id/unAssignLot -> Unassign a parking lot from a head.<br />
PATCH /api/admin/lot-head/:id/assignLot -> Assign a parking lot to a head.<br />

- **Head Module Endpoints (HeadRouter)**:<br />

POST /api/head/login -> Log in as a parking lot head.<br />
POST /api/head/logout -> Log out as a parking lot head.<br />
POST /api/head/enterVehicle -> Record a vehicle entry.<br />
POST /api/head/exitVehicle -> Record a vehicle exit.<br />
GET /api/head/allLots -> Get information about all parking lots of logedIn head.<br />
GET /api/head/singleLot/:id -> Get information about a specific parking lot of logedIn head.<br />
GET /api/head/allLotMoney -> Get information about the total money collected from all parking lots of logedIn head.<br />

- **Parking Lot Module Endpoints (ParkingLotRouter)**:<br />

POST /api/parking-lots/ -> Create a new parking lot.<br />
GET /api/parking-lots/ -> Fetch information about all parking lots.<br />
GET /api/parking-lots/totalMoney -> Get information about the total money collected from all parking lots.<br />
GET /api/parking-lots/:id -> Fetch information about a specific parking lot.<br />
PATCH /api/parking-lots/:id -> Update information about a specific parking lot.<br />
DELETE /api/parking-lots/:id -> Delete a specific parking lot.<br />

# Conclusion:
This parking system project addresses the real-life parking management challenges faced in Chandigarh. By combining modern technology, secure authentication, and robust RESTful APIs, we provide an efficient solution for administrators and parking lot users. This system enhances the overall parking experience in Chandigarh, making it easier to find, manage, and utilize parking facilities while ensuring secure and efficient operations.
