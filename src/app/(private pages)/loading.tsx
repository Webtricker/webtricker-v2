import LoadingSpinner from '@/sharedComponets/ui/loading/LoadingSpinner'
import React from 'react'

export default function LoadingPage() {
  return (
    <div className='w-full h-screen flex items-center justify-center'>
            <LoadingSpinner className='w-5 h-5 ' />
    </div>
  )
}
