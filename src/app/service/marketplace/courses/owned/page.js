'use client'

import { useAccount, useOwnedCourses } from "@components/hooks/web3";
import { Button, Message } from "@components/ui/common";
import { OwnedCourseCard } from "@components/ui/course";
import { BaseLayout } from "@components/ui/layout";
import { MarketHeader } from "@components/ui/marketplace";
import { getAllCourses } from "@content/courses/fetcher";
import { useRouter } from "next/navigation";
import Link from "next/link"

export default function OwnedCourses() {
    const { account } = useAccount()
    const { data } = getStaticProps()
    const router = useRouter()
    const { ownedCourses } = useOwnedCourses(data, account.data)


    return (
        <>
            <MarketHeader />
            <section className="grid grid-cols-1">
                {ownedCourses.isEmpty &&
                    <div className="w-1/2">
                        <Message type="warning">
                            <div>You don't own any courses</div>
                            <Link href="/marketplace" className="font-normal hover:underline">
                                <i>Purchase Course</i>
                            </Link>
                        </Message>
                    </div>
                }




                {ownedCourses.data?.map(course =>
                    <OwnedCourseCard
                        key={course.id}
                        course={course}
                    >
                        {/* <Message>
              My custom message!
            </Message> */}
                        <Button
                            onClick={() => router.push(`/service/courses/${course.slug}`)}
                        >
                        </Button>
                    </OwnedCourseCard>
                )}
            </section>
        </>
    )
}


function getStaticProps() {
    const data = getAllCourses()
    return data


}
