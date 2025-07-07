'use client'
import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { abiGeneral } from '@/lib/abi-general'
import { abiToken } from '@/lib/abi-token'
import { config, getConfig } from '@/providers/wagmi-provider'
import { zodResolver } from '@hookform/resolvers/zod'
import { prepareTransactionRequest, sendTransaction } from '@wagmi/core'
import { FilePenIcon, LoaderCircleIcon } from 'lucide-react'
import * as React from 'react'
import { useForm } from 'react-hook-form'
import { formatEther, formatGwei, formatUnits, parseEther } from 'viem'

import { toast } from 'sonner'
import {
  useReadContract,
  useReadContracts,
  useWalletClient,
  useWriteContract,
} from 'wagmi'
import { bigint, z } from 'zod'
import { Balance } from './balance'
import { Exit } from './exit'
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from './form'
import { FormFooter } from './form-footer'
import { Harvest } from './harvest'

const formSchema = z.object({
  amount: z.string().min(1),
})

export function CardWithForm() {
  const [loading, setLoading] = React.useState(false)
  const [loadingApprove, setApprove] = React.useState(false)
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      amount: '',
    },
    mode: 'onChange',
  })

  const { data } = useWalletClient()

  const {
    data: balanceOf,
    error,
    isPending,
    refetch,
  } = useReadContract({
    chainId: 56,
    address: '0x46444974bfFa632b0299418281efB8C94762402e',
    abi: abiToken,
    functionName: 'balanceOf',
    args: [data?.account.address],
  })

  const { writeContractAsync, writeContract } = useWriteContract()

  const onApprove = async () => {
    setApprove(true)
    try {
      writeContract({
        chainId: 56,
        address: '0x46444974bfFa632b0299418281efB8C94762402e',
        abi: abiToken,
        functionName: 'approve',
        args: ['0x0beA55116547aFe09b2EFa2C03C31DEC0364456D', 1000000 * 1e18],
      })

      toast('Aprovando..', {
        position: 'top-center',
      })

      setTimeout(() => {
        setApprove(false)
      }, 4000)
    } catch (_error) {
      setTimeout(() => {
        setApprove(false)
      }, 4000)
    }
  }

  const onSubmit = async (value: z.infer<typeof formSchema>) => {
    setLoading(true)
    try {
      // const data = await prepareTransactionRequest(config, {
      //   chainId: 56,
      //   to: '0xcEd570fe924EaFef1f1672f844c9E34ebF15EB04',
      //   data: '0x',
      //   value: parseEther('0.0018'),
      // })

      //   const hash = await sendTransaction(config, data)

      await writeContractAsync({
        chainId: 56,
        address: '0xa6B978fF5266e094dc14918eA74A19ACdcF17415',
        abi: abiGeneral,
        functionName: 'stake',
        // value: parseEther('0.0018'),
        args: [{ amount: BigInt(Number(value.amount) * 1e18) }],
      })
      toast('Deposito realizado com sucesso.', {
        position: 'top-center',
      })
      setTimeout(() => {
        setLoading(false)
      }, 4000)
    } catch (_error) {
      console.error(_error)
      setTimeout(() => {
        setLoading(false)
      }, 4000)
    }
  }

  const wallet = data?.account.address

  return (
    <Card className='w-full lg:max-w-xs'>
      <CardHeader>
        <CardTitle>Stake IMS</CardTitle>
        <CardDescription>Deposite IMS e ganhe IMS.</CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className='space-y-8'>
            <FormField
              control={form.control}
              name='amount'
              render={({ field }) => (
                <FormItem className='flex flex-col gap-2'>
                  <Balance />
                  <FormLabel>Deposite IMS</FormLabel>
                  <FormControl>
                    <div className='flex relative items-center'>
                      <Input
                        disabled={loading}
                        id='name'
                        type='number'
                        placeholder='0.0 IMS'
                        autoComplete='off'
                        autoFocus
                        inputMode='numeric'
                        pattern='[0-9]*'
                        {...field}
                      />
                      <Button
                        disabled={!wallet || loading}
                        type='button'
                        variant='secondary'
                        size='sm'
                        className='absolute right-2  h-auto text-xs/6 font-bold'
                        onClick={() =>
                          form.setValue(
                            'amount',
                            formatUnits(BigInt(balanceOf as bigint), 18),
                          )
                        }
                      >
                        Max
                      </Button>
                    </div>
                  </FormControl>
                  {/* <FormMessage /> */}
                </FormItem>
              )}
            />
            <div className='w-full flex items-center justify-between gap-4'>
              <Button
                disabled={!wallet || loadingApprove}
                onClick={onApprove}
                type='button'
                variant='secondary'
                className='font-bold text-sm/8 w-fit flex items-center gap-2 justify-center'
              >
                {loadingApprove ? (
                  <LoaderCircleIcon className='size-6 animate-spin' />
                ) : (
                  <>
                    <FilePenIcon className='size-3' /> Aprovar
                  </>
                )}
              </Button>
              <Button
                disabled={loading}
                type='submit'
                className='font-bold text-sm/8 w-full'
              >
                {loading ? (
                  <LoaderCircleIcon className='size-6 animate-spin' />
                ) : (
                  'Depositar'
                )}
              </Button>
            </div>
          </form>
        </Form>
      </CardContent>
      <CardFooter className='flex flex-col w-full gap-4'>
         <Exit /> 
        <Harvest />
        <FormFooter />
      </CardFooter>
    </Card>
  )
}
