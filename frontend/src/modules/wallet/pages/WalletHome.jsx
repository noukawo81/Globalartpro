import React, { useEffect, useState } from "react";
import { useAuth } from '@/core/hooks/useAuth.js';
import { Link } from 'react-router-dom';
import BalanceCard from '@/modules/wallet/components/BalanceCard.jsx';
import walletAPI from '@/modules/wallet/services/wallet.api.js';
import SendForm from '@/modules/wallet/components/SendForm.jsx';
import ReceiveAddress from '@/modules/wallet/components/ReceiveAddress.jsx';
import './wallet.css';

export default function WalletHome() {
	const { user, artistId } = useAuth();
	const [balance, setBalance] = useState({ ARTC: 0, PI: 0, IA: 0 });
	const [notificationsCount, setNotificationsCount] = useState(0);
	const userId = user?.id || artistId || 'guest-000';

	useEffect(() => {
		async function load() {
			try {
				const res = await walletAPI.getBalance(userId);
				if (res?.balances) setBalance(res.balances);
			} catch (err) {
				console.warn('wallet load error', err);
			}
		}
		load();
		async function loadNotes() {
			try {
				const notes = await walletAPI.notifications(userId);
				setNotificationsCount((notes || []).length);
			} catch (e) { console.warn('wallet loadNotes error', e); }
		}
		loadNotes();
	}, [userId]);

	return (
		<div className="wallet-home">
			<section className="wallet-hero">
				<h1>Mon Portefeuille GlobalArtPro</h1>
				<p>Gérer vos ARTC, Pi, crédits IA et NFT certifiés depuis un seul endroit.</p>
			</section>

			<div className="wallet-grid">
				<div className="left">
					<div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 12 }}>
						<BalanceCard token="ARTC" amount={balance?.ARTC || 0} usd={(balance?.ARTC || 0) * 0.01} />
						<BalanceCard token="PI" amount={balance?.PI || 0} usd={null} />
						<BalanceCard token="IA" amount={balance?.IA || 0} usd={null} />
					</div>

					<div style={{ marginTop: 12 }}>
						<h3>Actions rapides</h3>
						<div style={{ display: 'flex', gap: 8 }}>
							<Link to="/wallet/transactions"><button>Transactions</button></Link>
							<Link to="/wallet/nfts"><button>Mes NFT</button></Link>
							<Link to="/wallet/notifications"><button>Notifications ({notificationsCount})</button></Link>
							<Link to="/wallet/pay"><button>Payer / Recharger</button></Link>
						</div>
					</div>

					<div style={{ marginTop: 12 }}>
						<h3>Envoyer</h3>
						<SendForm defaultFrom={userId} />
					</div>
				</div>

				<aside className="right">
					<h3>Recevoir</h3>
					  <ReceiveAddress userId={userId} />
					<div style={{ marginTop: 12 }}>
						<h3>Statistiques</h3>
						<div>Transactions aujourd'hui: —</div>
						<div>Crédits IA utilisés: —</div>
						<div>Valeur ARTC estimée: ${(balance.ARTC || 0) * 0.01}</div>
					</div>
				</aside>
			</div>
		</div>
	);
}

