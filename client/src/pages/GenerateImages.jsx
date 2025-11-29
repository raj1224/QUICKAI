import React, { useState } from 'react'
import { Sparkles, Image } from 'lucide-react'
import { useAuth } from "@clerk/clerk-react"
import axios from 'axios'
import toast from 'react-hot-toast'

axios.defaults.baseURL = import.meta.env.VITE_BASE_BASE_URL || "http://localhost:3000";

function GenerateImages() {

  const imageStyle = [
    'Realistic','Ghibli style','Anime style','Cartoon style',
    'Fantasy style','Realistic style','3D style','Portrait style'
  ];

  const [input,setInput] = useState('');
  const [selectedStyle,setSelectedStyle] = useState('Realistic');
  const [publish,setPublish] = useState(false);
  const [loading,setLoading] = useState(false);
  const [content,setContent] = useState('');

  const { getToken } = useAuth();

  const onSubmitHandler = async(e)=>{
    e.preventDefault();
    try {
      setLoading(true);
      const prompt = `Generate an image with description "${input}" in ${selectedStyle} style.`

      const token = await getToken();
      const {data} = await axios.post(
        "/api/ai/generate-image",
        { prompt, publish },
        { headers:{ Authorization:`Bearer ${token}`} }
      );

      if(data.success) setContent(data.content)
      else toast.error(data.message);

    } catch(error){
      toast.error(error.message);
    }
    setLoading(false);
  }

  return (
    <div className='h-full overflow-y-scroll p-6 flex items-start flex-wrap gap-4 text-slate-700'>

      {/* Left */}
      <form onSubmit={onSubmitHandler}
            className='w-full max-w-lg p-4 bg-white rounded-lg border border-gray-200'>
        
        <div className='flex items-center gap-3'>
          <Sparkles className='w-6 text-[#00AD25]'/>
          <h1 className='text-xl font-semibold'>AI Image Generator</h1>
        </div>

        <p className='mt-6 text-sm font-medium'>Describe Image</p>
        <textarea
          onChange={(e)=>setInput(e.target.value)}
          value={input}
          rows={4}
          className='w-full p-2 mt-2 text-sm border rounded-md outline-none'
          placeholder='Describe what you want generated...'
          required
        />

        <p className='mt-4 text-sm font-medium'>Style</p>
        <div className='mt-3 flex gap-3 flex-wrap'>
          {imageStyle.map((s)=>(
            <span key={s}
              onClick={()=>setSelectedStyle(s)}
              className={`text-xs px-4 py-1 border rounded-full cursor-pointer 
              ${selectedStyle===s ? 'bg-green-50 text-green-700' : 'text-gray-500 border-gray-300'}`}>
              {s}
            </span>
          ))}
        </div>

        <div className='my-6 flex items-center gap-2'>
          <label className='relative cursor-pointer'>
            <input type="checkbox"
              checked={publish}
              onChange={e=>setPublish(e.target.checked)}
              className='sr-only peer'
            />
            <div className='w-9 h-5 bg-slate-300 rounded-full peer-checked:bg-green-500 transition'/>
            <span className='absolute left-1 top-1 w-3 h-3 bg-white rounded-full
              peer-checked:translate-x-4 transition'/>
          </label>
          <p className='text-sm'>Make Public</p>
        </div>

        <button disabled={loading}
          className='w-full flex justify-center items-center gap-2 bg-gradient-to-r 
          from-[#00AD25] to-[#04FF50] text-white py-2 text-sm rounded-lg'>

          {loading
            ? <span className='w-4 h-4 border-2 border-t-transparent animate-spin rounded-full'/>
            : <Image className='w-5'/>}
          
          Generate Image
        </button>
      </form>

      {/* Right */}
      <div className='w-full max-w-lg p-4 bg-white border rounded-lg min-h-96'>
        <div className='flex items-center gap-3'>
          <Image className='w-5 text-[#00AD25]'/>
          <h1 className='text-xl font-semibold'>Generated Image</h1>
        </div>

        {!content ? (
          <div className='flex-1 flex justify-center items-center text-gray-400 text-sm'>
            <div className='flex flex-col items-center gap-5'>
              <Image className='w-9 h-9'/>
              <p>Describe something + click "Generate"</p>
            </div>
          </div>
        ) : (
          <img src={content} className='mt-3 w-full rounded-md'/>
        )}
      </div>

    </div>
  )
}

export default GenerateImages
