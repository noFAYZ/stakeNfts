import { FC, useState,useEffect } from 'react'
import Image from 'next/image'
import { Container,Checkbox, Card, Col, Row, Button, Text, Grid, Divider, Modal, Input, Spacer, Link } from "@nextui-org/react";
import { useTimer } from 'react-timer-hook';

interface Props {
    userAddress?: string | "",
    isConnected?: boolean,
    isAuthenticated?: boolean,
    NFTData: { id: number; image: string; staked: boolean; }[] ,
  }

const Gallery:FC<Props> = (props) => {




  return (
<>
{props.NFTData 
?
<>


<Grid.Container  justify="center" >
{props.NFTData?.map((item, index) => (
  <Grid xs={6} sm={2} key={index} css={{display:"flex",justifyContent:"center",px:"10px",alignItems:"center"}}>
    <Card hoverable clickable color={"default"} css={{w:"250px",h:"300px"}} >
      <Card.Body css={{ p: 0 }}>
        <Card.Image
          objectFit="cover"
          src={item.image}
          width="100%"
          height="100%"
          css={{height:"100%"}}
          alt={item.id.toString()}
        />
      </Card.Body>
      <Card.Footer >
        <Row wrap="wrap" justify="space-between">
          <Text b>ID: {item.id}</Text>
          <Text css={{ color: "$accents4", fontWeight: "$semibold" }}>
                  {item.staked ? "Staked" : "Not Staked" }
                </Text>
        </Row>
      </Card.Footer>
    </Card>
  </Grid>
))}
</Grid.Container>


</>
:
null
}

</>
   

  )
}

export default Gallery
