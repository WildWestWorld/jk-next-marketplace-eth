'use client'


import { useWeb3 } from "@/components/providers"
import { Hero } from "@/components/ui/common"
import { CourseList } from "@/components/ui/course"
import { BaseLayout } from "@/components/ui/layout"
import { getAllCourses } from "@content/courses/fetcher"




export default function Home() {

  const { web3, isLoading } = useWeb3()

  const courses = getStaticProps()
  return (
    <BaseLayout>
      <Hero />
      <CourseList courses={courses} />
    </BaseLayout>
  )
}


function getStaticProps() {
  const { data } = getAllCourses()
  return data
}

Home.Layout = BaseLayout

