import { abiGeneral } from '@/lib/abi-general'
import React from 'react'
import { formatEther, formatGwei, formatUnits } from 'viem'

import { useReadContract, useWalletClient } from 'wagmi'

export const Balance = () => {
  const { data: wallet } = useWalletClient()
  const { data, error, isPending, refetch } = useReadContract({
    chainId: 56,
    address: '0xa6B978fF5266e094dc14918eA74A19ACdcF17415',
    abi: abiGeneral,
    functionName: 'earned',
    args: [wallet?.account.address],
  })
  const [balance, setBalance] = React.useState(isPending ? 0 : Number(data))

  refetch({
    cancelRefetch: false,
  })

  // biome-ignore lint/correctness/useExhaustiveDependencies: <explanation>
  React.useEffect(() => {
    const timer = setInterval(() => {
      setBalance(isPending ? 0 : Number(data))
    }, 1000)
    return () => clearInterval(timer)
  }, [data])

  return (
    <div className='text-lg/8 font-bold mx-auto'>
      {error ? (
        <span>
          {Number(formatEther(BigInt(0), 'wei')).toFixed(18)}{' '}
          <span className='text-xs/6 text-emerald-500'>IMS</span>
        </span>
      ) : (
        <span>
          {Number(formatEther(BigInt(balance), 'wei')).toFixed(18)}{' '}
          <span className='text-xs/6 text-emerald-500'>IMS</span>
        </span>
      )}
    </div>
  )
}
