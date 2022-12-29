import React, { useEffect } from 'react'
import { ListGroup } from 'react-bootstrap';
import { useDispatch, useSelector } from 'react-redux'
import { inboxActions } from '../../store/InboxReducer';

const Inbox = (props) => {
  const {loadMails} = props 
  const mails = useSelector(state=>state.inbox.mails)
  const unread = useSelector(state=>state.inbox.unread)
  const email = useSelector(state=>state.auth.loginEmail)
  const dispatch = useDispatch();
  
  useEffect(()=>{
    loadMails(false)
  },[dispatch, loadMails])

  const changeStatusHandler = async(mail) => {
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
    }
  }

  return (
    <>
        <h3 className='w-100 mb-3 border-bottom danger text-danger p-1'>
            <svg xmlns="http://www.w3.org/2000/svg" width="25" height="25" fill="currentColor" className="mx-1 bi bi-envelope" viewBox="0 0 16 16">
                <path d="M0 4a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2H2a2 2 0 0 1-2-2V4Zm2-1a1 1 0 0 0-1 1v.217l7 4.2 7-4.2V4a1 1 0 0 0-1-1H2Zm13 2.383-4.708 2.825L15 11.105V5.383Zm-.034 6.876-5.64-3.471L8 9.583l-1.326-.795-5.64 3.47A1 1 0 0 0 2 13h12a1 1 0 0 0 .966-.741ZM1 11.105l4.708-2.897L1 5.383v5.722Z"/>
            </svg>
            {`Your Inbox   (${unread})`}
        </h3>
        <ListGroup className='w-100 my-2 border border-danger rounded p-2 mh-75' style={{overflowY:'scroll', overflowX:'hidden'}}>
            {mails.length&&mails.map(mail=>{
                return(
                    <ListGroup.Item 
                        key={mail.id} 
                        id={mail.id} 
                        onClick={()=>{changeStatusHandler(mail)}} 
                        className={`d-flex justify-content-between text-light p-2 ${mail.status==='unread'?'bg-danger':'bg-secondary'}`}
                        style={{cursor:'pointer'}}
                        >
                        <svg xmlns="http://www.w3.org/2000/svg" width="25" height="25" fill="currentColor" className="mx-1 bi bi-envelope" viewBox="0 0 16 16">
                            <path d="M0 4a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2H2a2 2 0 0 1-2-2V4Zm2-1a1 1 0 0 0-1 1v.217l7 4.2 7-4.2V4a1 1 0 0 0-1-1H2Zm13 2.383-4.708 2.825L15 11.105V5.383Zm-.034 6.876-5.64-3.471L8 9.583l-1.326-.795-5.64 3.47A1 1 0 0 0 2 13h12a1 1 0 0 0 .966-.741ZM1 11.105l4.708-2.897L1 5.383v5.722Z"/>
                        </svg>
                        <h5 className='me-auto'>From: {mail.from}</h5>
                        <p className='fw-bold me-auto'>{mail.subject}</p>
                        <p>{mail.at.substring(0, mail.at.indexOf('T'))}</p>
                    </ListGroup.Item>            
                )
            })}
        </ListGroup>
    </>
  )
}

export default Inbox