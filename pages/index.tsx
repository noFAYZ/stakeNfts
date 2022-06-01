import type { NextPage } from 'next'
import { useState, useEffect } from 'react'
import { Container,Checkbox, Card, Col, Row, Button, Text, Grid, Divider, Modal, Input, Spacer, Link } from "@nextui-org/react";
import Nav from '../components/Nav'
import { ethers, providers } from "ethers";
import detectEthereumProvider from '@metamask/detect-provider';
import { ExternalProvider, Web3Provider } from '@ethersproject/providers';
import Gallery from '../components/Gallery'
import Stake from '../components/Stake'

const ContractAbi = require('../abi.json');
const ContractAddress = "0x11F41241f7FF609F46c6854B402D357cBB30310d";



const Home: NextPage = () => {



  let  provider!: Web3Provider;
  let  signer!: ethers.Signer;
  let  contract!: ethers.Contract;



  const [walletConnected, setWalletConnected] = useState<boolean>(false)
  const [isConnecting, setisConnecting] = useState<boolean>(false)
  
  const [userAddress, setUserAddress] = useState<string>("")
  const [NFTDatas, setNFTDatas] = useState<{ id: number; image: string; staked: boolean;}[]>([])
 
  const NFTData: { id: number; image: string; staked: boolean;}[] = []



  async function connect() {
    setisConnecting(true);
    const browserProvider = await detectEthereumProvider() as ExternalProvider;const Provider = new ethers.providers.Web3Provider(browserProvider)
    provider = Provider;
    signer = provider.getSigner()
    try {
      await provider.provider.request!({ method: 'eth_requestAccounts' });
      const add = await signer.getAddress();
      setUserAddress(add);
    
      const Contract = new ethers.Contract(
        ContractAddress!,
        ContractAbi,
        provider,
      );
      
      
      const Nfts = await Contract.walletOfOwner(add);

    for(let i = 0; i < Nfts.length; i++) {
      
      NFTData.push({
        id: parseInt(Nfts[i]),
        image: await getTokenImageUri(Nfts[i]),
        staked: false
      })
    
    }
       console.log(NFTData)
      setNFTDatas(NFTData)
    } catch (e) {
     console.log(e);
     setisConnecting(false);
     setWalletConnected(false);
    }
      setisConnecting(false);
      setWalletConnected(true);
      }



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

  async function getNftIds() {
    const browserProvider = await detectEthereumProvider() as ExternalProvider;
    const Provider = new ethers.providers.Web3Provider(browserProvider)

    provider = Provider;
    signer = provider.getSigner()

    const Contract = new ethers.Contract(
      ContractAddress!,
      ContractAbi,
      provider,
    );
  
    const Nfts = await Contract.walletOfOwner(userAddress);

    for(let i = 0; i < Nfts.length; i++) {
      
      NFTData.push({
        id: parseInt(Nfts[i]),
        image: await getTokenImageUri(Nfts[i])
      })
      console.log(NFTData)
    }

    
  }

  function disconnect() {
    console.log("disconnected")
    setNFTDatas([])
    setUserAddress("")
    setWalletConnected(false)
    setisConnecting(false)
  }

  return (
   <>

    {/* Navigation */}
      <Nav   
      disconnect={disconnect}
      connect={() =>connect()} 
      isConnecting = {isConnecting}
      isConnected = {walletConnected}
      userAddress = {userAddress}
   
      />

    {/* Gallery */}  
      <Spacer y={6} />
      {walletConnected?
        <>
        
          {NFTDatas.length > 0 ?
          <>

            <Stake
            NFTData = {NFTDatas}
            />
        <Spacer y={8} />

            <Gallery NFTData={NFTDatas}
            userAddress={userAddress}
            isConnected={walletConnected}
            />

          </>

          :
          null
          }

        </>
  
      :
      
      null
      }
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
