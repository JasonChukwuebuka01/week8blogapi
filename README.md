# Blog API

A REST API for user registration and authentication, profile-image uploads, and blog post management. The application is built with Express, stores users and blog posts in MongoDB through Mongoose, uses JWT bearer tokens for protected routes, and stores uploaded images in Cloudinary.

## Features

- Create an account and sign in with an email and password.
- Issue JWT access tokens that expire after seven days.
- Create, list, search, retrieve, update, and delete blog posts.
- Restrict blog updates and deletion to the post's author.
- Upload a profile image and blog images to Cloudinary.
- Validate authentication and blog request bodies with Joi.

## Requirements

- Node.js and npm.
- A MongoDB database (local or hosted, such as MongoDB Atlas).
- A Cloudinary account for image uploads.

## Installation

1. Clone or download this repository and open a terminal in the project directory.
2. Install the dependencies declared in `package.json`:

	 ```sh
	 npm install
	 ```

3. Create a `.env` file in the project root and set the environment variables described below.
4. Start the server using one of the commands in [Running the API](#running-the-api).

## Environment variables

The server loads environment variables from `.env` with `dotenv`.

| Variable | Required | Purpose |
| --- | --- | --- |
| `Port` | Yes | Port on which the Express server listens. The current server code uses this exact capitalization. |
| `MONGO_URI` | Yes | MongoDB connection string. |
| `JWT_SECRET` | Yes | Secret used to sign and verify authentication tokens. Use a long, private random value. |
| `CLOUDINARY_CLOUD_NAME` | Yes for image uploads | Cloudinary cloud name. |
| `CLOUDINARY_API_KEY` | Yes for image uploads | Cloudinary API key. |
| `CLOUDINARY_API_SECRET` | Yes for image uploads | Cloudinary API secret. Keep it private. |

Example `.env` layout (replace the example values with your own; do not commit secrets):

```dotenv
Port=3000
MONGO_URI=mongodb://127.0.0.1:27017/blogapi
JWT_SECRET=replace-with-a-long-random-secret
CLOUDINARY_CLOUD_NAME=your-cloud-name
CLOUDINARY_API_KEY=your-api-key
CLOUDINARY_API_SECRET=your-api-secret
```

For MongoDB Atlas, use the connection URI provided by Atlas instead of the local MongoDB URI. Ensure the database user and network access settings permit the connection.

## Running the API

Start in normal mode:

```sh
npm start
```

Start in development mode with Nodemon restarting the server when files change:

```sh
npm run dev
```

When the database connection succeeds, the server logs `Connected to MongoDB`. The root endpoint can be used as a simple availability check:

```http
GET /
```

It returns `Welcome to the Blog API`. The API routes are mounted under `/api/users` and `/api/blogs`.

## Authentication

Sign-in returns a bearer token. Include it on every protected request as an HTTP header:

```http
Authorization: Bearer <token>
```

Tokens are signed with `JWT_SECRET` and expire after seven days. Requests without a token, with an invalid or expired token, or associated with a user that no longer exists are rejected.

## API reference

All request and response bodies are JSON unless an endpoint is explicitly described as a file upload. Protected endpoints require the bearer token described above.

### Users

#### Create an account

```http
POST /api/users/sign-up
Content-Type: application/json
```

Request body:

```json
{
	"name": "Avery Writer",
	"email": "avery@example.com",
	"password": "example-password"
}
```

Validation: `name` is required, trimmed, and 2–100 characters; `email` must be a valid email address; `password` is required and at least 6 characters. A successful request returns `201` with `{ "message": "User created successfully" }`. A duplicate email returns `400` with `{ "message": "User already exists" }`. Passwords are hashed before being stored.

#### Sign in

```http
POST /api/users/sign-in
Content-Type: application/json
```

Request body:

```json
{
	"email": "avery@example.com",
	"password": "example-password"
}
```

Both fields are required; the email must be valid and the password must be at least 6 characters. On success, the endpoint returns `200` with a message, a public user object (`id`, `name`, and `email`), and a JWT `token`. Invalid credentials return `404` when no account matches the email, or `400` when the password does not match.

#### Upload or replace a profile image

```http
POST /api/users/profile-image
Authorization: Bearer <token>
Content-Type: multipart/form-data
```

Send one file in the multipart field named `avatar`. The image is uploaded to the Cloudinary `blog-images` folder, and its URL is saved as the authenticated user's `profileImage`. A successful request returns `200` with a success message, uploaded-file details, and the updated user. If no file is supplied, the endpoint returns `400`.

### Blogs

Every blog endpoint requires authentication.

#### List blogs and search

```http
GET /api/blogs
Authorization: Bearer <token>
```

Returns `200` with an array of blog documents. To search titles and content with a case-insensitive regular-expression match, provide the `q` query parameter:

```http
GET /api/blogs?q=travel
Authorization: Bearer <token>
```

The list response populates each blog's author with the author's `name` and `email`.

#### Create a blog

```http
POST /api/blogs
Authorization: Bearer <token>
Content-Type: application/json
```

Request body:

```json
{
	"title": "A day by the coast",
	"content": "A longer description of the trip goes here."
}
```

`title` is required, trimmed, and 3–100 characters. `content` is required and at least 10 characters. The authenticated user is recorded as the author. A successful request returns `201` with the created blog document.

The route is also configured to accept up to five uploaded files in a multipart field named `images`; accepted image formats are JPG, JPEG, and PNG. See [Known implementation notes](#known-implementation-notes) about multipart validation ordering.

#### Get one blog

```http
GET /api/blogs/:id
Authorization: Bearer <token>
```

Returns `200` with the blog document, or `404` with `{ "message": "Blog not found" }` if the ID does not identify a blog.

#### Update a blog

```http
PUT /api/blogs/:id
Authorization: Bearer <token>
Content-Type: application/json
```

Supply at least one field to update. `title`, if provided, must be 3–100 characters; `content`, if provided, must be at least 10 characters. The route also accepts up to five uploaded files in the multipart field named `images`. Only the blog's author can update it. A successful request returns `200` with the updated blog; a missing blog returns `404`, and a request by a different user returns `403`.

#### Delete a blog

```http
DELETE /api/blogs/:id
Authorization: Bearer <token>
```

Only the blog's author can delete it. Success returns `200` with `{ "message": "Blog deleted successfully" }`; a missing blog returns `404`, and a request by a different user returns `403`.

## Data model overview

- **User:** name, unique email, hashed password, optional profile-image URL, and Mongoose `createdAt`/`updatedAt` timestamps.
- **Blog:** title, content, author reference to a user, image URL entries, and Mongoose `createdAt`/`updatedAt` timestamps.

Blog images and profile images are stored as URLs returned by Cloudinary. The upload middleware configures the `blog-images` Cloudinary folder and JPG/JPEG/PNG formats. Blog create/update routes allow up to five files, while the profile-image route accepts one file.

## Project structure

```text
server.js                         Express app, middleware, routes, and startup
src/
	config/                         MongoDB and Cloudinary configuration
	controllers/                    User, profile-image, and blog request handlers
	middleware/                     Authentication, upload, and Joi validation
	models/                         Mongoose User and Blog schemas
	routes/                         User and blog endpoint definitions
	utils/                          JWT creation helper
	validations/                    Joi request schemas
```

## Errors and troubleshooting

- **MongoDB connection fails:** check `MONGO_URI`, database availability, Atlas network access, and credentials. The process exits if it cannot connect.
- **Protected endpoint returns `401`:** sign in again and send `Authorization: Bearer <token>`; confirm `JWT_SECRET` is consistent between server runs.
- **Image upload fails:** verify the Cloudinary credentials and use a supported image format (JPG, JPEG, or PNG).
- **Validation returns `400`:** inspect the `error` or `message` field and verify the required fields and length constraints.
- **Unexpected server error:** the Express error handler returns a `500` response containing a message; inspect the server log for details.

## Known implementation notes

- The blog create and update routes run Joi body validation before Multer processes multipart form data. Consequently, multipart text fields may not be available to the validator at that point; test the image-upload flows against the running service. This README documents the current route behavior and does not change it.
- The upload middleware passes a numeric value to Multer's `limits` option, although Multer expects a limits object. No specific maximum file size is therefore documented here.
- The `npm test` script is currently a placeholder that exits with an error because no test suite is configured.
- The server reads `Port` with an uppercase `P`; set that exact variable name in `.env` unless the code is intentionally changed later.

## License

The package currently declares the ISC license in `package.json`.
