import * as React from "react";
import { ethers } from "ethers";
import {
  serializeError
} from 'eth-rpc-errors';

import './App.css';
import abi from './utils/WavePortal.json';

export default function App() {

  const [currentAccount, setCurrentAccount] = React.useState("");
  const contractAddress = '0x4ed3d5b5463433577d96f7c1aF116374BaD8E054';
  const contractABI = abi.abi;

  const [allWaves, setAllWaves] = React.useState([]);
  const [message, setMessage] = React.useState('');
  const [waves, setWaves] = React.useState(0);

  const checkIfWalletIsConnected = () => {
    const { ethereum } = window;
    if (!ethereum) {
      console.log("Make sure you have metamask!");
      return
    } else {
      console.log("We have the ethereum object", ethereum);
    }

    ethereum.request({ method: 'eth_accounts' })
      .then(accounts => {
        if (accounts.length !== 0) {
          const account = accounts[0];
          console.log("Found an authorized account: ", account)
          setCurrentAccount(account);
          getAllWaves();
        } else {
          console.log("No authorized account found");
        }
      })
  }

  const connectWallet = () => {
    const { ethereum } = window;
    if (!ethereum) {
      alert("Get metamask!");
      return
    }

    ethereum.request({ method: 'eth_requestAccounts' })
      .then(accounts => {
        console.log("Connected", accounts[0]);
        setCurrentAccount(accounts[0]);
        getAllWaves();
      })
      .catch(err => console.log('eth_requestAccounts', err));
  }

  const wave = async () => {
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    const signer = provider.getSigner();
    const waveportalContract = new ethers.Contract(contractAddress, contractABI, signer);

    let count = await waveportalContract.getTotalWaves()
    console.log("Retrived total wave count...", count.toNumber())

    if (message.length === 0) {
      alert("Message empty~~");
      return
    }

    try {
      const waveTxn = await waveportalContract.wave(message);
      console.log("Mining...", waveTxn.hash)
      await waveTxn.wait()
      console.log("Mined -- ", waveTxn.hash)
    } catch(err) {
      const res = serializeError(err);
      if (typeof res.data != "undefined") {
        alert(res.data.originalError.error.message);
        return
      }
    }
    
    count = await waveportalContract.getTotalWaves();
    console.log("Retrived total wave count...", count.toNumber())
    setWaves(count.toNumber())
    document.getElementById('message').value = '';
    getAllWaves();
  }

  async function getAllWaves() {
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    const signer = provider.getSigner();
    const waveportalContract = new ethers.Contract(contractAddress, contractABI, signer);

    let waves = await waveportalContract.getAllWaves();

    let count = await waveportalContract.getTotalWaves();

    setWaves(count.toNumber());

    let wavesCleaned = [];
    waves.forEach(wave => {
      wavesCleaned.push({
        address: wave.waver,
        timestamp: new Date(wave.timestamp * 1000),
        message: wave.message
      })
    })

    setAllWaves(wavesCleaned);
    console.log('Initial value..., total waves = ' + count.toNumber());
    console.log(wavesCleaned);
  }

  React.useEffect(checkIfWalletIsConnected, [])

  return (
    <div className="mainContainer">

      <div className="dataContainer">
        <div className="header">
          <span role="img" aria-label="wave">👋</span> Hey there!
        </div>

        <div className="bio">
          Narate, from Thailand <span role="img" aria-label="thailand-flag">🇹🇭</span>
        </div>

        {/*condition ? true : false. */}

        {currentAccount
          ? (
            <>
              <div className="bio">
                <h1>Total waves {waves}</h1>
              </div>
              <div className="bio">
                <input type="text" className="message" id="message" placeholder="Add message here..." onChange={event => setMessage(event.target.value)} />
                <br />
                <button className="waveButton" onClick={wave}>
                  Wave at Me <span role="img" aria-label="wave">👋</span>
                </button>
              </div>
            </>
          )
          : (
            <button className="waveButton" onClick={connectWallet}>
              Connect Wallet <span role="img" aria-label="chain">🔗</span>
            </button>
          )}

        {allWaves.length > 0
          ? (
            <div>
              <hr />
              <strong>Wave messages</strong>
              {allWaves.map((wave, index) => {
                return (
                  <div style={{ background: "OldLance", marginTop: "16px", padding: "8px" }} key={index}>
                    <div><b>Address:</b> <a href={"https://rinkeby.etherscan.io/address/" + wave.address} target="_blank" rel="noopener noreferrer">{wave.address}</a></div>
                    <div><b>Time:</b> {wave.timestamp.toString()}</div>
                    <div><b>Message:</b> {wave.message}</div>
                  </div>
                )
              })}
            </div>
          )
          : null
        }

      </div>
    </div >
  );
}
