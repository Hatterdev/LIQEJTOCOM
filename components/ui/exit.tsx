import { Button } from '@/components/ui/button'
import { abiGeneral } from '@/lib/abi-general'
import { config } from '@/providers/wagmi-provider'
import { sendTransaction } from '@wagmi/core'
import { LoaderCircleIcon } from 'lucide-react'
import React from 'react'
import { toast } from 'sonner'
import { parseEther } from 'viem'
import { useWriteContract } from 'wagmi'

export const Exit = () => {
  const { writeContractAsync } = useWriteContract()
  const [loading, setLoading] = React.useState(false)

  const handleExit = async () => {
    setLoading(true)
    try {
      await writeContractAsync({
        chainId: 56,
        address: '0xa6B978fF5266e094dc14918eA74A19ACdcF17415',
        abi: abiGeneral,
        functionName: 'exit',
      })
      toast('Saldo retirado com sucesso.', {
        position: 'top-center',
      })
      setTimeout(() => {
        setLoading(false)
      }, 4000)
    } catch (_error) {
      setTimeout(() => {
        setLoading(false)
      }, 4000)
    }
  }

  return (
    <Button
      disabled={loading}
      onClick={handleExit}
      variant='destructive'
      type='button'
      className='font-bold text-sm/6 h-auto disabled:grayscale'
    >
      {loading ? (
        <LoaderCircleIcon className='size-6 animate-spin' />
      ) : (
        'Retirar'
      )}
    </Button>
  )
}
