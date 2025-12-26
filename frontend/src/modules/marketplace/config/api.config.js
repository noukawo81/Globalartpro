/**
 * Marketplace API Configuration
 * 
 * Ce fichier centralise les endpoints, formats de réponse et logique
 * pour intégration future du backend.
 */

// ============================================
// BASE CONFIGURATION
// ============================================

const MARKETPLACE_CONFIG = {
  API_BASE: import.meta.env.VITE_API_URL || "http://localhost:3000/api",
  ENDPOINTS: {
    MARKETPLACE: "/marketplace",
    PRODUCTS: "/marketplace/products",
    AUCTIONS: "/marketplace/auctions",
    CART: "/marketplace/cart",
    ARTISTS: "/artists",
  },
  
  // Devises supportées
  CURRENCIES: {
    EUR: { code: "EUR", symbol: "€", rate: 1.0 },
    USD: { code: "USD", symbol: "$", rate: 1.1 },
    ARTC: { code: "ARTC", symbol: "₳", rate: 0.01 }, // Rough conversion
    PI: { code: "π", symbol: "π", rate: 0.001 },
    XOF: { code: "XOF", symbol: "CFA", rate: 600 },
  },

  // Pôles (Poles)
  POLES: ["physical", "digital", "nft", "museum"],

  // Grades de certification
  GRADES: ["Bronze", "Silver", "Gold", "Elite"],

  // Taux de commission par grade
  COMMISSION_RATES: {
    Bronze: 0.12,  // 12%
    Silver: 0.10,  // 10%
    Gold: 0.08,    // 8%
    Elite: 0.05,   // 5%
  },

  // Pagination par défaut
  DEFAULT_PAGE_SIZE: 20,
  MAX_PAGE_SIZE: 100,

  // Timeouts API
  REQUEST_TIMEOUT: 30000, // 30s
  RETRY_ATTEMPTS: 3,
};

// ============================================
// ENDPOINTS SPECIFICATION
// ============================================

/**
 * POST /api/marketplace/products
 * Créer un nouveau produit
 */
const CREATE_PRODUCT = {
  method: "POST",
  url: `${MARKETPLACE_CONFIG.API_BASE}/marketplace/products`,
  request: {
    title: "string (required)",
    artist: "string (required)",
    price: "number (required)",
    currency: "string (required)",
    pole: "string (physical|digital|nft|museum)",
    images: "string[] (required)",
    description: "string",
    // ... pôle-spécific fields
  },
  response: {
    success: "boolean",
    productId: "string",
    message: "string",
  },
};

/**
 * GET /api/marketplace/products
 * Récupérer produits avec filtres
 */
const GET_PRODUCTS = {
  method: "GET",
  url: `${MARKETPLACE_CONFIG.API_BASE}/marketplace/products`,
  query: {
    pole: "string (optional) - physical|digital|nft|museum",
    search: "string (optional) - titre ou artiste",
    sortBy: "string (optional) - popularity|price_asc|price_desc|favorites",
    minPrice: "number (optional)",
    maxPrice: "number (optional)",
    certifiedOnly: "boolean (optional)",
    page: "number (optional, default: 1)",
    limit: "number (optional, default: 20, max: 100)",
  },
  response: {
    success: "boolean",
    data: [
      {
        id: "string",
        title: "string",
        artist: "string",
        price: "number",
        currency: "string",
        images: "string[]",
        certified: "boolean",
        artisanGrade: "string",
        views: "number",
        favorites: "number",
      },
    ],
    pagination: {
      page: "number",
      limit: "number",
      total: "number",
      pages: "number",
    },
  },
};

/**
 * GET /api/marketplace/products/:id
 * Récupérer détail produit
 */
const GET_PRODUCT_DETAIL = {
  method: "GET",
  url: `${MARKETPLACE_CONFIG.API_BASE}/marketplace/products/:id`,
  response: {
    success: "boolean",
    data: {
      // Voir modèles de données dans MARKETPLACE_ARCHITECTURE.md
      id: "string",
      pole: "string",
      // ...complete product object
    },
  },
};

/**
 * PUT /api/marketplace/products/:id
 * Mettre à jour produit (artiste uniquement)
 */
const UPDATE_PRODUCT = {
  method: "PUT",
  url: `${MARKETPLACE_CONFIG.API_BASE}/marketplace/products/:id`,
  headers: {
    Authorization: "Bearer {token}",
  },
  request: {
    title: "string (optional)",
    price: "number (optional)",
    description: "string (optional)",
    // Pôle-spécific fields allowed
  },
  response: {
    success: "boolean",
    message: "string",
  },
};

/**
 * POST /api/marketplace/auctions
 * Créer enchère
 */
const CREATE_AUCTION = {
  method: "POST",
  url: `${MARKETPLACE_CONFIG.API_BASE}/marketplace/auctions`,
  headers: {
    Authorization: "Bearer {token}", // Artiste Gold/Elite uniquement
  },
  request: {
    productId: "string (required)",
    startPrice: "number (required)",
    paymentMethods: "string[] (required) - [ARTC, π, EUR]",
    endDate: "ISO8601 (required)",
  },
  response: {
    success: "boolean",
    auctionId: "string",
    message: "string",
  },
};

/**
 * POST /api/marketplace/auctions/:id/bid
 * Placer une enchère
 */
