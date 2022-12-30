import React, { useEffect, useState, useCallback } from 'react'
import { Col, Container, Row } from 'react-bootstrap'
import { useDispatch, useSelector } from 'react-redux';
import { inboxActions } from '../../store/InboxReducer';
import Compose from '../Mail/Compose';
import Menu from './Menu'
const Inbox = React.lazy(()=>import("../Mail/Inbox"))
const Home = () => {
  const [greet, setGreet] = useState(true);
  const [showCompose, setShowCompose] = useState(false);
  const [showSent, setShowSent] = useState(false);
  const [showInbox, setShowInbox] = useState(false);
  let inbox = true;
  const email = useSelector(state=>state.auth.loginEmail);
  const dispatch = useDispatch();
  let countUnread = true;

  const loadMails = useCallback(async(countUnread, inbox) => {
    
    let res 
    if(inbox){
      res = await fetch(`https://mailbox-client-d3ec8-default-rtdb.firebaseio.com/${email}Inbox.json`);
    }
    else{
      res = await fetch(`https://mailbox-client-d3ec8-default-rtdb.firebaseio.com/${email}Sent.json`) 
    }
    const data = await res.json();
    if(res.ok){
      let mailData = Object.values(data).reverse();
      if(countUnread){
        dispatch(inboxActions.clear())
        mailData.forEach(mail=>{
          if(mail.status==='unread'){
            dispatch(inboxActions.incrementUnread())
          }
        })
      }
      dispatch(inboxActions.loadMails(mailData));
      
    }
  },[email, dispatch])

  useEffect(()=>{
    loadMails(countUnread, inbox)
  },[countUnread, inbox, loadMails])

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
            <Compose/>
          }
          {showInbox&&
            <Inbox loadMails = {loadMails} inbox={inbox}/>
          }
          {showSent&&
            <Inbox loadMails = {loadMails} inbox={!inbox}/>
          }
        </Col>
      </Row>
    </Container>
  )
}

export default Home

