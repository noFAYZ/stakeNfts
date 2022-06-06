import type { NextPage } from 'next'
import { useState, useEffect } from 'react'
import { Container,Checkbox, Card, Col, Row, Button, Text, Grid, Divider, Modal, Input, Spacer, Link } from "@nextui-org/react";
import Nav from '../components/Nav'
import { ethers, providers } from "ethers";
import detectEthereumProvider from '@metamask/detect-provider';
import { ExternalProvider, Web3Provider } from '@ethersproject/providers';
import Gallery from '../components/Gallery'
import Stake from '../components/Stake'
import axios from 'axios'
import Image from 'next/image'


const ContractAbi = require('../abi.json');
const ContractAddress = "0x11F41241f7FF609F46c6854B402D357cBB30310d";



const Home: NextPage = () => {



  let  provider!: Web3Provider;
  let  signer!: ethers.Signer;
  let  contract!: ethers.Contract;



  const [walletConnected, setWalletConnected] = useState<boolean>(false)
  const [isConnecting, setisConnecting] = useState<boolean>(false)
  
  const [userAddress, setUserAddress] = useState<string>("")
  const [NFTDatas, setNFTDatas] = useState<{ id: number; image: string; staked: boolean;time:Date}[]>([])
 
  let NFTData: { id: number; image: string; staked: boolean; time:Date}[] = []




async function refreshGallery() {
  try {
    console.log("function refresjh")
    const browserProvider = await detectEthereumProvider() as ExternalProvider;const Provider = new ethers.providers.Web3Provider(browserProvider)
    provider = Provider;
    signer = provider.getSigner()
    
      await provider.provider.request!({ method: 'eth_requestAccounts' });
      const add = await signer.getAddress();

    
      const Contract = new ethers.Contract(
        ContractAddress!,
        ContractAbi,
        provider,
      );
      
      
      const Nfts = await Contract.walletOfOwner(add);
      NFTData = []
    for(let i = 0; i < Nfts.length; i++) {

      const stakedInfo = await isStaked(Nfts[i])
      
      NFTData.push({
        id: parseInt(Nfts[i]),
        image: await getTokenImageUri(Nfts[i]),
        staked: stakedInfo.staked,
        time: stakedInfo.time
      })
    console.log(NFTData[i].staked)
    }

    
    setNFTDatas(NFTData)

    } catch (e) {
     console.log(e);
     
    }
}
/* 
This function checks the stacked status and returns the data

Parameters: (id:any) NFT/Token ID
Return: Object 
*/

  async function isStaked(id:any) {

    const data = await axios.get('https://sheet.best/api/sheets/4519fb37-8460-4f31-9de0-9e3d03201f3a')

    const filteredData = data.data.find(x => String(x.staked) === String('TRUE') && String(x.id) === String(id));

    const stackInfo = {
      staked: filteredData ? true : false,
      time: filteredData ? new Date(filteredData.time) : new Date()
    }
    
  return stackInfo

  }



/* 
This function connects the Metamask wallet and gets all the nfts and their data to render Gallery and Stake components

Parameters: none
Return: none 
*/

  async function connect() {
    try {
    setisConnecting(true);
    const browserProvider = await detectEthereumProvider() as ExternalProvider;const Provider = new ethers.providers.Web3Provider(browserProvider)
    provider = Provider;
    signer = provider.getSigner()
    
      await provider.provider.request!({ method: 'eth_requestAccounts' });
      const add = await signer.getAddress();
      setUserAddress(add);
    
      const Contract = new ethers.Contract(
        ContractAddress!,
        ContractAbi,
        provider,
      );
      
      
      const Nfts = await Contract.walletOfOwner(add);
     NFTData = []
    for(let i = 0; i < Nfts.length; i++) {

      const stakedInfo = await isStaked(Nfts[i])
      
      NFTData.push({
        id: parseInt(Nfts[i]),
        image: await getTokenImageUri(Nfts[i]),
        staked: stakedInfo.staked,
        time: stakedInfo.time
      })
    console.log(NFTData[i].staked)
    }

    
    setNFTDatas(NFTData)

    } catch (e) {
     console.log(e);
     setisConnecting(false);
     setWalletConnected(false);
    }
      setisConnecting(false);
      setWalletConnected(true);


  }


/* 
This function makes a Smart COntract call to get the URI of a given token ID and replace ipfs protocol with a gateway and returns a working image URL.

Parameters: (id:number) Token ID 
Return: the Token image URL 
*/
  async function getTokenImageUri(id:number) {
    const browserProvider = await detectEthereumProvider() as ExternalProvider;
    const Provider = new ethers.providers.Web3Provider(browserProvider)

    provider = Provider;
    signer = provider.getSigner()

    const Contract = new ethers.Contract(
      ContractAddress!,
      ContractAbi,
      provider,
    );


    const uriMetadata:string = await Contract.tokenURI(id);
    const MetadataUrl= uriMetadata.replace("ipfs://", "https://ipfs.io/ipfs/");

  
        let metadata = await fetch(MetadataUrl)
        .then(result => result.json())
        .then((output) => {
          return output;              
      }).catch(err => console.error(err));

      const imageUrl = metadata.image.replace("ipfs://", "https://ipfs.io/ipfs/");


return(imageUrl)

  }



/* 
This function sets the required useStates to false to disconenct the metamask wallet.

Parameters: none
Return: none 
*/

  function disconnect() {
    console.log("disconnected")
    setNFTDatas([])
    setUserAddress("")
    setWalletConnected(false)
    setisConnecting(false)
  }

  return (
   <>
<div>
    {/* Navigation */}
      <Nav   
      refreshGallery={()=> refreshGallery()}
      disconnect={disconnect}
      connect={() =>connect()} 
      isConnecting = {isConnecting}
      isConnected = {walletConnected}
      userAddress = {userAddress}
   
      />

    {/* Gallery */}  
      <Spacer y={4} />
      {walletConnected?
        <>
        
          {NFTDatas.length > 0 ?
          <>

            <Stake
            refreshGallery={()=> refreshGallery()}
            NFTData = {NFTDatas}
            />
        <Spacer y={5} />

            <Gallery NFTData={NFTDatas}
            userAddress={userAddress}
            isConnected={walletConnected}
            />

          </>

          :
          <Text b css={{"justifyContent":"center",p:"32%",fontSize:"20px"}}>No NFTs
        <span>  </span>  <span>  </span>  <span>  </span>
          <span>of Contract: </span>  <span style={{color:"red"}}> {ContractAddress}</span>
          </Text>
          }

        </>
  
      :
      
      null
      }
</div>

    </>
  )





  function registerWalletEvents(browserProvider: ExternalProvider): void
  {
    // @ts-ignore
    browserProvider.on('accountsChanged', () => {
 
    });

    // @ts-ignore
    browserProvider.on('chainChanged', () => {
      window.location.reload();
    });
  }





}

export default Home
