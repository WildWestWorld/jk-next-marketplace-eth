'use client'

import { useAccount, useOwnedCourses } from "@components/hooks/web3";
import { Button, Message } from "@components/ui/common";
import { OwnedCourseCard } from "@components/ui/course";
import { BaseLayout } from "@components/ui/layout";
import { MarketHeader } from "@components/ui/marketplace";
import { getAllCourses } from "@content/courses/fetcher";
import { useRouter } from "next/navigation";
import Link from "next/link"

import { useWeb3 } from "@components/providers"

export default function OwnedCourses() {
    const { account } = useAccount()
    const { requireInstall } = useWeb3()
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
                            <div>You don&apos;t own any courses</div>
                            <Link href="/marketplace">

                                <i>Purchase Course</i>

                            </Link>
                        </Message>
                    </div>
                }
                {account.isEmpty &&
                    <div className="w-1/2">
                        <Message type="warning">
                            <div>Please connect to Metamask</div>
                        </Message>
                    </div>
                }
                {requireInstall &&
                    <div className="w-1/2">
                        <Message type="warning">
                            <div>Please install Metamask</div>
                        </Message>
                    </div>
                }
                {ownedCourses.data?.map(course =>
                    <OwnedCourseCard
                        key={course.id}
                        course={course}
                    >
                        <Button
                            onClick={() => router.push(`/service/courses/${course.slug}`)}
                        >
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
