#!/usr/bin/env node

// Send a transaction to a Parity Ethereum Kovan node using Web3.js API 1.0.0

const fs = require('fs');
const Web3 = require('web3');
const EthereumTx = require('ethereumjs-tx');
const keythereum = require('keythereum');

// Use WebSockets since HTTP has no event support
web3 = new Web3(new Web3.providers.WebsocketProvider('ws://127.0.0.1:8546'));
console.log(`Web3.js version: ${web3.version}`);
console.log(`OS Platform: ${process.platform}`);
console.log(`Current Provider path: `, web3.currentProvider.path);

web3.eth.getAccounts().then((accounts) => { 
  console.log(`Accounts in network: ${accounts.length}`); 
});

// Setup tx parameters
const gasPrice = 1; // web3.eth.getGasPrice().then(console.log)
const gasLimit = 70000;
const fromAddress = '0xb2d354a6b5635e9d5837b8da3fc17fa64c0fd006';
const toAddress = '0xb2d354a6b5635e9d5837b8da3fc17fa64c0fd006';
const txAmount = web3.utils.toHex(web3.utils.toWei('0.000000001', 'ether'));
const nonce = web3.eth.getTransactionCount(fromAddress) + 4;
const txParams = {
  from: fromAddress,
  nonce: web3.utils.toHex(nonce),
  gasPrice: web3.utils.toHex(gasPrice * 1e9),
  gasLimit: web3.utils.toHex(gasLimit),
  to: toAddress,
  value: txAmount,
  // https://ethereum.stackexchange.com/questions/17051/how-to-select-a-network-id-or-is-there-a-list-of-network-ids
  chainId: 42 // EIP 155 chainID - mainnet 1, kovan 42
};

// Obtain private key from keystore file using password
const password = 'password';
const fileToRead = '/Users/scon/Library/Application Support/io.parity.ethereum/keys/kovan/UTC--2018-11-28T15-46-27Z--643de6cb-b403-7829-c833-be3838a8d45e';
const keyObject = JSON.parse(fs.readFileSync(fileToRead));
const privateKeyRecovered = keythereum.recover(password, keyObject);
console.log(privateKeyRecovered.toString('hex'));
const privateKey = privateKeyRecovered.toString('hex');
const privateKeyBuffer = new Buffer(privateKey, 'hex');
console.log('privateKeyBuffer: ', privateKeyBuffer);

// Create tx
const tx = new EthereumTx(txParams);
tx.sign(privateKeyBuffer);
const serializedTx = `0x${tx.serialize().toString('hex')}`;
console.log('serializedTx : ', serializedTx);

// Send signed tx
web3.eth.sendSignedTransaction(serializedTx, (error, txHash) => { 
  if (!error) {
    console.log('Success - Sent tx with hash: ', txHash);
  } else {
    console.error(`Error - Sending transaction: `, error); 
  }
})

// Subscriptions
const subscriptionToPendingTransactions = web3.eth.subscribe('pendingTransactions', 
  (error, pendingTransaction) => {
    if (!error) {
      console.log(`Subscription - Pending Transaction: `, pendingTransaction);
    } else {
      console.log(`Error - Subscription - Pending Transaction: ${error}`);
    }
  })
  .on('data', function(pendingTransaction) {
    console.log(`Subscription - Pending Transaction Data: `, pendingTransaction);
  });

const subscriptionToLogs = web3.eth.subscribe('logs', {
    address: fromAddress,
    topics: [null]
  },
  (error, log) => {
    if (!error) {
      console.log(`Subscription - Log: `, log); 
    } else {
      console.log(`Error - Subscription - Log:: ${error}`);
    }
  })
  .on('data', function(log) {
    console.log(`Subscription - Log Data: `, log);
  })
  .on('changed', function(log) {
    console.log(`Subscription - Log Changed: `, log);
  });

