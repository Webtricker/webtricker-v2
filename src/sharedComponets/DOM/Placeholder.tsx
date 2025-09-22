import React from 'react'
import LoadingSpinner from '../ui/loading/LoadingSpinner'

export default function Placeholder({ className = "" }: { className?: string; }) {
    return (
        <div className={`flex items-center justify-center w-full min-h-32 ${className}`}>
            <LoadingSpinner  />
        </div>
    )
}
