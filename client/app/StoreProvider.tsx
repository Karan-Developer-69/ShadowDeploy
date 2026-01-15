'use client'

import { useState, useEffect } from 'react'
import { Provider } from 'react-redux'
import { makeStore } from '../lib/store/store'
import { setStoreGetter } from '@/lib/api/axios'

import DataInitializer from './DataInitializer'

export default function StoreProvider({
    children,
}: {
    children: React.ReactNode
}) {
    // Use useState to ensure the store is created only once on the client
    const [store] = useState(() => {
        const storeInstance = makeStore()
        return storeInstance
    })

    // Set store getter for axios interceptor
    useEffect(() => {
        setStoreGetter(() => store)
    }, [store])

    return (
        <Provider store={store}>
            <DataInitializer>
                {children}
            </DataInitializer>
        </Provider>
    )
}
