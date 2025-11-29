import React ,{useState} from 'react'
import { Eraser, Sparkles } from 'lucide-react'
import { useAuth } from "@clerk/clerk-react"
import axios from 'axios'
import toast from 'react-hot-toast'

axios.defaults.baseURL = import.meta.env.VITE_BASE_URL || "http://localhost:3000";

function RemoveBackground() {

  const [input,setInput] = useState(null);
  const [loading,setLoading] = useState(false);
  const [content,setContent] = useState("");
  const { getToken } = useAuth();

  const onSubmitHandler = async (e)=>{
    e.preventDefault();
    try {
      setLoading(true);

      const formData = new FormData();
      formData.append("image", input);

      const token = await getToken();
      const {data} = await axios.post(
        "/api/ai/remove-image-background",
        formData, 
        { headers:{ Authorization:`Bearer ${token}`} }
      )

      if(data.success) setContent(data.content)
      else toast.error(data.message);

    } catch (error) {
      toast.error(error.message)
    }

    setLoading(false);
  }

  return (
    <div className="h-full overflow-y-scroll p-6 flex flex-wrap items-start gap-4 text-slate-700">

      {/* --- Left --- */}
      <form onSubmit={onSubmitHandler}
        className="w-full max-w-lg p-4 bg-white rounded-lg border border-gray-200">

        <div className="flex items-center gap-3">
          <Sparkles className="w-6 text-[#FF4938]" />
          <h1 className="text-xl font-semibold">Background Removal</h1>
        </div>

        <p className="mt-6 text-sm font-medium">Upload Image</p>
        <input 
          type="file"
          accept="image/*"
          required
          onChange={e => setInput(e.target.files[0])}
          className="w-full mt-2 p-2 px-3 text-sm border rounded-md"
        />

        <p className="text-xs text-gray-500 mt-1">Supports JPG, PNG, WEBP</p>

        <button disabled={loading}
          className="w-full flex justify-center items-center gap-2 bg-gradient-to-r 
          from-[#F6AB41] to-[#FF4938] text-white py-2 mt-6 text-sm rounded-lg">

          {loading
            ? <span className="w-4 h-4 border-2 border-t-transparent rounded-full animate-spin"></span>
            : <Eraser className="w-5"/> }

          Remove Background
        </button>
      </form>

      {/* --- Right --- */}
      <div className="w-full max-w-lg p-4 bg-white rounded-lg border border-gray-200 min-h-96">

        <div className="flex items-center gap-3">
          <Eraser className="w-5 text-[#FF4938]" />
          <h1 className="text-xl font-semibold">Processed Image</h1>
        </div>

        {!content ? (
          <div className="flex-1 flex justify-center items-center text-gray-400 text-sm mt-10">
            <div className="flex flex-col items-center gap-5">
              <Eraser className="w-9 h-9" />
              <p>Upload image & click remove</p>
            </div>
          </div>
        ) : (
          <img src={content} alt="output" className="mt-3 w-full rounded-lg" />
        )}

      </div>
    </div>
  );
}

export default RemoveBackground;
