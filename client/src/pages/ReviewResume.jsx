import React, { useState } from 'react'
import { Sparkles, FileText } from 'lucide-react'
import axios from 'axios'
import toast from 'react-hot-toast'
import { useAuth } from '@clerk/clerk-react'       // 🔥 FIX
import Markdown from "react-markdown";             // 🔥 FIX

axios.defaults.baseURL = import.meta.env.VITE_BASE_URL || 'http://localhost:3000';

function ReviewResume() {
  const [input, setInput] = useState(null);
  const [loading, setLoading] = useState(false);
  const [content, setContent] = useState('');

  const { getToken } = useAuth();

  const onSubmitHandler = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);

      if (!input) return toast.error("Upload resume first!");

      const formData = new FormData();
      formData.append("resume", input);

      const { data } = await axios.post("/api/ai/resume-review", formData, {
        headers: { Authorization: `Bearer ${await getToken()}` }
      });

      data.success ? setContent(data.content) : toast.error(data.message)

    } catch (error) {
      toast.error(error.message)
    }
    setLoading(false);
  }

  return (
    <div className='h-full overflow-y-scroll p-6 flex items-start flex-wrap gap-4 text-slate-700'>
      
      {/* LEFT SIDE */}
      <form onSubmit={onSubmitHandler} className='w-full max-w-lg p-4 bg-white rounded-lg border border-gray-200'>
        <div className='flex items-center gap-3'>
          <Sparkles className='w-6 text-[#00DA83]'/>
          <h1 className='text-xl font-semibold'>Resume Review</h1>
        </div>

        <p className='mt-6 text-sm font-medium'>Upload PDF Resume</p>
        <input type="file" accept='application/pdf'
         onChange={(e)=>setInput(e.target.files[0])}
         required
         className='w-full p-2 mt-2 text-sm border rounded-md'/>

        <button disabled={loading}
         className='w-full flex justify-center items-center gap-2 bg-gradient-to-r from-[#00DA83] to-[#009BB3] text-white px-4 py-2 mt-6 text-sm rounded-lg'>
          {loading
            ? <span className='w-4 h-4 border-2 border-t-transparent rounded-full animate-spin'></span>
            : <FileText className='w-5'/>
          }
          Review Resume
        </button>
      </form>

      {/* RIGHT SIDE - OUTPUT */}
      <div className='w-full max-w-lg p-4 bg-white rounded-lg border min-h-96 max-h-[600px] overflow-y-scroll'>
        <div className='flex items-center gap-3'>
          <FileText className='w-5 text-[#00DA83]'/>
          <h1 className='text-xl font-semibold'>Analysis Result</h1>
        </div>

        {!content ? (
          <div className='flex-1 flex justify-center items-center text-gray-400'>
            <div className='text-sm flex flex-col items-center gap-3 mt-10'>
              <FileText className='w-9'/>
              <p>Upload resume and click review to get AI evaluation.</p>
            </div>
          </div>
        ) : (
          <div className='mt-4 text-sm text-slate-700 leading-relaxed'>
            <Markdown>{content}</Markdown>
          </div>
        )}
      </div>
    </div>
  )
}

export default ReviewResume
