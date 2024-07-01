import { Modal } from "@components/common";
import {
    CourseHero,
    Curriculum,
    Keypoints
} from "@components/course";
import { BaseLayout } from "@components/layout";

import { getAllCourses } from "@content/courses/fetcher";

export default function Course(props) {



    const course = getStaticProps(props)
    return (
        <>
            {course?.title}
            {props.params.slug}
            <div className="py-4">
                <CourseHero />
            </div>
            <Keypoints />
            <Curriculum />
            <Modal />
        </>
    )



}



function getStaticPaths() {
    const { data } = getAllCourses()

    return {
        paths: data.map(c => ({
            params: {
                slug: c.slug
            }
        })),
        fallback: false
    }
}


function getStaticProps({ params }) {
    const { data } = getAllCourses()
    const course = data.filter(c => c.slug === params.slug)[0]
    console.log(course)
    return course
}




