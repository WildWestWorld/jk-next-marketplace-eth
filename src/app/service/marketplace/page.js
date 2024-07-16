'use client'

import { CourseCard, CourseList } from "@components/ui/course"
import { getAllCourses } from "@content/courses/fetcher"
import { useOwnedCourses, useWalletInfo } from "@components/hooks/web3"
import { Button, Loader, Message } from "@components/ui/common"

import { OrderModal } from "@components/ui/order"
import { useState } from "react"

import { withToast } from "@utils/toast"

import { MarketHeader } from "@components/ui/marketplace"
import { useWeb3 } from "@components/providers"

export default function Marketplace() {

    const { data } = getStaticProps()
    const [selectedCourse, setSelectedCourse] = useState(null)
    const [busyCourseId, setBusyCourseId] = useState(null)

    const [isNewPurchase, setIsNewPurchase] = useState(true)


    const { web3, contract, requireInstall } = useWeb3()
    const { hasConnectedWallet, isConnecting, account } = useWalletInfo()
    const { ownedCourses } = useOwnedCourses(data, account.data)
    console.warn(ownedCourses)
    const purchaseCourse = async (order, course) => {
        const utf8ToBytes16 = (str) => {
            let hexStr = web3.utils.utf8ToHex(str);
            // Remove '0x' prefix
            hexStr = hexStr.slice(2);
            if (hexStr.length > 32) { // 32 hex characters for bytes16
                hexStr = hexStr.slice(0, 32); // Trim to bytes16 length
            } else {
                hexStr = hexStr.padEnd(32, '0'); // Pad to bytes16 length
            }
            return '0x' + hexStr;
        }

        const hexCourseId = utf8ToBytes16(course.id);
        console.log("Padded hex:", hexCourseId);

        const orderHash = web3.utils.soliditySha3(
            { type: "bytes16", value: hexCourseId },
            { type: "address", value: account.data }
        )

        const value = web3.utils.toWei(String(order.price), 'ether');


        setBusyCourseId(course.id)

        if (isNewPurchase) {
            const emailHash = web3.utils.sha3(order.email)
            const proof = web3.utils.soliditySha3(
                { value: emailHash },
                { value: orderHash }
            )

            withToast(_purchaseCourse({ hexCourseId, proof, value }, course))
        } else {
            withToast(_repurchaseCourse({ courseHash: orderHash, value }, course))
        }
    }

    const _purchaseCourse = async ({ hexCourseId, proof, value }, course) => {
        try {
            const result = await contract.methods.purchaseCourse(
                hexCourseId,
                proof
            ).send({ from: account.data, value })

            ownedCourses.mutate([
                ...ownedCourses.data, {
                    ...course,
                    proof,
                    state: "purchased",
                    owner: account.data,
                    price: value
                }
            ])


            return result
        } catch (err) {
            throw new Error(err.message)
        } finally {
            setBusyCourseId(null)

        }
    }

    const _repurchaseCourse = async ({ courseHash, value }, course) => {
        try {
            const result = await contract.methods.repurchaseCourse(
                courseHash
            ).send({ from: account.data, value })


            const index = ownedCourses.data.findIndex(c => c.id === course.id)

            if (index >= 0) {
                ownedCourses.data[index].state = "purchased"
                ownedCourses.mutate(ownedCourses.data)
            } else {
                ownedCourses.mutate()

            }


            return result
        } catch (err) {
            throw new Error(err.message)
        } finally {
            setBusyCourseId(null)

        }
    }


    const cleanupModal = () => {
        setSelectedCourse(null)
        setIsNewPurchase(true)
    }



    return (
        <>
            <div className="pt-4">
                <MarketHeader />


            </div>
            <CourseList
                courses={data}
            >
                {course => {
                    const owned = ownedCourses.lookup[course.id]
                    return (
                        <CourseCard
                            key={course.id}
                            course={course}
                            state={owned?.state}
                            disabled={!hasConnectedWallet}
                            Footer={() => {
                                if (requireInstall) {
                                    return (
                                        <Button
                                            disabled={true}
                                            size="sm"
                                            variant="lightPurple">
                                            Install
                                        </Button>
                                    )
                                }

                                if (isConnecting) {
                                    return (
                                        <Button
                                            size="sm"

                                            disabled={true}
                                            variant="lightPurple">
                                            <Loader size="sm" />
                                        </Button>
                                    )
                                }
                                if (!ownedCourses.hasInitialResponse) {
                                    return (
                                        <Button
                                            variant="white"
                                            disabled={true}
                                            size="sm">
                                            {hasConnectedWallet ?
                                                "Loading State..." :
                                                "Connect"
                                            }
                                        </Button>
                                    )
                                }
                                const isBusy = busyCourseId === course.id

                                if (owned) {
                                    return (
                                        <>
                                            <div className="flex">
                                                <Button
                                                    onClick={() => alert("You are owner of this course.")}
                                                    disabled={isBusy}
                                                    size="sm"
                                                    variant="white">
                                                    Yours &#10004;
                                                </Button>
                                                {owned.state === "deactivated" &&
                                                    <div className="ml-1">
                                                        <Button
                                                            size="sm"
                                                            disabled={isBusy}
                                                            onClick={() => {
                                                                setIsNewPurchase(false)
                                                                setSelectedCourse(course)
                                                            }}
                                                            variant="purple">
                                                            {isBusy ?
                                                                <div className="flex">
                                                                    <Loader size="sm" />
                                                                    <div className="ml-2">In Progress</div>
                                                                </div> :
                                                                <div>Fund to Activate</div>
                                                            }                                                        </Button>
                                                    </div>
                                                }
                                            </div>
                                        </>
                                    )
                                }

                                return (
                                    <Button
                                        onClick={() => setSelectedCourse(course)}
                                        size="sm"

                                        disabled={!hasConnectedWallet || isBusy}
                                        variant="lightPurple">
                                        {isBusy ?
                                            <div className="flex">
                                                <Loader size="sm" />
                                                <div className="ml-2">In Progress</div>
                                            </div> :
                                            <div>Purchase</div>
                                        }
                                    </Button>
                                )
                            }
                            }
                        />
                    )
                }
                }
            </CourseList>
            {selectedCourse &&
                <OrderModal
                    course={selectedCourse}
                    isNewPurchase={isNewPurchase}

                    onSubmit={(formData, course) => {
                        purchaseCourse(formData, course)
                        cleanupModal()
                    }}
                    onClose={cleanupModal}
                />
            }
        </>
    )
}

function getStaticProps() {
    const data = getAllCourses()
    return data


}

