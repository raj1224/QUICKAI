import React,{useEffect,useState} from 'react'
import { dummyCreationData } from '../assets/assets'
import { Gem, Sparkle } from 'lucide-react';
import { Protect, useAuth } from '@clerk/clerk-react';    // FIXED
import CreationItem from '../components/CreationItem';  
import axios from 'axios';
import toast from 'react-hot-toast';

axios.defaults.baseURL = import.meta.env.VITE_BASE_URL || 'http://localhost:3000';

const Dashboard = () => {
  
  const [creation,setCreation] = useState([]);
  const [loading,setLoading] = useState(false);

  const { getToken } = useAuth(); // now works

  const getDashboardData = async()=>{
    setLoading(true); // FIXED
    try {
      const token = await getToken();
      
      const {data} = await axios.post('/api/ai/get-user-creations', {}, {
        headers:{ Authorization:`Bearer ${token}` }      // FIXED
      });
      
      if(data.success){
        setCreation(data.creations)
      }else{
        toast.error(data.message || "Something went wrong")
      }

    } catch (error) {
      toast.error(error.message)
    }
    setLoading(false);
  }

  useEffect(()=>{ getDashboardData() },[]);

  return (
    <div className='h-full overflow-y-scroll p-6'>
      <div className='flex justify-start gap-4 flex-wrap'>

        {/* total creation card */}
        <div className='flex justify-between items-center w-72 p-4 px-6 bg-white rounded-xl border border-gray-200'>
          <div className='text-slate-600'>
            <p className='text-sm'>Total Creations</p>
            <h2 className='text-xl font-semibold'>{creation.length}</h2>
          </div>
          <div className='w-10 h-10 rounded-lg bg-gradient-to-br from-[#3588F2] to-[#0BB0D7] flex justify-center items-center text-white'>
            <Sparkle className='w-5'/>
          </div>
        </div>

        {/* Active plan */}
        <div className='flex justify-between items-center w-72 p-4 px-6 bg-white rounded-xl border border-gray-200'>
          <div className='text-slate-600'>
            <p className='text-sm'>Active Plan</p>
            <h2 className='text-xl font-semibold'>
              <Protect plan='premium' fallback='Free'>Premium</Protect>
            </h2>
          </div>
          <div className='w-10 h-10 rounded-lg bg-gradient-to-br from-[#FF61C5] to-[#9E53EE] flex justify-center items-center text-white'>
            <Gem className='w-5'/>
          </div>
        </div>
      </div>

      {loading ? (
        <div className='flex justify-center items-center h-3/4'>
          <div className='animate-spin rounded-full h-11 w-11 border-4 border-purple-500 border-t-transparent'/>
        </div>
      ) : (
        <div className='mt-6 space-y-3'>
          <p className='mb-4'>Recent Creations</p>
          {creation.length === 0 ? (
            <p className='text-gray-500'>No creations yet...</p>
          ) : (
            creation.map(item => <CreationItem key={item.id} item={item}/>)
          )}
        </div>
      )}
    </div>
  )
}

export default Dashboard;
