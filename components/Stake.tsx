import { Button, Checkbox, Grid, Input, Loading, Modal, Row, Spacer,Text } from '@nextui-org/react'
import React, { FC, useEffect, useState } from 'react'
import ImagePicker from 'react-image-picker'
import 'react-image-picker/dist/index.css'
import axios, { AxiosRequestConfig } from 'axios'
import { Range, getTrackBackground } from 'react-range';

interface Props {
  userAddress:string,
  refreshGallery():Promise<void>,
  NFTData: { id: number; image: string; staked: boolean;}[] ,

}


const Stake:FC<Props> = (props) => {

  const [stake, setStake] = useState<{ id: number; image: string; staked: boolean;}[]>([])
  const [staked, setStaked] = useState<{ id: number; image: string; staked: boolean;}[]>([])
  const [toStake, setToStaked] = useState<{ id: number; image: string; staked: boolean;}[]>([])
  const [stakingComplete, setStakingComplete] = useState<{ id: number; image: string; staked: boolean;}[]>([])
  const [values, setValues] = useState([50]);
  const [visible, setVisible] = useState(false);
  const [stakeDone, setStakeDone] = useState(false);

  let stakeData: { id: number; image: string; staked: string; time: Date; userAddress: string; stakedOn:string}


  async function isStaked(id:any) {

    const data = await axios.get('https://sheet.best/api/sheets/4519fb37-8460-4f31-9de0-9e3d03201f3a')

    const filteredData = data.data.find(x => String(x.staked) === String('TRUE') && String(x.id) === String(id));
    if(filteredData) return true
    
  return false

  }


  useEffect(() =>{
    console.log("Staked: ",staked)

    async function refreshG() {
       if(stakeDone){
      await props.refreshGallery()
      setVisible(false)
      setStakeDone(false)
    }
    
    }
  refreshG()
    
    console.log("NFTs: ",props.NFTData)
   },[stakeDone])


  function onPickImages(images:any) {

    setStake(images)
    
  
  }


 async function stakeNfts() {
      setVisible(true)
      setStaked(stake)
      setStakeDone(false)

      stake.map(async (x:any) => {

  if(!await isStaked(x.value)) {

       const toDate:Date = new Date() 
       console.log(toDate)

          stakeData={
            id: x.value,
            image: x.src,
            staked: "TRUE",
            time: toDate,
            userAddress: props.userAddress,
            stakedOn: toDate.toLocaleString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric',timeZone: 'UTC', timeZoneName: 'short' })
          }

          const data = await axios.post('https://sheet.best/api/sheets/4519fb37-8460-4f31-9de0-9e3d03201f3a',stakeData)
          console.log(data.status,stakeData)

         
        }
        else{
          console.log("Already Staked")
          setVisible(false)
        }
        
      })
        
      setStakeDone(true)
 
    }

  
  async function unStakeNfts() {
      setVisible(true)
      setStaked(stake)
      setStakeDone(false)
      
      stake.map(async (x:any) => {

  if(await isStaked(x.value)) {

       const toDate:Date = new Date( (new Date()).setDate((new Date()).getDate() + values[0]) ) 
       console.log(toDate)
       let stakedData: {limit:number; query_type:string; id: number; image: string; staked}
          stakedData={
            'limit': 1,
          'query_type': 'and',
            'id': x.value,
            'image': x.src,
            'staked': "TRUE",
          }

          const data = await axios.delete('https://sheet.best/api/sheets/4519fb37-8460-4f31-9de0-9e3d03201f3a/id/'+stakedData.id+'')
          console.log(data.status,stakeData)

         
          setVisible(false)
        }
        else{
          console.log("Already Staked")
          setVisible(false)
        }
        
      })

    
      setStakeDone(true)
   
    }


  const closeHandler = () => {
      setVisible(false);
      console.log("closed");
    };

  return (
    <>

{props.NFTData 
?
<>



<Grid.Container gap={1} justify="center" css={{px:"33%"}}>

    <ImagePicker
          images={props.NFTData.map((token) => ({src: token.image, value: token.id, staked:true}))}
          onPick={onPickImages.bind(this)}
          multiple
          justify="center"
          
        />
        

  </Grid.Container>
  <Spacer y={1} />



<Spacer y={1} />

  <Grid.Container gap={1} justify="center" css={{px:"33%"}}>

    
    <Button auto color="primary"  css={{marginTop : "11px"}}  onPress={stakeNfts} >Stake</Button>
    <Spacer x={1} />
    <Button auto color="error"  css={{marginTop : "11px"}}  flat onPress={unStakeNfts} >Unstake</Button>

  </Grid.Container>

  {/* Modal */}

  <Modal
        closeButton
        aria-labelledby="modal-title"
        open={visible}
        onClose={closeHandler}
      >
        
        <Modal.Body>
        <Loading color="primary">Staking</Loading>
        </Modal.Body>
        <Modal.Footer>
          <Button auto flat color="error" onClick={closeHandler}>
            Close
          </Button>
        </Modal.Footer>
      </Modal>



</>
:
null
}


    </>
  )
}

export default Stake