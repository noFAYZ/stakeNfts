import { FC, useState } from 'react'
import Image from 'next/image'
import { Container,Checkbox, Card, Col, Row, Button, Text, Grid, Divider, Modal, Input, Spacer, Link,Loading } from "@nextui-org/react";


interface Props {
  connect():Promise<void>,
  disconnect():void,
  userAddress?: string | "",
  isConnected?: boolean,
  isAuthenticated?: boolean,
  isConnecting?: boolean,

}


const Nav:FC<Props>  =  (props)  => {


  function getAddress(address: string) {
    return address.substring(0,19) + "..." ;
  }

  async function connect(): Promise<void> {
    await props.connect();
   
    return;
  }

  function disconnectWallet(){
    props.disconnect();
   
  }

  return (
   

        <Card>
         <Container>
            <Row css={{ height: "60px", bgBlur: "black", background: 'transparent' }}>

            <Grid.Container >
              <Grid xs>
          
             {/*      <Image
                width={120}
                height={60}  
                src="/6.png"
                alt="Default Image"
                objectFit="cover"
              
              />  */}
              <Text b css={{"justifyContent":"center",paddingTop:"$8",fontSize:"22px"}}>Logo</Text>
 
              </Grid>
      

              <Grid xs justify='flex-end' css={{marginRight:"20px"}}>

           


               

                <Button auto color="primary"  css={{marginTop : "11px"}} onPress={connect} disabled={props.isConnected} flat={props.isConnected} >
                {props.isConnected ? 
                <>
                {getAddress(props.userAddress!) }
                </> 
                :
                   <>
                    {props.isConnecting ? 
                        <>
                        Connecting <Spacer y={1} /> 
                        <Loading color="currentColor" size="sm" /> 

                        </>
                    : 
                      <>
                      Connect <Spacer y={1} />               
                        <svg
                        data-name="Iconly/Curved/Lock"
                        xmlns="http://www.w3.org/2000/svg"
                        width={24}
                        height={24}
                        viewBox="0 0 24 24"

                      >
                        <g
                          fill="none"
                          stroke={"#ffff"}
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeMiterlimit={10}
                          strokeWidth={1.5}
                        >
                          <path
                            data-name="Stroke 1"
                            d="M16.471 9.403V7.25a4.561 4.561 0 00-9.121-.016v2.169"
                          />
                          <path data-name="Stroke 3" d="M11.91 14.156v2.221" />
                          <path
                            data-name="Stroke 5"
                            d="M11.91 8.824c-5.745 0-7.66 1.568-7.66 6.271s1.915 6.272 7.66 6.272 7.661-1.568 7.661-6.272-1.921-6.271-7.661-6.271z"
                          />
                        </g>
                      </svg>
                      </>
                    }
                   </>
                }
                

                 
                </Button>
                <Spacer x={1} />
                {props.isConnected ?
                <Button auto color="error"  css={{marginTop : "11px"}}  flat animated  onPress={disconnectWallet}>Logout</Button>
              
                :
                  null
              }
                
            
               
              </Grid>

             </Grid.Container>
            

              
            </Row>
          </Container>
        </Card>

       
   

  )
}

export default Nav
