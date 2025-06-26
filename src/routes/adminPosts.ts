import { Router } from 'express';
import type { Request, Response } from 'express';
import db from '../db.ts';

const router = Router();

// GET all posts
router.get('/', async (req: Request, res: Response): Promise<any> => {
  try {
    await db.read();
    return res.status(200).send(db.data?.posts || []);
  } catch (error: any) {
    return res.status(500).send({ message: error.message || 'Internal Server Error' });
  }
});

// POST new post
router.post('/', async (req: Request, res: Response): Promise<any> => {
  try {
    const title = req.body.title?.trim();
    const body = req.body.body?.trim();

    if (!title || !body) {
      return res.status(400).send({ message: 'Title and body are required' });
    }

    await db.read();
    const posts = db.data?.posts || [];
    const newPost = {
      id: Date.now(),
      title,
      body,
    };
    posts.push(newPost);
    db.data!.posts = posts;
    await db.write();

    return res.status(201).send(newPost);
  } catch (error: any) {
    return res.status(500).send({ message: error.message || 'Internal Server Error' });
  }
});

// PUT update post
router.put('/:id', async (req: Request, res: Response): Promise<any> => {
  try {
    const id = Number(req.params.id);
    const title = req.body.title?.trim();
    const body = req.body.body?.trim();

    await db.read();
    const post = db.data?.posts.find((p) => p.id === id);

    if (!post) {
      return res.status(404).send({ message: 'Post not found' });
    }

    if (!title && !body) {
      return res.status(400).send({ message: 'At least one of title or body must be provided' });
    }

    post.title = title || post.title;
    post.body = body || post.body;

    await db.write();
    return res.send(post);
  } catch (error: any) {
    return res.status(500).send({ message: error.message || 'Internal Server Error' });
  }
});

// DELETE post
router.delete('/:id', async (req: Request, res: Response): Promise<any> => {
  try {
    const id = Number(req.params.id);

    await db.read();
    const posts = db.data?.posts || [];
    const updated = posts.filter((p) => p.id !== id);

    if (posts.length === updated.length) {
      return res.status(404).send({ message: 'Post not found' });
    }

    db.data!.posts = updated;
    await db.write();

    return res.send({ message: 'Post deleted successfully' });
  } catch (error: any) {
    return res.status(500).send({ message: error.message || 'Internal Server Error' });
  }
});

export default router;