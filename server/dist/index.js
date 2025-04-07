"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const client_1 = require("@prisma/client");
const cors_1 = __importDefault(require("cors"));
const bcrypt_1 = __importDefault(require("bcrypt"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const dotenv_1 = __importDefault(require("dotenv"));
const cookie_parser_1 = __importDefault(require("cookie-parser"));
const route_1 = __importDefault(require("./routes/route"));
dotenv_1.default.config();
const app = (0, express_1.default)();
const prisma = new client_1.PrismaClient();
const JWT_SECRET = process.env.JWT_SECRET || "SHIVAM12@#";
// 🔐 Middleware
app.use(express_1.default.json());
app.use((0, cookie_parser_1.default)());
// ✅ CORS FIX
app.use((0, cors_1.default)({
    origin: "http://localhost:5173", // your frontend URL
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
    credentials: true, // <== very important
}));
// 💡 Handle Preflight requests
app.options('*', (0, cors_1.default)());
// 🔐 Auth Middleware
const authenticateToken = (req, res, next) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];
    if (!token)
        return res.status(401).json({ error: 'Access Denied. No token provided.' });
    try {
        const decoded = jsonwebtoken_1.default.verify(token, JWT_SECRET);
        req.user = decoded;
        // 🍪 Set Cookie with userId
        res.cookie("userId", decoded.userId, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "lax",
            maxAge: 24 * 60 * 60 * 1000,
        });
        next();
    }
    catch (err) {
        return res.status(403).json({ error: 'Invalid or expired token.' });
    }
};
app.post('/signup', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { name, email, password, role } = req.body;
    const uppercaseRole = role.toUpperCase();
    const existingUser = yield prisma.user.findUnique({ where: { email } });
    if (existingUser) {
        return res.status(409).json({ error: "User already exists" });
    }
    const hashedPassword = yield bcrypt_1.default.hash(password, 10);
    yield prisma.user.create({
        data: {
            name,
            email,
            password: hashedPassword,
            role: uppercaseRole,
        },
    });
    return res.status(200).json({ msg: "Signup Success" });
}));
// 🔐 Login Route with Token + Cookie
app.post('/login', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { email, password } = req.body;
    try {
        const user = yield prisma.user.findUnique({ where: { email } });
        if (!user || !(yield bcrypt_1.default.compare(password, user.password))) {
            return res.status(401).json({ error: "Invalid credentials" });
        }
        const token = jsonwebtoken_1.default.sign({ userId: user.id, role: user.role }, JWT_SECRET, { expiresIn: '1h' });
        // 🍪 Set cookie
        res.cookie("userId", user.id, {
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
    }
    catch (err) {
        console.error(err);
        return res.status(500).json({ error: "Internal Server Error" });
    }
}));
// 📦 Loan Routes
app.use('/api', route_1.default); // all your loan routes go here
// 🚀 Start server
app.listen(8000, () => {
    console.log('✅ Server running at http://localhost:8000');
});
