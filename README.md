# Lead Management System

A full-stack application for managing sales leads, assigning work to team members, and tracking a lead through its sales lifecycle. The project contains a React/Vite client and a Node.js/Express API backed by MySQL.

## Features

- Separate administrator and user sign-in
- Role-based access control
- User management for administrators
- Lead creation, assignment, editing, deletion, search, and filtering
- Dashboard summary of lead data
- Interactive Swagger/OpenAPI API documentation
- Scripts for bulk-seeding sample users and leads

## Roles and permissions

The application has **two roles**.

| Role | Permissions |
| --- | --- |
| `admin` | Can view, create, edit, and delete all users and leads. An admin can assign or reassign a lead, or leave it unassigned. |
| `user` | Can view, create, edit, and delete only leads assigned to that user. A lead created by a user is automatically assigned to them. |

The **Users** page is visible only to administrators. Both roles can use the **Dashboard** and **Leads** pages.

## Prerequisites

- Node.js 18 or newer
- MySQL Server 8 or compatible MySQL installation
- npm

## Installation and local setup

1. Create a MySQL database:

   ```sql
   CREATE DATABASE lead_management;
   ```

2. Configure the backend environment variables. Copy the example file in `Server` and save it as `.env`:

   ```powershell
   Copy-Item Server/.env.example Server/.env
   ```

3. Update `Server/.env` with your MySQL credentials, JWT secrets, and initial administrator details:

   ```env
   PORT=5000

   DB_HOST=localhost
   DB_PORT=3306
   DB_USER=root
   DB_PASSWORD=your_mysql_password
   DB_NAME=lead_management

   JWT_ACCESS_SECRET=use_a_long_random_secret
   JWT_REFRESH_SECRET=use_a_different_long_random_secret

   ADMIN_EMAIL=admin@example.com
   ADMIN_PASSWORD=StrongPassword123
   ADMIN_USERNAME=admin
   ```

   Keep `.env` private. It contains database credentials, authentication secrets, and the initial administrator password.

4. Install dependencies for both applications:

   ```powershell
   cd Server
   npm install
   cd ../Client
   npm install
   ```

5. Start the backend in one terminal:

   ```powershell
   cd Server
   npm run dev
   ```

   The API starts at `http://localhost:5000`. The database tables are created automatically when the server connects successfully.

6. Start the frontend in another terminal:

   ```powershell
   cd Client
   npm run dev
   ```

   Open the local URL printed by Vite, normally `http://localhost:5173`.

### Optional frontend API URL

The frontend uses `http://localhost:5000` by default. To target another backend URL, create `Client/.env`:

```env
VITE_API_URL=http://localhost:5000
```

Restart the Vite development server after changing this value.

## Creating the first administrator

Administrator details come from the three `ADMIN_*` values in `Server/.env`; they are not read from the request body.

1. Start the backend after setting `ADMIN_USERNAME`, `ADMIN_EMAIL`, and an `ADMIN_PASSWORD` that is at least eight characters.
2. Send a `POST` request to `http://localhost:5000/admin/create`. You can do this from Postman or PowerShell:

   ```powershell
   Invoke-RestMethod -Method Post -Uri http://localhost:5000/admin/create
   ```

3. A successful request returns `201 Created`. The password is hashed before it is stored.
4. Sign in at the frontend route `/admin/login` using the email and password from `.env`.

An administrator email can be created only once. Repeating the request with the same email returns an “Email address already in use” error. Because `/admin/create` is not authentication-protected, create the intended administrator during setup and do not expose this endpoint publicly without adding appropriate protection.

## Using the application

### Administrator workflow

1. Visit `/admin/login` and sign in.
2. Open **Users** from the sidebar and create team users. Each user needs a username, a unique email address, and a password of at least eight characters.
3. Open **Leads** to create a lead. An administrator can choose an assignee or leave the lead unassigned.
4. Use the lead list to search by lead number, name, email, phone, or company; filter by status, source, priority, and (for admins) assignee.
5. Edit lead details, change assignment, or delete records when needed.

### User workflow

