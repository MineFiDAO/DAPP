import MineABI from '@/abi/Miner'
import wc from '@/utils/conwallet'
import store from '@/store'
import chainmgr from '@/utils/chainmgr'
import NFTC from '@/utils/NFTContract'
import em from '@/utils/em'
import vui from '@/uicommon'
var ethers = require('ethers')
var gasLimit = ethers.utils.parseUnits((10000000000).toString(), 0)

function getContract(caddr) {
    var nftCAddr = caddr
    var provider = wc.getProvider()
    var signer = provider.getSigner()
    var c = new ethers.Contract(nftCAddr, MineABI, signer)
    return c
}

function getTransResult(presult) {
    return new Promise((r, e) => {
        presult.then(res => {
            var time = 100
            var _res = res
            var _r = r
            var act = () => {
                if (time > 0) {
                    wc.getTransByHash(_res.hash)
                        .then(tr => {
                            console.log('检查交易结果', _res.hash, tr)
                            if (tr) {
                                if (tr.status == '0x1') {
                                    _r(_res)
                                } else {
                                    e()
                                }
                            } else {
                                setTimeout(() => {
                                    act()
                                }, 1 * 1000);
                            }
                        }).catch(_err => {
                            setTimeout(() => {
                                act()
                            }, 5 * 1000);
                        })
                    time--
                } else {
                    e()
                }
            }
            act()
        }).catch((err) => {
            e(err)
        })
    })
}
export function SubmitStop(minerAddr, nodeAddr, title) {
    var req = new Promise((r, e) => {
        var c = getContract(minerAddr)
        NFTC.getMinerId(nodeAddr).then(minerId => {
            c.submitExceptionTerminate(minerId.toBigInt(), { gasLimit: gasLimit }).then(res => {
                chainmgr.addTxhash(minerAddr, res.hash, em.HashType.SubmitStop, { memo: '终止节点', title: title })
                r(res)
            }).catch(e)
        })
    })
    return getTransResult(req)
}

export function stopTerminate(minerAddr, nodeAddr, title) {
    var req = new Promise((r, e) => {
        var c = getContract(minerAddr)
        NFTC.getMinerId(nodeAddr).then(minerId => {
            c.stopTerminate(minerId.toBigInt(), { gasLimit: gasLimit }).then(res => {
                chainmgr.addTxhash(minerAddr, res.hash, em.HashType.Ret, { memo: '重置节点', title: title })
                r(res)
            }).catch(e)
        })
    })
    return getTransResult(req)
}


export default { SubmitStop, stopTerminate }