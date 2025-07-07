import { abiGeneral } from '@/lib/abi-general'
import React from 'react'
import { formatEther, formatGwei, formatUnits } from 'viem'

import { useReadContract, useWalletClient } from 'wagmi'

interface BalanceStakingProps {
  generalAddress: string
  rewardName: string
  poolAddress: string
}

export const BalanceStaking = (props: BalanceStakingProps) => {
  const { data: wallet } = useWalletClient()
  const { data, error, isPending, refetch, status } = useReadContract({
    chainId: 56,
    address: `0x${props.generalAddress}`,
    abi: abiGeneral,
    functionName: 'earned',
    args: [wallet?.account.address],
  })
  const [balance, setBalance] = React.useState(isPending ? 0 : Number(data))
  const [price, setPrice] = React.useState<string>('0')

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

  const priceUSD = React.useCallback(async () => {
    const datas = await fetch(`/api/v2/pool/${props.poolAddress}`)
    const response: number = await datas.json()

    if (datas.ok) {
      if (status === "success") {

        if (props.rewardName === "USDT") {
          setPrice(formatEther(BigInt(balance), "wei"))
        } else {
          setPrice(String(Number(response) * Number(formatEther(BigInt(balance), "wei"))))
        }


      }
    }



  }, [data])

  React.useEffect(() => {
    priceUSD()
  }, [priceUSD])

  return (
    <div className='flex flex-col items-start justify-center'>
      <div className='text-lg/8 font-bold'>
        {error ? (
          <span>
            {Number(formatEther(BigInt(0), 'wei')).toFixed(18)}{' '}
            <span className='text-xs/6 text-emerald-500'>{props.rewardName}</span>
          </span>
        ) : (
          <span>
            {Number(formatEther(BigInt(balance), 'wei')).toFixed(18)}{' '}
            <span className='text-xs/6 text-emerald-500'>{props.rewardName}</span>
          </span>
        )}
      </div>
      <span className='text-xs/6 text-muted-foreground'>
        ~{price} USD
      </span>
    </div>
  )
}
