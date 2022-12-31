import React from 'react'
import { Button } from 'react-bootstrap'
import { useSelector } from 'react-redux'

const Menu = (props) => {
  const email = useSelector(state=>state.auth.loginEmail)
  const unread = useSelector(state=>state.inbox.unread);
  const toggleCompose = () => {
    props.setGreet(false);
    props.setShowInbox(false);
    props.setShowSent(false);
    props.setShowCompose(prev=>!prev);  
  }

  const toggleInbox = () => {
    props.setUrl(`https://mailbox-client-d3ec8-default-rtdb.firebaseio.com/${email}Inbox.json`)
    props.setGreet(false);
    props.setShowCompose(false);
    props.setShowSent(false);
    props.setShowInbox(prev=>!prev);  
  }
  
  const toggleSent = () => {
    props.setUrl(`https://mailbox-client-d3ec8-default-rtdb.firebaseio.com/${email}Sent.json`)
    props.setGreet(false);
    props.setShowCompose(false);
    props.setShowInbox(false);
    props.setShowSent(prev=>!prev);  
  }

  return (
    <div className='d-flex flex-column h-100 p-3' style={{borderRight:'2px solid crimson'}}>
        <Button variant='danger' size='lg' className='my-3' onClick={toggleCompose}>
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-pencil-fill" viewBox="0 0 16 16">
                <path d="M12.854.146a.5.5 0 0 0-.707 0L10.5 1.793 14.207 5.5l1.647-1.646a.5.5 0 0 0 0-.708l-3-3zm.646 6.061L9.793 2.5 3.293 9H3.5a.5.5 0 0 1 .5.5v.5h.5a.5.5 0 0 1 .5.5v.5h.5a.5.5 0 0 1 .5.5v.5h.5a.5.5 0 0 1 .5.5v.207l6.5-6.5zm-7.468 7.468A.5.5 0 0 1 6 13.5V13h-.5a.5.5 0 0 1-.5-.5V12h-.5a.5.5 0 0 1-.5-.5V11h-.5a.5.5 0 0 1-.5-.5V10h-.5a.499.499 0 0 1-.175-.032l-.179.178a.5.5 0 0 0-.11.168l-2 5a.5.5 0 0 0 .65.65l5-2a.5.5 0 0 0 .168-.11l.178-.178z"/>
            </svg>
            Compose
        </Button>
        <Button variant='outline-danger' size='md' className='my-1 fw-bold' onClick={toggleInbox}>
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="mx-1 bi bi-inbox-fill" viewBox="0 0 16 16">
                <path d="M4.98 4a.5.5 0 0 0-.39.188L1.54 8H6a.5.5 0 0 1 .5.5 1.5 1.5 0 1 0 3 0A.5.5 0 0 1 10 8h4.46l-3.05-3.812A.5.5 0 0 0 11.02 4H4.98zm-1.17-.437A1.5 1.5 0 0 1 4.98 3h6.04a1.5 1.5 0 0 1 1.17.563l3.7 4.625a.5.5 0 0 1 .106.374l-.39 3.124A1.5 1.5 0 0 1 14.117 13H1.883a1.5 1.5 0 0 1-1.489-1.314l-.39-3.124a.5.5 0 0 1 .106-.374l3.7-4.625z"/>
            </svg>
            Inbox
            {unread>0&&<span className='mx-1 bg-danger text-light rounded-circle p-1'>{unread}</span>}
        </Button>
        <Button variant='outline-danger' size='md' className='my-1 fw-bold' onClick={toggleSent}>
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="mx-1 bi bi-send-fill" viewBox="0 0 16 16">
                <path d="M15.964.686a.5.5 0 0 0-.65-.65L.767 5.855H.766l-.452.18a.5.5 0 0 0-.082.887l.41.26.001.002 4.995 3.178 3.178 4.995.002.002.26.41a.5.5 0 0 0 .886-.083l6-15Zm-1.833 1.89L6.637 10.07l-.215-.338a.5.5 0 0 0-.154-.154l-.338-.215 7.494-7.494 1.178-.471-.47 1.178Z"/>
            </svg>
            Sent
        </Button>
    </div>
  )
}

export default Menu