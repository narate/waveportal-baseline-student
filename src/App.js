import * as React from "react";
import { ethers } from "ethers";
import './App.css';

export default function App() {

  const [currentAccount, setCurrentAccount] = React.useState("")

  const checkIfWalletIsConnected = () => {
    const { ethereum } = window;
    if(!ethereum) {
      console.log("Make sure you have metamask!")
      return
    } else {
      console.log("We have the ethereum object", ethereum)
    }
  }

  ethereum.request({ method: 'eth_accounts' })
  .then(accounts => {
    if(accounts.length !== 0)
  })

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

        <button className="waveButton" onClick={wave}>
          Wave at Me
        </button>
      </div>
    </div>
  );
}
