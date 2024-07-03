'use client'

import { CourseList } from "@components/ui/course"
import { BaseLayout } from "@components/ui/layout"
import { getAllCourses } from "@content/courses/fetcher"
import { WalletBar } from "@components/ui/web3"
import { useAccount } from "@components/hooks/web3/useAccount"

import { useNetwork } from "@components/hooks/web3/useNetwork"

export default function Marketplace() {
    const { account } = useAccount()
    const { network } = useNetwork()


    const { data } = getStaticProps()
    return (
        <>
            <div className="py-4">
                {network.data}
                <WalletBar
                    address={account.data}
                    network={network.data}
                />
            </div>
            <CourseList
                courses={data}
            />
        </>
    )
}

function getStaticProps() {
    const data = getAllCourses()
    return data


}

