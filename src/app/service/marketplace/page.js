'use client'

import { CourseCard, CourseList } from "@components/ui/course"
import { getAllCourses } from "@content/courses/fetcher"
import { useWalletInfo } from "@components/hooks/web3"
import { Button } from "@components/ui/common"

import { OrderModal } from "@components/ui/order"
import { useState } from "react"


import { MarketHeader } from "@components/ui/marketplace"
import { useWeb3 } from "@components/providers"

export default function Marketplace() {
    const [selectedCourse, setSelectedCourse] = useState(null)

    const { web3, contract } = useWeb3()
    const { canPurchaseCourse, account } = useWalletInfo()

    const purchaseCourse = async (order) => {
        if (!selectedCourse.id || !account.data || !order.email || !order.price) {
            console.error("缺少完成购买所需的信息。");
            return;
        }

        // Convert the course ID to hex
        let hexCourseId = web3.utils.utf8ToHex(selectedCourse.id);
        console.log(hexCourseId);

        // Ensure the hexCourseId is 16 bytes (32 characters) long
        if (hexCourseId.length > 34) {
            // If too long, truncate to 16 bytes
            hexCourseId = hexCourseId.slice(0, 34);
        } else if (hexCourseId.length < 34) {
            // If too short, pad with zeros
            hexCourseId = hexCourseId.padEnd(34, '0');
        }

        console.log(hexCourseId);

        if (hexCourseId.length !== 34) {
            console.error("hexCourseId 的长度不是 16 字节。");
            return;
        }

        if (!web3.utils.isAddress(account.data)) {
            console.error("account.data 不是一个有效的以太坊地址。");
            return;
        }

        let orderHash;
        try {
            orderHash = web3.utils.soliditySha3(
                { type: "bytes16", value: hexCourseId },
                { type: "address", value: account.data }
            );
            console.log(orderHash);
        } catch (error) {
            console.error("生成 orderHash 时出错：", error);
            return;
        }

        let emailHash;
        try {
            emailHash = web3.utils.sha3(order.email);
            console.log(emailHash);
        } catch (error) {
            console.error("生成 emailHash 时出错：", error);
            return;
        }

        // Remove the '0x' prefix from emailHash and orderHash
        const emailHashWithoutPrefix = emailHash.slice(2);
        const orderHashWithoutPrefix = orderHash.slice(2);

        let proof;
        try {
            proof = web3.utils.soliditySha3(
                { value: `0x${emailHashWithoutPrefix}` },
                { value: `0x${orderHashWithoutPrefix}` }
            );
            console.warn(proof);
        } catch (error) {
            console.error("生成 proof 时出错：", error);
            return;
        }
        console.log(order.price)

        // Ensure order.price is a valid number
        let value;
        try {
            const price = Number(order.price);
            if (isNaN(price) || price <= 0) {
                throw new Error("价格必须是一个有效的正数。");
            }
            value = web3.utils.toWei(String(price), 'ether');
        } catch (error) {
            console.error("无效的价格：", error);
            return;
        }
        try {
            const result = await contract.methods.purchaseCourse(
                hexCourseId,
                proof
            ).send({ from: account.data, value });
            console.log(result);
        } catch (error) {
            console.error("购买课程失败：", error);
        }
    };


    const { data } = getStaticProps()
    return (
        <>
            <div className="pt-4">
                <MarketHeader />


            </div>
            <CourseList
                courses={data}
            >
                {course =>
                    <CourseCard
                        key={course.id}
                        course={course}
                        disabled={!canPurchaseCourse}
                        Footer={() =>
                            <div className="mt-4">
                                <Button
                                    onClick={() => setSelectedCourse(course)}
                                    disabled={!canPurchaseCourse}
                                    variant="lightPurple">
                                    Purchase
                                </Button>
                            </div>
                        }
                    />
                }
            </CourseList>
            {selectedCourse &&
                <OrderModal
                    course={selectedCourse}
                    onClose={() => setSelectedCourse(null)}
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

