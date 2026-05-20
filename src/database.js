
import { randomUUID } from 'node:crypto';
import { readFile, writeFile } from 'node:fs/promises';
import { APIError } from './utils/api-error.js';

const databasePath = new URL('db.json', import.meta.url);

export class Database {
  #database = {}

  async #persist() {
    try {
      await writeFile(databasePath, JSON.stringify(this.#database))
    } catch (error) {
      await this.#persist();
    }
  }

  async #load() {
    try {
      const db = await readFile(databasePath)

      if (!db) throw new Error("Databased not found")

      this.#database = JSON.parse(db)
    } catch (error) {
      await this.#persist();
    }
  }

  constructor() {
    this.#load();
  }

  #getItem(table, id) {
    if (!id) throw new APIError('Parameter "id" cannot be empty.',)

    const itemIndex = this.#database[table]?.findIndex(i => i.id === id)
    const item = this.#database[table]?.[itemIndex]

    if (!item) throw new APIError('Resource not found')

    return { item, itemIndex }
  }

  select(table, search = {}) {
    let data = this.#database[table] ?? [];

    console.log({ search })
    if (!!Object.keys(search)?.length) {
      data = data.filter(v => {
        return Object.entries(search).every(([key, value]) =>
          v[key]?.toLowerCase().includes(value?.trim().toLowerCase() || "")
        )
      })
    }

    return data;
  }

  insert(table, body, validator) {
    if (!body) throw new Error('No body found')

    if (!!validator) {
      const { valid, messages } = validator(body)
      if (!valid) throw new Error(messages.join(', '))
    }

    const created_at = new Date().toISOString()

    const newItem = {
      id: randomUUID(),
      created_at,
      updated_at: created_at,
      completed_at: null,
      ...body,
    }

    if (!this.#database[table]) {
      this.#database[table] = []
    }
    this.#database[table].push(newItem)


    this.#persist();

    return newItem

  }

  update(table, id, body) {
    if (!body) throw new APIError('No body found',)

    const { item, itemIndex } = this.#getItem(table, id)

    const updatedItem = {
      ...item,
      ...body,
      updated_at: new Date().toISOString(),
    }

    this.#database[table][itemIndex] = updatedItem

    this.#persist();

    return;
  }

  toggleCompletion(table, id) {
    const { item, itemIndex } = this.#getItem(table, id)

    const updatedItem = {
      ...item,
      completed_at: !item.completed_at ? new Date().toISOString() : null,
    }

    this.#database[table][itemIndex] = updatedItem

    this.#persist();

    return;
  }

  delete(table, id) {
    const { itemIndex } = this.#getItem(table, id)

    this.#database[table].splice(itemIndex, 1)

    this.#persist();

    return;
  }
}