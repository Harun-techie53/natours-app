
# Natours App

## A fully functional EXAMPLE Project built in Javascript showing how to create a REST API with all of Backend Functionalities

This project is an example project which mainly illustrates the following:
* Creating a custom Http web server, handling API routes by using Expressjs.
* This application maintains MVC architecture.
* Developed a robust authentication service incorporating JWT, OAuth 2.0,          cookie-based authentication, role-based authentication and salted password hashing.
* Forgot or reset password functionality has also been implemented.
* Enabled rate limiting, logging internal errors and http requests/responses during development.
* This application consists of three main modules those are Users, Tours and Reviews. These modules have Create, Read, Update and Delete in short CRUD functionalities.
* Multiple MongoDB aggregation pipelines are being used for showing grouped statistics.

## Environment Variables

To run this project, you will need to add the following environment variables to your .env file

`NODE_ENV`

`DATABASE_REMOTE`

`DATABASE_PASSWORD`

`PORT`

`JWT_SECRET`

`JWT_EXPIRES_IN`

`JWT_COOKIE_EXPIRES_IN`


## Run Locally

Clone the project

```bash
  git clone https://github.com/Harun-techie53/natours-app.git
```

Go to the project directory

```bash
  cd natours-app
```

Install dependencies

```bash
  npm install
```

Start the server

```bash
  npm run start
```

