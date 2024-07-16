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
    const [isNewPurchase, setIsNewPurchase] = useState(true)


    const { web3, contract, requireInstall } = useWeb3()
    const { hasConnectedWallet, isConnecting, account } = useWalletInfo()
    const { ownedCourses } = useOwnedCourses(data, account.data)
    console.warn(ownedCourses)
    const purchaseCourse = async order => {
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

        const hexCourseId = utf8ToBytes16(selectedCourse.id);
        console.log("Padded hex:", hexCourseId);

        const orderHash = web3.utils.soliditySha3(
            { type: "bytes16", value: hexCourseId },
            { type: "address", value: account.data }
        )

        const value = web3.utils.toWei(String(order.price), 'ether');



        if (isNewPurchase) {
            const emailHash = web3.utils.sha3(order.email)
            const proof = web3.utils.soliditySha3(
                { value: emailHash },
                { value: orderHash }
            )

            _purchaseCourse(hexCourseId, proof, value)
        } else {
            _repurchaseCourse(orderHash, value)
        }
    }

    const _purchaseCourse = async (hexCourseId, proof, value) => {
        try {
            const result = await contract.methods.purchaseCourse(
                hexCourseId,
                proof
            ).send({ from: account.data, value })
            console.log(result)
        } catch (err) {
            console.error("Purchase course: Operation has failed.", err)
        }
    }

    const _repurchaseCourse = async (courseHash, value) => {
        try {
            const result = await contract.methods.repurchaseCourse(
                courseHash
            ).send({ from: account.data, value })
            console.log(result)
        } catch {
            console.error("Purchase course: Operation has failed.")
        }
    }


    const notify = () => {
        // const resolveWithSomeData = new Promise(resolve => setTimeout(() => resolve({
        //   transactionHash: "0x610ebf769141514a711bb9ef01c09340f14fe28c3709a3c12c0c05dd5e7c668a"
        // }), 3000));
        const resolveWithSomeData = new Promise(
            (resolve, reject) => setTimeout(() => reject(new Error("Some Error")), 3000))

        withToast(resolveWithSomeData)
    }


    return (
        <>
            <div className="pt-4">
                <MarketHeader />
                <Button onClick={notify}>
                    Notify!
                </Button>

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
                                        <div style={{ height: "42px" }}></div>
                                    )
                                }

                                if (owned) {
                                    return (
                                        <>
                                            <div className="flex">
                                                <Button
                                                    onClick={() => alert("You are owner of this course.")}
                                                    disabled={false}
                                                    size="sm"
                                                    variant="white">
                                                    Yours &#10004;
                                                </Button>
                                                {owned.state === "deactivated" &&
                                                    <div className="ml-1">
                                                        <Button
                                                            size="sm"
                                                            disabled={false}
                                                            onClick={() => {
                                                                setIsNewPurchase(false)
                                                                setSelectedCourse(course)
                                                            }}
                                                            variant="purple">
                                                            Fund to Activate
                                                        </Button>
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

                                        disabled={!hasConnectedWallet}
                                        variant="lightPurple">
                                        Purchase
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

                    onClose={() => {
                        setSelectedCourse(null)
                        setIsNewPurchase(true)
                    }}
                    onSubmit={purchaseCourse}
                />
            }
        </>
    )
}

function getStaticProps() {
    const data = getAllCourses()
    return data


}

