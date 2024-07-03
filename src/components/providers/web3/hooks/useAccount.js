import { useEffect } from "react"
import useSWR from "swr"


const adminAddresses = {
    "0xBF3Bcb772a189D6B70bAFe7Bd1c58A12F768677C": true
}


export const handler = (web3, provider) => () => {

    const { data, mutate, ...rest } = useSWR(() =>
        web3 ? "web3/accounts" : null,
        async () => {
            const accounts = await web3.eth.getAccounts()
            return accounts[0]
        }
    )

    useEffect(() => {
        provider &&
            provider.on("accountsChanged",
                accounts => mutate(accounts[0] ?? null)
            )
    }, [provider])

    return {
        account: {
            data,
            isAdmin: (data && adminAddresses[data]) ?? false,
            mutate,
            ...rest
        }
    }
}