

import { Breadcrumbs } from "@components/ui/common";
import { EthRates, WalletBar } from "@components/ui/web3";



const LINKS = [{
    href: "/service/marketplace",
    value: "Buy"
}, {
    href: "/service/marketplace/courses/owned",
    value: "My Courses"
}, {
    href: "/service/marketplace/courses/manage",
    value: "Manage Courses"
}]

export default function Header() {
    return (
        <>
            <WalletBar />
            <EthRates />
            <div className="flex flex-row-reverse pb-4 px-4 sm:px-6 lg:px-8">
                <Breadcrumbs items={LINKS} />
            </div>
        </>
    )
}