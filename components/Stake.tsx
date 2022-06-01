import { Button, Grid, Spacer } from '@nextui-org/react'
import React, { FC, useEffect, useState } from 'react'
import ImagePicker from 'react-image-picker'
import 'react-image-picker/dist/index.css'


interface Props {
  NFTData: { id: number; image: string; staked: boolean;}[] ,

}


const Stake:FC<Props> = (props) => {

  const [stake, setStake] = useState<{ id: number; image: string; staked: boolean;}[]>([])
  const [staked, setStaked] = useState<{ id: number; image: string; staked: boolean;}[]>([])
  useEffect(() =>{
    console.log("Staked: ",staked)
    console.log("NFTs: ",props.NFTData)
   },[staked])

  function onPickImages(images:any) {

    setStake(images)
    
  
  }


  function stakeNfts() {
    setStaked(stake)
  
  }



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
  <Spacer y={2} />
  <Grid.Container gap={1} justify="center" css={{px:"33%"}}>

    
    <Button auto color="default"  css={{marginTop : "11px"}}  onPress={stakeNfts} >Stake</Button>
    <Spacer x={1} />
    <Button auto color="error"  css={{marginTop : "11px"}}  flat >Unstake</Button>

</Grid.Container>
</>
:
null
}


    </>
  )
}

export default Stake