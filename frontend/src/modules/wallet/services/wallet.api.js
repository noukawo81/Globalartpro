import API from '@/services/api.js';

const BASE = '/wallet';

export const walletAPI = {
  register: (userId, opts = {}) => API.post(`${BASE}/register`, { userId, ...opts }).then(r => r.data),
  getBalance: (userId) => API.get(`${BASE}/balance`, { params: { userId } }).then(r => r.data),
  send: (fromUserId, toUserId, token = 'ARTC', amount = 0, description = '') =>
    API.post(`${BASE}/send`, { fromUserId, toUserId, token, amount, description }).then(r => r.data),
  transactions: (userId) => API.get(`${BASE}/transactions`, { params: { userId } }).then(r => r.data),
  deposit: (userId, token = 'PI', amount = 0, meta = {}) => API.post(`${BASE}/deposit`, { userId, token, amount, meta }).then(r => r.data),
  nfts: (userId) => API.get(`${BASE}/nfts`, { params: { userId } }).then(r => r.data),
  mintNFT: (userId, metadata = {}) => API.post(`${BASE}/nft/mint`, { userId, metadata }).then(r => r.data),
  confirmDeposit: (txId, status='CONFIRMED') => API.post(`${BASE}/webhook/deposit`, { txId, status }).then(r => r.data),
  notifications: (userId) => API.get(`${BASE}/notifications`, { params: { userId } }).then(r => r.data),
};

export default walletAPI;
