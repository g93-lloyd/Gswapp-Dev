require('dotenv').config(); // Add this at the top of sendTransaction.js
const { 
    Connection, 
    clusterApiUrl, 
    Keypair, 
    LAMPORTS_PER_SOL, 
    PublicKey, 
    SystemProgram, 
    Transaction 
  } = require("@solana/web3.js");
  const fs = require("fs");
  const os = require("os");
  const path = require("path");
  
  const sendTransaction = async (toPublicKey, amount) => {
      const connection = new Connection(clusterApiUrl("devnet"), "confirmed");
  
      // Resolve full path to wallet file
      const walletPath = path.join(os.homedir(), ".config", "solana", "dev-wallet.json");
      const secretKey = Uint8Array.from(JSON.parse(fs.readFileSync(walletPath, "utf8")));
      const sender = Keypair.fromSecretKey(secretKey);
  
      // Create transaction
      const transaction = new Transaction().add(
          SystemProgram.transfer({
              fromPubkey: sender.publicKey,
              toPubkey: new PublicKey(toPublicKey),
              lamports: amount * LAMPORTS_PER_SOL, // Convert SOL to lamports
          })
      );
  
      // Send transaction
      const signature = await connection.sendTransaction(transaction, [sender]);
      console.log("Transaction Signature:", signature);
  };
  
  (async () => {
      const recipient = "ENV47rdoPGoHJTqmTJdXTbKib4ZgipcvV83ajbDkjAbR"; // Replace with a test recipient public key
      await sendTransaction(recipient, 0.01); // Sending 0.01 SOL
  })();
  

 
