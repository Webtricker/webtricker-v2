import React from 'react'
import PrivatePageWrapper from '../../components/PrivatePageWrapper'
import PageTitle from '../../components/PageTitle'
import SidebarForm from './components/SidebarForm'

export default function HomeCustomizationPage() {
  return (
    <PrivatePageWrapper className="!p-0">
      <main className="w-full z-0">
        <section className=" w-full py-3 px-4 md:px-5 lg:px-10 left-0 flex items-center justify-between lg:bg-slate-100">
          <PageTitle key="Sidebar" title="Sidebar" />
        </section>

        <section
          className={`w-full min-h-screen z-0 flex flex-col relative mb-8 md:mb-10 lg:mb-14 xl:mb-16 2xl:mb-18`}
        >
          <SidebarForm   />

        </section>
      </main>
    </PrivatePageWrapper>
  )
}
