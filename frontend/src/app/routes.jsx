import React from "react";
import { Routes, Route } from "react-router-dom";

/* Layouts globaux */
import MainLayout from "@/core/layout/MainLayout.jsx";
import DashboardLayout from "@/core/layout/DashboardLayout.jsx";

/* Pages modules */
import ArtistList from "@/modules/artists/pages/ArtistList.jsx";
import ArtistProfile from "@/modules/artists/pages/ArtistProfile.jsx";
import ArtistDashboard from "@/modules/artists/pages/ArtistDashboard.jsx";

import MarketplaceHome from "@/modules/marketplace/pages/MarketplaceHome.jsx";
import ProductPage from "@/modules/marketplace/pages/ProductPage.jsx";

import GAPStudioHome from "@/modules/gapstudio/pages/GAPStudioHome.jsx";
import StudioDashboard from "@/modules/gapstudio/pages/StudioDashboard.jsx";

import UserDashboard from "@/modules/dashboard/pages/UserDashboard.jsx";
import AdminDashboard from "@/modules/dashboard/pages/AdminDashboard.jsx";
import AdminExhibitions from "@/modules/admin/pages/AdminExhibitions.jsx"; 

import PortalCulture from "@/modules/culture/pages/PortalCulture.jsx";

/* Museum */
import MuseumHome from "@/modules/museum/pages/MuseumHome.jsx";
import MuseumItem from "@/modules/museum/pages/MuseumItem.jsx";
import WalletHome from "@/modules/wallet/pages/WalletHome.jsx";
import WalletTransactions from "@/modules/wallet/pages/WalletTransactions.jsx";
import WalletNotifications from "@/modules/wallet/pages/WalletNotifications.jsx";
import WalletSettings from "@/modules/wallet/pages/WalletSettings.jsx";
import WalletNFT from "@/modules/wallet/pages/WalletNFT.jsx";
import WalletPayment from "@/modules/wallet/pages/WalletPayment.jsx";

/* Pages spéciales */
import LegacyIframe from "@/components/Legacy/LegacyIframe.jsx";
import Manifeste from "@/pages/Manifeste.jsx";
import Donations from "@/components/don/Donations.jsx";
import MineARTC from "@/components/MineARTC.jsx";
import Dashboard from "@/modules/dashboard/pages/Dashboard.jsx";

/* Sécurité */
import ProtectedRoute from "@/components/Security/ProtectedRoute.jsx";

export default function AppRoutes() {
  return (
    <Routes>

      {/* ---------------- MAIN WEBSITE (public) ---------------- */}
      <Route element={<MainLayout />}>

        <Route path="/" element={<Dashboard />} />

        <Route path="/artists" element={<ArtistList />} />
        <Route path="/artist/:id" element={<ArtistProfile />} />
        <Route
          path="/artist/:id/dashboard"
          element={
            <ProtectedRoute>
              <ArtistDashboard />
            </ProtectedRoute>
          }
        />

        <Route path="/marketplace" element={<MarketplaceHome />} />
        <Route path="/product/:id" element={<ProductPage />} />

        <Route path="/gapstudio" element={<GAPStudioHome />} />
        <Route path="/gapstudio/dashboard" element={<StudioDashboard />} />
        <Route path="/dashboard" element={<Dashboard />} />

        <Route path="/museum" element={<MuseumHome />} />
        <Route path="/museum/:id" element={<MuseumItem />} />

        <Route path="/legacy/:page" element={<LegacyIframe />} />

        <Route path="/manifeste" element={<Manifeste />} />
        <Route path="/donations" element={<Donations />} />
        <Route path="/mine-artc" element={<MineARTC />} />

        <Route
          path="/portal-culture"
          element={
            <ProtectedRoute>
              <PortalCulture />
            </ProtectedRoute>
          }
        />

        <Route path="/wallet" element={<ProtectedRoute><WalletHome /></ProtectedRoute>} />
        <Route path="/wallet/transactions" element={<ProtectedRoute><WalletTransactions /></ProtectedRoute>} />
        <Route path="/wallet/notifications" element={<ProtectedRoute><WalletNotifications /></ProtectedRoute>} />
        <Route path="/wallet/nfts" element={<ProtectedRoute><WalletNFT /></ProtectedRoute>} />
        <Route path="/wallet/settings" element={<ProtectedRoute><WalletSettings /></ProtectedRoute>} />
        <Route path="/wallet/pay" element={<ProtectedRoute><WalletPayment /></ProtectedRoute>} />

      </Route>

      {/* ---------------- DASHBOARD ADMIN ---------------- */}
      <Route element={<DashboardLayout />}>
        <Route path="/admin" element={<AdminDashboard />} />
        <Route path="/admin/exhibitions" element={<ProtectedRoute><AdminExhibitions /></ProtectedRoute>} />
      </Route>

    </Routes>
  );
}