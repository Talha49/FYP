"use client"

import { useParams } from 'next/navigation';
import React from 'react'

const page = () => {

    const param = useParams() 
    const {LatestCapture} = param
  return (
    <div>LatestCapture {LatestCapture} </div>
  )
}

export default page