const { Connection, PublicKey, clusterApiUrl } = require("@solana/web3.js");

const getBalance = async (publicKey) => {
  const connection = new Connection(clusterApiUrl("devnet"), "confirmed");
  const balance = await connection.getBalance(new PublicKey(publicKey));
  return balance / 1e9; // Convert lamports to SOL
};

// Test Function
(async () => {
  const publicKey = "ENV47rdoPGoHJTqmTJdXTbKib4ZgipcvV83ajbDkjAbR"; // Replace with your wallet's public key
  const balance = await getBalance(publicKey);
  console.log(`Wallet Balance: ${balance} SOL`);
})();





