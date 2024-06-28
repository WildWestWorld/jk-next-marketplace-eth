import { Hero } from "@components/common"
import { CourseList } from "@components/course"
import { BaseLayout } from "@components/layout"
import { getAllCourses } from "@content/courses/fetcher"

export default function Home() {

  const courses = getStaticProps()
  console.log(courses)
  return (
    <>
      <Hero />
      {JSON.stringify(courses)}
      <CourseList />
    </>
  )
}

function getStaticProps() {
  const { data } = getAllCourses()
  return data
}

Home.Layout = BaseLayout