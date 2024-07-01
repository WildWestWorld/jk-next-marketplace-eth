import { Hero } from "@components/common"
import { CourseList } from "@components/course"
import { BaseLayout } from "@components/layout"
import { getAllCourses } from "@content/courses/fetcher"

export default function Home() {

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

