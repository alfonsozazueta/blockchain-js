const sha256 = require('sha256')
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
        receiver: receiver
    };

    this.pendingTransactions.push(newTransaction);
    return this.getLastBlock()['index'] + 1;
};

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



module.exports = Blockchain;