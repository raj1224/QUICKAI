import React, { useState } from 'react'
import { Eraser, Sparkles, Scissors } from 'lucide-react';
import axios from 'axios';
import toast from 'react-hot-toast';
import { useAuth } from '@clerk/clerk-react';   // 🔥 FIX ADDED

axios.defaults.baseURL = import.meta.env.VITE_BASE_URL || 'http://localhost:3000';

function RemoveObject() {
  const [input,setInput]=useState('');
  const [object,setObject]=useState('');
  const [loading,setLoading]=useState(false);
  const [content,setContent]=useState('');
  
  const { getToken } = useAuth();

  const onSubmitHandler = async (e)=>{
    e.preventDefault();
    setLoading(true);

    if(object.trim().split(" ").length > 1){
      toast.error("Please enter only one object name");
      setLoading(false);      // 🔥 prevent infinite loader
      return;
    }

    try {
      const formData = new FormData();
      formData.append('image',input);
      formData.append('object',object);

      const {data} = await axios.post('/api/ai/remove-image-object',formData,{
        headers:{ Authorization:`Bearer ${await getToken()}` }
      });

      if(data.success){
        setContent(data.content);
      }else toast.error(data.message);

    } catch (error) {
      toast.error(error.message);

    }
    setLoading(false);
  }

  return (
    <div className='h-full overflow-y-scroll p-6 flex items-start flex-wrap gap-4 text-slate-700'>

      {/* LEFT SECTION */}
      <form onSubmit={onSubmitHandler} className='w-full max-w-lg p-4 bg-white rounded-lg border border-gray-200'>
        <div className='flex items-center gap-3'>
          <Sparkles className='w-6 text-[#4A7AFF]'/>
          <h1 className='text-xl font-semibold'>Object Removal</h1>
        </div>

        <p className='mt-6 text-sm font-medium'>Upload Image</p>
        <input type="file" accept="image/*" required
         onChange={(e)=>setInput(e.target.files[0])}
         className='w-full text-gray-600 p-2 px-3 mt-2 outline-none text-sm rounded-md border border-gray-300' />

        <p className='mt-6 text-sm font-medium'>Object Name</p>
        <textarea value={object} required
         onChange={(e)=>setObject(e.target.value)}
         rows={4} placeholder='example: watch (only one word)'
         className='w-full p-2 px-3 mt-2 outline-none text-sm rounded-md border border-gray-300'/>

        <button disabled={loading} 
         className='w-full flex justify-center items-center gap-2 bg-gradient-to-r from-[#417DF6] to-[#8E37EB] text-white px-4 py-2 mt-6 text-sm rounded-lg'>

          { loading
            ? <span className='w-4 h-4 border-2 border-t-transparent rounded-full animate-spin'></span>
            : <Scissors className='w-5'/>   // 🔥 only one icon now
          }

          Remove Object
        </button>
      </form>


      {/* RIGHT SECTION */}
      <div className='w-full max-w-lg p-4 bg-white rounded-lg flex flex-col border border-gray-200 min-h-96'>
        <div className='flex items-center gap-3'>
          <Scissors className='w-5 h-5 text-[#4A7AFF]'/>
          <h1 className='text-xl font-semibold'>Processed Image</h1>
        </div>

        {!content ? (
          <div className='flex-1 flex justify-center items-center text-gray-400 flex-col gap-5'>
            <Scissors className='w-9 h-9'/>
            <p>Upload image → Enter object → Click "Remove"</p>
          </div>
        ) : (
          <img src={content} alt="result" className='mt-3 w-full h-full' />
        )}
      </div>
    </div>
  )
}

export default RemoveObject;
