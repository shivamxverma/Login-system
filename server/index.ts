import express, { Request, Response, NextFunction } from 'express';
import { PrismaClient } from '@prisma/client';
import cors from 'cors';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
import cookieParser from 'cookie-parser';
import LoanRoute from './routes/route';
import AdminRoute from './routes/admin';

dotenv.config();
const app = express();
const prisma = new PrismaClient();
const JWT_SECRET = process.env.JWT_SECRET || "SHIVAM12@#";

app.use(express.json());
app.use(cookieParser());

app.use(cors({
  origin: "https://login-system-eosin.vercel.app",
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"],
  credentials: true,
}));


const authenticateToken = (req: Request, res: Response, next: NextFunction) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) return res.status(401).json({ error: 'Access Denied. No token provided.' });

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    (req as any).user = decoded;

    res.cookie("userId", (decoded as any).userId, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 24 * 60 * 60 * 1000,
    });

    next();
  } catch (err) {
    return res.status(403).json({ error: 'Invalid or expired token.' });
  }
};

app.post('/signup', async (req : any, res : any) => {
  const { name, email, password, role } = req.body;

  const uppercaseRole = role.toUpperCase();

  const existingUser = await prisma.user.findUnique({ where: { email } });
  if (existingUser) {
    return res.status(409).json({ error: "User already exists" });
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  await prisma.user.create({
    data: {
      name,
      email,
      password: hashedPassword,
      role: uppercaseRole,
    },
  });

  return res.status(200).json({ msg: "Signup Success" });
});

app.post('/login', async (req: any, res: any) => {
  const { email, password } = req.body;

  try {
    const user = await prisma.user.findUnique({ where: { email } });

    if (!user || !(await bcrypt.compare(password, user.password))) {
      return res.status(401).json({ error: "Invalid credentials" });
    }

    const token = jwt.sign(
      { userId: user.id, role: user.role },
      JWT_SECRET,
      { expiresIn: '1h' }
    );

    res.cookie("userId", user.id, {
      httpOnly: true,
      secure: false,
      sameSite: "lax",
      maxAge: 24 * 60 * 60 * 1000,
    });

    res.cookie("userRole", user.role, {
      httpOnly: true,
      secure: false,
      sameSite: "lax",
      maxAge: 24 * 60 * 60 * 1000,
    });

    return res.status(200).json({
      msg: "Login Success",
      token,
      user: { name: user.name, email: user.email, role: user.role },
    });

  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: "Internal Server Error" });
  }
});

app.use('/api', LoanRoute); 
app.use('/users',AdminRoute);

const port = process.env.PORT || 5000 ;
app.listen(port, () => {
  console.log('✅ Server running at https://login-system-wqit.onrender.com');
});


