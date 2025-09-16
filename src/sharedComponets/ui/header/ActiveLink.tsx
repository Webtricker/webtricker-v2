"use client"
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import React from 'react'


type Props = {
  link: {
    label: string;
    href: string;
  }
}

export default function ActiveLink({ link: { label, href } }: Props) {
  const pathname = usePathname();
  return (
    <Link
      className={`wt_header-navlink heading capitalize cursor-pointer ${pathname===href && "wt_active"}`}
      key={label}
      href={href}
    >
      {label}
    </Link>
  )
}
