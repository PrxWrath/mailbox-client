import React, {useRef, useState} from 'react'
import { Alert, Button, Container, FloatingLabel, Form } from 'react-bootstrap'
import { useDispatch } from 'react-redux';
import { authActions } from '../../store/AuthReducer';
import { NavLink, useHistory } from 'react-router-dom';
import Loader from '../Layout/Loader';

const UserForm = () => {

  const [alert, setAlert] = useState(<></>);
  const [login, setLogin] = useState(false);
  const [forgot, setForgot] = useState(false);
  const [loading, setLoading] = useState(false);
  const dispatch = useDispatch();
  const history = useHistory();
  const emailRef = useRef();
  const passwordRef = useRef();
  const confirmRef = useRef();
 
  const toggleLoginHandler = () => {
    setLogin(prev=>!prev);
  }

  const togglePasswordReset = () => {
    setForgot(prev=>!prev);
  }

  const submitHandler = async(e) => {
    e.preventDefault();
      if(!login){
        try{
          if(!emailRef.current.value && !passwordRef.current.value){
            setAlert(<Alert variant='warning'>Fill all the fields!</Alert>)
            setTimeout(()=>{setAlert(<></>)}, 3000)
          }
          else if(confirmRef.current.value !== passwordRef.current.value){
            setAlert(<Alert variant='warning'>Passwords don't match!</Alert>)
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
          setAlert(<Alert variant='warning'>{err.message}</Alert>)
          setTimeout(()=>{setAlert(<></>)}, 3000)
        }
      }else{
        try{
          if(!emailRef.current.value && !passwordRef.current.value){
            setAlert(<Alert variant='warning'>Fill all the fields!</Alert>)
            setTimeout(()=>{setAlert(<></>)}, 3000)
          }
          else{
            const res = await fetch('https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=AIzaSyDWuxuXtZ_8VFxBtWZW8gGGjJ_QcrjvOGo',{
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
              dispatch(authActions.login({token:data.idToken, email:data.email.replace('@','').replace('.','')}));
              history.replace('/')
            }

            emailRef.current.value = '';
            passwordRef.current.value = '';
          }
        }catch(err){
          setAlert(<Alert variant='warning'>{err.message}</Alert>)
          setTimeout(()=>{setAlert(<></>)}, 3000)
        }

      }
    
  };

  const passwordResetHandler = async() => {
    setLoading(true);
    try{
      const res = await fetch('https://identitytoolkit.googleapis.com/v1/accounts:sendOobCode?key=AIzaSyDWuxuXtZ_8VFxBtWZW8gGGjJ_QcrjvOGo',{
        method:'POST',
        body:JSON.stringify({
            requestType: 'PASSWORD_RESET',
            email: emailRef.current.value
        }),
        headers:{
            'Content-Type':'application/json'
        }
      })
      const data = await res.json();
      if(!res.ok){
        throw new Error(data.error.errors[0].message)
      }else{
        setAlert(<Alert variant='danger'>Password reset link sent to your email :)</Alert>)
        setTimeout(()=>{setAlert(<></>)}, 3000)
        emailRef.current.value = '';
      }
    }catch(err){
      setAlert(<Alert variant='warning'>{err.message}</Alert>)
      setTimeout(()=>{setAlert(<></>)}, 3000)
    }
    setLoading(false);
        
  }

   return (
    <Container style={{paddingTop:'8rem'}}>
        <div className='w-50 mx-auto my-1'>
            {alert}
        </div>
        <div className='d-flex w-50 shadow-lg rounded mx-auto border border-danger'>
          <img src={require('../../resources/userFormBg.jpg')} alt='signup bg' className="w-50"/>
          <Form className='w-50 mx-auto p-3 my-1 text-danger' onSubmit={submitHandler}>
              {!forgot?
              <>
                <h3 className='mx-auto my-2 mb-3 w-50 border-bottom border-danger text-center'>{login?'Login':'Signup'}</h3>
                <FloatingLabel controlId='email' className='mb-3' label='Your Email'>
                    <Form.Control type='email' ref={emailRef}/>
                </FloatingLabel>
                <FloatingLabel controlId='password' className='mb-3' label='Your Password'>
                    <Form.Control type='password' ref={passwordRef}/>
                </FloatingLabel>
                {!login&&
                <FloatingLabel controlId='confirm' className='mb-3' label='Confirm Password'>
                    <Form.Control type='password' ref={confirmRef}/>
                </FloatingLabel>
                }
                
                <div className='my-2 w-100 text-center'>
                    <Button type='submit' variant='danger' size='md'>{login?'Login':'Create Account'}</Button>
                </div>
                {login&&
                <div className='my-2 w-100 text-center'>
                  <NavLink to='#' onClick={togglePasswordReset} className='text-danger'>Forgot Password?</NavLink>
                </div>
                }
                <div className='my-2 w-100 text-center'>
                    <Button onClick={toggleLoginHandler} size='sm' variant='outline-danger'>{login?'Create new account':'Login with existing account'}</Button>
                </div>
              </>
              :
              <>
                <h3 className='mx-auto my-2 mb-5 w-75 border-bottom border-danger text-center'>Forgot Password?</h3>
                <Form.Group className='mb-5'>
                  <Form.Label className='mb-1'>Enter you registered email id</Form.Label> 
                  <Form.Control type='email' ref={emailRef}/>
                </Form.Group>
                {!loading?
                  <Loader className='my-2'/>
                  :
                  <div className='my-2 w-100 text-center'>
                      <Button onClick={passwordResetHandler} variant='danger' size='md'>Send Link</Button>
                  </div>
                }
                <div className='my-2 w-100 text-center'>
                    <Button variant='outline-danger' size='md' onClick={togglePasswordReset}>Back to Login</Button>
                </div>
              </>
            }
          </Form>
        </div>
    </Container>
  )
}

export default UserForm