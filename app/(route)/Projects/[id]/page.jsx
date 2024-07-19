import React from 'react'
import ActiveSheetsComp from '../_components/ActiveSheetsComp'
import LatestCaptureComp from '../_components/LatestCaptureComp'

const page = ({params}) => {
  return (
    <div className='w-full h-full py-10'>
         
        <div  className=''>
            <h2 className='font-bold text-[22px]'>
               Three Month Tenant Improvement
            </h2>
            <p className='text-gray-500'>2330 Butano Drive Sacramento Country California United States 9280290 99</p>
        </div>
        <div>
          <ActiveSheetsComp/>
        </div>
        <div>
          <LatestCaptureComp/>
        </div>
    </div>  
  )
}

export default page