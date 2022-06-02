import { Button, Checkbox, Grid, Input, Loading, Modal, Row, Spacer,Text } from '@nextui-org/react'
import React, { FC, useEffect, useState } from 'react'
import ImagePicker from 'react-image-picker'
import 'react-image-picker/dist/index.css'
import axios from 'axios'
import { Range, getTrackBackground } from 'react-range';

interface Props {

  NFTData: { id: number; image: string; staked: boolean;}[] ,

}


const Stake:FC<Props> = (props) => {

  const [stake, setStake] = useState<{ id: number; image: string; staked: boolean;}[]>([])
  const [staked, setStaked] = useState<{ id: number; image: string; staked: boolean;}[]>([])
  const [toStake, setToStaked] = useState<{ id: number; image: string; staked: boolean;}[]>([])
  const [values, setValues] = useState([50]);
  const [visible, setVisible] = useState(false);


  let stakeData: { id: number; image: string; staked: string; time: number}


  async function isStaked(id:any) {

    const data = await axios.get('https://sheet2api.com/v1/KlXFOUSuQ1Oc/stake')

    const filteredData = data.data.find(x => String(x.staked) === String('TRUE') && String(x.id) === String(id));
    if(filteredData) return true
    
  return false

  }


  useEffect(() =>{
    console.log("Staked: ",staked)



    console.log("NFTs: ",props.NFTData)
   },[staked])


  function onPickImages(images:any) {

    setStake(images)
    
  
  }


  function stakeNfts() {
     setVisible(true)
      setStaked(stake)
      
      stake.map(async (x:any) => {

  if(!await isStaked(x.value)) {

          stakeData={
            id: x.value,
            image: x.src,
            staked: "TRUE",
            time: values[0]*86400
          }

          const data = await axios.post('https://sheet2api.com/v1/KlXFOUSuQ1Oc/stake',stakeData)
          console.log(data.status,stakeData)


        }
        else{
          console.log("Already Staked")
          setVisible(false)
        }
        setVisible(false)
      })


     
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


    <div
  style={{
    display: "flex",
    justifyContent: "center",
    flexWrap: "wrap",
    marginTop: "2em"
  }}
  >
<Range
        values={values}
        step={5}
        min={5}
        max={60}
        onChange={(values) => setValues(values)}
        renderMark={({ props, index }) => (
          <div
            {...props}
            style={{
              ...props.style,
              height: '16px',
              width: '5px',
              backgroundColor: index * 5 < values[0] ? '#548BF4' : '#ccc'
            }}
          />
        )}
        renderTrack={({ props, children }) => (
          <div
            onMouseDown={props.onMouseDown}
            onTouchStart={props.onTouchStart}
            style={{
              ...props.style,
              height: '36px',
              display: 'flex',
              width: '25%'
            }}
          >
            <div
              ref={props.ref}
              style={{
                height: '5px',
                width: '100%',
                borderRadius: '4px',
                background: getTrackBackground({
                  values: values,
                  colors: ['#548BF4', '#ccc'],
                  min: 5,
                  max: 60,
                 
                }),
                alignSelf: 'center'
              }}
            >
              {children}
            </div>
          </div>
        )}
        renderThumb={({ props, isDragged }) => (
          <div
          {...props}
          style={{
            ...props.style,
            height: '42px',
            width: '45px',
            borderRadius: '4px',
            backgroundColor: '#FFF',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            boxShadow: '0px 2px 6px #AAA'
          }}
        >
          <div
            style={{
              position: 'absolute',
              top: '-28px',
              color: '#fff',
              fontWeight: 'bold',
              width: '60px',
              fontSize: '12px',
              fontFamily: 'Arial,Helvetica Neue,Helvetica,sans-serif',
              padding: '4px',
              borderRadius: '4px',
              textAlign: 'center',
              backgroundColor: '#548BF4'
            }}
          >
            {values[0] +" days"}
          </div>
          <div
            style={{
              height: '16px',
              width: '5px',
              backgroundColor: isDragged ? '#548BF4' : '#CCC'
            }}
          />
        </div>
        )}
      />

  </div>

<Spacer y={1} />

  <Grid.Container gap={1} justify="center" css={{px:"33%"}}>

    
    <Button auto color="primary"  css={{marginTop : "11px"}}  onPress={stakeNfts} >Stake</Button>
    <Spacer x={1} />
    <Button auto color="error"  css={{marginTop : "11px"}}  flat >Unstake</Button>

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