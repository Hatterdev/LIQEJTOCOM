'use client'

import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { ConnectKitProvider, getDefaultConfig } from 'connectkit'
import { bsc, bscTestnet } from 'viem/chains'
import { http, WagmiProvider as Provider, createConfig } from 'wagmi'

const walletConnectProjectId = process.env.NEXT_PUBLIC_WC_KEY as string

export const config = createConfig(
  getDefaultConfig({
    chains: [bsc],
    transports: {
      [bsc.id]: http('https://bsc-dataseed1.binance.org/'),
    },
    ssr: true,
    cacheTime: 4_000,
    walletConnectProjectId,
    appName: 'IMS DApp',
    appDescription:
      'IMS is a project that unites the virtual world with the physical world, bringing ballast and security...',
    appUrl: '',
    appIcon: 'https://family.co/logo.png',
  }),
)

export function getConfig() {
  return config
}

export const WagmiProvider = ({ children }: { children: React.ReactNode }) => {
  const queryClient = new QueryClient()

  return (
    <QueryClientProvider client={queryClient}>
      <Provider config={config}>
        <ConnectKitProvider mode='dark'>{children}</ConnectKitProvider>
      </Provider>
    </QueryClientProvider>
  )
}
