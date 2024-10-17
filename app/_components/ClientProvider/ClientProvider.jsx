"use client"
import store from '@/lib/Store/Store'
import React from 'react'
import { Provider } from 'react-redux'

function ClientProvider({children}) {
    return (
        <div>
            <Provider store={store}>
               {children}            
            </Provider> 
        </div>
    )
}

export default ClientProvider
