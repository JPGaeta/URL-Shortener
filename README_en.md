# URL-Shortener

<p align="center">
  <span>English</span> |
  <a href="./README.md">Português Brasileiro</a>
</p>

This project is a robust and efficient API for shortening URLs. The API provides a fast and secure way to shorten long URLs, making them more manageable and shareable.

<p align="center">
  <a href="#Technologies">Technologies</a> •
  <a href="#Main Features">Features</a> •
  <a href="#Project Installation/Usage Methods">Installation</a> •
  <a href="#How the Project Works">How the Project Works</a> •
  <a href="#Project Highlights">Project Highlights</a> 
</p>

## Technologies Used

- NestJS
- TypeScript
- Express
- Prisma
- PostgreSQL

## Main Features

- **User Registration**: Allows users to sign up and manage their own shortened URLs.
- **JWT User Authentication**: Implements JWT authentication to ensure the security and integrity of user data.
- **URL Registration**: Users can shorten any URL, with or without authentication. The shortened URLs are unique and persistent.
- **URL Destination Update**: Users have the ability to change the destination of their shortened URLs at any time.
- **URL Deletion**: Shortened URLs can be deleted by users at any time, providing full control over their URLs.

This project is perfect for those looking for a customized and secure URL shortening service.

## Project Installation/Usage Methods

### 1. Access the Cloud-Hosted API Link

You can access the API directly via the link below:

[URL-Shortener-API](http://68.183.154.173:5000/)

> **Important:** This link will be deactivated soon for security reasons.

### 2. Using Docker

To use Docker, follow the steps below:

1.  Create the `docker.env` file based on `docker.env.example`.
2.  Run the following command:
    ```sh
    docker compose build
    ```
3.  After the build, run:
    ```sh
    docker compose up
    ```
    This will generate the database, build the project, and make it ready for local use.

### 3. Cloning the Repository

To clone the repository and run the project locally, follow the steps below:

1.  Clone the repository and create the `.env` file based on `.env.example`.
2.  Make sure you have Node.js 20 and Yarn installed on your machine, along with PostgreSQL running locally or in the cloud.
3.  Install the dependencies:

    ```sh
    yarn install
    ```

4.  Generate Prisma files:

    ```sh
    npx prisma generate
    ```

5.  Run Prisma migrations:

    ```sh
    npx prisma migrate dev
    ```

    > **Note:** Run `npx prisma migrate deploy` in production environments.

6.  To run the project in development:

    ```sh
    yarn start:dev
    ```

    To run the project in production:

    ```sh
    yarn build
    yarn start:prod
    ```

> **Note:** Run `yarn test` to execute unit tests.

# How the Project Works

This project has complete documentation of available routes at the URL "/docs". This documentation includes all parameters, request bodies, and required authentications for each route.

## Usage Without Authentication

1.  **Short Link Creation**: Use the short link creation route, providing the desired destination URL. You will receive the shortened URL in return.

2.  **Redirection**: Enter the returned shortened URL into your preferred browser to be redirected to the destination URL.

## Usage With Authentication

1.  **Account Creation**: Use the SignUp route to create your account.

2.  **Login**: Log in to the system with the registered credentials to receive your authentication token.

3.  **Using the Token**: Send your token in the authorization header ("Authorization: Bearer {token}") for routes that require authentication.

4.  **Short Link Creation**: When creating a new short link while authenticated, the link will automatically be associated with your account.

5.  **View Short Links**: Use the get route to retrieve all short links associated with your account.

6.  **Update Destination URL**: Use the update route to change the destination URL of an existing short link.

7.  **Delete Link**: If you need to delete a short link, use the delete route.

# Project Highlights

This project has several features that make it stand out:

- **NodeJS Versions**: The project defines and ensures which NodeJS versions are supported, ensuring compatibility and stability.
- **Git Tags for Release Versions**: Git tags are used to define release versions, making it easy to track changes and improvements.
- **Cloud Provider Deployment**: The project is deployed on a cloud provider, and the link is provided in the README for easy access.
- **Docker-Compose**: Docker-Compose is used to simplify the configuration and initialization of the complete local environment.
- **Unit Testing**: The project includes unit tests to ensure all parts of the code work as expected.
- **API Documentation**: The API is fully documented with Swagger, making it easy to understand and use.
- **Input Validation**: Input validation is implemented wherever necessary to ensure data security and integrity.
- **Pre-Commit or Pre-Push Hooks**: Pre-commit or pre-push hooks are set up to ensure code quality before any commits or pushes.
- **GitHub Actions**: GitHub Actions are used to automate lint and test execution, ensuring continuous code quality.
