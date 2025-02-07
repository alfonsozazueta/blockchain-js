const Blockchain = require("./blockchain")
const bitcoin = new Blockchain();

//This is just testing for our blockchain
console.log(bitcoin)


const bc1 = {
    "chain": [
    {
    "index": 1,
    "timestamp": 1738816470843,
    "transactions": [],
    "nonce": 100,
    "hash": "0",
    "previousBlockHash": "0"
    },
    {
    "index": 2,
    "timestamp": 1738816488815,
    "transactions": [],
    "nonce": 18140,
    "hash": "0000b9135b054d1131392c9eb9d03b0111d4b516824a03c35639e12858912100",
    "previousBlockHash": "0"
    },
    {
    "index": 3,
    "timestamp": 1738816580126,
    "transactions": [
    {
    "sender": "00",
    "receiver": "b6b466ca73c44b9d988d88e18d076b9d",
    "transactionId": "798ce526718347ca9ddc6895a690a960"
    },
    {
    "amount": 45,
    "sender": "asidqpewiudqp3ie3",
    "receiver": "3984y283eu20o38yeh2",
    "transactionId": "38ce5b48c75849a496de0060ef250054"
    },
    {
    "amount": 30,
    "sender": "asidqpewiudqp3ie3",
    "receiver": "3984y283eu20o38yeh2",
    "transactionId": "fa189feefd724f0ba2507fbe7c9c5b99"
    },
    {
    "amount": 50,
    "sender": "asidqpewiudqp3ie3",
    "receiver": "3984y283eu20o38yeh2",
    "transactionId": "7194214732bc4542a6377180c4bfd344"
    },
    {
    "amount": 60,
    "sender": "asidqpewiudqp3ie3",
    "receiver": "3984y283eu20o38yeh2",
    "transactionId": "f696ee75836d4825bf705f9ddc1a1923"
    }
    ],
    "nonce": 3783,
    "hash": "0000c69cb90a3ea026d36b02fb4402fd1abe25d846a83839bc20dd48ef638af7",
    "previousBlockHash": "0000b9135b054d1131392c9eb9d03b0111d4b516824a03c35639e12858912100"
    }
    ],
    "pendingTransactions": [
    {
    "sender": "00",
    "receiver": "b6b466ca73c44b9d988d88e18d076b9d",
    "transactionId": "a41b71a468084d0f9d4bba629b9bcadd"
    }
    ],
    "currentNodeUrl": "http://localhost:3001",
    "networkNodes": []
    }


    console.log('VALID: ', bitcoin.chainIsValid(bc1.chain))