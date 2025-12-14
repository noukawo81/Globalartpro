# Wallet Backend Routes

Endpoints available at `/api/wallet`:
- `POST /register` : Create or initialize an account (body: `{ userId }`).
- `GET /balance?userId=` : Retrieve balances for ARTC, PI and IA credits.
- `POST /send` : Transfer tokens (body: `{ fromUserId, toUserId, token, amount }`).
- `GET /transactions?userId=` : Retrieve transactions for a user.
- `POST /deposit` : Create a deposit (body: `{ userId, token, amount }`).
- `GET /nfts?userId=` : List NFTs owned by a user.
- `POST /nft/mint` : Mint NFT and record transaction (body: `{ userId, metadata }`).

This is a minimal local JSON-backed implementation for prototyping. Add proper auth/session verification before production use.
