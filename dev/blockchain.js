const sha256 = require('sha256')
const { v4: uuidv4 } = require('uuid');
//Requerimos sha256 protocolo hashing

const currentNodeUrl = process.argv[3]

//Inicializamos la cadena y transacciones pendientes, creamos el bloque genesis con standar values
function Blockchain(){
    this.chain = []
    this.pendingTransactions = []

    this.currentNodeUrl = currentNodeUrl
    this.networkNodes = []

    this.createNewBlock(100, '0', '0')
}

//Este método crea un bloque nuevo, con un nonce que satisface la prueba de trabajo
//previousBlockHash hash del bloque anterior
//hash hash generado en nuevo bloque
Blockchain.prototype.createNewBlock = function(nonce, previousBlockHash,hash){
    const newBlock={
        index: this.chain.length + 1,
        timestamp: Date.now(),
        transactions: this.pendingTransactions,
        nonce: nonce,
        hash: hash,
        previousBlockHash: previousBlockHash
    };

    this.pendingTransactions = [];
    this.chain.push(newBlock);

    return newBlock
}

//Este método devuelve el ùltimo bloque de la cadena
Blockchain.prototype.getLastBlock = function(){
    return this.chain[this.chain.length - 1];
};

//Método que crea una nueva transaccion y la almacena en Pedning
//Devuelve el index del próximo bloque donde se alacenará la transacción
Blockchain.prototype.createNewTransaction = function(amount, sender, receiver){
    const newTransaction = {
        amount: amount,
        sender: sender,
        receiver: receiver,
        transactionId: uuidv4().split('-').join('')
    };

    return newTransaction
};

Blockchain.prototype.addTransactionToPendingTransactions = function(transactionObj){

    this.pendingTransactions.push(transactionObj)
    return this.getLastBlock()['index'] + 1

}

//Toma el previoushash, los datos del current block y el nonce
//Concatena todo un str y genera hash usando librebria sha256
Blockchain.prototype.hashBlock = function(previousBlockHash, currentBlockData, nonce){
    const dataAsString = previousBlockHash + String(nonce) + JSON.stringify(currentBlockData)
    const hash = sha256(dataAsString)
    return hash
}

//PoW para encontrar un hash que empiece con '0000'
//Incrementa el nonce hasta encontrar un hash que sea válido
Blockchain.prototype.proofOfWoork = function(previousBlockHash, currentBlockData) {
    let nonce = 0
    //let because nonce and hash will be mutating
    let hash = this.hashBlock(previousBlockHash, currentBlockData, nonce)
    while(hash.substring(0,4)!== '0000'){
        nonce ++
        hash = this.hashBlock(previousBlockHash, currentBlockData, nonce)
        console.log(hash)
    }
    return nonce
}

Blockchain.prototype.chainIsValid = function(blockchain){
    let validChain = true
    
    for(var i=1; i<blockchain.length; i++){
        const currentBlock = blockchain[i]
        const prevBlock = blockchain[i] - 1
        const blockHash =  this.hashBlock(prevBlock['hash'], {transactions: currentBlock['transactions'], index: currentBlock['index']}, currentBlock['nonce'])
        if(blockHash.substring(0,4)!== '0000') validChain = false

        if(currentBlock['prevHash'] !== prevBlock['hash']) validChain = false
        console.log('previousBlockHash =>', prevBlock['hash'])
        console.log('currentBlockHash =>', currentBlock['hash'])
    }

    const genesisBlock = blockchain[0]
    const correctNonce = genesisBlock['nonce'] === 100
    const correctPreviousBlockHash = genesisBlock['previousBlockHash'] === '0'
    const correctHash = genesisBlock['hash'] === '0'
    const correctTransactions = genesisBlock['transactions'].length === 0

    if(!correctNonce || !correctPreviousBlockHash || !correctHash || !correctTransactions) validChain = false

    return validChain
}



module.exports = Blockchain;