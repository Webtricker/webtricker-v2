import React, { ReactNode } from 'react'

export default function ConditionalReturnContainer({children}:{children:ReactNode}) {
  return (
    <div className='w-full min-h-[300px] flex items-center justify-center flex-col p-5 text-center'>{children}</div>
  )
}
