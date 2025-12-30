import React from 'react';
import MarketplaceHome from '@/modules/marketplace/pages/MarketplaceHome';

// Thin wrapper kept for backwards compatibility with older imports
export default function Marketplace(props) {
  return <MarketplaceHome {...props} />;
}
