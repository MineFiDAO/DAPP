var rules = {
    walletAddr: [{ required: true, pattern: /^0x[a-fA-F0-9]{40}/, message: '请输入格式：0x******的钱包地址' }]
}

export default rules