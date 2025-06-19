# Task Management System - Backend Documentation

## Overview

The Task Management System is a comprehensive solution designed to streamline task allocation, tracking, and collaboration within teams. The backend is built using Node.js with Express.js framework and MongoDB database, providing a robust RESTful API for managing tasks and users.

## Table of Contents

-  [System Architecture](#system-architecture)
-  [Technology Stack](#technology-stack)
-  [System Requirements](#system-requirements)
-  [Installation & Setup](#installation--setup)
-  [Database Schema](#database-schema)
-  [API Documentation](#api-documentation)
-  [Authentication & Authorization](#authentication--authorization)
-  [Email Notifications](#email-notifications)
-  [Error Handling](#error-handling)
-  [Security Measures](#security-measures)
-  [Best Practices](#best-practices)
-  [Troubleshooting](#troubleshooting)
-  [Testing Guide](#testing-guide)

## System Architecture

The backend follows a modular architecture pattern with clear separation of concerns:

```
server/
├── config/          # Configuration files and database connection
├── controllers/     # Business logic for routes
├── middleware/      # Request processing middleware
├── models/          # Database schema definitions
├── routes/          # API route definitions
├── utils/           # Helper utilities and services
└── index.js         # Application entry point
```

### Key Components:

-  **Models**: Define database schemas and data validation
-  **Controllers**: Handle request processing and response generation
-  **Routes**: Define API endpoints and connect them to controllers
-  **Middleware**: Handle cross-cutting concerns like authentication
-  **Utils**: Provide shared functionality across the application

## Technology Stack

-  **Runtime Environment**: Node.js
-  **Framework**: Express.js
-  **Database**: MongoDB with Mongoose ODM
-  **Authentication**: JWT (JSON Web Tokens)
-  **Email Service**: Nodemailer
-  **Validation**: Mongoose schemas + validator.js
-  **Security**: bcryptjs for password hashing

## System Requirements

-  Node.js (v14.x or higher)
-  MongoDB (v4.x or higher)
-  NPM or Yarn package manager
-  SMTP server access for email notifications

## Installation & Setup

### 1. Clone the Repository

```bash
git clone <repository-url>
cd task_management_system/server
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Environment Configuration

Create a `.env` file in the server root directory with the following variables:

```properties
# Server Configuration
PORT=5000
NODE_ENV=development

# MongoDB Connection
MONGODB_URI=mongodb+srv://<username>:<password>@<cluster>.mongodb.net/<database>?retryWrites=true&w=majority

# JWT Authentication
JWT_SECRET=yourStrongSecretKey
JWT_EXPIRES_IN=30d

# Email Configuration
EMAIL_SERVICE=gmail
EMAIL_USERNAME=your_email@gmail.com
EMAIL_PASSWORD=your_app_password
EMAIL_FROM=Task Management System <your_email@gmail.com>

# Frontend URL (for email links)
FRONTEND_URL=http://localhost:3000
```

#### Important Email Configuration Notes

-  **EMAIL_SERVICE**: Currently supports 'gmail', but can be configured for other services
-  **EMAIL_USERNAME**: The full Gmail address used to send notifications
-  **EMAIL_PASSWORD**:
   -  For Gmail, use an App Password, not your regular account password
   -  To generate an App Password:
      1. Enable 2-Step Verification in your Google Account
      2. Visit https://myaccount.google.com/apppasswords
      3. Select "Mail" and your device, then generate and copy the 16-character password
-  **EMAIL_FROM**: The sender name and email that recipients will see

### 4. Initialize the Database

MongoDB will create the database automatically when the application connects to it for the first time.

### 5. Start the Server

Development mode with hot reload:

```bash
npm run dev
```

Production mode:

```bash
npm start
```

### 6. Initial Admin User

The system requires at least one admin user to function properly. To create the initial admin user, run the provided script:

```bash
cd task_management_system/server
node scripts/createAdmin.js
```

This will create an admin user with the following credentials:

-  Email: admin@example.com
-  Password: admin123

**Important**: After creating the initial admin, log in and change the default password immediately for security reasons. Once the initial admin is created, additional administrators can be created through the API by existing admin users.

## Database Schema

### User Model

```javascript
{
  name: String,             // User's full name
  email: String,            // Unique email address
  password: String,         // Hashed password
  role: String,             // 'admin' or 'team_member'
  department: String,       // Department name
  position: String,         // Job position/title
  photo: String,            // Profile photo path
  passwordChangedAt: Date,  // Password change timestamp
  active: Boolean,          // Account status
  createdAt: Date           // Account creation date
}
```

### Task Model

```javascript
{
  title: String,            // Task title
  description: String,      // Task description
  status: String,           // 'pending', 'in_progress', 'completed', 'archived'
  priority: String,         // 'low', 'medium', 'high'
  createdBy: ObjectId,      // Reference to User who created the task
  assignedTo: ObjectId,     // Reference to User assigned to the task
  deadline: Date,           // Task deadline
  createdAt: Date,          // Task creation date
  completedAt: Date,        // Task completion date
  attachments: [            // Array of attachments
    {
      name: String,         // File name
      path: String,         // File path
      uploadedAt: Date      // Upload timestamp
    }
  ],
  comments: [               // Array of comments
    {
      text: String,         // Comment text
      createdBy: ObjectId,  // Reference to User who commented
      createdAt: Date       // Comment timestamp
    }
  ],
  tags: [String]            // Array of tags for categorization
}
```

## API Documentation

### Base URL

All API endpoints are relative to: `http://localhost:5000/api`

### Authentication Endpoints

#### Login

-  **URL**: `/users/login`
-  **Method**: `POST`
-  **Request Body**:
   ```json
   {
   	"email": "user@example.com",
   	"password": "password123"
   }
   ```
-  **Success Response**:
   ```json
   {
   	"status": "success",
   	"token": "jwt_token_string",
   	"data": {
   		"user": {
   			"id": "user_id",
   			"name": "User Name",
   			"email": "user@example.com",
   			"role": "admin",
   			"department": "IT",
   			"position": "Manager"
   		}
   	}
   }
   ```
-  **Error Response**:
   ```json
   {
   	"status": "fail",
   	"message": "Incorrect email or password"
   }
   ```

#### Update Password

-  **URL**: `/users/update-password`
-  **Method**: `PATCH`
-  **Authentication**: JWT Token required
-  **Request Body**:
   ```json
   {
   	"currentPassword": "oldPassword123",
   	"password": "newPassword123"
   }
   ```
-  **Success Response**:
   ```json
   {
   	"status": "success",
   	"token": "new_jwt_token_string",
   	"data": {
   		"user": {
   			"id": "user_id",
   			"name": "User Name",
   			"email": "user@example.com",
   			"role": "admin"
   		}
   	}
   }
   ```

### User Management Endpoints (Admin Only)

#### Get All Users

-  **URL**: `/users`
-  **Method**: `GET`
-  **Authentication**: JWT Token with admin role required
-  **Success Response**:
   ```json
   {
   	"status": "success",
   	"results": 2,
   	"data": {
   		"users": [
   			{
   				"id": "user_id_1",
   				"name": "Admin User",
   				"email": "admin@example.com",
   				"role": "admin",
   				"department": "Management",
   				"position": "CEO"
   			},
   			{
   				"id": "user_id_2",
   				"name": "Team Member",
   				"email": "team@example.com",
   				"role": "team_member",
   				"department": "Development",
   				"position": "Developer"
   			}
   		]
   	}
   }
   ```

#### Create User

-  **URL**: `/users`
-  **Method**: `POST`
-  **Authentication**: JWT Token with admin role required
-  **Request Body**:
   ```json
   {
   	"name": "New User",
   	"email": "newuser@example.com",
   	"password": "password123",
   	"role": "team_member", // Can be "admin" or "team_member"
   	"department": "Marketing",
   	"position": "Specialist"
   }
   ```
-  **Notes**: Admin users can create both regular team members and other admin users

-  **Success Response**:
   ```json
   {
   	"status": "success",
   	"data": {
   		"user": {
   			"id": "user_id",
   			"name": "New User",
   			"email": "newuser@example.com",
   			"role": "team_member",
   			"department": "Marketing",
   			"position": "Specialist"
   		}
   	}
   }
   ```

#### Get User

-  **URL**: `/users/:id`
-  **Method**: `GET`
-  **Authentication**: JWT Token with admin role required
-  **Success Response**:
   ```json
   {
   	"status": "success",
   	"data": {
   		"user": {
   			"id": "user_id",
   			"name": "User Name",
   			"email": "user@example.com",
   			"role": "team_member",
   			"department": "Development",
   			"position": "Developer"
   		}
   	}
   }
   ```

#### Update User

-  **URL**: `/users/:id`
-  **Method**: `PATCH`
-  **Authentication**: JWT Token with admin role required
-  **Request Body**:
   ```json
   {
   	"name": "Updated Name",
   	"department": "Quality Assurance"
   }
   ```
-  **Success Response**:
   ```json
   {
   	"status": "success",
   	"data": {
   		"user": {
   			"id": "user_id",
   			"name": "Updated Name",
   			"email": "user@example.com",
   			"role": "team_member",
   			"department": "Quality Assurance",
   			"position": "Developer"
   		}
   	}
   }
   ```

#### Delete User

-  **URL**: `/users/:id`
-  **Method**: `DELETE`
-  **Authentication**: JWT Token with admin role required
-  **Success Response**:
   ```json
   {
   	"status": "success",
   	"data": null
   }
   ```

### User Profile Endpoints (All Authenticated Users)

#### Get Current User Profile

-  **URL**: `/users/me`
-  **Method**: `GET`
-  **Authentication**: JWT Token required
-  **Success Response**:
   ```json
   {
   	"status": "success",
   	"data": {
   		"user": {
   			"id": "user_id",
   			"name": "User Name",
   			"email": "user@example.com",
   			"role": "team_member",
   			"department": "Development",
   			"position": "Developer"
   		}
   	}
   }
   ```

#### Update Current User Profile

-  **URL**: `/users/update-me`
-  **Method**: `PATCH`
-  **Authentication**: JWT Token required
-  **Request Body**:
   ```json
   {
   	"name": "New Name",
   	"photo": "profile-pic.jpg"
   }
   ```
-  **Success Response**:
   ```json
   {
   	"status": "success",
   	"data": {
   		"user": {
   			"id": "user_id",
   			"name": "New Name",
   			"email": "user@example.com",
   			"photo": "profile-pic.jpg"
   		}
   	}
   }
   ```

#### Deactivate Account

-  **URL**: `/users/delete-me`
-  **Method**: `DELETE`
-  **Authentication**: JWT Token required
-  **Success Response**:
   ```json
   {
   	"status": "success",
   	"data": null
   }
   ```

### Task Management Endpoints

#### Get All Tasks

-  **URL**: `/tasks`
-  **Method**: `GET`
-  **Authentication**: JWT Token required
-  **Query Parameters**:
   -  `status`: Filter by status ('pending', 'in_progress', 'completed', 'archived')
   -  `priority`: Filter by priority ('low', 'medium', 'high')
-  **Notes**:
   -  Admin users see all tasks
   -  Team members see only tasks assigned to them
-  **Success Response**:
   ```json
   {
   	"status": "success",
   	"results": 2,
   	"data": {
   		"tasks": [
   			{
   				"id": "task_id_1",
   				"title": "Complete project documentation",
   				"description": "Write comprehensive documentation for the project",
   				"status": "pending",
   				"priority": "high",
   				"createdBy": {
   					"id": "user_id",
   					"name": "Admin User",
   					"email": "admin@example.com"
   				},
   				"assignedTo": {
   					"id": "user_id",
   					"name": "Team Member",
   					"email": "team@example.com"
   				},
   				"deadline": "2025-07-30T00:00:00.000Z",
   				"createdAt": "2025-06-15T00:00:00.000Z",
   				"daysRemaining": 42,
   				"isOverdue": false
   			},
   			{
   				"id": "task_id_2",
   				"title": "Fix login bug",
   				"description": "Address the login failure issue on the staging server",
   				"status": "in_progress",
   				"priority": "high",
   				"createdBy": {
   					"id": "user_id",
   					"name": "Admin User",
   					"email": "admin@example.com"
   				},
   				"assignedTo": {
   					"id": "user_id",
   					"name": "Team Member",
   					"email": "team@example.com"
   				},
   				"deadline": "2025-06-20T00:00:00.000Z",
   				"createdAt": "2025-06-10T00:00:00.000Z",
   				"daysRemaining": 2,
   				"isOverdue": false
   			}
   		]
   	}
   }
   ```

#### Create Task (Admin Only)

-  **URL**: `/tasks`
-  **Method**: `POST`
-  **Authentication**: JWT Token with admin role required
-  **Request Body**:
   ```json
   {
   	"title": "Implement user authentication",
   	"description": "Create login and registration functionality",
   	"priority": "high",
   	"assignedTo": "user_id",
   	"deadline": "2025-07-15T00:00:00.000Z",
   	"tags": ["frontend", "security"]
   }
   ```
-  **Success Response**:
   ```json
   {
   	"status": "success",
   	"data": {
   		"task": {
   			"id": "task_id",
   			"title": "Implement user authentication",
   			"description": "Create login and registration functionality",
   			"status": "pending",
   			"priority": "high",
   			"createdBy": {
   				"id": "admin_id",
   				"name": "Admin User",
   				"email": "admin@example.com"
   			},
   			"assignedTo": {
   				"id": "user_id",
   				"name": "Team Member",
   				"email": "team@example.com"
   			},
   			"deadline": "2025-07-15T00:00:00.000Z",
   			"createdAt": "2025-06-18T00:00:00.000Z",
   			"tags": ["frontend", "security"],
   			"daysRemaining": 27,
   			"isOverdue": false
   		}
   	}
   }
   ```

#### Get Task

-  **URL**: `/tasks/:id`
-  **Method**: `GET`
-  **Authentication**: JWT Token required
-  **Notes**: Team members can only access their assigned tasks
-  **Success Response**:
   ```json
   {
   	"status": "success",
   	"data": {
   		"task": {
   			"id": "task_id",
   			"title": "Implement user authentication",
   			"description": "Create login and registration functionality",
   			"status": "pending",
   			"priority": "high",
   			"createdBy": {
   				"id": "admin_id",
   				"name": "Admin User",
   				"email": "admin@example.com"
   			},
   			"assignedTo": {
   				"id": "user_id",
   				"name": "Team Member",
   				"email": "team@example.com"
   			},
   			"deadline": "2025-07-15T00:00:00.000Z",
   			"createdAt": "2025-06-18T00:00:00.000Z",
   			"comments": [
   				{
   					"text": "Started working on this",
   					"createdBy": {
   						"id": "user_id",
   						"name": "Team Member",
   						"email": "team@example.com"
   					},
   					"createdAt": "2025-06-19T10:30:00.000Z"
   				}
   			],
   			"tags": ["frontend", "security"],
   			"daysRemaining": 27,
   			"isOverdue": false
   		}
   	}
   }
   ```

#### Update Task

-  **URL**: `/tasks/:id`
-  **Method**: `PATCH`
-  **Authentication**: JWT Token required
-  **Notes**:
   -  Admin can update all fields
   -  Team members can only update the status of their assigned tasks
-  **Request Body** (Admin):
   ```json
   {
   	"title": "Updated task title",
   	"priority": "medium",
   	"deadline": "2025-08-01T00:00:00.000Z"
   }
   ```
-  **Request Body** (Team Member):
   ```json
   {
   	"status": "in_progress"
   }
   ```
-  **Success Response**:
   ```json
   {
   	"status": "success",
   	"data": {
   		"task": {
   			"id": "task_id",
   			"title": "Updated task title",
   			"description": "Create login and registration functionality",
   			"status": "in_progress",
   			"priority": "medium",
   			"createdBy": {
   				"id": "admin_id",
   				"name": "Admin User"
   			},
   			"assignedTo": {
   				"id": "user_id",
   				"name": "Team Member"
   			},
   			"deadline": "2025-08-01T00:00:00.000Z",
   			"createdAt": "2025-06-18T00:00:00.000Z",
   			"daysRemaining": 44,
   			"isOverdue": false
   		}
   	}
   }
   ```

#### Delete Task (Admin Only)

-  **URL**: `/tasks/:id`
-  **Method**: `DELETE`
-  **Authentication**: JWT Token with admin role required
-  **Success Response**:
   ```json
   {
   	"status": "success",
   	"data": null
   }
   ```

#### Add Comment to Task

-  **URL**: `/tasks/:id/comments`
-  **Method**: `POST`
-  **Authentication**: JWT Token required
-  **Notes**: Team members can only comment on tasks assigned to them
-  **Request Body**:
   ```json
   {
   	"text": "Almost finished this task, should be done by tomorrow"
   }
   ```
-  **Success Response**:
   ```json
   {
   	"status": "success",
   	"data": {
   		"task": {
   			"id": "task_id",
   			"title": "Implement user authentication",
   			"comments": [
   				{
   					"text": "Started working on this",
   					"createdBy": "user_id",
   					"createdAt": "2025-06-19T10:30:00.000Z"
   				},
   				{
   					"text": "Almost finished this task, should be done by tomorrow",
   					"createdBy": "user_id",
   					"createdAt": "2025-06-20T14:25:00.000Z"
   				}
   			]
   		}
   	}
   }
   ```

#### Get Tasks for Calendar View

-  **URL**: `/tasks/calendar`
-  **Method**: `GET`
-  **Authentication**: JWT Token required
-  **Query Parameters**:
   -  `startDate`: Start date for calendar range (YYYY-MM-DD)
   -  `endDate`: End date for calendar range (YYYY-MM-DD)
-  **Notes**: Team members see only their assigned tasks
-  **Success Response**:
   ```json
   {
   	"status": "success",
   	"results": 2,
   	"data": {
   		"tasks": [
   			{
   				"id": "task_id_1",
   				"title": "Complete project documentation",
   				"deadline": "2025-07-30T00:00:00.000Z",
   				"status": "pending",
   				"priority": "high"
   			},
   			{
   				"id": "task_id_2",
   				"title": "Fix login bug",
   				"deadline": "2025-06-20T00:00:00.000Z",
   				"status": "in_progress",
   				"priority": "high"
   			}
   		]
   	}
   }
   ```

#### Get Task Statistics (Admin Only)

-  **URL**: `/tasks/stats`
-  **Method**: `GET`
-  **Authentication**: JWT Token with admin role required
-  **Success Response**:
   ```json
   {
   	"status": "success",
   	"data": {
   		"stats": {
   			"statusStats": [
   				{ "_id": "pending", "count": 5 },
   				{ "_id": "in_progress", "count": 3 },
   				{ "_id": "completed", "count": 7 },
   				{ "_id": "archived", "count": 1 }
   			],
   			"priorityStats": [
   				{ "_id": "low", "count": 4 },
   				{ "_id": "medium", "count": 6 },
   				{ "_id": "high", "count": 6 }
   			],
   			"overdueTasks": [{ "count": 2 }],
   			"userAssignmentStats": [
   				{
   					"_id": "user_id_1",
   					"count": 3,
   					"name": "Team Member 1"
   				},
   				{
   					"_id": "user_id_2",
   					"count": 5,
   					"name": "Team Member 2"
   				}
   			]
   		}
   	}
   }
   ```

### Analytics Endpoints (Admin Only)

#### Get Task Completion Statistics

-  **URL**: `/analytics/completion-stats`
-  **Method**: `GET`
-  **Authentication**: JWT Token with admin role required
-  **Query Parameters**:
   -  `period`: Time grouping ('day', 'week', 'month')
   -  `count`: Number of periods to include (default: 6)
-  **Success Response**:
   ```json
   {
   	"status": "success",
   	"data": {
   		"period": "month",
   		"stats": [
   			{
   				"_id": "2025-01",
   				"count": 5
   			},
   			{
   				"_id": "2025-02",
   				"count": 8
   			},
   			{
   				"_id": "2025-03",
   				"count": 12
   			}
   		]
   	}
   }
   ```

#### Get Team Workload Distribution

-  **URL**: `/analytics/workload-distribution`
-  **Method**: `GET`
-  **Authentication**: JWT Token with admin role required
-  **Success Response**:
   ```json
   {
   	"status": "success",
   	"results": 2,
   	"data": {
   		"workload": [
   			{
   				"_id": "user_id_1",
   				"totalTasks": 7,
   				"highPriority": 2,
   				"mediumPriority": 3,
   				"lowPriority": 2,
   				"averageCompletionTime": 3.5,
   				"userName": "Team Member 1",
   				"department": "Development"
   			},
   			{
   				"_id": "user_id_2",
   				"totalTasks": 5,
   				"highPriority": 1,
   				"mediumPriority": 3,
   				"lowPriority": 1,
   				"averageCompletionTime": 2.8,
   				"userName": "Team Member 2",
   				"department": "Design"
   			}
   		]
   	}
   }
   ```

#### Get Department Performance

-  **URL**: `/analytics/department-performance`
-  **Method**: `GET`
-  **Authentication**: JWT Token with admin role required
-  **Success Response**:
   ```json
   {
   	"status": "success",
   	"data": {
   		"departments": {
   			"Development": {
   				"total": 15,
   				"completed": 8,
   				"pending": 3,
   				"in_progress": 4,
   				"archived": 0,
   				"onTime": 6,
   				"overdue": 2,
   				"averageCompletionTime": 4.2
   			},
   			"Design": {
   				"total": 12,
   				"completed": 7,
   				"pending": 2,
   				"in_progress": 3,
   				"archived": 0,
   				"onTime": 5,
   				"overdue": 2,
   				"averageCompletionTime": 5.1
   			}
   		}
   	}
   }
   ```

#### Get Task Trends

-  **URL**: `/analytics/task-trends`
-  **Method**: `GET`
-  **Authentication**: JWT Token with admin role required
-  **Query Parameters**:
   -  `period`: Time grouping ('day', 'week', 'month')
   -  `count`: Number of periods to include (default: 12)
-  **Success Response**:
   ```json
   {
   	"status": "success",
   	"data": {
   		"period": "week",
   		"created": [
   			{
   				"_id": "2025-W01",
   				"count": 7
   			},
   			{
   				"_id": "2025-W02",
   				"count": 5
   			}
   		],
   		"completed": [
   			{
   				"_id": "2025-W01",
   				"count": 3
   			},
   			{
   				"_id": "2025-W02",
   				"count": 6
   			}
   		]
   	}
   }
   ```

#### Get User Performance Metrics

-  **URL**: `/analytics/user-performance`
-  **Method**: `GET`
-  **Authentication**: JWT Token with admin role required
-  **Success Response**:
   ```json
   {
   	"status": "success",
   	"results": 2,
   	"data": {
   		"performance": [
   			{
   				"userId": "user_id_1",
   				"name": "Team Member 1",
   				"department": "Development",
   				"position": "Developer",
   				"tasksCompleted": 15,
   				"onTimePercentage": 86.7,
   				"averageCompletionSpeed": -0.8
   			},
   			{
   				"userId": "user_id_2",
   				"name": "Team Member 2",
   				"department": "Design",
   				"position": "UI Designer",
   				"tasksCompleted": 12,
   				"onTimePercentage": 75.0,
   				"averageCompletionSpeed": 1.2
   			}
   		]
   	}
   }
   ```

#### Get Task Priority Distribution

-  **URL**: `/analytics/priority-distribution`
-  **Method**: `GET`
-  **Authentication**: JWT Token with admin role required
-  **Success Response**:
   ```json
   {
   	"status": "success",
   	"data": {
   		"distribution": [
   			{
   				"_id": "high",
   				"total": 15,
   				"statusBreakdown": [
   					{
   						"status": "pending",
   						"count": 3
   					},
   					{
   						"status": "in_progress",
   						"count": 4
   					},
   					{
   						"status": "completed",
   						"count": 8
   					}
   				]
   			},
   			{
   				"_id": "medium",
   				"total": 22,
   				"statusBreakdown": [
   					{
   						"status": "pending",
   						"count": 7
   					},
   					{
   						"status": "in_progress",
   						"count": 8
   					},
   					{
   						"status": "completed",
   						"count": 7
   					}
   				]
   			},
   			{
   				"_id": "low",
   				"total": 13,
   				"statusBreakdown": [
   					{
   						"status": "pending",
   						"count": 4
   					},
   					{
   						"status": "in_progress",
   						"count": 3
   					},
   					{
   						"status": "completed",
   						"count": 6
   					}
   				]
   			}
   		]
   	}
   }
   ```

#### Get Overdue Tasks Analysis

-  **URL**: `/analytics/overdue-analysis`
-  **Method**: `GET`
-  **Authentication**: JWT Token with admin role required
-  **Success Response**:
   ```json
   {
   	"status": "success",
   	"data": {
   		"totalOverdue": 8,
   		"departments": {
   			"Development": {
   				"count": 5,
   				"highPriority": 2,
   				"mediumPriority": 2,
   				"lowPriority": 1,
   				"averageOverdueDays": 4.6
   			},
   			"Design": {
   				"count": 3,
   				"highPriority": 1,
   				"mediumPriority": 2,
   				"lowPriority": 0,
   				"averageOverdueDays": 3.3
   			}
   		},
   		"users": [
   			{
   				"userId": "user_id_1",
   				"userName": "Team Member 1",
   				"department": "Development",
   				"count": 3,
   				"tasks": [
   					{
   						"taskId": "task_id_1",
   						"title": "Fix login bug",
   						"priority": "high",
   						"deadline": "2025-06-01T00:00:00.000Z",
   						"overdueDays": 5
   					},
   					{
   						"taskId": "task_id_2",
   						"title": "Implement file upload",
   						"priority": "medium",
   						"deadline": "2025-06-03T00:00:00.000Z",
   						"overdueDays": 3
   					}
   				]
   			}
   		]
   	}
   }
   ```

## Authentication & Authorization

### JWT Authentication

The system uses JSON Web Tokens (JWT) for stateless authentication:

1. User logs in with email and password
2. Server validates credentials and issues a JWT
3. Client includes JWT in the Authorization header for subsequent requests
4. Server validates token and grants access based on user role

### Authorization Levels

1. **Public Routes**: No authentication required

   -  Login endpoint

2. **Protected Routes**: Authentication required

   -  User profile management
   -  View assigned tasks
   -  Update task status
   -  Task calendar view

3. **Admin-only Routes**: Authentication + Admin role required
   -  User management (including creating other admins)
   -  Task creation and deletion
   -  Analytics dashboard

## Email Notifications

The system automatically sends email notifications for key events:

### Task Assignment

When a task is assigned to a user, an email is sent with:

-  Task title and description
-  Priority level
-  Deadline
-  Link to view task details

### Deadline Reminders

Automatic reminders are sent 3 days before a task deadline with:

-  Task title
-  Days remaining until deadline
-  Current task status
-  Link to update task

### Email Configuration Notes

-  The email scheduler runs every minute and checks if it's 8:00 AM to send deadline reminders
-  For the reminder system to work properly:
   -  Ensure the server is running continuously
   -  Verify that `EMAIL_USERNAME` and `EMAIL_PASSWORD` are correctly configured
   -  For Gmail, ensure you're using an App Password if 2FA is enabled
   -  Tasks must have valid assignees with proper email addresses
-  For testing notifications, you can modify the `scheduler.js` file to run more frequently

## Error Handling

The API implements consistent error handling:

-  **Validation Errors**: 400 Bad Request
-  **Authentication Errors**: 401 Unauthorized
-  **Authorization Errors**: 403 Forbidden
-  **Not Found Errors**: 404 Not Found
-  **Server Errors**: 500 Internal Server Error

All error responses follow a standard format:

```json
{
  "status": "fail" | "error",
  "message": "Detailed error message"
}
```

## Security Measures

1. **Password Security**:

   -  Passwords are hashed using bcrypt
   -  Minimum password length of 8 characters
   -  Password never exposed in API responses

2. **API Security**:

   -  JWT expiration to limit token validity
   -  HTTPS recommended for production
   -  Input validation on all endpoints

3. **Data Protection**:
   -  User accounts can be deactivated rather than deleted
   -  Sensitive data (passwords) excluded from responses
   -  JWT invalidation on password change

## Best Practices

### API Usage

1. Always include the Authorization header with Bearer token:

   ```
   Authorization: Bearer your_jwt_token
   ```

2. Handle token expiration by implementing token refresh or re-login

3. For admin operations, ensure proper error handling for unauthorized actions

### Development Workflow

1. Use development environment for testing:

   ```
   npm run dev
   ```

2. Set appropriate environment variables based on deployment environment

3. Test all API endpoints thoroughly after making changes

## Troubleshooting

### Common Issues

1. **Connection Errors**:

   -  Check MongoDB connection string
   -  Ensure MongoDB service is running
   -  Verify network connectivity to MongoDB Atlas if using cloud hosting

2. **Authentication Failures**:

   -  Verify correct email and password
   -  Check JWT expiration
   -  Ensure token is included in Authorization header

3. **Email Sending Failures**:
   -  Verify email service credentials in .env file
   -  For Gmail, confirm App Password is correct and 2FA is enabled on your account
   -  Check if your email service provider is blocking automated emails
   -  Look for rate limiting issues with the email provider

### Logs

-  Server logs are output to the console
-  In production, consider implementing a logging service

## Testing Guide

### Prerequisites

-  Postman or similar API testing tool
-  MongoDB Compass (optional, for database inspection)

### Testing Authentication

1. **Login**:

   -  Make a POST request to `/api/users/login` with admin credentials
   -  Save the JWT token returned in the response

2. **Using the JWT Token**:
   -  For all subsequent requests, add an Authorization header:
   ```
   Authorization: Bearer your_jwt_token
   ```

### Testing Task Management

1. **Create a Task**:

   -  Login as admin
   -  Make a POST request to `/api/tasks` with task details
   -  Include a valid user ID for the `assignedTo` field

2. **Check Email Notifications**:

   -  After creating a task, check the email inbox of the assigned user
   -  An assignment notification email should be received

3. **Test Deadline Reminders**:
   -  Create a task with a deadline 1-3 days in the future
   -  For immediate testing, you can temporarily modify the scheduler.js file:
   ```javascript
   // For testing, remove the time check
   setInterval(async () => {
   	console.log("Running scheduled deadline reminders check...");
   	await sendDeadlineReminders();
   }, 60 * 1000); // Check every minute
   ```
   -  Restart the server and wait for the reminder email

### Testing User Management

1. **Create Team Member**:

   -  Login as admin
   -  Make a POST request to `/api/users` with user details
   -  Set `role` to "team_member"

2. **Create Another Admin**:

   -  Login as admin
   -  Make a POST request to `/api/users` with user details
   -  Set `role` to "admin"

3. **Test Role-Based Access Control**:
   -  Login as team member
   -  Try to access admin endpoints like `/api/users` or task creation
   -  These should return 403 Forbidden errors

### Full Testing Workflow

1. Create admin user with the script
2. Login as admin
3. Create team members and other admins
4. Create tasks and assign them to users
5. Login as team members to view and update assigned tasks
6. Check email notifications
7. Test deadline reminders
8. Generate and check task statistics (admin only)

## Deployment

For production deployment:

1. Set `NODE_ENV=production`
2. Use a process manager like PM2
3. Set up a MongoDB Atlas account or dedicated MongoDB server
4. Use HTTPS with a valid SSL certificate
5. Implement proper logging and monitoring
