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
const prisma = new client_1.PrismaClient();
const router = express_1.default.Router();
router.post('/loan', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { fullName, amount, 
        // loanTenure,
        reason, 
        // employmentStatus,
        // employmentAddress,
        userId } = req.body;
        console.log(req.body);
        const newLoan = yield prisma.loan.create({
            data: {
                customerName: fullName,
                amount: parseFloat(amount),
                reason: reason,
                userId,
            }
        });
        console.log("New loan is Created");
        console.log(newLoan);
        res.status(201).json({ message: 'Loan request submitted successfully', loan: newLoan });
    }
    catch (error) {
        console.error("Loan creation error:", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
}));
router.get('/loan', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const allLoans = yield prisma.loan.findMany();
        res.status(200).json({ message: 'All loans fetched successfully', loan: allLoans });
    }
    catch (error) {
        console.error("Loan fetching error:", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
}));
router.put('/loan/verify/:loanId', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { loanId } = req.params;
    const { verifierId } = req.body;
    console.log(verifierId);
    console.log(loanId);
    try {
        const updatedLoan = yield prisma.loan.update({
            where: { id: loanId },
            data: {
                status: 'VERIFIED',
                verifiedById: verifierId,
            },
        });
        console.log('Loan is updated');
        console.log(updatedLoan);
        res.json({ message: 'Loan verified successfully', loan: updatedLoan });
    }
    catch (error) {
        console.error("Verify Error:", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
}));
router.delete('/loan/reject/:loanId', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { loanId } = req.params;
    try {
        yield prisma.loan.delete({
            where: { id: loanId },
        });
        res.json({ message: 'Loan rejected and deleted' });
    }
    catch (error) {
        console.error("Reject Error:", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
}));
router.put('/loan/approve/:loanId', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { loanId } = req.params;
    const { adminId } = req.body;
    try {
        const loan = yield prisma.loan.findUnique({
            where: { id: loanId },
        });
        if (!loan || loan.status !== 'VERIFIED') {
            return res.status(400).json({ error: "Loan must be verified before approval" });
        }
        const updatedLoan = yield prisma.loan.update({
            where: { id: loanId },
            data: {
                status: 'APPROVED',
                approvedById: adminId,
            },
        });
        res.json({ message: 'Loan approved successfully', loan: updatedLoan });
    }
    catch (error) {
        console.error("Approval Error:", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
}));
router.get('/loan/verified', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const loans = yield prisma.loan.findMany({
            where: { status: 'VERIFIED' },
            include: {
                user: true,
                verifiedBy: true,
            },
        });
        res.json(loans);
    }
    catch (error) {
        console.error("Fetch Verified Loans Error:", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
}));
router.put('/loan/admin/reject/:loanId', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { loanId } = req.params;
    const { adminId, reason } = req.body;
    try {
        const loan = yield prisma.loan.findUnique({
            where: { id: loanId },
        });
        if (!loan || loan.status !== 'VERIFIED') {
            return res.status(400).json({ error: "Loan must be VERIFIED before Admin rejection" });
        }
        const rejectedLoan = yield prisma.loan.update({
            where: { id: loanId },
            data: {
                status: 'REJECTED',
                rejectedById: adminId,
                rejectionReason: reason || "Rejected by Admin",
            },
        });
        res.json({ message: "Loan rejected by Admin", loan: rejectedLoan });
    }
    catch (err) {
        console.error("Admin Reject Error:", err);
        res.status(500).json({ error: "Internal Server Error" });
    }
}));
exports.default = router;
