What is Axios Instance?
Axios Instance is a pre-configured HTTP client that:

Sets a base URL for all requests (e.g., http://localhost:4000)
Sets default headers for all requests
Sets a timeout (10 seconds)
Can be reused throughout the app without repeating configuration

Why We Made It:

DRY Principle - Don't repeat yourself
Centralized Configuration - Change base URL in one place
Consistent Headers - All requests have same headers
Easy Authentication - Add token to all requests automatically

Without Axios Instance (Bad):
javascript// Every API call needs full configuration
axios.get('http://localhost:4000/api/auth/profile', {
    headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
    }
});

axios.get('http://localhost:4000/api/tasks', {
    headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
    }
});
With Axios Instance (Good):
javascript// Just use the instance, configuration is automatic
axiosInstance.get('/api/auth/profile');
axiosInstance.get('/api/tasks');

2. Request Interceptor
javascriptaxiosInstance.interceptors.request.use(
    (config) => {
        if (typeof window !== "undefined" && typeof localStorage !== "undefined") {
            const accessToken = localStorage.getItem("token");
            if (accessToken) {
                config.headers.Authorization = `Bearer ${accessToken}`;
            }
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);
```

## **What is a Request Interceptor?**

A **Request Interceptor** is code that **runs BEFORE every HTTP request** is sent to the server.

**Responsibility:**
1. **Retrieves JWT token** from localStorage
2. **Adds Authorization header** to every request automatically
3. **Runs before every API call** (login, create task, get profile, etc.)

**Analogy:**
Think of it like a **security guard at a building entrance**:
- Before you enter (make a request), the guard checks if you have an ID badge (token)
- If you have one, they attach it to you (add Authorization header)
- Then you're allowed to enter (request is sent)

**Visual Flow:**
```
User clicks "Create Task"
    ↓
Frontend calls: axiosInstance.post('/api/tasks', data)
    ↓
Request Interceptor runs:
    - Gets token from localStorage
    - Adds header: Authorization: Bearer eyJhbGc...
    ↓
Request sent to backend with token
    ↓
Backend receives request with Authorization header
Example:
javascript// You write this in your code:
axiosInstance.get('/api/auth/profile');

// Interceptor automatically transforms it to:
axiosInstance.get('/api/auth/profile', {
    headers: {
        Authorization: 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...'
    }
});

3. Response Interceptor
javascriptaxiosInstance.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response) {
            const { status } = error.response;
            
            if (status === 401) {
                if (typeof window !== "undefined") {
                    window.location.href = "/login";
                }
            } else if (status === 500) {
                console.error("Server error. Please try again later.");
            }
        } else if (error.code === "ECONNABORTED") {
            console.warn("Request timeout. Please try again later.");
        }
        
        return Promise.reject(error);
    }
);
```

## **What is a Response Interceptor?**

A **Response Interceptor** is code that **runs AFTER every HTTP response** is received from the server.

**Responsibility:**
1. **Handles successful responses** - Just passes them through
2. **Handles errors globally** - Catches all errors from any API call
3. **Redirects on 401** - If token is invalid/expired, redirect to login
4. **Logs errors** - Shows error messages in console
5. **Handles timeouts** - Shows warning if request takes too long

**Analogy:**
Think of it like a **quality control inspector**:
- After the server responds (sends back data)
- Inspector checks if response is good or bad
- If bad (401 error), they redirect you to login
- If timeout, they log a warning

**Visual Flow:**
```
Backend sends response
    ↓
Response Interceptor runs:
    - Checks status code
    - If 401 → Redirect to /login
    - If 500 → Log error
    - If timeout → Log warning
    ↓
Response passed to your code
    ↓
Your .then() or .catch() runs
Example Scenarios:
Scenario 1: Token Expired
javascript// You make a request
axiosInstance.get('/api/tasks');

