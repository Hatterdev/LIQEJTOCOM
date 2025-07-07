import { abiGeneral } from '@/lib/abi-general'
import { abiToken } from '@/lib/abi-token'
import { abiProxy } from '@/lib/abi.proxy'
import React from 'react'
import { formatUnits } from 'viem'
import { useReadContract, useReadContracts, useWalletClient } from 'wagmi'

export const FormFooter = () => {
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
        address: '0xa6B978fF5266e094dc14918eA74A19ACdcF17415',
        abi: abiGeneral,
        functionName: '_balance',
        args: [wallet?.account.address],
      },
      {
        chainId: 56,
        address: '0xa6B978fF5266e094dc14918eA74A19ACdcF17415',
        abi: abiGeneral,
        functionName: '_periodFinish',
      },
      {
        chainId: 56,
        address: '0xa6B978fF5266e094dc14918eA74A19ACdcF17415',
        abi: abiGeneral,
        functionName: 'DURATION',
      },
      {
        chainId: 56,
        address: '0x46444974bfFa632b0299418281efB8C94762402e',
        abi: abiToken,
        functionName: 'balanceOf',
        args: ['0x0beA55116547aFe09b2EFa2C03C31DEC0364456D'],
      },
      {
        chainId: 56,
        address: '0x46444974bfFa632b0299418281efB8C94762402e',
        abi: abiToken,
        functionName: 'balanceOf',
        args: ['0xa6B978fF5266e094dc14918eA74A19ACdcF17415'],
      },
    ],
  })

  refetch({
    cancelRefetch: false,
  })

  const endTime = Number(functions?.[1]?.result)
  const currentTime = Math.floor(Date.now() / 1000)
  const duration = Number(functions?.[2]?.result)

  const balanceOf = Number(functions?.[3]?.result)

  const rewardOf = Number(functions?.[4]?.result)

  const ellpasedTime = React.useMemo(() => {
    if (isPending) return 0
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

  const calculateAPR = (totalTokens: number, totalRewardsPerYear: number) => {
    if (totalTokens === 0) return 0
    return (totalRewardsPerYear / totalTokens) * 100
  }

  // TODO

  const periodsPerYear = 365
  const totalRewardsPerYear = rewardOf * periodsPerYear

  const apr = calculateAPR(balanceOf, totalRewardsPerYear)

  return (
    <ul className='flex flex-col gap-2 col-span-2 text-xs/6 w-full'>
      <li className='flex justify-between'>
        <span>My Balance</span>
        <span>
          {wallet?.account.address === undefined
            ? 0
            : isPending
              ? 0
              : formatUnits(functions?.[0]?.result as bigint, 18)}{' '}
          IMS
        </span>
      </li>
      <li className='flex justify-between'>
        <span>APR</span>
        <span>
          {Number.isNaN(apr) ? 0 : Number(apr.toFixed(0)).toLocaleString()}%
        </span>
      </li>
      <li className='flex justify-between'>
        <span>Duration</span>
        <span>{error ? formatTime(0) : formatTime(time)}</span>
      </li>
    </ul>
  )
}
