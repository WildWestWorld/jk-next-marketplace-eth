'use client'

import { CourseCard, CourseList } from "@components/ui/course"
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
                <WalletBar
                    address={account.data}
                    network={{
                        data: network.data,
                        target: network.target,
                        isSupported: network.isSupported,
                        hasFinishedFirstFetch: network.hasFinishedFirstFetch
                    }} />


                "Current" {`${network.data}`}
                "Target" {`${network.target}`}
                "Is Supported" {`${network.isSupported}`}
            </div>
            <CourseList
                courses={data}
            >
                {course =>
                    <CourseCard
                        key={course.id}
                        course={course}
                    />
                }
            </CourseList>
        </>
    )
}

function getStaticProps() {
    const data = getAllCourses()
    return data


}

