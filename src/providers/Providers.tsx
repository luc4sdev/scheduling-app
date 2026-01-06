'use client'

import React, { ReactNode } from 'react'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'

interface ProviderProps {
    children: ReactNode | ReactNode[] | React.JSX.Element | React.JSX.Element[]
}
const queryClient = new QueryClient()

export const Providers = ({ children }: ProviderProps) => {
    return (
        <QueryClientProvider client={queryClient}>
            {children}
        </QueryClientProvider>
    )
}