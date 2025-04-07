import { Request, Response } from 'express';
import express from 'express';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

const router = express.Router();

router.get('/admins', async (req: Request, res: Response) => {
    try {
      const admins = await prisma.user.findMany({
        where: { role: 'ADMIN' },
        select: { id: true, name: true, email: true, role: true, createdAt: true, updatedAt: true },
      });
      res.json(admins);
    } catch (error) {
      console.error('Error fetching admins:', error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  });

router.delete('/:id', async (req: any, res: any) => {
    const { id } = req.params;
    const currentUserId = req.user?.id || 'current-user-id';
  
    if (id === currentUserId) {
      return res.status(400).json({ error: 'You cannot delete yourself' });
    }
  
    try {
      const user = await prisma.user.findUnique({
        where: { id },
      });
  
      if (!user || user.role !== 'ADMIN') {
        return res.status(404).json({ error: 'Admin not found' });
      }
  
      await prisma.user.delete({
        where: { id },
      });
  
      res.json({ message: 'Admin deleted successfully' });
    } catch (error) {
      console.error('Error deleting admin:', error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  });

  export default router;