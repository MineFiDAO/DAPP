var _em = {
    FissMoneyType: {
        Income: [0, '收益'],
        Get: [1, '提现']
    },
    HashType: {
        BuyNFT: [0, "购买NFT"],
        AllotIncome: [1, "提交收益"],
        ClearIncome: [2, "清除收益"],
        GetIncome: [3, "领取收益"],
        Ret: [4, '重置数据'],
        RansomPledge: [5, '质押赎回'],
        SubmitStop: [6, '申请终止节点'],
        ClearLastTotalIncome: [7, '清除上传总金额'],
        AuditPledgeData: [8, '审核上传退还质押币信息']
    },
    HashStatus: {
        Pending: [0, '处理中'],
        Success: [1, '成功'],
        Fail: [2, '失败']
    },
    NodeStatus: {
        Offline: [0, '待审核'],
        Online: [1, '正常'],
        Abort: [2, '异常']
    },
    ProfitStatus: {
        Auditing: [0, '等待提交'],
        Submiting: [1, '正在提交'],
        Submitted: [2, '公示中'],
        Confirmed: [3, '已发放'],
    },
    NftStatus: {
        Burned: [0, '已销毁'],
        Normal: [1, '正常']
    }
}


for (var oname in _em) {
    var obj = _em[oname + '_em'] = {}
    for (var key in _em[oname]) {
        if (Array.isArray(_em[oname][key])) {
            obj[_em[oname][key][0]] = _em[oname][key][1]
            _em[oname][key] = _em[oname][key][0]
        } else {
            obj[_em[oname][key]] = key
        }
    }
}

export default _em