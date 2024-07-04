'use client'

import { CourseCard, CourseList } from "@components/ui/course"
import { getAllCourses } from "@content/courses/fetcher"
import { useWalletInfo } from "@components/hooks/web3"
import { Button } from "@components/ui/common"

import { OrderModal } from "@components/ui/order"
import { useState } from "react"


import { MarketHeader } from "@components/ui/marketplace"

export default function Marketplace() {
    const [selectedCourse, setSelectedCourse] = useState(null)

    const { canPurchaseCourse } = useWalletInfo()





    const { data } = getStaticProps()
    return (
        <>
            <div className="pt-4">
                <MarketHeader />


            </div>
            <CourseList
                courses={data}
            >
                {course =>
                    <CourseCard
                        key={course.id}
                        course={course}
                        disabled={!canPurchaseCourse}
                        Footer={() =>
                            <div className="mt-4">
                                <Button
                                    onClick={() => setSelectedCourse(course)}
                                    disabled={!canPurchaseCourse}
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

