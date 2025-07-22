import React from 'react'

export default function PrivatePageWrapper({children,className=''}: {children: React.ReactNode,className?: string}) {
  return (
    <div className={`w-full relative h-full p-4 mt-[60px] md:p-5 lg:mt-0 ${className}`}>{children}</div>
  )
}
