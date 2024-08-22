"use client"

import { useParams } from 'next/navigation';
import React from 'react'

const page = () => {

    const param = useParams() 
    const {FieldNotes} = param
  return (
    <div>FieldNotes {FieldNotes} </div>
  )
}

export default page