import { abiGeneral } from '@/lib/abi-general'
import { abiToken } from '@/lib/abi-token'
import { abiProxy } from '@/lib/abi.proxy'
import React from 'react'
import { formatEther, formatUnits } from 'viem'
import { useReadContract, useReadContracts, useWalletClient } from 'wagmi'

interface FormFooterProps {
  generalAddress: string
  proxyAddress: string
  tokenAddress: string
  symbol: string
  id: number
  tokenRewardAddress: string
}

export const Footer = (props: FormFooterProps) => {
  const { data: wallet } = useWalletClient()
  const {
    data: functions,
    error,
    isPending,
    refetch,
  } = useReadContracts({
    contracts: [
      {
        chainId: 56,
        address: `0x${props.generalAddress}`,
        abi: abiGeneral,
        functionName: '_balance',
        args: [wallet?.account.address],
      },
      {
        chainId: 56,
        address: `0x${props.generalAddress}`,
        abi: abiGeneral,
        functionName: '_periodFinish',
      },
      {
        chainId: 56,
        address: `0x${props.generalAddress}`,
        abi: abiGeneral,
        functionName: 'DURATION',
      },
      {
        chainId: 56,
        address: `0x${props.tokenAddress}`,
        abi: abiToken,
        functionName: 'balanceOf',
        args: [props.proxyAddress],
      },
      {
        chainId: 56,
        address: `0x${props.tokenRewardAddress}`,
        abi: abiToken,
        functionName: 'balanceOf',
        args: [`0x${props.generalAddress}`],
      },
    ],
  })

  refetch({
    cancelRefetch: false,
  })

  const endTime = Number(functions?.[1]?.result)
  const currentTime = Math.floor(Date.now() / 1000)
  const duration = Number(functions?.[2]?.result)

  const balanceOf = isPending ? BigInt(0) : BigInt(functions?.[3]?.result as string)

  const rewardOf = isPending ? BigInt(0) : BigInt(functions?.[4]?.result as string)

  const ellpasedTime = React.useMemo(() => {
    if (isPending) return 0
    if (currentTime > endTime) return 0
    if (endTime - currentTime >= duration) return duration

    return endTime - currentTime
  }, [isPending, endTime, currentTime, duration])

  const [time, setTime] = React.useState(ellpasedTime)



  // biome-ignore lint/correctness/useExhaustiveDependencies: <explanation>
  React.useEffect(() => {
    const timer = setInterval(() => {
      if (ellpasedTime === duration) {
        setTime(0)
        return
      }
      setTime(ellpasedTime)
    }, 1000)
    return () => clearInterval(timer)
  }, [ellpasedTime])

  const formatTime = (seconds: number) => {
    const d = Math.floor(seconds / 86400)
      .toString()
      .padStart(2, '0') // 86400 seconds in a day
    const h = Math.floor((seconds % 86400) / 3600)
      .toString()
      .padStart(2, '0')
    const m = Math.floor((seconds % 3600) / 60)
      .toString()
      .padStart(2, '0')
    const s = (seconds % 60).toString().padStart(2, '0')
    return `${d}d ${h}h ${m}m ${s}s`
  }

  const calculateAPR = (totalTokens: bigint, totalRewardsPerYear: bigint) => {

    if (Number(totalTokens) === 0) return 0

    return (Number(totalRewardsPerYear) / Number(totalTokens)) * 100
  }


  const periodsPerYear = BigInt(365)

  const totalRewardsPerYear = rewardOf * periodsPerYear




  // TODO



  const apr = calculateAPR(balanceOf, totalRewardsPerYear)






  return (
    <ul className='flex flex-col gap-2 col-span-2 text-xs/6 w-full'>
      <li className='flex justify-between'>
        <span>In Staking</span>
        <span>
          {wallet?.account.address === undefined
            ? 0
            : isPending
              ? 0
              : formatUnits(functions?.[0]?.result as bigint, 18)}{' '}
          {props.symbol}
        </span>
      </li>
      <li className='flex justify-between'>
        <span>APR</span>
        <span>
          {Number.isNaN(apr) ? 0 : Number(apr) < 0.01 ? Number(apr).toFixed(6) : Number(apr).toLocaleString()}%
        </span>
      </li>
      <li className='flex justify-between'>
        <span>Duration</span>
        <span>{time > 0 ? error ? formatTime(0) : formatTime(time) : "-"}</span>
      </li>
    </ul>
  )
}
