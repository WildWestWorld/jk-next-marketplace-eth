'use client'

import { useAccount, useOwnedCourses } from "@components/hooks/web3";
import { Button, Message } from "@components/ui/common";
import { OwnedCourseCard } from "@components/ui/course";
import { BaseLayout } from "@components/ui/layout";
import { MarketHeader } from "@components/ui/marketplace";
import { getAllCourses } from "@content/courses/fetcher";

export default function OwnedCourses() {
    const { account } = useAccount()
    const { data } = getStaticProps()

    const { ownedCourses } = useOwnedCourses(data, account.data)


    return (
        <>
            <MarketHeader />
            <section className="grid grid-cols-1">
                {ownedCourses.data?.map(course =>
                    <OwnedCourseCard
                        key={course.id}
                        course={course}
                    >
                        {/* <Message>
              My custom message!
            </Message> */}
                        <Button>
                            Watch the course
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
