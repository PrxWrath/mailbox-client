import React, { useState, useEffect, useRef } from 'react'
import {Editor} from 'react-draft-wysiwyg'
import {EditorState, convertToRaw} from 'draft-js'
import draftToHtml from 'draftjs-to-html'
import { Alert, Button, Col, Form, Row } from 'react-bootstrap'
import 'react-draft-wysiwyg/dist/react-draft-wysiwyg.css'
import { useSelector } from 'react-redux'

const Compose = () => {
  const[editorState, setEditorState] = useState(EditorState.createEmpty());
  const [alert, setAlert] = useState(<></>);
  const [msgBody, setMsgBody] = useState('');
  const email = useSelector(state=>state.auth.loginEmail);
  const sendTo = useRef();
  const subject = useRef();
  
  const editorChangeHandler = (editorState) => {
    setEditorState(editorState)
  }

  useEffect(()=>{
    setMsgBody(draftToHtml(convertToRaw(editorState.getCurrentContent())))
  }, [editorState,msgBody])

  const sendMailHandler = async() => {
    try{
        if(!subject.current.value || !sendTo.current.value){
            throw new Error('Please fill all fields');
        }
        if(!sendTo.current.value.includes('@')){
            throw new Error('Enter a valid email address')
        }
        let sentMail = {
            id: new Date().getTime(),
            at: new Date(),
            to: sendTo.current.value,
            subject: subject.current.value,
            body: msgBody
        }
        let recMail = {
            id: new Date().getTime(),
            at: new Date(),
            from: email,
            subject: subject.current.value,
            body: msgBody,
            status: 'unread'
        }
        let receiver = sentMail.to.replace('@', '').replace('.', '');
        //create sent entry
        let sentRes = await fetch(`https://mailbox-client-d3ec8-default-rtdb.firebaseio.com/${email}Sent/mail${sentMail.id}.json`,{
            method:'PUT',
            body:JSON.stringify(sentMail),
        })
        //create inbox entry
        let recRes = await fetch(`https://mailbox-client-d3ec8-default-rtdb.firebaseio.com/${receiver}Inbox/mail${recMail.id}.json`,{
            method:'PUT',
            body:JSON.stringify(recMail),
        })

        if(!sentRes.ok && !recRes.ok){
            throw new Error('Could not send your email :(');
        }
        else{
            setAlert(<Alert variant='success'>Mail sent to {sendTo.current.value} :)</Alert>);
            setTimeout(()=>{setAlert(<></>)}, 2000);
        }
    }catch(err){
        setAlert(<Alert variant='warning'>{err.message}</Alert>)
        setTimeout(()=>{setAlert(<></>)},2000);
    }
  }

  return (
    <div className='my-1'>
        <h3 className='w-100 mb-4 border-bottom border-dark text-danger p-2'>Compose Mail</h3>
        {alert}
        <Form>
            <Form.Group as={Row} className='mb-3'>
                <Form.Label className='fw-bold text-danger text-center' column xs lg='2'><h5>Send To:</h5></Form.Label>
                <Col xs lg='6'>
                    <Form.Control className='border border-danger' type='email' id='toEmail'ref={sendTo}/>
                </Col>
            </Form.Group>
            <Form.Group as={Row} className='mb-3'>
                <Form.Label className='fw-bold text-danger text-center' column xs lg='2'><h5>Subject:</h5></Form.Label>
                <Col xs lg='6'>
                    <Form.Control className='border border-danger' type='text' id='subject' ref={subject}/>
                </Col>
            </Form.Group>   
        </Form>
        
        <div className='d-flex w-100'>
            
            <Button onClick={sendMailHandler} variant='danger' size='lg' style={{width:'8rem',height:'2.8rem'}}>
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="mx-1 bi bi-send-fill" viewBox="0 0 16 16">
                    <path d="M15.964.686a.5.5 0 0 0-.65-.65L.767 5.855H.766l-.452.18a.5.5 0 0 0-.082.887l.41.26.001.002 4.995 3.178 3.178 4.995.002.002.26.41a.5.5 0 0 0 .886-.083l6-15Zm-1.833 1.89L6.637 10.07l-.215-.338a.5.5 0 0 0-.154-.154l-.338-.215 7.494-7.494 1.178-.471-.47 1.178Z"/>
                </svg>
                Send
            </Button>
            
            <Editor
                editorState={editorState}
                wrapperClassName='wrapperClassName w-75 mx-auto'
                toolbarClassName='toolbarClassName bg-danger rounded p-1'
                editorClassName='editorClassName'
                onEditorStateChange={editorChangeHandler}
                editorStyle={{height:'70vh'}}
                toolbar={{
                    options: ['inline','blockType', 'fontSize', 'fontFamily', 'list', 'textAlign', 'history'],
                    inline:{
                        options:['bold', 'italic', 'underline'],
                        className:'mx-2',
                    },
                    list:{
                        className:'mx-2',
                        options:['unordered', 'ordered'],
                    },
                    textAlign:{
                        className:'mx-2',
                    },
                    history:{
                        className:'mx-2',
                    }
                }}
            />
        </div>
    </div>
  )
}

export default Compose