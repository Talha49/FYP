"use client"
import store from '@/lib/Store/Store'
import React from 'react'
import { Provider } from 'react-redux'

const ClientProvider = ({children}) => {
    return (
        <div>
            <Provider store={store}>
               {children}            
            </Provider> 
        </div>
    )
}

export default ClientProvider
