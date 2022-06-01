import { Grid } from '@nextui-org/react'
import React, { useEffect, useState } from 'react'
import ImagePicker from 'react-image-picker'
import 'react-image-picker/dist/index.css'


const Staked = () => {

  const [stake, setStake] = useState<{ id: number; image: string; staked: boolean;}[]>([])

  useEffect(() =>{
    console.log(stake)
  
   },[stake])

  function onPickImages(images:any) {
    setStake(images)
  
  }

  return (
    <>


    </>
  )
}

export default Staked