import { useEffect } from "react"
import useSWR from "swr"


const adminAddresses = {
    "0x3958bfb9e9749d2788927c96e4b8248499441fa3969ac28ab849b452d68c1df4": true
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
            isAdmin: (data && adminAddresses[web3.utils.keccak256(data)]) ?? false,
            mutate,
            ...rest
        }
    }
}