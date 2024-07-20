"use client"

import Image from 'next/image';
import { useParams } from 'next/navigation';
import React from 'react'
import NestedActiveComp from '../_components/NestedActiveComp';

const page = () => {

    const param = useParams() 
    const {ActiveSheets} = param
  return (
    <div className='md:pl-3 pl-8'>
      <NestedActiveComp />
    </div>
  )
}

export default page