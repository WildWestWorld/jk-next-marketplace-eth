'use client'
const { createContext, useContext, useEffect, useState, useMemo } = require("react");

import detectEthereumProvider from "@metamask/detect-provider";
import Web3 from "web3";

const Web3Context = createContext(null)

export default function Web3Provider({ children }) {

    const [web3Api, setWeb3Api] = useState({
        provider: null,
        web3: null,
        contract: null,
        isLoading: true
    })

    useEffect(() => {
        const loadProvider = async () => {

            const provider = await detectEthereumProvider()
            if (provider) {
                const web3 = new Web3(provider)
                setWeb3Api({
                    provider,
                    web3,
                    contract: null,
                    isLoading: false
                })
            } else {
                setWeb3Api(api => ({ ...api, isLoading: false }))
                console.error("Please, install Metamask.")
            }
        }

        loadProvider()
    }, [])



    const _web3Api = useMemo(() => {
        return {
            ...web3Api,
            isWeb3Loaded: web3Api.web3 != null,
            connect: web3Api.provider ?
                async () => {
                    try {
                        await web3Api.provider.request({ method: "eth_requestAccounts" })
                    } catch (e) {
                        console.log(e)
                        // location.reload()
                    }
                } :
                () => console.error("Cannot connect to Metamask, try to reload your browser please.")
        }
    }, [web3Api])

    return (
        <Web3Context.Provider value={_web3Api}>
            {children}
        </Web3Context.Provider>
    )
}
// 创建自定义钩子，方便使用上下文
export const useWeb3 = () => {
    const context = useContext(Web3Context);
    if (!context) {
        throw new Error('useWeb3 必须在 Web3Provider 中使用');
    }
    return context;
};