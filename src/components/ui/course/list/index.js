

import Image from "next/image"
import Link from "next/link"


export default function List({ courses }) {
    return (
        <section className="grid md:grid-cols-1 lg:grid-cols-2 gap-4 mb-5">
            {courses.map(course =>
                <div
                    key={course.id}
                    className="bg-white rounded-xl shadow-md overflow-hidden md:max-w-2xl">
                    <div className="flex h-full">
                        <div className="h-full block">
                            <div className="relative" style={{
                                'width': 200,
                                'height': 230
                            }}>
                                <Image
                                    className="object-cover"
                                    src={course.coverImage}

                                    alt={course.title}
                                    style={{ 'maxWidth': null }}
                                    fill
                                    sizes="100%"

                                />
                            </div>

                        </div>
                        <div className="p-8">
                            <div
                                className="uppercase tracking-wide text-sm text-indigo-500 font-semibold">
                                {course.type}
                            </div>
                            <Link href={`/service/courses/${course.slug}`} className="block mt-1 text-lg leading-tight font-medium text-black hover:underline">
                                {course.title}
                            </Link>
                            <p
                                className="mt-2 text-gray-500">
                                {course.description}
                            </p>
                        </div>
                    </div>
                </div>
            )}
        </section>
    )
}