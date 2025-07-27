"use client"

import { useParams } from 'next/navigation';
import React from 'react'

const Page = () => {

    const param = useParams() 
    const {LatestCapture} = param
  return (
    <div>LatestCapture {LatestCapture} </div>
  )
}

export default Page