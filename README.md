## Express server as a module of the Kontroll backend

### Install the software

1. #### First clone the repository

   ```bash
   git clone https://github.com/leonardobaranelli/kontroll-backend-module/
   ```

2. #### Create a .env file on the root of the directory with the following variable names, and fill it with your credentials:

   ```bash
   PORT = 3001
   #DATABASE_TYPE=firestore
   DATABASE_TYPE=sequelize

   # DB credentials example
   DB_NAME = kontroll-local
   DB_USER = postgres
   DB_PASS = admin
   DB_HOST = localhost

   JWT_SECRET =
   SESSION_SECRET = this-one-can-be-empty
   ```

3. #### Then (on the root of the directory too), run the following command to install the dependencies:

   ```bash
   npm i
   ```

You also have to install a python server, that is used to process some tasks in the core of the backend
(be sure you have python 3.9 or higher installed in your main system)

4. #### Navigate to the server directory:

   ```bash
   cd src/core/carriers/get-req-via-doc/4b-process-links/2-process-content/spacy
   ```

5. #### Create a virtual environment:

   ```bash
   python -m venv venv
   ```

6. #### Activate the virtual environment:

   On Windows:

   ```bash
    source venv/scripts/activate
   ```

   On Linux:

   ```bash
    source venv/bin/activate
   ```

7. #### Install the required packages:

   ```bash
   pip install -r requirements.txt
   ```

8. #### Download the SpaCy language model:

   ```bash
   python -m spacy download en_core_web_sm
   ```

At this point, you have already configured the software :)
<br><br>

### Run the backend (already configured)

Run the main server and the auxiliary python server (both must be running simultaneously)

1. #### On the root of the directory run the following command:

   ```bash
   npm start
   ```

2. #### Open other console and navigate to python server directory:

   ```bash
   cd src/core/carriers/get-req-via-doc/4b-process-links/2-process-content/spacy
   ```

3. #### Activate the virtual environment:

   On Windows:

   ```bash
    source venv/scripts/activate
   ```

   On Linux:

   ```bash
    source venv/bin/activate
   ```

4. #### Run the server:

   ```bash
    python nlp_server.py
   ```