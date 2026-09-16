import React, { useState } from 'react';
import NavBar from '../components/NavBar';
import BottomNav from '../components/BottomNav';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';
import { apiRequest } from '../api';



const Create = () => {

  const [caption, setCaption] = useState("");
  const [image, setImage] = useState("");
  const [mode, setMode] = useState('post');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const navigate = useNavigate();

  const create = async () => {
    if (image === "") {
      toast.error("Choose an image to share");
      return;
    }

    let formData = new FormData();
    formData.append("image", image);
    formData.append("caption", caption);
    formData.append("token", localStorage.getItem("token"))

    try {
      setIsSubmitting(true);
      await apiRequest(mode === 'post' ? '/createPost' : '/createStory', { method: 'POST', body: formData });
      toast.success(mode === 'post' ? 'Post created successfully' : 'Story shared for 24 hours');
      navigate('/');
    } catch (error) {
      toast.error(error.message);
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <>
      <NavBar />
      <div className="create mx-auto w-full max-w-3xl px-2.5 pb-20">
        <div className="mb-5 flex items-center justify-between"><h1 className='text-xl'>{mode === 'post' ? 'Create post' : 'Create story'}</h1><div className="flex rounded-lg border border-[#27272a] p-1"><button type="button" onClick={() => setMode('post')} className={`rounded-md px-3 py-1 text-sm ${mode === 'post' ? 'bg-white text-black' : 'text-gray-400'}`}>Post</button><button type="button" onClick={() => setMode('story')} className={`rounded-md px-3 py-1 text-sm ${mode === 'story' ? 'bg-pink-500 text-white' : 'text-gray-400'}`}>Story</button></div></div>
        <input className='w-full rounded-md border border-[#27272a] bg-[#121212] p-2.5' onChange={(e) => { setImage(e.target.files[0]) }} type="file" id='file' required />
        <div className="inputBox mt-4">
          <textarea onChange={(e) => { setCaption(e.target.value) }} value={caption} placeholder='Caption' required></textarea>
        </div>
        <button className="btnNormal mt-2 w-full disabled:opacity-60" onClick={create} disabled={isSubmitting}>{isSubmitting ? 'Sharing...' : mode === 'post' ? 'Create post' : 'Share story'}</button>
      </div>

      <BottomNav />
    </>
  )
}

export default Create;