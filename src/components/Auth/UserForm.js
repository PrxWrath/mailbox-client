import React, {useRef, useState} from 'react'
import { Alert, Button, Container, FloatingLabel, Form } from 'react-bootstrap'

const UserForm = () => {

  const [alert, setAlert] = useState(<></>);
  const emailRef = useRef();
  const passwordRef = useRef();
  const confirmRef = useRef();

  const submitHandler = async(e) => {
    e.preventDefault();
      try{
        if(!emailRef.current.value && !passwordRef.current.value){
          setAlert(<Alert variant='danger'>Fill all the fields!</Alert>)
          setTimeout(()=>{setAlert(<></>)}, 3000)
        }
        else if(confirmRef.current.value !== passwordRef.current.value){
          setAlert(<Alert variant='danger'>Passwords don't match!</Alert>)
          setTimeout(()=>{setAlert(<></>)}, 3000)
        }
        else{
          const res = await fetch('https://identitytoolkit.googleapis.com/v1/accounts:signUp?key=AIzaSyDWuxuXtZ_8VFxBtWZW8gGGjJ_QcrjvOGo',{
            method:'POST',
            body:JSON.stringify({
              email:emailRef.current.value,
              password: passwordRef.current.value,
              returnSecureToken: true
            }),
            headers:{
              'Content-Type':'application/json'
            }
          })

          const data = await res.json();

          if(!res.ok){  
            throw new Error(data.error.errors[0].message)
          }else{
            setAlert(<Alert variant='danger'>Your account has been created. Please login with new account :)</Alert>)
            setTimeout(()=>{setAlert(<></>)}, 3000)
            console.log("User has successfully signed up")
          }

          emailRef.current.value = '';
          passwordRef.current.value = '';
          confirmRef.current.value = '';
        }
      }catch(err){
        setAlert(<Alert variant='danger'>{err.message}</Alert>)
        setTimeout(()=>{setAlert(<></>)}, 3000)
      }

  };

   return (
    <Container style={{paddingTop:'8rem'}}>
        <div className='w-50 mx-auto my-1'>
            {alert}
        </div>
        <div className='d-flex w-50 shadow-lg rounded mx-auto border border-danger'>
          <img src={require('../../resources/userFormBg.jpg')} alt='signup' className="w-50"/>
          <Form className='w-50 mx-auto p-3 my-1 text-danger' onSubmit={submitHandler}>
              <h3 className='mx-auto my-2 mb-3 w-50 border-bottom border-danger text-center'>Signup</h3>
              <FloatingLabel controlId='email' className='mb-3' label='Your Email'>
                  <Form.Control type='email' ref={emailRef}/>
              </FloatingLabel>
              <FloatingLabel controlId='password' className='mb-3' label='Your Password'>
                  <Form.Control type='password' ref={passwordRef}/>
              </FloatingLabel>
              <FloatingLabel controlId='confirm' className='mb-3' label='Confirm Password'>
                  <Form.Control type='password' ref={confirmRef}/>
              </FloatingLabel>

              <div className='my-2 w-100 text-center'>
                  <Button type='submit' variant='danger' size='md'>Create Account</Button>
              </div>
              <div className='my-2 w-100 text-center'>
                  <Button size='sm' variant='outline-danger'>Login with existing account</Button>
              </div>
          </Form>
        </div>
    </Container>
  )
}

export default UserForm