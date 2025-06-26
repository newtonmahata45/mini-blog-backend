import express from 'express'
import cors from 'cors'
import { initDb } from './db.ts'


const app = express()
const PORT = 4000

app.use(cors())
app.use(express.json());

await initDb()


const adminRoutes = await import('./routes/adminPosts.ts') 
app.use('/admin/posts', adminRoutes.default)


app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`)
})