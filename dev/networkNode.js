const express = require('express')
const app = express()
//Body parser para manejo de datos json y daros url encoded
const bodyParser = require('body-parser')
const Blockchain = require('./blockchain')
//Generamos un UUID como dirección del Node
const { v4: uuidv4 } = require('uuid');
//Refers to comand in pack json to start server
const port = process.argv[2]

const rp = require('request-promise')
const nodeAdress = uuidv4().split('-').join('')



const bitcoin = new Blockchain()



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
    const newTransaction = req.body
    const blockIndex = bitcoin.addTransactionToPendingTransactions(newTransaction)
    res.json({note: `Transaction will be added in block ${blockIndex}`})
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
    const requestPromises = []

    bitcoin.networkNodes.forEach(networkNodeuRL =>{
        const requestOptions = {
            uri: networkNodeuRL + '/receive-new-block',
            method: 'POST',
            body: { newBlock: newBlock},
            json: true
        }

        requestPromises.push(rp(requestOptions))
    })

    Promise.all(requestPromises)
    .then(data => {
        //...
        const requestOptions = {
            uri: bitcoin.currentNodeUrl + '/transaction/broadcast',
            method: 'POST',
            body: {
                annount: 12.5,
                sender: "00",
                recipient: nodeAdress
            },
            json: true
        }

        return rp(requestOptions)
    })

    .then(data =>{
        res.json({
            note: 'New block mined & brodcast successfully',
            block: newBlock
        })
    })
    
    
})

app.post('/receive-new-block', function(req,res){
    const newBlock = req.body.newBlock
    const lastBlock = bitcoin.getLastBlock
    const correctHash = lastBlock.hash == newBlock.prevHash
    const correctIndex = lastBlock['index'] + 1 == newBlock['index']

    if(correctHash && correctIndex){
        bitcoin.chain.push(newBlock)
        bitcoin.pendingTransactions = []
        res.json({
            note: 'New Block received and accepted',
            newBlock:  newBlock
        })
    } else {
        res.json({
            note: 'New block rejected',
            newBlock: newBlock
        })
    }
})

//Register a noode and broadcast it in the network
app.post('/register-and-broadcast-node', function(req,res){
    const newNodeUrl = req.body.newNodeUrl
    if (bitcoin.networkNodes.indexOf(newNodeUrl) == -1) bitcoin.networkNodes.push(newNodeUrl)

    const regNodesPromises = []
    bitcoin.networkNodes.forEach(networkNodeuRL => {
        //REGISTER NODES
        const requestOptions = {
            uri: networkNodeuRL + '/register-node',
            method: 'POST',
            body: {newNodeUrl: newNodeUrl},
            json: true
        }

        regNodesPromises.push(rp(requestOptions))
    })

    Promise.all(regNodesPromises)
    .then(data =>{
        const bulkRegisterOptions = {
            uri: newNodeUrl + '/register-nodes-bulk',
            method: 'POST',
            body: {
                allNetworkNodes: [...bitcoin.networkNodes, bitcoin.currentNodeUrl]
            },
            json: true
        }
        return rp(bulkRegisterOptions)
    })
    .then(data =>{
        res.json({ note: 'New node registered with network successfully'})
    })

})

//register a node with the network
app.post('/register-node', function(req,res){
    const newNodeUrl = req.body.newNodeUrl
    const nodeNotAlreadyPresent = bitcoin.networkNodes.indexOf(newNodeUrl) == -1
    const notCurrentNode = bitcoin.currentNodeUrl !== newNodeUrl

    if(nodeNotAlreadyPresent && notCurrentNode) bitcoin.networkNodes.push(newNodeUrl)
    res.json({note: 'New node registered successfully with node.'})
})

app.post('/register-nodes-bulk', function(req,res){
    const allNetworkNodes = req.body.allNetworkNodes
    allNetworkNodes.forEach(networkNodeuRL => {
        //...
        const notNotAlreadyPresent = bitcoin.networkNodes.indexOf(networkNodeuRL) == -1
        const notCurrentNode = bitcoin.currentNodeUrl !== networkNodeuRL

        if(notNotAlreadyPresent && notCurrentNode) bitcoin.networkNodes.push(networkNodeuRL)
    })

    res.json({note: "Registration successful"})
})


app.post('/transaction/broadcast', function(req,res){
    const newTransaction = bitcoin.createNewTransaction(req.body.amount, req.body.sender, req.body.recipient)
    bitcoin.addTransactionToPendingTransactions(newTransaction)

    const requestPromises = []
    bitcoin.networkNodes.forEach(networkNodeuRL => {
        //...
        const requestOptions = {
            uri: networkNodeuRL + '/transaction',
            method: 'POST',
            body: newTransaction,
            json: true
        }
        requestPromises.push(rp(requestOptions))
    })

    Promise.all(requestPromises)
    .then(data => {
        res.json({note: 'Transaction created and broadcast successfully.'})
    })
})

app.listen(port, function(){
    console.log(`Listening on port ${port}...`)
})