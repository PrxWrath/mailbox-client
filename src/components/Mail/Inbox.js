import React, { useEffect, useState } from 'react'
import { ListGroup, Button } from 'react-bootstrap';
import { useDispatch, useSelector } from 'react-redux'
import { inboxActions } from '../../store/InboxReducer';
import Reader from './Reader';

const Inbox = (props) => {
  const {loadMails, inbox} = props 
  const [toRead, setToRead] = useState({});
  const [showReader, setShowReader] = useState(false);
  const mails = useSelector(state=>state.inbox.mails)
  const unread = useSelector(state=>state.inbox.unread)
  const email = useSelector(state=>state.auth.loginEmail)
  const dispatch = useDispatch();
  
  useEffect(()=>{
    loadMails(false, inbox)
  },[dispatch, loadMails, inbox])

  const changeStatusHandler = async(mail) => {
    if(inbox){
        const readMail = {
            id: mail.id,
            at: mail.at,
            body: mail.body,
            subject: mail.subject,
            from: mail.from,
            status: 'read'
        }
        const res = await fetch(`https://mailbox-client-d3ec8-default-rtdb.firebaseio.com/${email}Inbox/mail${mail.id}.json`,{
            method:'PUT',
            body:JSON.stringify(readMail)
        })
        if(res.ok){
            dispatch(inboxActions.decrementUnread())
            loadMails(false, inbox);        
        }
    }
  }

  const readMailHandler = (mail) =>{
    if(inbox){
        setToRead({
            at: mail.at.substring(0,mail.at.indexOf('T')),
            from: mail.from,
            subject: mail.subject,
            body: mail.body
        })
    }else{
        setToRead({
            at: mail.at.substring(0,mail.at.indexOf('T')),
            to: mail.to,
            subject: mail.subject,
            body: mail.body
        })
    }
    setShowReader(true)
  }

  const deleteMailHandler = async(id) => {
    let res 
    if(inbox){
        res = await fetch(`https://mailbox-client-d3ec8-default-rtdb.firebaseio.com/${email}Inbox/mail${id}.json`,{
            method:'DELETE'
        }) 
    }else{
        res = await fetch(`https://mailbox-client-d3ec8-default-rtdb.firebaseio.com/${email}Sent/mail${id}.json`,{
            method:'DELETE'
        })
    }

    if(res.ok){
        loadMails(false, inbox);
    }
  }
  
  return (
    <>
        {showReader?
            <Reader mail={toRead} setShowMail={setShowReader} inbox={inbox}/>
            :
            <>
                <h3 className='w-100 mb-3 border-bottom border-dark text-danger p-1'>
                    <svg xmlns="http://www.w3.org/2000/svg" width="25" height="25" fill="currentColor" className="mx-1 bi bi-envelope" viewBox="0 0 16 16">
                        <path d="M0 4a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2H2a2 2 0 0 1-2-2V4Zm2-1a1 1 0 0 0-1 1v.217l7 4.2 7-4.2V4a1 1 0 0 0-1-1H2Zm13 2.383-4.708 2.825L15 11.105V5.383Zm-.034 6.876-5.64-3.471L8 9.583l-1.326-.795-5.64 3.47A1 1 0 0 0 2 13h12a1 1 0 0 0 .966-.741ZM1 11.105l4.708-2.897L1 5.383v5.722Z"/>
                    </svg>
                    {inbox?`Your Inbox (${unread})`:'Sent Box'}
                </h3>
                <ListGroup className='w-100 my-2 border border-dark rounded p-2 mh-75' style={{overflowY:'scroll', overflowX:'hidden'}}>
                    {mails.length&&mails.map(mail=>{
                        return(
                            <div className='d-flex w-100'>
                                <ListGroup.Item 
                                    key={mail.id} 
                                    id={mail.id} 
                                    onClick={()=>{
                                        if(mail.status==='unread'){changeStatusHandler(mail)}
                                        readMailHandler(mail)
                                    }} 
                                    className={`w-100 d-flex justify-content-between shadow-sm p-2 border border-danger mb-2 rounded text-danger`}
                                    style={{cursor:'pointer'}}
                                    >
                                    {inbox&&<>
                                        {mail.status==='unread'?
                                            <svg xmlns="http://www.w3.org/2000/svg" width="25" height="25" fill="currentColor" className="mx-1 bi bi-envelope-exclamation-fill" viewBox="0 0 16 16">
                                                <path d="M.05 3.555A2 2 0 0 1 2 2h12a2 2 0 0 1 1.95 1.555L8 8.414.05 3.555ZM0 4.697v7.104l5.803-3.558L0 4.697ZM6.761 8.83l-6.57 4.026A2 2 0 0 0 2 14h6.256A4.493 4.493 0 0 1 8 12.5a4.49 4.49 0 0 1 1.606-3.446l-.367-.225L8 9.586l-1.239-.757ZM16 4.697v4.974A4.491 4.491 0 0 0 12.5 8a4.49 4.49 0 0 0-1.965.45l-.338-.207L16 4.697Z"/>
                                                <path d="M12.5 16a3.5 3.5 0 1 0 0-7 3.5 3.5 0 0 0 0 7Zm.5-5v1.5a.5.5 0 0 1-1 0V11a.5.5 0 0 1 1 0Zm0 3a.5.5 0 1 1-1 0 .5.5 0 0 1 1 0Z"/>
                                            </svg>
                                        :
                                            <svg xmlns="http://www.w3.org/2000/svg" width="25" height="25" fill="currentColor" className="mx-1 bi bi-envelope-open" viewBox="0 0 16 16">
                                                <path d="M8.47 1.318a1 1 0 0 0-.94 0l-6 3.2A1 1 0 0 0 1 5.4v.817l5.75 3.45L8 8.917l1.25.75L15 6.217V5.4a1 1 0 0 0-.53-.882l-6-3.2ZM15 7.383l-4.778 2.867L15 13.117V7.383Zm-.035 6.88L8 10.082l-6.965 4.18A1 1 0 0 0 2 15h12a1 1 0 0 0 .965-.738ZM1 13.116l4.778-2.867L1 7.383v5.734ZM7.059.435a2 2 0 0 1 1.882 0l6 3.2A2 2 0 0 1 16 5.4V14a2 2 0 0 1-2 2H2a2 2 0 0 1-2-2V5.4a2 2 0 0 1 1.059-1.765l6-3.2Z"/>
                                            </svg>
                                        }
                                    </>
                                    }
                                    <h5 className='me-auto'>{inbox?`From: ${mail.from}`:`To: ${mail.to}`}</h5>
                                    <p className='fw-bold me-auto'>{mail.subject}</p>
                                    <p className='text-secondary'>{mail.at.substring(0, mail.at.indexOf('T'))}</p>
                                </ListGroup.Item> 
                                <Button variant='outline-danger' size='sm' className='mx-1 h-50' onClick={()=>{deleteMailHandler(mail.id)}}>
                                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-trash-fill" viewBox="0 0 16 16">
                                        <path d="M2.5 1a1 1 0 0 0-1 1v1a1 1 0 0 0 1 1H3v9a2 2 0 0 0 2 2h6a2 2 0 0 0 2-2V4h.5a1 1 0 0 0 1-1V2a1 1 0 0 0-1-1H10a1 1 0 0 0-1-1H7a1 1 0 0 0-1 1H2.5zm3 4a.5.5 0 0 1 .5.5v7a.5.5 0 0 1-1 0v-7a.5.5 0 0 1 .5-.5zM8 5a.5.5 0 0 1 .5.5v7a.5.5 0 0 1-1 0v-7A.5.5 0 0 1 8 5zm3 .5v7a.5.5 0 0 1-1 0v-7a.5.5 0 0 1 1 0z"/>
                                    </svg>
                                </Button> 
                            </div>          
                        )
                    })}
                </ListGroup>
        </>}
    </>
  )
}

export default React.memo(Inbox)