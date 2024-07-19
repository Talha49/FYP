"use client"

import { useParams } from 'next/navigation';
import React from 'react'

const page = () => {

    const param = useParams() 
    const {ActiveSheets} = param
  return (
    <div>Active sheet {ActiveSheets} </div>
  )
}

export default page