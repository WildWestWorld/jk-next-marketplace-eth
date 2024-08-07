import Image from "next/image"
import Link from "next/link"
import { AnimateKeyframes } from "react-simple-animate"

export default function Card({ course, disabled, Footer, state }) {
    return (
        <div
            className="bg-white rounded-xl shadow-md overflow-hidden m  d:max-w-2xl">
            <div className="flex h-full">
                <div className="h-full block  flex-1  next-image-wrapper">
                    <div className="relative" style={{
                        'width': 200,
                    }}>
                        <Image
                            className={`object-cover ${disabled && "filter grayscale"}`}
                            src={course.coverImage}
                            alt={course.title}
                            style={{ 'maxWidth': null }}
                            fill
                            sizes="100%"
                        />
                    </div>

                </div>
                <div className="p-8 pb-4 flex-2">
                    <div className="flex items-center">
                        <div
                            className="uppercase mr-2 tracking-wide text-sm text-indigo-500 font-semibold">
                            {course.type}
                        </div>
                        <div>
                            {state === "activated" &&
                                <div className="text-xs text-black bg-green-200 p-1 px-3 rounded-full">
                                    Activated
                                </div>
                            }
                            {state === "deactivated" &&
                                <div className="text-xs text-black bg-red-200 p-1 px-3 rounded-full">
                                    Deactivated
                                </div>
                            }
                            {state === "purchased" &&
                                <AnimateKeyframes
                                    play
                                    duration={2}
                                    keyframes={["opacity: 0.2", "opacity: 1"]}
                                    iterationCount="infinite"
                                >
                                    <div className="text-xs text-black bg-yellow-200 p-1 px-3 rounded-full">
                                        Pending
                                    </div>
                                </AnimateKeyframes>
                            }
                        </div>
                    </div>

                    <Link href={`/service/courses/${course.slug}`} className="h-12 block mt-1 text-sm sm:text-base leading-tight font-medium text-black hover:underline">
                        {course.title}
                    </Link>
                    <p
                        className="mt-2 mb-4 text-sm sm:text-base text-gray-500">
                        {course.description.substring(0, 70)}...
                    </p>
                    {Footer &&
                        <div className="mt-2">
                            <Footer />
                        </div>
                    }
                </div>
            </div>
        </div>
    )
}