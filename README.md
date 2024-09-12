# admin-dashboard-backend

### :dvd: Installation

#### 1. Getting Started

``` sh
# Clone this repo to your local machine using
https://github.com/MazenOth/admin-dashboard-backend.git

# Get into the directory 
cd admin-dahshboard-backend

# Make it your own
rm -rf .git && git init
```

#### 2. Install all Dependencies
```sh
# On the command line or terminal paste this line:
npm i
# preferably user node version 16.20.2, you can use NVM on that.
```

#### 3. Setup PostgreSQL local Connection


You can use any DBMT like DBeaver, and add DB credentials to .env file in this format:
``` sh
DB_HOST=
DB_USER=
DB_PASSWORD=
DB_NAME=
DB_PORT=

```

#### 4. Run Back-end server locally 

Open the terminal on the project's directory:

``` sh

# Use the start script
npm run start

```

### 5. Integration and Unit Testing

``` sh
# Run the test script
npm run test

```

Everything should be working from here :)

### :dvd: Assumptions: 

#### 1- A helper cannot become a client and vice versa.
#### 2- A helper or a client can only have a single match; if a helper is assigned to a client this helper cannot be reassigned except he unassigned from his client.
