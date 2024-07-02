'use client'
const { createContext, useContext } = require("react");

export const Web3Context = createContext(null)

export default function Web3Provider({ children }) {
    return (
        <Web3Context.Provider value={{ test: "Hello" }}>
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