// Backend returns 401 (unauthorized)
// Response Interceptor automatically:
// - Detects 401 status
// - Redirects to /login
// - User never sees error, just gets redirected
Scenario 2: Server Error
javascript// You make a request
axiosInstance.post('/api/tasks', data);

// Backend returns 500 (server error)
// Response Interceptor:
// - Logs: "Server error. Please try again later."
// - Passes error to your catch block

4. API Paths (apiPaths.js)
javascriptexport const BASE_URL = "http://localhost:4000";

export const API_PATHS = {
    AUTH: {
        REGISTER: "/api/auth/register",
        LOGIN: "/api/auth/login",
        GET_PROFILE: "/api/auth/profile",
    },
    TASKS: {
        CREATE_TASK: "/api/tasks",
        GET_ALL_TASKS: "/api/tasks",
        // ...
    }
};
Responsibility:

Centralized endpoint definitions - All API URLs in one place
Easy to update - Change endpoint in one place
Type safety - No typos in URLs
Documentation - Easy to see all available endpoints

Usage:
javascript// Instead of:
axiosInstance.post('http://localhost:4000/api/tasks', data);

// Use:
axiosInstance.post(API_PATHS.TASKS.CREATE_TASK, data);

5. CreateTask Component
Responsibility:

Manages form state (title, description, priority, etc.)
Validates input before submission
Calls API to create task
Shows success/error messages using toast
Navigates back to task list after creation

Key Functions:
handleValueChange - Updates form state
javascriptconst handleValueChange = (key, value) => {
    setTaskData((prevData) => ({ ...prevData, [key]: value }));
};
createTask - Sends data to backend
javascriptconst createTask = async () => {
    const response = await axiosInstance.post(API_PATHS.TASKS.CREATE_TASK, {
        ...taskData,
        dueDate: new Date(taskData.dueDate).toISOString(),
        todoChecklist: todoList,
    });
};
```

---

### **6. SelectUsers Component**

**Responsibility:**
- **Fetches all users** from backend
- **Shows modal** with user list
- **Allows selection** of multiple users (checkboxes)
- **Updates parent state** with selected user IDs
- **Displays avatars** of selected users

**Data Flow:**
```
1. Component mounts → getAllUsers() → Fetches users from API
2. User clicks "Add Members" → Opens modal
3. User checks checkboxes → Updates tempSelectedUsers
4. User clicks "DONE" → Updates taskData.assignedTo
5. Parent component receives selected user IDs

7. UserContext
Responsibility:

Manages global user state (logged-in user data)
Fetches user profile on app load
Provides user data to all components
Updates user after login/signup
Clears user on logout

How it works:
javascript<UserProvider>
    <App />  {/* All components inside can access user data */}
</UserProvider>
Usage in components:
javascriptconst { user, loading } = useContext(UserContext);

Complete Request Flow Example
Creating a Task:

User fills form in CreateTask component
User clicks "CREATE TASK"
Frontend validates input (title, description, etc.)
Frontend calls:

javascript   axiosInstance.post(API_PATHS.TASKS.CREATE_TASK, taskData)
```

5. **Request Interceptor runs:**
   - Gets token from localStorage
   - Adds: `Authorization: Bearer <token>`

6. **Request sent to backend:**
```
   POST http://localhost:4000/api/tasks
   Headers: {
       Authorization: Bearer eyJhbGc...
       Content-Type: application/json
   }
   Body: {
       title: "Create App UI",
       description: "...",
       priority: "medium",
       assignedTo: ["507f1f77bcf86cd799439011"],
       // ...
   }

Backend receives request:

protect middleware runs
Verifies token
Attaches user to req.user


Controller runs:

createTask function
Validates data
Creates task in MongoDB
Returns response


Backend sends response:

json   {
       "message": "Task created successfully",
       "task": { ... }
   }

Response Interceptor runs:

Checks status (201 = success)
Passes response through


Frontend receives response:

javascript    toast.success("Task Created Successfully");
    clearData();

