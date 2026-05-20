This repository contains the Task Manager API developed as part of one of the challenges from the Rocketseat Node.js course, featuring CSV stream import support.

The API is stateless and was built using Node.js native http module and a simple JSON file as persistent storage.

#### Running the Project

Install the dependencies and start the development server:

```bash
npm install
npm run dev
```

To test the CSV stream import script:

```bash
node src/utils/csv-import-script.js
```

#### Challenge Requirements

- [x] Add a POST /tasks route to create tasks
- [x] Add a GET /tasks route to list tasks
- [x] Add filtering support to GET /tasks by title and description
- [x] Add a PUT /tasks/:id route to fully update a task
- [x] Validate whether the task exists before updating
- [x] Add a DELETE /tasks/:id route to delete a task
- [x] Validate whether the task exists before deleting
- [x] Add a PATCH /tasks/:id/complete route to mark a task as completed or pending
- [x] Validate whether the task exists before patching
- [x] Create a separate script to import tasks
- [x] Use the csv-parse library to read the CSV file as a stream
- [x] Implement the logic to send requests to POST /tasks for each CSV row during import

#### Extra Implementations

- [x] Validate the request body in POST /tasks to ensure the required fields are present
- [x] Return feedback in all routes that expect an ID when the task is not found
