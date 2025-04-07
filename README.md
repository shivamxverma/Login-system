# Loan Application System

This is a role-based loan application system where users can submit loan applications, verifiers can review and verify/reject them, and admins can approve/reject loans or manage other admins. The system ensures secure access control and a clear workflow for loan processing.

## Table of Contents
1. [Features](#features)
2. [Roles and Permissions](#roles-and-permissions)
3. [Workflow](#workflow)
4. [Tech Stack](#tech-stack)
5. [Setup Instructions](#setup-instructions)
6. [Usage](#usage)
7. [API Endpoints](#api-endpoints)
8. [Future Improvements](#future-improvements)

---

## Features
- **User Loan Application**: Users can submit loan applications with details like name, tenure, reason, amount, employment status, and address.
- **Role-Based Access**: Different roles (Admin, Verifier, User) have specific permissions.
- **Loan Review Process**: Verifiers review applications first, followed by admin approval/rejection.
- **Admin Management**: Admins can delete other admins.
- **Status Tracking**: Loan applications have statuses like "Pending", "Verified", "Approved", or "Rejected".

---

## Roles and Permissions
| Role       | Permissions                                      |
|------------|-------------------------------------------------|
| **User**   | Submit loan applications, view application status |
| **Verifier**| Verify or reject loan applications             |
| **Admin**  | Approve/reject loans, delete other admins      |

- **User**: Regular individuals applying for loans.
- **Verifier**: Staff responsible for initial review and validation.
- **Admin**: Higher authority with full control over loan decisions and admin management.

---

## Workflow
1. **User Submits Application**:
   - Fills out a form with `Name`, `Tenure`, `Reason`, `Amount`, `EmploymentStatus`, and `EmploymentAddress`.
   - Application status is set to "Pending".
2. **Verifier Reviews**:
   - Verifier logs in, sees pending applications, and either:
     - Verifies it → Status = "Verified".
     - Rejects it → Status = "Rejected".
3. **Admin Finalizes**:
   - Admin reviews "Verified" applications and either:
     - Approves it → Status = "Approved".
     - Rejects it → Status = "Rejected".
4. **Admin Management**:
   - Admin can delete another admin account if needed.

---

## Tech Stack
- **Frontend**: React,
- **Backend**: Node.js with Express.js in Typescript.
- **Database**: postgres (for storing users, roles, and loan applications).
- **Authentication**: JWT (JSON Web Tokens) for role-based login.

---

## Setup Instructions

### Prerequisites
- Node.js (v16 or higher)
- MongoDB (local or cloud like MongoDB Atlas)
- Git (for cloning the repo)

### Steps
1. **Clone the Repository**:
   ```bash
   git clone <repository-url>
   cd loan-system
   ```

2. **Install Dependencies**:
   ```bash
   npm install
   ```

3. **Set Up Environment Variables**:
   Create a `.env` file in the root directory with:
   ```
   PORT=3000
   MONGO_URI=<your-mongodb-connection-string>
   JWT_SECRET=<your-secret-key>
   ```

4. **Run MongoDB**:
   - If local: Start MongoDB with `mongod`.
   - If cloud: Ensure your MongoDB Atlas URI is correct.

5. **Start the Server**:
   ```bash
   npm start
   ```
   The server will run on `http://localhost:3000`.

---

## Usage
1. **Register/Login**:
   - Users, verifiers, and admins must register with a role assigned (e.g., via an admin or seeded data).
   - Login to access role-specific dashboards.

2. **Submit a Loan Application**:
   - As a user, go to `/loan/apply`, fill out the form, and submit.
   - Example form data:
     ```json
     {
       "name": "John Doe",
       "tenure": "12",
       "reason": "Medical expenses",
       "amount": "5000",
       "employmentStatus": "Employed",
       "employmentAddress": "123 Main St"
     }
     ```

3. **Verifier Actions**:
   - Login as a verifier, view pending applications at `/verifier/dashboard`.
   - Verify or reject applications.

4. **Admin Actions**:
   - Login as an admin, view verified applications at `/admin/dashboard`.
   - Approve/reject loans or delete another admin via `/admin/manage`.

---

## API Endpoints
### Authentication
- `POST /api/auth/register`: Register a new user (name, email, password, role).
- `POST /api/auth/login`: Login and receive a JWT token.

### Loan Application
- `POST /api/loan/apply`: Submit a new loan application (user only).
- `GET /api/loan/status/:id`: Check application status (user only).
- `PUT /api/loan/verify/:id`: Verify or reject a loan (verifier only).
- `PUT /api/loan/approve/:id`: Approve or reject a loan (admin only).

### Admin Management
- `DELETE /api/admin/delete/:id`: Delete an admin (admin only).

**Note**: All endpoints require JWT authentication and role checks.

---

## Future Improvements
- **Input Validation**: Add stricter checks for form fields (e.g., amount limits, valid tenure).
- **Notifications**: Email/SMS alerts for status updates.
- **UI Dashboard**: Build a responsive frontend for easier interaction.
- **Audit Logs**: Track who approved/rejected loans for accountability.
- **Multiple Admins**: Add a super-admin role to manage all admins.

---