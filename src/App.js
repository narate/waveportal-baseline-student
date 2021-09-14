import * as React from "react";
import { ethers } from "ethers";
import './App.css';

export default function App() {

  const [currentAccount, setCurrentAccount] = React.useState("")

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

  React.useEffect(() => {
    checkIfWalletIsConnected()
  }, [])

  const wave = () => {
  }

  return (
    <div className="mainContainer">

      <div className="dataContainer">
        <div className="header">
          Hey there!
        </div>

        <div className="bio">
          Narate,from Thailand.
        </div>

        <button className="waveButton" onClick={null}>
          Wave at Me
        </button>

        {currentAccount ? null : (
          <button className="waveButton" onClick={connectWallet}>
            Connect Wallet
          </button>
        )}
      </div>
    </div>
  );
}
