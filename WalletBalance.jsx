//Here we will interact with ether.js which is a javascript library which makes it easy communicate between the smart contract and the end users wallet.
//In this wallet we will get the end-users balance.
import { useState } from 'react';
import { ethers } from 'ethers';

function WalletBalance(){
    const [balance, setBalance] = useState();
    const getBalance = async () => {
        const [account] = await window.ethereum.request({method: 'eth_requestAccounts'});
        const provider = new ethers.providers.Web3Provider(window.ethereum);
        const balance = await provider.getBalance(account);
        setBalance(ethers.utils.formatEther(balance));
    };
    return(
            <div>
                <h5>Your Balance: {balance}</h5>
                <button onClick={()=>getBalance()}>View my Balance</button>
            </div>
    );
};

export default  WalletBalance;