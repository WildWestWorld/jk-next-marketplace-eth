'use client'
const { createContext, useContext, useEffect, useState } = require("react");

import detectEthereumProvider from "@metamask/detect-provider";
import Web3 from "web3";

const Web3Context = createContext(null)

export default function Web3Provider({ children }) {

    const [web3Api, setWeb3Api] = useState({
        provider: null,
        web3: null,
        contract: null,
        isInitialized: false
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
                    isInitialized: true
                })
            } else {
                setWeb3Api(api => ({ ...api, isInitialized: true }))
                console.error("Please, install Metamask.")
            }
        }

        loadProvider()
    }, [])

    return (
        <Web3Context.Provider value={web3Api}>
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