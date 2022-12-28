import React, { useState } from 'react'
import { Col, Container, Row } from 'react-bootstrap'
import MailEditor from '../Mail/Compose';
import Menu from './Menu'

const Home = () => {
  const [greet, setGreet] = useState(true);
  const [showCompose, setShowCompose] = useState(false);
  const [showSent, setShowSent] = useState(false);
  const [showInbox, setShowInbox] = useState(false);

  return (
    <Container fluid style={{paddingTop:'4rem'}} className='h-100'>
      <Row>
        <Col xs lg="3" style={{height:'100vh'}}>
          <Menu setGreet = {setGreet} setShowCompose = {setShowCompose} setShowInbox = {setShowInbox} setShowSent = {setShowSent}/>
        </Col>
        <Col xs lg="9" className='p-2' style={{height:'100vh'}}>
          {greet&&
            <h2 className='text-danger border border-danger rounded fw-bold w-75 mx-auto p-3 text-center'>
              Welcome to your MailBox :)
            </h2>
          }
          {showCompose&&
            <MailEditor/>
          }
          {showInbox&&
            <></>
          }
          {showSent&&
            <></>
          }
        </Col>
      </Row>
    </Container>
  )
}

export default Home

