import React, { useState, useEffect } from 'react'
import { Heart } from 'lucide-react'
import { useUser, useAuth } from '@clerk/clerk-react'
import axios from 'axios'
import toast from 'react-hot-toast'

axios.defaults.baseURL = import.meta.env.VITE_BASE_URL || 'http://localhost:3000';

function Community() {

  const [creations, setCreations] = useState([]);
  const [loading, setLoading] = useState(true);

  const { user } = useUser();
  const { getToken } = useAuth();

  // ⬇ Correct API (replace with your backend fetch route)
  const fetchCreations = async () => {
    try {
      setLoading(true);

      const { data } = await axios.get("/api/ai/get-community-creations", {
        headers: {
          Authorization: `Bearer ${await getToken()}`
        }
      });

      if (data.success) setCreations(data.data);
      else toast.error(data.message);

    } catch (error) {
      toast.error(error.message);
    }

    setLoading(false);
  }

  // Toggle image like
  const imageLikeToggle = async (id) => {
    try {
      const { data } = await axios.post('/api/ai/toggle-like-creation', { id },
        { headers: { Authorization: `Bearer ${await getToken()}` } }
      );

      if (data.success) {
        toast.success(data.message);
        fetchCreations();  // refresh UI
      }

    } catch (error) {
      toast.error(error.message);
    }
  }

  useEffect(() => {
    if (user) fetchCreations();
  }, [user]);

  return !loading ? (
    <div className="flex-1 h-full flex flex-col gap-4 p-6">
      
      <h1 className="text-xl font-semibold">Community Creations</h1>

      <div className="bg-white h-full w-full rounded-xl overflow-y-auto flex flex-wrap gap-4 p-4">

        {creations.length === 0 && (
          <p className="text-gray-500 w-full text-center mt-10">No posts yet...</p>
        )}

        {creations.map((creation) => (
          <div key={creation.id} className="relative group w-full sm:w-[48%] lg:w-[30%]">
            
            <img src={creation.content} 
                 className="rounded-lg w-full h-64 object-cover" />

            <div className="absolute inset-0 flex justify-end items-end p-3
                            bg-gradient-to-t from-black/70 via-transparent to-transparent
                            opacity-0 group-hover:opacity-100 transition">

              <div className="flex gap-1 items-center text-white">
                <p>{creation.likes.length}</p>
                <Heart 
                  onClick={() => imageLikeToggle(creation.id)}
                  className={`w-6 h-6 cursor-pointer transition 
                  ${creation.likes.includes(user?.id) 
                     ? "fill-red-500 text-red-500" 
                     : "hover:scale-110"}`}
                />
              </div>

            </div>
          </div>
        ))}

      </div>
    </div>
  ) : (
    <div className="flex justify-center items-center h-full">
      <span className="w-6 h-6 border-2 border-t-transparent animate-spin rounded-full"></span>
    </div>
  )
}

export default Community;
