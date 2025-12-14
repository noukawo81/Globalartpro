// create-artc-final.js
require('dotenv').config();
const StellarSdk = require('@stellar/stellar-sdk');

const HORIZON_URL = process.env.HORIZON_URL || 'https://api.testnet.minepi.com';
const NETWORK_PASSPHRASE = process.env.NETWORK_PASSPHRASE || 'Pi Testnet';

const ISSUER_PUBLIC = process.env.ISSUER_PUBLIC;
const DISTRIBUTOR_PUBLIC = process.env.DISTRIBUTOR_PUBLIC;
const ISSUER_SECRET = process.env.ISSUER_SECRET;
const DISTRIBUTOR_SECRET = process.env.DISTRIBUTOR_SECRET;

const ASSET_CODE = 'ARTC';
const TOTAL_SUPPLY = '1000000000';

if (!ISSUER_PUBLIC || !DISTRIBUTOR_PUBLIC || !ISSUER_SECRET || !DISTRIBUTOR_SECRET) {
  console.error('Erreur: configure correctement ton .env.');
  process.exit(1);
}

const server = new StellarSdk.Horizon.Server(HORIZON_URL);
const issuerKeypair = StellarSdk.Keypair.fromSecret(ISSUER_SECRET);
const distributorKeypair = StellarSdk.Keypair.fromSecret(DISTRIBUTOR_SECRET);

function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

async function getBaseFee() {
  try {
    const resp = await server.ledgers().order('desc').limit(1).call();
    return resp.records[0].base_fee_in_stroops;
  } catch {
    return '100';
  }
}

async function getTrustline(accountPub, code, issuerPub) {
  const account = await server.loadAccount(accountPub);
  return account.balances.find(
    b => b.asset_type !== 'native' && b.asset_code === code && b.asset_issuer === issuerPub
  );
}

(async () => {
  try {
    console.log('Horizon URL:', HORIZON_URL);
    console.log('Network passphrase:', NETWORK_PASSPHRASE);

    const baseFee = await getBaseFee();
    const asset = new StellarSdk.Asset(ASSET_CODE, ISSUER_PUBLIC);

    // Vérifier et ajuster la trustline
    const trustline = await getTrustline(DISTRIBUTOR_PUBLIC, ASSET_CODE, ISSUER_PUBLIC);
    if (!trustline) {
      console.log('Trustline inexistante, création...');
      const distributorAcct = await server.loadAccount(DISTRIBUTOR_PUBLIC);
      const trustTx = new StellarSdk.TransactionBuilder(distributorAcct, {
        fee: baseFee,
        networkPassphrase: NETWORK_PASSPHRASE,
        timebounds: await server.fetchTimebounds(120),
      })
        .addOperation(StellarSdk.Operation.changeTrust({
          asset,
          limit: TOTAL_SUPPLY
        }))
        .build();
      trustTx.sign(distributorKeypair);
      await server.submitTransaction(trustTx);
      console.log('Trustline créée pour ARTC.');
    } else if (parseFloat(trustline.limit) < parseFloat(TOTAL_SUPPLY)) {
      console.log(`Trustline existante mais limite trop faible (${trustline.limit}), mise à jour...`);
      const distributorAcct = await server.loadAccount(DISTRIBUTOR_PUBLIC);
      const trustTx = new StellarSdk.TransactionBuilder(distributorAcct, {
        fee: baseFee,
        networkPassphrase: NETWORK_PASSPHRASE,
        timebounds: await server.fetchTimebounds(120),
      })
        .addOperation(StellarSdk.Operation.changeTrust({
          asset,
          limit: TOTAL_SUPPLY
        }))
        .build();
      trustTx.sign(distributorKeypair);
      await server.submitTransaction(trustTx);
      console.log('Trustline mise à jour.');
    } else {
      console.log('Trustline existante et limite suffisante.');
    }

    // Vérifier le solde actuel
    const distAcct = await server.loadAccount(DISTRIBUTOR_PUBLIC);
    let currentBalance = '0';
    distAcct.balances.forEach(b => {
      if (b.asset_code === ASSET_CODE && b.asset_issuer === ISSUER_PUBLIC) currentBalance = b.balance;
    });

    if (parseFloat(currentBalance) >= parseFloat(TOTAL_SUPPLY)) {
      console.log(`Distributor a déjà ${currentBalance} ${ASSET_CODE}. Mint non nécessaire.`);
    } else {
      console.log(`Minting ${TOTAL_SUPPLY} ${ASSET_CODE} depuis issuer vers distributor...`);
      const issuerAcct = await server.loadAccount(ISSUER_PUBLIC);
      const paymentTx = new StellarSdk.TransactionBuilder(issuerAcct, {
        fee: baseFee,
        networkPassphrase: NETWORK_PASSPHRASE,
        timebounds: await server.fetchTimebounds(120),
      })
        .addOperation(StellarSdk.Operation.payment({
          destination: DISTRIBUTOR_PUBLIC,
          asset,
          amount: TOTAL_SUPPLY
        }))
        .build();
      paymentTx.sign(issuerKeypair);
      const paymentResult = await server.submitTransaction(paymentTx);
      console.log('Mint effectué. Hash:', paymentResult.hash);
    }

    // Attendre propagation et vérifier solde final
    console.log('Attente propagation...');
    await sleep(10000);

    const finalDist = await server.loadAccount(DISTRIBUTOR_PUBLIC);
    console.log('--- Balances finales du Distributor ---');
    finalDist.balances.forEach(b => {
      if (b.asset_type !== 'native') {
        console.log(`- ${b.asset_code} (issuer: ${b.asset_issuer}): ${b.balance}`);
      } else {
        console.log(`- Test-Pi (native): ${b.balance}`);
      }
    });

    console.log('✅ ARTC existe maintenant sur le Testnet. Tout est prêt !');

  } catch (err) {
    console.error('Erreur:', err.message || err);
    if (err.response && err.response.data) console.error('Horizon:', JSON.stringify(err.response.data, null, 2));
    process.exit(1);
  }
})();