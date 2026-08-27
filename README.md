# LEAD_MANAGEMENT_SYSTEM
This Repository is created for the Lead Management


Swagger API documentation is now configured and ready.
Open it after restarting the backend:
- Swagger UI: http://localhost:5000/api-docs
- OpenAPI JSON: http://localhost:5000/api-docs.json
Updated:
- [swagger.js](D:\MY PROGRAMMING FOLDERS\Lead Management\Server\config\swagger.js) — complete OpenAPI 3.0 specification with JWT bearer authorization, schemas, examples, tags, request bodies, responses, and filter query parameters.
- [adminRoutes.js](D:\MY PROGRAMMING FOLDERS\Lead Management\Server\routes\adminRoutes.js) — fixed /logout and /validate-token middleware registration.
- [index.js](D:\MY PROGRAMMING FOLDERS\Lead Management\Server\index.js) — exposes the raw spec at /api-docs.json.
Documented endpoints include:
- Admin/user login, logout, token validation
- User create/read/update/delete
- Lead create/read/update/delete
- Lead search and all filters
To test protected endpoints in Swagger:
1. Call /admin/login or /user/login.
2. Copy the returned accessToken.
3. Click Authorize at the top of Swagger UI.
4. Enter Bearer <your-access-token>.
5. Use Try it out on protected endpoints.
The Swagger document generation check passed with all 10 documented paths.