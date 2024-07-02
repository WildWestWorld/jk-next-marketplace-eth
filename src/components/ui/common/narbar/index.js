import Link from "next/link"

import { useWeb3 } from "@components/providers"

import { Button } from "@components/ui/common"


export default function Navbar() {

    const { connect, isLoading, isWeb3Loaded, hooks } = useWeb3()
    const { account } = hooks.useAccount()
    return (
        <section>
            {account}
            <div className="relative pt-6 px-4 sm:px-6 lg:px-8">
                <nav className="relative" aria-label="Global">
                    <div className="flex justify-between items-center">
                        <div>
                            <Link href="#" className="font-medium mr-8 text-gray-500 hover:text-gray-900">Home</Link>
                            <Link href="#" className="font-medium mr-8 text-gray-500 hover:text-gray-900">Marketplace</Link>
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
                                isWeb3Loaded ?
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
        </section>
    )
}