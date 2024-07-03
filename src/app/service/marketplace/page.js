'use client'

import { CourseList } from "@components/ui/course"
import { BaseLayout } from "@components/ui/layout"
import { getAllCourses } from "@content/courses/fetcher"
import { WalletBar } from "@components/ui/web3"
import { useAccount } from "@components/hooks/web3/useAccount"

export default function Marketplace() {
    const { account } = useAccount()
    const { data } = getStaticProps()
    console.log(data)
    return (
        <>
            <div className="py-4">
                <WalletBar
                    address={account.data}
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
