/**
 * Building a simple Blockchain
 */

const SHA256 = require('crypto-js/sha256');

class Transaction{
	
	constructor(fromAddress, toAddress, amount){
		this.fromAddress = fromAddress;
		this.toAddress = toAddress;
		this.amount = amount;
	}
}

class Block{
	
	constructor(timestamp, transactions, previousHash = ''){
		this.timestamp = timestamp;
		this.transactions = transactions;
		this.previousHash = previousHash;
		this.hash = this.calculateHash();
		this.nonce = 0;
	}
	
	calculateHash(){
		return SHA256(this.previousHash + this.timestamp +  JSON.stringify(this.transactions) + this.nonce).toString();
	}
	
	mineBlock(difficulty){
		while(this.hash.substring(0, difficulty) !== Array(difficulty + 1).join("0")){
			this.nonce = this.nonce + 1;
			this.hash = this.calculateHash();
		}
		console.log("Block mined...: ", this.hash);
	}
}

class BlockChain{
	
	constructor(){
		this.chain = [this.createGenesisBlock()];
		this.difficulty = 3;
		this.pendingTransactions = [];
		this.minerReward = 10;
	}
	
	createGenesisBlock(){
		return (new Block("03/03/2018", "Genesis Block", "0"));
	}
	
	getLatestBlock(){
		return this.chain[this.chain.length - 1];
	}
	
	minePendingTransactions(minerAddress){
		var newBlock = new Block(new Date(), this.pendingTransactions, this.getLatestBlock().hash);
		newBlock.mineBlock(this.difficulty);
		this.chain.push(newBlock);
		this.pendingTransactions = [new Transaction(null, minerAddress, this.minerReward)];
	}
	
	createTransaction(transaction){
		this.pendingTransactions.push(transaction);
	}
	
	getBalance(address){
		
		var balance = 0;
		
		for(const block of this.chain){
			for(const trans of block.transactions){
				if(address == trans.toAddress){
					balance += trans.amount;
				}
				else if(address == trans.fromAddress){
					balance -= trans.amount;
				}
			}
		}
		return balance;
	}
	
	isChainValid(){
		for(var i = 1; i< this.chain.length; i++){
			const currentBlock = this.chain[i];
			const previousBlock = this.chain[i - 1];
			
			if(currentBlock.hash !== currentBlock.calculateHash()){
				console.log("Hash fail");
				return false;
			}
			
			if(currentBlock.previousHash !== previousBlock.hash){
				console.log("Previous Hash fail");
				return false;
			}
		}
		return true;
	}
}

var blockChain = new BlockChain();

blockChain.createTransaction(new Transaction("A", "B", 100));
blockChain.createTransaction(new Transaction("B", "A", 50));

console.log("Start mining...");
blockChain.minePendingTransactions("miner");

console.log(JSON.stringify(blockChain, null, 4));
console.log("balance of A: ", blockChain.getBalance("A"));

console.log('\n Start mining again...');
blockChain.minePendingTransactions("miner");

console.log(JSON.stringify(blockChain, null, 4));
console.log("Is Chain Valid? " + blockChain.isChainValid());


//console.log("Mining block 1...");
//blockChain.addBlock(new Block(1, "03/04/2018", {amount : 10} ));
//console.log("Mining block 2...");
//blockChain.addBlock(new Block(2, "03/05/2018", {amount : 5} ));
//blockChain.chain[1].transactions[0].amount = 10;
//console.log("Is Chain Valid? " + blockChain.isChainValid());
//console.log(JSON.stringify(blockChain, null, 4));
//console.log("Is Chain Valid? " + blockChain.isChainValid());

