'use client'

import { CourseCard, CourseList } from "@components/ui/course"
import { BaseLayout } from "@components/ui/layout"
import { getAllCourses } from "@content/courses/fetcher"
import { WalletBar } from "@components/ui/web3"
import { useAccount, useNetwork } from "@components/hooks/web3"
import { Button } from "@components/ui/common"
import { OrderModal } from "@components/ui/order"
import { useState } from "react"

export default function Marketplace() {
    const [selectedCourse, setSelectedCourse] = useState(null)

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
                        hasInitialResponse: network.hasInitialResponse
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
                        Footer={() =>
                            <div className="mt-4">
                                <Button
                                    onClick={() => setSelectedCourse(course)}
                                    variant="lightPurple">
                                    Purchase
                                </Button>
                            </div>
                        }
                    />
                }
            </CourseList>
            {selectedCourse &&
                <OrderModal
                    course={selectedCourse}
                    onClose={() => setSelectedCourse(null)}
                />
            }
        </>
    )
}

function getStaticProps() {
    const data = getAllCourses()
    return data


}

