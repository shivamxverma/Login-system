import express from 'express';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();
const router = express.Router();

router.post('/loan', async (req : any, res : any) => {
    try {
      const {
        Name,
        Amount,
        // Tenure,
        Reason,
        // EmploymentStatus,
        // EmploymentAddress,
        userId
      } = req.body;

      console.log(req.body);
  
      const newLoan = await prisma.loan.create({
        data: {
          customerName: Name,
          amount: parseFloat(Amount),
          reason: Reason,
          userId,
        }
      });

      console.log("New loan is Created");
      console.log(newLoan);
  
      res.status(201).json({ message: 'Loan request submitted successfully', loan: newLoan });
  
    } catch (error) {
      console.error("Loan creation error:", error);
      res.status(500).json({ error: "Internal Server Error" });
    }
});

router.put('/loan/verify/:loanId', async (req, res) => {
  const { loanId } = req.params;
  const { verifierId } = req.body;

  console.log(verifierId);
  console.log(loanId);

  try {
    const updatedLoan = await prisma.loan.update({
      where: { id: loanId },
      data: {
        status: 'VERIFIED',
        verifiedById: verifierId,
      },
    });

    console.log('Loan is updated');
    console.log(updatedLoan);

    res.json({ message: 'Loan verified successfully', loan: updatedLoan });
  } catch (error) {
    console.error("Verify Error:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

router.delete('/loan/reject/:loanId', async (req, res) => {
  const { loanId } = req.params;

  try {
    await prisma.loan.delete({
      where: { id: loanId },
    });

    res.json({ message: 'Loan rejected and deleted' });
  } catch (error) {
    console.error("Reject Error:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

router.put('/loan/approve/:loanId', async (req : any, res : any) => {
  const { loanId } = req.params;
  const { adminId } = req.body;

  try {
    const loan = await prisma.loan.findUnique({
      where: { id: loanId },
    });

    if (!loan || loan.status !== 'VERIFIED') {
      return res.status(400).json({ error: "Loan must be verified before approval" });
    }

    const updatedLoan = await prisma.loan.update({
      where: { id: loanId },
      data: {
        status: 'APPROVED',
        approvedById: adminId,
      },
    });

    res.json({ message: 'Loan approved successfully', loan: updatedLoan });
  } catch (error) {
    console.error("Approval Error:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

router.get('/loan/verified', async (req, res) => {
  try {
    const loans = await prisma.loan.findMany({
      where: { status: 'VERIFIED' },
      include: {
        user: true,
        verifiedBy: true,
      },
    });

    res.json(loans);
  } catch (error) {
    console.error("Fetch Verified Loans Error:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});
  
  router.put('/loan/admin/reject/:loanId', async (req : any, res : any) => {
    const { loanId } = req.params;
    const { adminId, reason } = req.body;
  
    try {
      const loan = await prisma.loan.findUnique({
        where: { id: loanId },
      });
  
      if (!loan || loan.status !== 'VERIFIED') {
        return res.status(400).json({ error: "Loan must be VERIFIED before Admin rejection" });
      }
  
      const rejectedLoan = await prisma.loan.update({
        where: { id: loanId },
        data: {
          status: 'REJECTED',
          rejectedById: adminId,
          rejectionReason: reason || "Rejected by Admin",
        },
      });
  
      res.json({ message: "Loan rejected by Admin", loan: rejectedLoan });
    } catch (err) {
      console.error("Admin Reject Error:", err);
      res.status(500).json({ error: "Internal Server Error" });
    }
  });
  

export default router;