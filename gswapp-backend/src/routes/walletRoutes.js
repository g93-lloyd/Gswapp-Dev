const express = require('express');
const { Keypair, PublicKey, Connection, clusterApiUrl } = require('@solana/web3.js');
const fs = require('fs');
const os = require('os');
const path = require('path');

const router = express.Router();
const connection = new Connection(clusterApiUrl("devnet"), "confirmed");

// Middleware to enforce HTTP methods and normalize URLs
router.all('/create-wallet', (req, res, next) => {
    if (req.method === 'GET') {
        console.log('Transforming GET to POST for /create-wallet');
        req.method = 'POST'; // Rewrite method
    }
    if (req.method !== 'POST') {
        console.log(`Invalid method: ${req.method} on /create-wallet`);
        return res.status(405).json({ error: 'Method Not Allowed. Use POST or GET for /create-wallet' });
    }
    next();
});

router.all('/wallet-balance/:publicKey', (req, res, next) => {
    // Remove trailing slashes
    if (req.url.endsWith('/')) {
        console.log('Trailing slash detected. Normalizing URL.');
        req.url = req.url.slice(0, -1); // Remove the trailing slash
    }

    if (req.method !== 'GET') {
        console.log(`Invalid method: ${req.method} on /wallet-balance`);
        return res.status(405).json({ error: 'Method Not Allowed. Use GET for /wallet-balance' });
    }
    next();
});

// Create Wallet Endpoint
router.post('/create-wallet', (req, res) => {
    console.log("POST /create-wallet hit");
    const wallet = Keypair.generate();
    const secretKey = JSON.stringify(Array.from(wallet.secretKey));
    const walletPath = path.join(os.homedir(), `.config/solana/${wallet.publicKey.toString()}.json`);
    fs.writeFileSync(walletPath, secretKey);
    res.json({ publicKey: wallet.publicKey.toString(), walletPath });
});

// Wallet Balance Endpoint
router.get('/wallet-balance/:publicKey', async (req, res) => {
    const { publicKey } = req.params;

    // Log the received public key
    console.log(`Received GET request for /wallet-balance with publicKey=${publicKey}`);

    try {
        const pubKey = new PublicKey(publicKey); // Validate format
        const balance = await connection.getBalance(pubKey);
        res.json({ publicKey: pubKey.toString(), balance: balance / 1e9 }); // Convert lamports to SOL
    } catch (error) {
        console.log(`Error fetching balance for ${publicKey}: ${error.message}`);
        res.status(400).json({ error: 'Invalid public key or fetch failed' });
    }
});

module.exports = router;
