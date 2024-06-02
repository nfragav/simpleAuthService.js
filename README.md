# Simple Auth API

A simple and easy to use auth API. Works by lifting a database to store users, implementing fine security practices🔐👥. Technologies featuring this project are:
- Docker for initialization of the 2 containers.
- A PosgreSQL server in the container `users-db`.
- A Node.js API which connects to the database using `Sequelize`.
- JWT as standard practice to handle authentication.

## Features

- User registration.
- User authentication.
- Password hashing for secure storage.
- Token generation for authenticated users.

## Getting Started

These instructions will get you a copy of the project up and running on your local machine for development and testing purposes.

### Prerrequisites

- Docker, may be installed by following [this guide](https://docs.docker.com/engine/install/), according to your OS. It should come with the `docker compose` plugin. If you are a linux user and after installing Docker you may not run any of these commands:

```
docker compose
```
```
docker-compose
```

Then, you should install the Docker compose plugin by following the steps in [this site](https://docs.docker.com/compose/install/linux/#install-using-the-repository).

### Installation

1. Clone the repository:

```
git clone https://github.com/nfragav/simpleAuthService.js.git
```

2. Create an `.env` file in the root of this repository the [.env.example](.env.example) file as template. For creating JWT secret keys, you can use the following command (requires `node.js` installed in your machine):

```
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

3. Running the following command to give execute permissions to the Docker container:

```
chmod +x db/setup.sh
```

4. Run the following command
```
docker compose up
```
This will build the necessary containers and run the program, exposing the API and the database at the defined ports in tne `.env` file.

5. *Voilà*, you are ready to use this authentication service and save your users, with a token expiration of 2 hours.

### API Documentation

To see the API documentation, see [this file](docs/api_documentation.md) in `docs/` folder.