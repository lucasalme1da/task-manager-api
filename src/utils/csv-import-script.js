import { parse } from 'csv-parse';
import { createReadStream } from 'node:fs';


const parser = parse({ delimiter: "," })

const csvFilePath = new URL('tasks.csv', import.meta.url);

async function importCSV() {

  const fileStream = await createReadStream(csvFilePath)

  let idx = 0
  for await (const chunk of fileStream.pipe(parser)) {
    if (idx > 0) {
      const [title, description] = chunk;

      console.log('Adding a new task:', title)

      await fetch('http://localhost:3333/tasks', {
        method: "POST",
        body: JSON.stringify({ title, description }),
      })
    }

    idx += 1;
  }

}

importCSV();