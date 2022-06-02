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



const ContractAbi = require('../abi.json');
const ContractAddress = "0x11F41241f7FF609F46c6854B402D357cBB30310d";



const Home: NextPage = () => {



  let  provider!: Web3Provider;
  let  signer!: ethers.Signer;
  let  contract!: ethers.Contract;



  const [walletConnected, setWalletConnected] = useState<boolean>(false)
  const [isConnecting, setisConnecting] = useState<boolean>(false)
  
  const [userAddress, setUserAddress] = useState<string>("")
  const [NFTDatas, setNFTDatas] = useState<{ id: number; image: string; staked: boolean;time:number}[]>([])
 
  const NFTData: { id: number; image: string; staked: boolean;time:number}[] = []



  async function isStaked(id:any) {

    const data = await axios.get('https://sheet2api.com/v1/KlXFOUSuQ1Oc/stake')

    const filteredData = data.data.find(x => String(x.staked) === String('TRUE') && String(x.id) === String(id));

    const stackInfo = {
      staked: filteredData ? true : false,
      time: filteredData ? filteredData.time : 0
    }
    
  return stackInfo

  }


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
        image: await getTokenImageUri(Nfts[i]),
        staked: false
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
      <Spacer y={4} />
      {walletConnected?
        <>
        
          {NFTDatas.length > 0 ?
          <>

            <Stake
          
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
