import express from 'express';

const router = express.Router();

router.post('/create', (req, res) => {
  const { amount, currency = 'pi' } = req.body;
  const donationId = `don-${Date.now()}`;
  const piAddress = process.env.PI_RECEIVE_ADDRESS || "pi_addr_example";
  
  // retourner info de don + QR static
  res.json({
    donationId,
    amount,
    currency,
    piAddress,
    qrUrl: `https://api.qrserver.com/v1/create-qr-code/?size=300x300&data=${encodeURIComponent(piAddress)}`,
    deepLink: `pi://transfer?address=${piAddress}&amount=${amount}` // si Pi supporte
  });
});

export default router;