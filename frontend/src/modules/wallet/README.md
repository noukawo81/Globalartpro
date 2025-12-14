# Wallet Module

Ce dossier contient les pages, composants et services pour le Wallet GlobalArtPro.

Structure:
- pages/: WalletHome.jsx, WalletTransactions.jsx, WalletNFT.jsx, WalletPayment.jsx, WalletSettings.jsx
- components/: BalanceCard, SendForm, ReceiveAddress, TransactionItem, QRPayment
- services/: wallet.api.js (wraps les endpoints backend /api/wallet)

Utilisation:
- Importer `walletAPI` depuis `services/wallet.api.js` pour appeler le backend.
- Les routes sont ajoutées dans `frontend/src/app/routes.jsx`.