1. Visit `/` and sign in with the account created by an administrator.
2. Use **Dashboard** to see your assigned lead information.
3. Use **Leads** to create and manage your own assigned leads. New leads are automatically assigned to your account.

Users cannot access the Users page or work with leads assigned to other users.

### Lead fields and allowed values

Required fields for a lead are first name, last name, email, lead source, and priority. Lead email addresses must be unique.

| Field | Allowed values |
| --- | --- |
| Lead source | `Website`, `Google Ads`, `Facebook`, `Referral`, `Phone`, `Email`, `Other` |
| Status | `New`, `Contacted`, `Qualified`, `Proposal Sent`, `Negotiation`, `Won`, `Lost` |
| Priority | `High`, `Medium`, `Low` |

Status defaults to `New` when it is omitted. Optional fields include company, phone, expected value, expected close date, and notes.

## API documentation (Swagger)

Start the backend, then open:

- Swagger UI: `http://localhost:5000/api-docs`
- OpenAPI JSON: `http://localhost:5000/api-docs.json`

To call protected endpoints in Swagger:

1. Use `/admin/login` or `/user/login` and copy the returned `accessToken`.
2. Click **Authorize** at the top of Swagger UI.
3. Enter `Bearer <access-token>`.
4. Select an endpoint, click **Try it out**, provide the request data, and click **Execute**.

The API includes authentication, user management, lead management, and lead search/filter endpoints.

## Bulk-create sample users and leads

Bulk creation is provided as **database seed scripts**. 

Before running either script, confirm that `Server/.env` points to the intended database. The scripts insert records directly into it.

### Bulk-create sample users

`Server/bulkCreateUser.js` contains 15 sample users. It hashes their passwords and inserts them in one operation.

```powershell
cd Server
node bulkCreateUser.js
```

The supplied sample accounts use `Password123`. Change this password in the script before using it outside local development. The script is not idempotent: running it again without changing the emails will fail because user emails are unique.

To bulk-create your own users, replace the `users` array in `Server/bulkCreateUser.js`. Each object needs:

```js
{
  username: "Jane Doe",
  email: "jane@example.com",
  password: "A-password-with-at-least-8-characters",
  role: "user"
}
```

### Bulk-create sample leads

`Server/bulkCreateLeads.js` generates 30–35 sample leads with unique lead numbers and emails, then inserts them in one operation.

```powershell
cd Server
node bulkCreateLeads.js
```

Generated leads are unassigned. Sign in as an administrator afterwards to assign them from the **Leads** page. Each script run generates new lead numbers and email addresses, so it can be used again to add more sample data.

## Useful API endpoints

| Method | Endpoint | Access | Purpose |
| --- | --- | --- | --- |
| `POST` | `/admin/create` | Public setup endpoint | Creates the administrator from `.env` values. |
| `POST` | `/admin/login` | Public | Administrator login. |
| `POST` | `/user/login` | Public | User login. |
| `GET` | `/users` | Admin | Lists users. |
| `POST` | `/user` | Admin | Creates a user. |
| `PUT`, `DELETE` | `/user/:id` | Admin | Updates or removes a user. |
| `GET` | `/leads` | Admin or user | Lists all leads for admins, or assigned leads for users. |
| `GET` | `/leads/search` | Admin or user | Searches and filters visible leads. |
| `POST` | `/lead` | Admin or user | Creates a lead. |
| `PUT`, `DELETE` | `/lead/:id` | Admin or user | Updates or removes a visible lead. |
| `POST` | `/logout` | Authenticated | Logs out the current user. |
| `GET` | `/validate-token` | Authenticated | Checks whether an access token is valid. |

For the exact request and response formats, use Swagger UI.

## Project structure

```text
Client/                  React + Vite user interface
  src/context/           Authentication, users, and leads state
  src/Pages/             Login, dashboard, users, and leads screens
Server/                  Express + Sequelize API
  controllers/           API request handling
  models/                Admin, user, and lead models
  routes/                API routes
  config/swagger.js      OpenAPI specification
  bulkCreateUser.js      Sample-user seed script
  bulkCreateLeads.js     Sample-lead seed script
```
