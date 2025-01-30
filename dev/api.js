const express = require('express')
const app = express()
//Body parser para manejo de datos json y daros url encoded
const bodyParser = require('body-parser')
const Blockchain = require('./blockchain')
//Generamos un UUID como dirección del Node
const { v4: uuidv4 } = require('uuid');
const bitcoin = new Blockchain()

const nodeAdress = uuidv4().split('-').join('')


app.use(bodyParser.json())
app.use(bodyParser.urlencoded({extended:false}))

//GET, devuelve la estructura uriginal del blockchain
app.get('/blockchain', function (req, res) {
    res.send(bitcoin)

})

//POST, crea transaccion
//Agrega transacción a pendingTransactions
//Devuelve el índice del próximo bloque donde se agregará la transacción
app.post('/transaction', function(req, res){
    const blockIndex = bitcoin.createNewTransaction(req.body.amount, req.body.sender, req.body.receiver)
    res.json({note: `Transaction will be added in block  ${blockIndex}`})
})

//GET, obtiene el ultimo bloque y su hash
//Realiza PoW
//Crea transaccion y da una reward
//Crea y añade un bloque a la cadena
app.get('/mine', function(req,res){

    const lastBlock = bitcoin.getLastBlock()
    const prevHash = lastBlock['hash']
    const currentBlockData = {
        transactions: bitcoin.pendingTransactions,
        index: lastBlock['index'] + 1
    }
    const nonce = bitcoin.proofOfWoork(prevHash, currentBlockData)
    const blockHash = bitcoin.hashBlock(prevHash, currentBlockData, nonce)

    bitcoin.createNewTransaction(12.5, "00", nodeAdress)

    const newBlock = bitcoin.createNewBlock(nonce, prevHash, blockHash)
    res.json({
        note: 'New block mined successfully',
        block: newBlock
    })
})


app.listen(3000, function(){
    console.log('Listening on port 3000...')
})