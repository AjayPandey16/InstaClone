import React, { useState } from 'react'
import logo from '../images/logo.png'
import { Link } from 'react-router-dom';
import { toast } from 'react-toastify';

const SignUp = () => {

    const SignUp = () => {
     
        const [username, setUsername] = useState('');
        const [name, setName] = useState('');
        const [email, setEmail] = useState('');
        const [password, setPassword] = useState('');
    
        const SubmitForm = (e) => {
            e.preventDefault();
            fetch (api_base_url + "/signUp",{
      mode: "cors",
      method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          Username: username,
          Name: name,
          Email: email,
          Password: password,
        })

        }).then(res => res.json()).then(data => {
          if(data.success){
            alert("Account created successfully");
            window.location.href = "/login";
          }
          else{
          toast.error(data.msg);
          } 
      })
        };   


         return (
        <>
        <div className='w-full h-screen flex flex-col justify-center items-center bg-black gap-6'>
           <form onSubmit={SubmitForm} className='flex flex-col gap-4 bg-gray-900 p-6 rounded-lg shadow-lg w-[350px]'>
                <img className='w [150px] object-cover' src={logo} alt='' />
           
           <div className='inputBox'>
            <input onChange={(e)=>{setUsername(e.target.value)}} value={username} type='text' placeholder='Username' required />
            </div>

            <div className='inputBox'>
                        <input onChange={(e)=>{setName(e.target.value)}} value={name} type='text' placeholder='Name' required />
                        </div>

            <div className='inputBox'>
                        <input onChange={(e)=>{setEmail(e.target.value)}} value={email} type='email' placeholder='Email' required />
                        </div>

            <div className='inputBox'>
                        <input onChange={(e)=>{setPassword(e.target.value)}} value={password} type='password' placeholder='Password' required />
                        </div>

                        <p className='text-[14px] text-gray-100 self-start'> Already have an account
                         <Link to="/login" className='text-[#3797EF]'> Login</Link></p>
           
           <button className='btnNormal w-full mt-4' type='submit'> Sign Up</button>
           </form>
        </div>
        </>
    )
}
}
export default SignUp
    