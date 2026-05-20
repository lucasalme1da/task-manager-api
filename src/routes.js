import { Database } from './database.js';
import { buildRoutePath } from './utils/build-route-path.js';

const database = new Database()

export const routes = [
  {
    method: 'POST',
    path: buildRoutePath('/tasks'),
    handler: async (req, res) => {
      const body = req.body

      const validator = (task) => {
        const messages = []

        if (!('title' in task)) {
          messages.push('"Title" cannot be empty.')
        }

        if (!('description' in task)) {
          messages.push('"Description" cannot be empty.')
        }

        return {
          valid: messages.length === 0,
          messages
        }
      }

      // Delay to mimic database connection
      await new Promise(r => setTimeout(r, 100))

      const created = await database.insert('tasks', body, validator)

      return res.writeHead(201).end(JSON.stringify(created))
    }
  },
  {
    method: 'GET',
    path: buildRoutePath('/tasks'),
    handler: async (req, res) => {
      const search = req.query

      const tasks = await database.select('tasks', search)

      return res.end(JSON.stringify(tasks))
    }
  },
  {
    method: 'PUT',
    path: buildRoutePath('/tasks/:id'),
    handler: async (req, res) => {

      const body = req.body
      const id = req.params.id

      const tasks = await database.update('tasks', id, body,)

      return res.end(JSON.stringify(tasks))
    }
  },
  {
    method: 'PATCH',
    path: buildRoutePath('/tasks/:id/complete'),
    handler: async (req, res) => {
      const id = req.params.id

      await database.toggleCompletion('tasks', id)

      return res.end()

    }
  },
  {
    method: 'DELETE',
    path: buildRoutePath('/tasks/:id'),
    handler: async (req, res) => {
      const id = req.params.id

      await database.delete('tasks', id)

      return res.end()
    }
  },
]