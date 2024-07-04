'use client'

import Link from "next/link"
import React from "react"
import { usePathname } from 'next/navigation'


export default function ActiveLink({ children, activeLinkClass, ...props }) {
    const pathname = usePathname()

    let className = props.className || ""

    if (pathname === props.href) {
        className = `${className} ${activeLinkClass ? activeLinkClass : "text-indigo-600"}`
    }
    props.className = className

    return (
        <Link {...props}>
            {
                children
            }


        </Link>
    )
}