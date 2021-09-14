import * as React from "react";
import { ethers } from "ethers";
import './App.css';
import abi from './utils/WavePortal.json';

export default function App() {
  const [currentAccount, setCurrentAccount] = React.useState("")
  const contractAddress = '0xDA5f2139A79243c75BCebA2756f784Fa89152B46'
  const contractABI = abi.abi

  const [waves, setWaves] = React.useState(0)

  const checkIfWalletIsConnected = () => {
    const { ethereum } = window;
    if (!ethereum) {
      console.log("Make sure you have metamask!")
      return
    } else {
      console.log("We have the ethereum object", ethereum)
    }

    ethereum.request({ method: 'eth_accounts' })
      .then(accounts => {
        if (accounts.length !== 0) {
          const account = accounts[0];
          console.log("Found an authorized account: ", account)
          setCurrentAccount(account);
        } else {
          console.log("No authorized account found")
        }
      })
  }

  const connectWallet = () => {
    const { ethereum } = window;
    if (!ethereum) {
      alert("Get metamask!")
      return
    }

    ethereum.request({ method: 'eth_requestAccounts' })
      .then(accounts => {
        console.log("Connected", accounts[0])
        setCurrentAccount(accounts[0])
      })
      .catch(err => console.log(err));
  }

  // Get waved count
  (async () => {
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    const signer = provider.getSigner();
    const waveportalContract = new ethers.Contract(contractAddress, contractABI, signer);

    let count = await waveportalContract.getTotalWaves()
    console.log('Initial value..., total waves = ' + count.toNumber())
    setWaves(count.toNumber())
  })();

  const wave = async () => {
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    const signer = provider.getSigner();
    const waveportalContract = new ethers.Contract(contractAddress, contractABI, signer);

    let count = await waveportalContract.getTotalWaves()
    console.log("Retrived total wave count...", count.toNumber())

    const waveTxn = await waveportalContract.wave(1);
    console.log("Mining...", waveTxn.hash)
    await waveTxn.wait()
    console.log("Mined -- ", waveTxn.hash)

    count = await waveportalContract.getTotalWaves();
    console.log("Retrived total wave count...", count.toNumber())
    setWaves(count.toNumber())
  }

  React.useEffect(() => {
    checkIfWalletIsConnected()
  }, [])

  function WaveAtMe() {
    return <button className="waveButton" onClick={wave}>
      Wave at Me 👋
    </button>
  }

  return (
    <div className="mainContainer">

      <div className="dataContainer">
        <div className="header">
          👋 Hey there!
        </div>

        <div className="bio">
          Narate, from Thailand 🇹🇭
        </div>
        <div className="bio">
          <h1>Total waves {waves}</h1>
        </div>

        <WaveAtMe />
        
        {currentAccount ? null : (
          <button className="waveButton" onClick={connectWallet}>
            Connect Wallet 🔗
          </button>
        )}
      </div>
    </div>
  );
}
