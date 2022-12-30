import React from 'react'
import parse from 'html-react-parser'
import { Button } from 'react-bootstrap'

const Reader = (props) => {
  const {mail, setShowMail, inbox} = props 
  return (
    <>
        <h5 className='text-danger w-100 border-bottom border-dark p-2 mb-3 d-flex'>
            {inbox?`From:${mail.from}`:`To:${mail.to}`} 
            <p className='text-secondary ms-auto'>{mail.at}</p>
        </h5>
        <div className='w-75 mx-auto h-75 shadow-lg border border-danger p-2'>
            <h5 className='d-flex w-100 bg-danger text-light p-2' style={{height:'10%'}}>
                {mail.subject}
                <Button variant='outline-light' className='ms-auto fw-bold' onClick={()=>{setShowMail(false)}}>Close X</Button>
            </h5>
            <div className='w-100 p-2 border border-danger rounded' style={{overflow:'scroll', height:'87%'}}>
                {parse(mail.body)}
            </div>
        </div>
    </>
  )
}

export default Reader