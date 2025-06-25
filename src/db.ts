// db.ts
import { JSONFile } from 'lowdb/node'
import { Low } from 'lowdb'
import { join, dirname } from 'path'
import { fileURLToPath } from 'url'

// Fix for __dirname in ESM
const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

type Post = {
  id: number
  title: string
  body: string
}

type Data = {
  posts: Post[]
}

const file = join(__dirname, '../db.json')
const adapter = new JSONFile<Data>(file)
const db = new Low<Data>(adapter, { posts: [] })

export const initDb = async () => {
  await db.read()
  db.data ||= { posts: [] }
  await db.write()
}

export default db