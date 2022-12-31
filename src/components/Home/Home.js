import React, {useState, useCallback, useEffect } from 'react'
import { Col, Container, Row } from 'react-bootstrap'
import { useDispatch, useSelector } from 'react-redux';
import useFetch from '../../hooks/useFetch';
import { inboxActions } from '../../store/InboxReducer';
import Compose from '../Mail/Compose';
import Menu from './Menu'
const Inbox = React.lazy(()=>import("../Mail/Inbox"))

const Home = () => {
  const [greet, setGreet] = useState(true);
  const [showCompose, setShowCompose] = useState(false);
  const [showSent, setShowSent] = useState(false);
  const [showInbox, setShowInbox] = useState(false);
  const email = useSelector(state=>state.auth.loginEmail);
  const [url, setUrl] = useState(`https://mailbox-client-d3ec8-default-rtdb.firebaseio.com/${email}Inbox.json`);
  const dispatch = useDispatch();
  

  const loadMails = useCallback((data) => {
      if(data){
        let mailData = Object.values(data).reverse();
        dispatch(inboxActions.clear())
        mailData.forEach(mail=>{
            if(mail.status==='unread'){
              dispatch(inboxActions.incrementUnread())
            }
        })
         dispatch(inboxActions.loadMails(mailData));
      }
    },[dispatch])

  let sendReq = useFetch({url:url}, loadMails)
  
  useEffect(()=>{
    let interval = setInterval(()=>{
      sendReq()
    }, 2000)
    return ()=>clearInterval(interval)
  },[sendReq])
  
  return (
    <Container fluid style={{paddingTop:'4rem'}} className='h-100'>
      <Row>
        <Col xs lg="3" style={{height:'100vh'}}>
          <Menu setUrl={setUrl} setGreet = {setGreet} setShowCompose = {setShowCompose} setShowInbox = {setShowInbox} setShowSent = {setShowSent}/>
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
            <Inbox loadMails = {loadMails} inbox={showInbox}/>
          }
          {showSent&&
            <Inbox loadMails = {loadMails} inbox={showInbox}/>
          }
        </Col>
      </Row>
    </Container>
  )
}

export default Home

