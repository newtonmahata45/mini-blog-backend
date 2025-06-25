import { Router } from 'express';
import type { Request, Response } from 'express'
import db from '../db.ts'

const router = Router()

// GET all posts
router.get('/', async (req: Request, res: Response): Promise<any> => {
  try {
  await db.read()
  return res.status(200).send(db.data?.posts || [])
  } catch (error: any) {
    console.error('Error fetching posts:', error)
    return res.status(500).send({ message: error.message || 'Internal Server Error' })
  }
})

// POST new post
router.post('/', async (req: Request, res: Response): Promise<any> => {
  const { title, body } = req.body
  if (!title || !body) {
    return res.status(400).send({ message: 'Title and body are required' })
  }

  await db.read()
  const posts = db.data?.posts || []
  const newPost = {
    id: Date.now(),
    title,
    body,
  }
  posts.push(newPost)
  db.data!.posts = posts
  await db.write()

  res.status(201).send(newPost)
})

// PUT update post
router.put('/:id', async (req: Request, res: Response): Promise<any> => {
  const id = Number(req.params.id)
  const { title, body } = req.body

  await db.read()
  const post = db.data?.posts.find((p) => p.id === id)

  if (!post) return res.status(404).send({ message: 'Post not found' })

  post.title = title || post.title
  post.body = body || post.body

  await db.write()
  res.send(post)
})

// DELETE post
router.delete('/:id', async (req: Request, res: Response): Promise<any> => {
  const id = Number(req.params.id)

  await db.read()
  const posts = db.data?.posts || []
  const updated = posts.filter((p) => p.id !== id)

  if (posts.length === updated.length)
    return res.status(404).send({ message: 'Post not found' })

  db.data!.posts = updated
  await db.write()

  res.send({ message: 'Post deleted successfully' })
})

export default router