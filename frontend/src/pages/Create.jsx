import React, { useState } from 'react';
import NavBar from '../components/NavBar';
import BottomNav from '../components/BottomNav';
import { api_base_url } from '../helper';
import { toast } from 'react-toastify';



const Create = () => {

  const [caption, setCaption] = useState("");
  const [image, setImage] = useState("");

  const create = () => {
    if (caption === "" || image === "") {
      toast.error("Please fill all the fields");
      return;
    }

    let formData = new FormData();
    formData.append("image", image);
    formData.append("caption", caption);
    formData.append("token", localStorage.getItem("token"))

    fetch(api_base_url + "/createPost", {
      mode: "cors",
      method: "POST",
      body: formData
    }).then(res => res.json()).then(data => {
      if (data.success) {
        toast.success("Post Created Successfully... !")
      }
      else {
        toast.error(data.msg)
      }
    })
  }

  return (
    <>
      <NavBar />
      <div className="create mx-auto w-full max-w-3xl px-2.5 pb-20">
        <h1 className='mb-5 text-xl'>Create</h1>
        <input className='w-full rounded-md border border-[#27272a] bg-[#121212] p-2.5' onChange={(e) => { setImage(e.target.files[0]) }} type="file" id='file' required />
        <div className="inputBox mt-4">
          <textarea onChange={(e) => { setCaption(e.target.value) }} value={caption} placeholder='Caption' required></textarea>
        </div>
        <button className="btnNormal mt-2 w-full" onClick={create}>Create</button>
      </div>

      <BottomNav />
    </>
  )
}

export default Create;