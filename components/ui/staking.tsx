import { z } from "zod"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "./card"
import { Form, FormControl, FormField, FormItem, FormLabel } from "./form"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { Button } from "./button"
import { useReadContract, useWalletClient, useWriteContract } from "wagmi"
import { abiToken } from "@/lib/abi-token"
import { toast } from "sonner"
import React from "react"
import { LoaderCircleIcon } from "lucide-react"
import { Input } from "./input"
import { formatUnits, parseEther } from "viem"
import { abiGeneral } from "@/lib/abi-general"
import { Footer } from "./footer"
import { BalanceStaking } from "./balanceStkaing"

interface StakingPRops {
  depositName: string
  rewardName: string
  generalAddress: string
  proxyAddress: string
  locked: boolean
  tokenAddress: string,
  timeLockedSeconds: number
  daysLocked?: string
  poolAddress: string
  id: number
  tokenRewardAddress: string
}

const formSchema = z.object({
  amount: z.string().min(1),
})

export const Staking = (props: StakingPRops) => {
  const [loadingSubmit, setSubmit] = React.useState(false)
  const [loadingApprove, setApprove] = React.useState(false)
  const [loadingExit, setExit] = React.useState(false)
  const [loadingHarvest, setHarvest] = React.useState(false)

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      amount: '',
    },
    mode: 'onChange',
  })


  const onSubmit = async (value: z.infer<typeof formSchema>) => {
    setSubmit(true)
    toast.success('Depositando..', {
      position: 'top-center',
    })
    try {

      await writeContractAsync({
        chainId: 56,
        address: `0x${props.generalAddress}`,
        abi: abiGeneral,
        functionName: 'stake',
        args: [{ amount: BigInt(Number(value.amount) * 1e18) }],
        value: parseEther("0.00031"),
      })

      toast.success('Depositado com sucesso', {
        position: 'top-center',
      })
    } catch (error) {
      console.info(error)
      toast.error('Hmm, algo deu errado..', {
        position: 'top-center',
      })
    } finally {
      setSubmit(false)
      form.reset()
    }
  }

  const { writeContractAsync, writeContract, } = useWriteContract()

  const { data } = useWalletClient()

  const {
    data: balanceOf,
    error,
    isPending,
    refetch,
  } = useReadContract({
    chainId: 56,
    address: `0x${props.tokenAddress}`,
    abi: abiToken,
    functionName: 'balanceOf',
    args: [data?.account.address],
  })

  console.info(data?.account.address)

  refetch({
    cancelRefetch: false,
  })

  const onApprove = async () => {
    setApprove(true)
    toast.success('Aprovando..', {
      position: 'top-center',
    })
    try {

      await writeContractAsync({
        chainId: 56,
        address: `0x${props.tokenAddress}`,
        abi: abiToken,
        functionName: 'approve',
        args: [props.proxyAddress, 1000000 * 1e18],
      })

      toast.success('Aprovado com sucesso', {
        position: 'top-center',
      })
    } catch (error) {
      console.info(error)
      toast.error('Hmm, algo deu errado..', {
        position: 'top-center',
      })
    } finally {
      setApprove(false)
    }
  }

  const handleExit = async () => {
    setExit(true)
    try {
      await writeContractAsync({
        chainId: 56,
        address: `0x${props.generalAddress}`,
        abi: abiGeneral,
        functionName: 'exit',
      })
      toast('Saldo retirado com sucesso.', {
        position: 'top-center',
      })

    } catch (error) {
      console.info(error)
      toast.error('Hmm, algo deu errado..', {
        position: 'top-center',
      })
    } finally {
      setExit(false)
    }
  }


  const handleHarvest = async () => {
    setHarvest(true)
    try {
      await writeContractAsync({
        chainId: 56,
        address: `0x${props.generalAddress}`,
        abi: abiGeneral,
        functionName: 'harvest',
      })
      toast('Recompensa retirada com sucesso.', {
        position: 'top-center',
      })

    } catch (error) {
      console.info(error)
      toast.error('Hmm, algo deu errado..', {
        position: 'top-center',
      })
    } finally {
      setHarvest(false)
    }
  }

  return <Card className='w-full lg:max-w-sm'>
    <CardHeader>
      <CardTitle>Staking {props.depositName}</CardTitle>
      <CardDescription>Deposite {props.depositName} e ganhe {props.rewardName}.  {!props.locked ? (
        <span className="p-1 px-2 bg-red-500 rounded-full text-white text-xs/6">Unlocked</span>
      ) : (
        <span className="p-1 px-2 bg-emerald-500 rounded-full text-white text-xs/6">Locked {props.timeLockedSeconds && props.daysLocked}</span>
      )}</CardDescription>
    </CardHeader>
    <CardContent>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className='space-y-8'>
          <FormField
            control={form.control}
            name='amount'
            render={({ field }) => (
              <FormItem className='flex flex-col gap-2'>
                <BalanceStaking generalAddress={props.generalAddress} rewardName={props.rewardName} poolAddress={props.poolAddress} />
                <FormLabel>Deposite {props.depositName}</FormLabel>
                <FormControl>
                  <div className='flex relative items-center'>
                    <Input
                      // disabled={loading}
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
                      // disabled={!wallet || loading}
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
          <div className="flex gap-2 w-full *:font-bold *:text-sm/8">
            <Button disabled={loadingApprove} type="button" variant="secondary" onClick={onApprove} className="w-full min-w-24 max-w-24">
              {loadingApprove ? <LoaderCircleIcon className="size-6 animate-spin" /> : 'Aprovar'}
            </Button>
            <Button disabled={loadingSubmit} variant="default" className="w-full" type="submit">
              {loadingSubmit ? <LoaderCircleIcon className="size-6 animate-spin" /> : 'Depositar'}
            </Button>
          </div>
        </form>
      </Form>
    </CardContent>
    <CardFooter>
      <div className="flex flex-col gap-2 w-full *:font-bold *:text-sm/8">
        <Button disabled={props.locked || loadingExit} variant="destructive" onClick={handleExit}>
          {loadingExit ? <LoaderCircleIcon className="size-6 animate-spin" /> : 'Sair'}
        </Button>
        <Button disabled={loadingHarvest} variant="default" onClick={handleHarvest}>
          {loadingHarvest ? <LoaderCircleIcon className="size-6 animate-spin" /> : 'Recompensas'}
        </Button>

        <Footer id={props.id} tokenRewardAddress={props.tokenRewardAddress} generalAddress={props.generalAddress} proxyAddress={props.proxyAddress} tokenAddress={props.tokenAddress} symbol={props.depositName} />
      </div>
    </CardFooter>
  </Card>
}
