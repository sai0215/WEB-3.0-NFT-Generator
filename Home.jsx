import WalletBalance from './WalletBalance';
import {useEffect, useState} from 'react';

import { ethers } from 'ethers';
import Nftfolk from '../artifacts/contracts/nfft.sol/Nftfolk.json';

const contractAdd = '0x5FbDB2315678afecb367f032d93F642f64180aa3';

const provider = new ethers.providers.Web3Provider(window.ethereum);

//End user
const signer = provider.getSigner();

//Smart Contract
const contract = new ethers.Contract(contractAdd, Nftfolk.abi, signer); //Nftfolk ee

function Home(){

    const [totalMinted, setTotalMinted] = useState(0);
    useEffect(() => {
        getCount();
    }, []);

    const getCount = async () => {
        const con = await contract.con(); //con is the count
        console.log(parseInt(con));
        setTotalMinted(parseInt(con));
    };
    
    return (
        <div>
            <WalletBalance/>
            <h1>Here is my NFT's</h1>
            {Array(totalMinted+1) //looping over every token that's been minted so far
                .fill(0) //NFTimage takes the index as a prop which conviniently matches the token id
                .map((_,i) => (
                    <div key={i}> 
                        <NFTImage tokenID={i} getCount={getCount} />
                    </div>
                ))}
        </div>    
        );
}

function NFTImage({tokenID, getCount}){
    const contentID = 'QmRXcBc5Bsv9HbXmxC1CySF3VKN8RVfvdzJXgUiaU4ADbJ';
    const metadataURI = `${contentID}/${tokenID}.json`;
    const imageURI = `img/${tokenID}.png`;

    const [isMinted, setIsMinted] = useState(false);

    useEffect(() => {
        getMintedStatus();
    }, [isMinted]);

    const getMintedStatus = async () => {
        const result = await contract.isContentOwned(metadataURI);
        console.log(result)
        setIsMinted(result);
    };

    const mintToken = async () => {
        const connection = contract.connect(signer);
        const addr = connection.address;
        const result = await contract.payToMint(addr,metadataURI,{
            value: ethers.utils.parseEther('0.05'),
        });

        await result.wait();
        getMintedStatus();
        getCount();
    };

    async function getURI(){
        const uri = await contract.tokenURI(tokenID);
        alert(uri);
    }

    return (
        <div>
          <img src={isMinted ? imageURI : 'img/placeholder.png'}></img>
            <h5>ID #{tokenID}</h5>
            {!isMinted ? (
              <button onClick={mintToken}>
                Mint
              </button>
            ) : (
              <button onClick={getURI}>
                Taken! Show URI
              </button>
            )}
        </div>
      );
    }

export default Home;
