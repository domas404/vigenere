import logo from './logo.svg';
import './App.css';
import React, { useEffect, useState } from 'react'
import Web3 from 'web3'
import Transaction from './build/contracts/transaction.json'
import react from 'react';
function App() {
  const [account, setAccount] = useState(0)
  const [contract, setContract] = useState(null)
  const [input, setInput] = useState('');
  const [inputproduct, setInputproduct] = useState('');
  const [input2, setInput2] = useState('');
  const [inputIndex, setInputIndex] = useState('');
  const [inputPrice, setInputPrice] = useState('');
  const [inputAddr, setAddr] = useState('');
  const [inputDelivPrice, setDelivPrice] = useState('');
  const [oInfo, setInfo] = useState([]);
  const [oInfo2, setInfo2] = useState(['', '']);

  useEffect(() => {
    window.addEventListener('load', async () => {
      // Modern dapp browsers...
      if (window.ethereum) {
        window.web3 = new Web3(window.ethereum)
        try {
          // Request account access if needed
          await window.ethereum.enable()
        } catch (error) {
          console.log(error)
          // User denied account access...
        }
      }
      // Legacy dapp browsers...
      else if (window.web3) {
        window.web3 = new Web3(window.web3.currentProvider)

      }
      // Non-dapp browsers...
      else {
        alert('Non-Ethereum browser detected. You should consider trying MetaMask!')
      }
    }, [])
    if (window.ethereum) {
      window.ethereum.on("accountsChanged", loadBlockchainData)
    }

  })
  async function loadBlockchainData() {
    const accounts = await window.web3.eth.getAccounts()
    setAccount(accounts[0])
    const networkID = await window.web3.eth.net.getId()
    const networkData = Transaction.networks[networkID]
    if (networkData) {
      const Transactions = new window.web3.eth.Contract(Transaction.abi, networkData.address)
      setContract(Transactions);
    }
    else {
      alert('Transaction contract not deployed to network you are using!')
    }

  }

  async function createOrder() {
    let oNumber = input;
    let pName = input2;
    alert(oNumber);
    alert(pName);
    try {
      contract.methods.createorder(pName, oNumber).send({ from: account })
    } catch (error) {
      console.log(error)
      return;
    }
  }

  async function payforOrder() {
    alert("test0");
    let returnvalues
    let index_ = inputIndex;
    try {
      returnvalues = await contract.methods.getFullPrice(index_).call({ from: account });
      alert(returnvalues)
    } catch (error) {
      console.log(error)
      return;
    }
    try {
      contract.methods.payForOrder(index_).send({ from: account, value: returnvalues })
    } catch (error) {
      console.log(error)
      return;
    }

  }

  async function setOrderPrice() {
    let price_ = inputPrice;
    let index_ = inputIndex;
    alert(price_);
    try {
      contract.methods.setPrice(index_, price_).send({ from: account })
    } catch (error) {
      console.log(error)
      return;
    }
  }

  async function setOrderCourier() {
    let addr_ = inputAddr;
    let index_ = inputIndex;
    alert(addr_);
    try {
      contract.methods.setCourier(index_, addr_).send({ from: account })
    } catch (error) {
      console.log(error)
      return;
    }
  }

  async function setDeliveryPrice() {
    let dprice_ = inputDelivPrice;
    let index_ = inputIndex;
    alert(dprice_);
    try {
      contract.methods.setShipmentPrice(index_, dprice_).send({ from: account })
    } catch (error) {
      console.log(error)
      return;
    }
  }

  async function confirmDelivery() {
    alert("test1");
    let index_ = inputIndex;
    try {
      contract.methods.confirmDelivery(index_).send({ from: account })
    } catch (error) {
      console.log(error)
      return;
    }
  }

  async function getorderaddr() {
    try {
      let returnvalues = await contract.methods.buyer().call({ from: account });
      alert("test2");
      alert(returnvalues)
    } catch (error) {
      console.log(error)
      return;
    }
  }

  async function getorderselleraddr() {
    try {
      let returnvalues = await contract.methods.seller().call({ from: account });
      alert("test3");
      alert(returnvalues)
    } catch (error) {
      console.log(error)
      return;
    }

  }

  async function getorderInfo() {
    let returnvalues;
    let returnvalues2;
    try {
      alert("test4")
      alert(inputIndex)
      returnvalues = await contract.methods.getOrderInfo(inputIndex).call({ from: account });
    } catch (error) {
      console.log(error)
      return;
    }
    try {
      returnvalues2 = await contract.methods.getOrderStatus(inputIndex).call({ from: account })
    } catch (error) {
      console.log(error)
      return;
    }

    setInfo(returnvalues);
    setInfo2(returnvalues2);

  }

  async function getProducts() {
    try {
      let returnvalues = await contract.methods.getProducts().call({ from: account });
      alert("test2");
      alert(returnvalues)
    } catch (error) {
      console.log(error)
      return;
    }
  }

  async function addProduct() {
    try {
      contract.methods.createProduct(inputproduct).send({ from: account });

    } catch (error) {
      console.log(error)
      return;
    }
  }

  return (
    <React.Fragment>
      <h2>Indeksas</h2>
      <label for="ordernmb4">užsakymo indeksas</label>
      <input value={inputIndex} onInput={e => setInputIndex(e.target.value)} />


      <br />

      <h1>Pirkėjo funkcijos</h1>
      <label for="prodname">įveskite produktą</label>
      <input value={input2} onInput={e => setInput2(e.target.value)} />
      <label for="prodkiek">įveskite kiekį</label>
      <input value={input} onInput={e => setInput(e.target.value)} />
      <button id="createOrderB" onClick={createOrder}>create order</button>
      <br />
      <button id="payforOrderB" onClick={payforOrder}>buy</button>
      <br />

      <h1>Pardavėjo funkcijos</h1>
      <label for="kaina">Naujos produktas</label>
      <input value={inputproduct} onInput={e => setInputproduct(e.target.value)} />
      <button id="setOrderPriceB" onClick={addProduct}>add product</button>
      <br />
      <label for="kaina">užsakymo kaina</label>
      <input value={inputPrice} onInput={e => setInputPrice(e.target.value)} />
      <button id="setOrderPriceB" onClick={setOrderPrice}>set price</button>
      <br />
      <label for="cur">kurjerio adresas</label>
      <input value={inputAddr} onInput={e => setAddr(e.target.value)} />
      <button id="setOrderaddr" onClick={setOrderCourier}>set courier</button>
      <br />
      <label for="pkaina">Pristatymo kaina</label>
      <input value={inputDelivPrice} onInput={e => setDelivPrice(e.target.value)} />
      <button id="setOrderDivPriceB" onClick={setDeliveryPrice}>set delivery price</button>
      <h1>kurjerio funkcijos</h1>
      <button id="confimDeliv" onClick={confirmDelivery}>confirm delivery</button>
      <br />
      <h1>kitos funkcijos</h1>
      <button id="getaddr" onClick={getorderaddr}>buyer address</button>
      <br />
      <button id="getaddr" onClick={getorderselleraddr}>seller address</button>
      <br />
      <button id="getProd" onClick={getProducts}>products</button>
      <br />
      <button id="getInfo" onClick={getorderInfo}>order info</button>
      <br />
      <label> kurjeris </label> <p id="kr">{oInfo[0]}</p>
      <label> produktas </label> <p id="pr">{oInfo[1]}</p>
      <label> keikis </label> <p id="kk">{oInfo[2]}</p>
      <label> kaina</label> <p id="kn">{oInfo[3]}</p>
      <label> pristatymo kaina</label> <p id="pk">{oInfo[4]}</p>
      <label> sumoketa</label> <p id="sm">{oInfo[5]}</p>
      <label> apmokėjimo statusas</label> <p id="sm">{oInfo2[0].toString()}</p>
      <label> pristatymo statusas</label> <p id="sm">{oInfo2[1].toString()}</p>




    </React.Fragment>
  )

}

export default App;
