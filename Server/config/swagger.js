import swaggerJsDoc from "swagger-jsdoc";
import swaggerUi from "swagger-ui-express";

const leadSources = [
  "Website",
  "Google Ads",
  "Facebook",
  "Referral",
  "Phone",
  "Email",
  "Other",
];
const leadStatuses = [
  "New",
  "Contacted",
  "Qualified",
  "Proposal Sent",
  "Negotiation",
  "Won",
  "Lost",
];
const leadPriorities = ["High", "Medium", "Low"];

const idParameter = {
  name: "id",
  in: "path",
  required: true,
  schema: { type: "string", format: "uuid" },
};

const errorResponse = {
  description: "Request failed",
  content: {
    "application/json": { schema: { $ref: "#/components/schemas/Error" } },
  },
};

const swaggerOptions = {
  definition: {
    openapi: "3.0.3",
    info: {
      title: "Lead Management System API",
      version: "1.0.0",
      description:
        "REST API for authentication, user management, and lead management.",
    },
    servers: [
      {
        url: "http://localhost:5000",
        description: "Local development server",
      },
    ],
    tags: [
      { name: "Authentication", description: "Admin and user authentication" },
      { name: "Users", description: "Admin-only user management" },
      { name: "Leads", description: "Lead management and filtering" },
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: "http",
          scheme: "bearer",
          bearerFormat: "JWT",
          description: "Paste an access token returned by a login endpoint.",
        },
      },
      schemas: {
        Error: {
          type: "object",
          properties: {
            success: { type: "boolean", example: false },
            message: { type: "string", example: "Unauthorized!" },
          },
        },
        LoginRequest: {
          type: "object",
          required: ["email", "password"],
          properties: {
            email: {
              type: "string",
              format: "email",
              example: "user@example.com",
            },
            password: {
              type: "string",
              format: "password",
              example: "password123",
            },
          },
        },
        AuthTokens: {
          type: "object",
          properties: {
            success: { type: "boolean", example: true },
            message: { type: "string", example: "Login successful" },
            data: {
              type: "object",
              properties: {
                accessToken: { type: "string" },
                refreshToken: { type: "string" },
              },
            },
          },
        },
        User: {
          type: "object",
          properties: {
            id: { type: "string", format: "uuid" },
            username: { type: "string", example: "jane.doe" },
            email: {
              type: "string",
              format: "email",
              example: "jane@example.com",
            },
            role: { type: "string", example: "user" },
            createdAt: { type: "string", format: "date-time" },
            updatedAt: { type: "string", format: "date-time" },
          },
        },
        UserInput: {
          type: "object",
          required: ["username", "email", "password"],
          properties: {
            username: { type: "string", example: "jane.doe" },
            email: {
              type: "string",
              format: "email",
              example: "jane@example.com",
            },
            password: {
              type: "string",
              format: "password",
              minLength: 8,
              example: "password123",
            },
          },
        },
        Lead: {
          type: "object",
          properties: {
            id: { type: "string", format: "uuid" },
            leadNumber: { type: "string", example: "LEAD-00001" },
            firstName: { type: "string", example: "John" },
            lastName: { type: "string", example: "Smith" },
            companyName: {
              type: "string",
              nullable: true,
              example: "Acme Inc.",
            },
            email: {
              type: "string",
              format: "email",
              example: "john@acme.com",
            },
            phone: { type: "string", nullable: true },
            leadSource: { type: "string", enum: leadSources },
            status: { type: "string", enum: leadStatuses },
            priority: { type: "string", enum: leadPriorities },
            assignedUser: { type: "string", nullable: true },
            assignedUserId: {
              type: "string",
              format: "uuid",
              nullable: true,
            },
            expectedValue: {
              type: "number",
              format: "float",
              nullable: true,
              example: 5000,
            },
            expectedCloseDate: {
              type: "string",
              format: "date-time",
              nullable: true,
            },
            notes: { type: "string", nullable: true },
            createdAt: { type: "string", format: "date-time" },
            updatedAt: { type: "string", format: "date-time" },
          },
        },
        LeadInput: {
          type: "object",
          required: ["firstName", "lastName", "email", "leadSource", "priority"],
          properties: {
            firstName: { type: "string", example: "John" },
            lastName: { type: "string", example: "Smith" },
            companyName: { type: "string", example: "Acme Inc." },
            email: {
              type: "string",
              format: "email",
              example: "john@acme.com",
            },
            phone: { type: "string", example: "+1 555 0100" },
            leadSource: { type: "string", enum: leadSources },
            status: {
              type: "string",
              enum: leadStatuses,
              default: "New",
            },
            priority: {
              type: "string",
              enum: leadPriorities,
              default: "Medium",
            },
            assignedUserId: {
              type: "string",
              format: "uuid",
              description: "Admin only. Leave empty to keep the lead unassigned.",
            },
            expectedValue: {
              type: "number",
              format: "float",
              minimum: 0,
              example: 5000,
            },
            expectedCloseDate: {
              type: "string",
              format: "date",
              example: "2026-12-31",
            },
            notes: { type: "string", example: "Requested a product demo." },
          },
        },
      },
    },
    security: [{ bearerAuth: [] }],
    paths: {
      "/admin/login": {
        post: {
          tags: ["Authentication"],
          summary: "Log in as an administrator",
          security: [],
          requestBody: {
            required: true,
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/LoginRequest" },
              },
            },
          },
          responses: {
            200: {
              description: "Authenticated",
              content: {
                "application/json": {
                  schema: { $ref: "#/components/schemas/AuthTokens" },
                },
              },
            },
            400: errorResponse,
          },
        },
      },
      "/user/login": {
        post: {
          tags: ["Authentication"],
          summary: "Log in as a user",
          security: [],
          requestBody: {
            required: true,
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/LoginRequest" },
              },
            },
          },
          responses: { 200: { description: "Authenticated" }, 400: errorResponse },
        },
      },
      "/logout": {
        post: {
          tags: ["Authentication"],
          summary: "Log out the current user",
          responses: { 200: { description: "Logged out" }, 401: errorResponse },
        },
      },
      "/validate-token": {
        get: {
          tags: ["Authentication"],
          summary: "Validate the current access token",
          responses: {
            200: { description: "Token is valid" },
            401: errorResponse,
            403: errorResponse,
          },
        },
      },
      "/users": {
        get: {
          tags: ["Users"],
          summary: "List users (admin only)",
          responses: { 200: { description: "Users returned" }, 403: errorResponse },
        },
        post: {
          tags: ["Users"],
          summary: "Create a user (admin only)",
          requestBody: {
            required: true,
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/UserInput" },
              },
            },
          },
          responses: { 201: { description: "User created" }, 400: errorResponse },
        },
      },
      "/user/{id}": {
        put: {
          tags: ["Users"],
          summary: "Update a user (admin only)",
          parameters: [idParameter],
          requestBody: {
            required: true,
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/UserInput" },
              },
            },
          },
          responses: { 200: { description: "User updated" }, 404: errorResponse },
        },
        delete: {
          tags: ["Users"],
          summary: "Delete a user (admin only)",
          parameters: [idParameter],
          responses: { 200: { description: "User deleted" }, 404: errorResponse },
        },
      },
      "/leads": {
        get: {
          tags: ["Leads"],
          summary: "List visible leads",
          description:
            "Admins receive all leads. Users receive only leads assigned to them.",
          responses: { 200: { description: "Leads returned" } },
        },
      },
      "/lead": {
        post: {
          tags: ["Leads"],
          summary: "Create a lead",
          description:
            "User-created leads are automatically assigned to that user. Admins may assign a user or leave the lead unassigned.",
          requestBody: {
            required: true,
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/LeadInput" },
              },
            },
          },
          responses: {
            201: { description: "Lead created" },
            400: errorResponse,
            409: errorResponse,
          },
        },
      },
      "/lead/{id}": {
        put: {
          tags: ["Leads"],
          summary: "Update a lead",
          description:
            "Users may update only leads assigned to them. Admins may update all leads and change assignment.",
          parameters: [idParameter],
          requestBody: {
            required: true,
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/LeadInput" },
              },
            },
          },
          responses: {
            200: { description: "Lead updated" },
            403: errorResponse,
            404: errorResponse,
          },
        },
        delete: {
          tags: ["Leads"],
          summary: "Delete a lead",
          description: "Users may delete only leads assigned to them.",
          parameters: [idParameter],
          responses: {
            200: { description: "Lead deleted" },
            403: errorResponse,
            404: errorResponse,
          },
        },
      },
      "/leads/search": {
        get: {
          tags: ["Leads"],
          summary: "Search and filter visible leads",
          description:
            "Searches lead number, name, email, phone, and company. The assigned-user filter applies to admins only.",
          parameters: [
            { name: "search", in: "query", schema: { type: "string" } },
            { name: "status", in: "query", schema: { type: "string", enum: leadStatuses } },
            { name: "leadSource", in: "query", schema: { type: "string", enum: leadSources } },
            { name: "priority", in: "query", schema: { type: "string", enum: leadPriorities } },
            { name: "assignedUserId", in: "query", schema: { type: "string", format: "uuid" } },
          ],
          responses: { 200: { description: "Filtered leads returned" }, 400: errorResponse },
        },
      },
    },
  },
  apis: [],
};

const swaggerDocs = swaggerJsDoc(swaggerOptions);

export { swaggerUi, swaggerDocs };