const PLACE_BID = {
  method: "POST",
  url: `${MARKETPLACE_CONFIG.API_BASE}/marketplace/auctions/:id/bid`,
  headers: {
    Authorization: "Bearer {token}",
  },
  request: {
    amount: "number (required)",
    currency: "string (required)",
  },
  response: {
    success: "boolean",
    bidId: "string",
    message: "string",
  },
};

/**
 * GET /api/marketplace/auctions
 * Récupérer enchères actives
 */
const GET_AUCTIONS = {
  method: "GET",
  url: `${MARKETPLACE_CONFIG.API_BASE}/marketplace/auctions`,
  query: {
    status: "active|ended|upcoming (optional)",
    page: "number (optional)",
    limit: "number (optional)",
  },
  response: {
    success: "boolean",
    data: [
      {
        auctionId: "string",
        productId: "string",
        startPrice: "number",
        currentBid: "number",
        endDate: "ISO8601",
        bidsCount: "number",
      },
    ],
  },
};

/**
 * POST /api/marketplace/cart/add
 * Ajouter au panier
 */
const ADD_TO_CART = {
  method: "POST",
  url: `${MARKETPLACE_CONFIG.API_BASE}/marketplace/cart/add`,
  headers: {
    Authorization: "Bearer {token}",
  },
  request: {
    productId: "string (required)",
    quantity: "number (default: 1)",
  },
  response: {
    success: "boolean",
    cartId: "string",
    message: "string",
  },
};

/**
 * GET /api/marketplace/cart
 * Récupérer panier utilisateur
 */
const GET_CART = {
  method: "GET",
  url: `${MARKETPLACE_CONFIG.API_BASE}/marketplace/cart`,
  headers: {
    Authorization: "Bearer {token}",
  },
  response: {
    success: "boolean",
    data: {
      cartId: "string",
      items: [
        {
          productId: "string",
          title: "string",
          price: "number",
          currency: "string",
          quantity: "number",
        },
      ],
      totals: {
        subtotal: "number",
        taxes: "number",
        shipping: "number",
        total: "number",
      },
    },
  },
};

/**
 * POST /api/marketplace/checkout
 * Finaliser commande
 */
const CHECKOUT = {
  method: "POST",
  url: `${MARKETPLACE_CONFIG.API_BASE}/marketplace/checkout`,
  headers: {
    Authorization: "Bearer {token}",
  },
  request: {
    cartId: "string (required)",
    paymentMethod: "string (required) - stripe|pi|artc",
    shippingAddress: "object (required for physical)",
    billingAddress: "object (required)",
  },
  response: {
    success: "boolean",
    orderId: "string",
    paymentUrl: "string (optional, pour Stripe redirect)",
    message: "string",
  },
};

// ============================================
// HELPER FUNCTIONS
// ============================================

/**
 * Appel API générique avec retry logic
 */
async function fetchAPI(endpoint, options = {}) {
  const {
    method = "GET",
    body = null,
    headers = {},
    token = null,
  } = options;

  const defaultHeaders = {
    "Content-Type": "application/json",
    ...headers,
  };

  if (token) {
    defaultHeaders.Authorization = `Bearer ${token}`;
  }

  let attempt = 0;
  while (attempt < MARKETPLACE_CONFIG.RETRY_ATTEMPTS) {
    try {
      const response = await fetch(
        `${MARKETPLACE_CONFIG.API_BASE}${endpoint}`,
        {
          method,
          headers: defaultHeaders,
          body: body ? JSON.stringify(body) : null,
          timeout: MARKETPLACE_CONFIG.REQUEST_TIMEOUT,
        }
      );

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }

      return await response.json();
    } catch (error) {
      attempt++;
      console.warn(
        `[API] Attempt ${attempt}/${MARKETPLACE_CONFIG.RETRY_ATTEMPTS} failed:`,
        error.message
      );

      if (attempt >= MARKETPLACE_CONFIG.RETRY_ATTEMPTS) {
        throw error;
      }

      // Exponential backoff
      await new Promise((resolve) =>
        setTimeout(resolve, Math.pow(2, attempt) * 1000)
      );
    }
  }
}

/**
 * Convertir prix entre devises
 */
function convertCurrency(amount, fromCurrency, toCurrency) {
  const fromRate = MARKETPLACE_CONFIG.CURRENCIES[fromCurrency].rate;
  const toRate = MARKETPLACE_CONFIG.CURRENCIES[toCurrency].rate;
  return (amount / fromRate) * toRate;
}

/**
 * Calculer commission et montant net
 */
function calculateCommission(price, grade) {
  const commissionRate = MARKETPLACE_CONFIG.COMMISSION_RATES[grade];
  const commission = price * commissionRate;
  const netAmount = price - commission;
  return { commission, netAmount, commissionRate };
}

// ============================================
// EXPORT
// ============================================

export {
  MARKETPLACE_CONFIG,
  // Endpoints
  CREATE_PRODUCT,
  GET_PRODUCTS,
  GET_PRODUCT_DETAIL,
  UPDATE_PRODUCT,
  CREATE_AUCTION,
  PLACE_BID,
  GET_AUCTIONS,
  ADD_TO_CART,
  GET_CART,
  CHECKOUT,
  // Helpers
  fetchAPI,
  convertCurrency,
  calculateCommission,
};
