# API Documentation
This API provides endpoints for user verification, user creation, and login.

## Endpoints
### Verify Token
#### POST /verify
Verifies the authenticity of a JWT token.

##### Headers:

- Authorization: Bearer <token>

##### Responses:

- 200 OK: Token is valid.
- 403 Forbidden: Token is invalid or expired.


### Create User
#### POST /users
Creates a new user with a hashed password and returns an authentication token.

##### Request Body:
```
{
  "username": "string",
  "email": "string",
  "password": "string"
}
```
##### Responses:

- 201 Created: User created successfully.
```
{
  "user": {
    "username": "string",
    "email": "string"
  },
  "token": {
    "access_token": "string",
    "token_type": "Bearer"
  }
}
```
- 409 Conflict: Email address or username already exists.
```
{
  "message": "Email address or Username already exist"
}
```

### Login
#### POST /login
Logs in a user and returns an authentication token if the credentials are correct.

##### Request Body

```
{
  "username": "string",
  "password": "string"
}
```

##### Responses:

- 201 Created: Login successful.
```
{
  "user": {
    "username": "string",
    "email": "string"
  },
  "token": {
    "access_token": "string",
    "token_type": "Bearer"
  }
}
- 401 Unauthorized: Username or password is incorrect.
```
{
  "message": "Username or password is incorrect"
}
```
- 403 Forbidden: Username or password is incorrect.
```
{
  "message": "Username or password is incorrect"
}
```

### Error Handling
Errors are returned in the following format:
```
{
  "message": "Error message"
}
```