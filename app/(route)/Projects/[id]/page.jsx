import React from 'react'
import ActiveSheetsComp from '../_components/ActiveSheetsComp'
import LatestCaptureComp from '../_components/LatestCaptureComp'
import FieldNotesComp from '../_components/FieldNotesComp'

const page = ({params}) => {
  return (
    <div className='w-full h-full py-10 md:pl-3 pl-8 '>
         
        <div  className='bg-white   '>
            <h2 className='font-bold md:text-[22px] text-md'>
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
        <div>
          <FieldNotesComp/>
        </div>
    </div>  
  )
}

export default page