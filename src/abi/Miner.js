var Miner =
	[
		{
			"inputs": [
				{
					"internalType": "int256",
					"name": "errorCode",
					"type": "int256"
				}
			],
			"name": "ActorError",
			"type": "error"
		},
		{
			"inputs": [],
			"name": "ActorNotFound",
			"type": "error"
		},
		{
			"inputs": [],
			"name": "FailToCallActor",
			"type": "error"
		},
		{
			"inputs": [
				{
					"internalType": "CommonTypes.FilActorId",
					"name": "actorId",
					"type": "uint64"
				}
			],
			"name": "InvalidActorID",
			"type": "error"
		},
		{
			"inputs": [
				{
					"internalType": "uint64",
					"name": "",
					"type": "uint64"
				}
			],
			"name": "InvalidCodec",
			"type": "error"
		},
		{
			"inputs": [],
			"name": "InvalidResponseLength",
			"type": "error"
		},
		{
			"inputs": [],
			"name": "NegativeValueNotAllowed",
			"type": "error"
		},
		{
			"inputs": [
				{
					"internalType": "uint256",
					"name": "balance",
					"type": "uint256"
				},
				{
					"internalType": "uint256",
					"name": "value",
					"type": "uint256"
				}
			],
			"name": "NotEnoughBalance",
			"type": "error"
		},
		{
			"anonymous": false,
			"inputs": [
				{
					"indexed": false,
					"internalType": "address",
					"name": "previousAdmin",
					"type": "address"
				},
				{
					"indexed": false,
					"internalType": "address",
					"name": "newAdmin",
					"type": "address"
				}
			],
			"name": "AdminChanged",
			"type": "event"
		},
		{
			"anonymous": false,
			"inputs": [
				{
					"indexed": true,
					"internalType": "address",
					"name": "beacon",
					"type": "address"
				}
			],
			"name": "BeaconUpgraded",
			"type": "event"
		},
		{
			"anonymous": false,
			"inputs": [
				{
					"indexed": false,
					"internalType": "uint8",
					"name": "version",
					"type": "uint8"
				}
			],
			"name": "Initialized",
			"type": "event"
		},
		{
			"anonymous": false,
			"inputs": [
				{
					"indexed": true,
					"internalType": "address",
					"name": "previousOwner",
					"type": "address"
				},
				{
					"indexed": true,
					"internalType": "address",
					"name": "newOwner",
					"type": "address"
				}
			],
			"name": "OwnershipTransferred",
			"type": "event"
		},
		{
			"anonymous": false,
			"inputs": [
				{
					"indexed": true,
					"internalType": "address",
					"name": "implementation",
					"type": "address"
				}
			],
			"name": "Upgraded",
			"type": "event"
		},
		{
			"inputs": [
				{
					"internalType": "CommonTypes.FilActorId",
					"name": "target",
					"type": "uint64"
				},
				{
					"internalType": "uint64",
					"name": "newActorId",
					"type": "uint64"
				},
				{
					"internalType": "uint256",
					"name": "new_quota",
					"type": "uint256"
				},
				{
					"internalType": "CommonTypes.ChainEpoch",
					"name": "expire",
					"type": "int64"
				}
			],
			"name": "changeBeneficiary",
			"outputs": [],
			"stateMutability": "nonpayable",
			"type": "function"
		},
		{
			"inputs": [
				{
					"internalType": "CommonTypes.FilActorId",
					"name": "target",
					"type": "uint64"
				},
				{
					"internalType": "uint64",
					"name": "newOwnerId",
					"type": "uint64"
				}
			],
			"name": "changeOwnerAddress",
			"outputs": [],
			"stateMutability": "nonpayable",
			"type": "function"
		},
		{
			"inputs": [
				{
					"internalType": "CommonTypes.FilActorId",
					"name": "target",
					"type": "uint64"
				},
				{
					"internalType": "uint64",
					"name": "newWorkerAddrId",
					"type": "uint64"
				},
				{
					"internalType": "uint64[]",
					"name": "newControlAddresses",
					"type": "uint64[]"
				}
			],
			"name": "changeWorkerAddress",
			"outputs": [],
			"stateMutability": "nonpayable",
			"type": "function"
		},
		{
			"inputs": [
				{
					"internalType": "CommonTypes.FilActorId",
					"name": "target",
					"type": "uint64"
				}
			],
			"name": "confirmChangeWorkerAddress",
			"outputs": [],
			"stateMutability": "nonpayable",
			"type": "function"
		},
		{
			"inputs": [
				{
					"internalType": "CommonTypes.FilActorId",
					"name": "minerId",
					"type": "uint64"
				}
			],
			"name": "confirmRegister",
			"outputs": [],
			"stateMutability": "nonpayable",
			"type": "function"
		},
		{
			"inputs": [
				{
					"internalType": "CommonTypes.FilActorId",
					"name": "minerId",
					"type": "uint64"
				}
			],
			"name": "getAuditRansomRate",
			"outputs": [
				{
					"internalType": "uint256",
					"name": "",
					"type": "uint256"
				}
			],
			"stateMutability": "view",
			"type": "function"
		},
		{
			"inputs": [
				{
					"internalType": "CommonTypes.FilActorId",
					"name": "target",
					"type": "uint64"
				}
			],
			"name": "getAvailableBalance",
			"outputs": [
				{
					"internalType": "uint256",
					"name": "",
					"type": "uint256"
				},
				{
					"internalType": "bool",
					"name": "",
					"type": "bool"
				}
			],
			"stateMutability": "nonpayable",
			"type": "function"
		},
		{
			"inputs": [
				{
					"internalType": "CommonTypes.FilActorId",
					"name": "minerId",
					"type": "uint64"
				}
			],
			"name": "getExceptionTerminateTime",
			"outputs": [
				{
					"internalType": "uint256",
					"name": "",
					"type": "uint256"
				}
			],
			"stateMutability": "view",
			"type": "function"
		},
		{
			"inputs": [
				{
					"internalType": "CommonTypes.FilActorId",
					"name": "target",
					"type": "uint64"
				}
			],
			"name": "getOwner",
			"outputs": [
				{
					"components": [
						{
							"components": [
								{
									"internalType": "bytes",
									"name": "data",
									"type": "bytes"
								}
							],
							"internalType": "struct CommonTypes.FilAddress",
							"name": "owner",
							"type": "tuple"
						},
						{
							"components": [
								{
									"internalType": "bytes",
									"name": "data",
									"type": "bytes"
								}
							],
							"internalType": "struct CommonTypes.FilAddress",
							"name": "proposed",
							"type": "tuple"
						}
					],
					"internalType": "struct MinerTypes.GetOwnerReturn",
					"name": "",
					"type": "tuple"
				}
			],
			"stateMutability": "nonpayable",
			"type": "function"
		},
		{
			"inputs": [
				{
					"internalType": "CommonTypes.FilActorId",
					"name": "minerId",
					"type": "uint64"
				}
			],
			"name": "getRansomRate",
			"outputs": [
				{
					"internalType": "uint256",
					"name": "",
					"type": "uint256"
				}
			],
			"stateMutability": "view",
			"type": "function"
		},
		{
			"inputs": [],
			"name": "initialize",
			"outputs": [],
			"stateMutability": "nonpayable",
			"type": "function"
		},
		{
			"inputs": [],
			"name": "owner",
			"outputs": [
				{
					"internalType": "address",
					"name": "",
					"type": "address"
				}
			],
			"stateMutability": "view",
			"type": "function"
		},
		{
			"inputs": [],
			"name": "proxiableUUID",
			"outputs": [
				{
					"internalType": "bytes32",
					"name": "",
					"type": "bytes32"
				}
			],
			"stateMutability": "view",
			"type": "function"
		},
		{
			"inputs": [
				{
					"internalType": "CommonTypes.FilActorId",
					"name": "minerId",
					"type": "uint64"
				},
				{
					"internalType": "address",
					"name": "minerAdmin",
					"type": "address"
				},
				{
					"internalType": "uint256",
					"name": "ransomRate",
					"type": "uint256"
				}
			],
			"name": "register",
			"outputs": [],
			"stateMutability": "nonpayable",
			"type": "function"
		},
		{
			"inputs": [],
			"name": "renounceOwnership",
			"outputs": [],
			"stateMutability": "nonpayable",
			"type": "function"
		},
		{
			"inputs": [
				{
					"internalType": "CommonTypes.FilActorId",
					"name": "minerId",
					"type": "uint64"
				}
			],
			"name": "submitExceptionTerminate",
			"outputs": [],
			"stateMutability": "nonpayable",
			"type": "function"
		},
		{
			"inputs": [
				{
					"internalType": "address",
					"name": "newOwner",
					"type": "address"
				}
			],
			"name": "transferOwnership",
			"outputs": [],
			"stateMutability": "nonpayable",
			"type": "function"
		},
		{
			"inputs": [
				{
					"internalType": "address",
					"name": "newImplementation",
					"type": "address"
				}
			],
			"name": "upgradeTo",
			"outputs": [],
			"stateMutability": "nonpayable",
			"type": "function"
		},
		{
			"inputs": [
				{
					"internalType": "address",
					"name": "newImplementation",
					"type": "address"
				},
				{
					"internalType": "bytes",
					"name": "data",
					"type": "bytes"
				}
			],
			"name": "upgradeToAndCall",
			"outputs": [],
			"stateMutability": "payable",
			"type": "function"
		},
		{
			"inputs": [
				{
					"internalType": "CommonTypes.FilActorId",
					"name": "target",
					"type": "uint64"
				},
				{
					"internalType": "uint256",
					"name": "amount",
					"type": "uint256"
				}
			],
			"name": "withdrawBalance",
			"outputs": [
				{
					"components": [
						{
							"internalType": "bytes",
							"name": "val",
							"type": "bytes"
						},
						{
							"internalType": "bool",
							"name": "neg",
							"type": "bool"
						}
					],
					"internalType": "struct CommonTypes.BigInt",
					"name": "",
					"type": "tuple"
				}
			],
			"stateMutability": "nonpayable",
			"type": "function"
		}
	]
export default Miner