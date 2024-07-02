'use client'

import { useWeb3 } from "@/components/providers";
import { Modal } from "@/components/ui/common";
import {
    CourseHero,
    Curriculum,
    Keypoints
} from "@/components/ui/course";
import { BaseLayout } from "@/components/ui/layout";

import { getAllCourses } from "@content/courses/fetcher";




export default function Course(props) {
    const { web3State, setWeb3State } = useWeb3();

    const connectWeb3 = () => {

        console.log(useWeb3())
    };
    connectWeb3()


    const course = getStaticProps(props)
    return (
        <>
            <div className="py-4">
                <CourseHero
                    title={course?.title}
                    description={course?.description}
                    image={course?.coverImage}
                />
            </div>
            <Keypoints
                points={course.wsl}
            />
            <Curriculum
                locked={true}
            />
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
    return course
}




