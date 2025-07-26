import Container from '@/sharedComponets/ui/wrapper/Container'
import React from 'react'

export default function NoBlogFoundMsg({msg='No blog found'}: {msg?: string}) {
  return (
    <div className='w-full py-20 min-h-[500px] z-0 flex relative mb-8 md:mb-10 lg:mb-14 xl:mb-16 2xl:mb-18'>
        <Container className='flex items-center justify-center'>
            <h3 className='text-center'>{msg}</h3>
        </Container>
    </div>
  )
}
