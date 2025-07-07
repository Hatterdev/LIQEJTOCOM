'use client'
import { CardWithForm } from '@/components/ui/form-stake'
import { Staking } from '@/components/ui/staking'
import { ConnectKitButton } from 'connectkit'
import Image from 'next/image'

export default function Home() {
  // This is a mock data, replace it with your actual data fetching logic
  const tokens = [
    {
      id: 1,
      depositName: 'IMS',
      rewardName: 'IMS',
      locked: true,
      tokenAddress: "46444974bfFa632b0299418281efB8C94762402e",
      generalAddress: "f4B16b79Ba0D9b570D769DBee8dAB5A0e544e859",
      proxyAddress: "0x7321211BDE69d979C6b07854a4B0b97411Bc3a47",
      tokenRewardAddress: "46444974bfFa632b0299418281efB8C94762402e",
      timeLocked: "30 days",
      poolAddress: "0x44db6ade057ebdd14e8e2ba9ea80380848f40401",
      timeLockedSeconds: 2592000 // 30 days in seconds
    },
    {
      id: 2,
      depositName: 'IMS',
      rewardName: 'IMS',
      locked: false,
      tokenAddress: "46444974bfFa632b0299418281efB8C94762402e",
      generalAddress: "1C22cD51C4Add52e9CFb0a9F7064299caA2058fc",
      proxyAddress: "0xA70B3De347511d6Eba50C5737d442500434f0aBc",
      tokenRewardAddress: "46444974bfFa632b0299418281efB8C94762402e",
      timeLocked: "No lock",
      poolAddress: "0x44db6ade057ebdd14e8e2ba9ea80380848f40401",
      timeLockedSeconds: 0 // No lock

    },
    {
      id: 3,
      depositName: 'RWA',
      rewardName: 'IMS',
      locked: false,
      tokenAddress: "807ae36882723A75bfECaB46a426F8a7806B91cA",
      generalAddress: "7C91908548b8FF176F9062BC832b1A8bF68Eab81",
      proxyAddress: "0x3B842898F3ac7b02Bc58dA5d6B89B95B12802291",
      tokenRewardAddress: "46444974bfFa632b0299418281efB8C94762402e",
      timeLocked: "No lock",
      poolAddress: "0x44db6ade057ebdd14e8e2ba9ea80380848f40401",
      timeLockedSeconds: 0 // No lock

    },
    {
      id: 4,
      depositName: 'IMS',
      rewardName: 'BTC',
      locked: true,
      tokenAddress: "46444974bfFa632b0299418281efB8C94762402e",
      generalAddress: "040db83b78A3028A3EEccD059578aDA4D31049FA",
      tokenRewardAddress: "7130d2a12b9bcbfae4f2634d864a1ee1ce3ead9c",
      proxyAddress: "0xCb30B5fED38985496691a1db4690F485e934BC65",
      timeLocked: "180 days",
      poolAddress: "0x6bbc40579ad1bbd243895ca0acb086bb6300d636",
      timeLockedSeconds: 15552000 // 180 days in seconds
    },
    {
      id: 5,
      depositName: 'IMS',
      rewardName: 'USDT',
      locked: true,
      tokenAddress: "46444974bfFa632b0299418281efB8C94762402e",
      tokenRewardAddress: "55d398326f99059ff775485246999027b3197955",
      generalAddress: "b6DDF8Df9FD74b14974fa4469C3e2f571697EBd3",
      proxyAddress: "0xEfE0b5f3275085557Dd5DD520868412512BF4218",
      timeLocked: "90 days",
      poolAddress: "0x44db6ade057ebdd14e8e2ba9ea80380848f40401",
      timeLockedSeconds: 7776000 // 90 days in seconds
    }
  ]

  return (
    <main className='flex flex-col items-center justify-start pt-24 pb-24 px-4 gap-4 flex-1 bg-[url("/assets/bg.jpg")] bg-cover bg-fixed bg-center bg-no-repeat'>
      <ConnectKitButton mode='dark' />
      {/* <CardWithForm /> */}
      <div className='grid grid-cols-1 xl:grid-cols-4 lg:grid-cols-3 md:grid-cols-2 gap-4 '>
        {
          tokens.map((t) => (
            <Staking tokenRewardAddress={t.tokenRewardAddress} key={t.id} depositName={t.depositName} tokenAddress={t.tokenAddress}
              generalAddress={t.generalAddress} proxyAddress={t.proxyAddress} id={t.id}
              rewardName={t.rewardName} locked={t.locked} timeLockedSeconds={t.timeLockedSeconds} daysLocked={t.timeLocked} poolAddress={t.poolAddress} />
          ))
        }
      </div>
    </main>
  )
}
