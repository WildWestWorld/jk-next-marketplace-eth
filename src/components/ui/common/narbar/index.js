'use client'

import Link from "next/link"

import { useWeb3 } from "@components/providers/index.js"

import { Button } from "@components/ui/common"

import { useAccount } from "@components/hooks/web3/index"

import { usePathname } from 'next/navigation'


export default function Navbar() {

    const { connect, isLoading, web3 } = useWeb3()
    const { account } = useAccount()

    const pathname = usePathname()

    return (
        <section>
            <div className="relative pt-6 px-4 sm:px-6 lg:px-8">
                <nav className="relative" aria-label="Global">
                    <div className="flex justify-between items-center">
                        <div>
                            <Link href="/" className="font-medium mr-8 text-gray-500 hover:text-gray-900">Home</Link>
                            <Link href="/service/marketplace" className="font-medium mr-8 text-gray-500 hover:text-gray-900">Marketplace</Link>
                            <Link href="#" className="font-medium mr-8 text-gray-500 hover:text-gray-900">Blogs</Link>
                        </div>
                        <div>
                            <Link href="#" className="font-medium mr-8 text-gray-500 hover:text-gray-900">Wishlist</Link>
                            {isLoading ?
                                <Button
                                    disabled={true}
                                    onClick={connect}>
                                    Loading...
                                </Button> :
                                web3 != null ?
                                    account.data ?
                                        <Button
                                            hoverable={false}
                                            className="cursor-default">
                                            Hi there {account.isAdmin && "Admin"}
                                        </Button> :
                                        <Button
                                            onClick={connect}>
                                            Connect
                                        </Button> :
                                    <Button
                                        onClick={() => window.open("https://metamask.io/download.html", "_blank")}>
                                        Install Metamask
                                    </Button>
                            }
                        </div>
                    </div>
                </nav>
            </div>

            {account.data &&
                !pathname.includes("/marketplace") &&
                <div className="flex justify-end pt-1 sm:px-6 lg:px-8">
                    <div className="text-white bg-indigo-600 rounded-md p-2">
                        {account.data}
                    </div>
                </div>
            }
        </section>
    )
}