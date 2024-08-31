'use client'
import React, { useEffect, useState } from 'react'
import ActionModal from '../widgets/ActionModal'
import { Button } from '../ui/button'
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"
import {
    Select,
    SelectContent,
    SelectGroup,
    SelectItem,
    SelectLabel,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import {
    Form,
    FormControl,
    FormDescription,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Input } from '../ui/input'
import { LoadingButton } from '../widgets/Loader'
import { useRouter, useSearchParams } from 'next/navigation'
import { createInvoice, getInvoice, updateInvoice } from '@/actions/invoiceAction'
import { toast } from 'react-toastify'

const customers = [
    {
        id: 1,
        name: "Sashi",
        image: "https://i.pravatar.cc/300?u=a042581f4e29026702d",
        email: "sashisam10@gmail.com",
    },
    {
        id: 2,
        name: "Sai",
        image: "https://i.pravatar.cc/300?u=a042581f4e29026702d",
        email: "sashisam10@gmail.com",
    },
    {
        id: 3,
        name: "Kumar",
        image: "https://i.pravatar.cc/300?u=a042581f4e29026702d",
        email: "sashisam10@gmail.com",
    },

]

const formSchema = z.object({
    name: z.string().min(2, {
        message: "Name is required",
    }),
    status: z.string().min(2, {
        message: "Status is required",
    }),
    amount: z.string().min(2, {
        message: "Amount is required",
    }),
})

const CreateInvoice = () => {
    const [open, setOpen] = useState(false)
    const router = useRouter()
    const searchParams = useSearchParams()
    const id = searchParams.get('id')
    // 1. Define your form.
    const form = useForm({
        resolver: zodResolver(formSchema),
        defaultValues: {
            name: "",
            amount: "",
            status: "Unpaid",
        },
    })

    const isLoading = form.formState.isSubmitting

    // 2. Define a submit handler.
    async function onSubmit(values) {
        // Do something with the form values.
        // ✅ This will be type-safe and validated.
        const { name, amount, status } = values
        console.log(values)
        const customer = customers.find((c) => c.name === name)
        const formData = {
            customer,
            amount,
            status,
            id: id ? id : ''
        }
        if (id) {
            //update
            const res = await updateInvoice(formData)
            console.log(res)
            if (res?.error) {
                toast.error(res.error)
            }
            if (res?.message) {
                toast.success(res.message)
            }
            form.reset()
            setOpen(false)
            router.push('/')
        } else {
            //create
            const res = await createInvoice(formData)
            console.log(res)
            if (res?.error) {
                toast.error(res.error)
            }
            if (res?.message) {
                toast.success(res.message)
            }
            form.reset()
            setOpen(false)
            router.push('/')
        }
    }

    useEffect(() => {
        const fetchInvoice = async () => {
            const res = await getInvoice(id);
            const invoice = JSON.parse(res);
            form.setValue('name',invoice.customer.name);
            form.setValue('amount',invoice.amount);
            form.setValue('status',invoice.status)
        }
        if (id) {
            setOpen(true)
            fetchInvoice()
        }
    }, [id])

    useEffect(() => {
        if (!open) {
            router.replace('/')
        }
    }, [open,router])

    return (
        <div>
            <ActionModal title="Create Invoice"
                desc="Create a new Invoice"
                trigger={
                    <Button className="text-white space-x-1">
                        <span>Create Invoice</span>
                        <span className="text-lg">+</span>
                    </Button>
                }
                open={open}
                setOpen={setOpen}
            >
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="w-full space-y-6">
                        <FormField
                            control={form.control}
                            name="name"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Name</FormLabel>
                                    <Select value={field.value} // Bind the selected value
                                        onValueChange={(value) => field.onChange(value)}>
                                        <FormControl>
                                            <SelectTrigger>
                                                <SelectValue placeholder="Select a Customer" />
                                            </SelectTrigger>
                                        </FormControl>
                                        <SelectContent>
                                            {customers?.map((customer) => (
                                                <SelectItem key={customer.id} value={customer.name}>
                                                    {customer.name}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>

                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="amount"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Amount</FormLabel>
                                    <FormControl>
                                        <Input placeholder="Amount" {...field} />
                                    </FormControl>

                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="status"
                            render={({ field }) => (
                                <FormItem className="space-y-3">
                                    <FormLabel>Status.</FormLabel>
                                    <FormControl>
                                        <RadioGroup
                                            onValueChange={field.onChange}
                                            defaultValue={field.value}
                                            className="flex flex-col space-y-1"
                                        >
                                            <FormItem className="flex items-center space-x-3 space-y-0">
                                                <FormControl>
                                                    <RadioGroupItem value="paid" />
                                                </FormControl>
                                                <FormLabel className="font-normal">
                                                    Paid
                                                </FormLabel>
                                            </FormItem>
                                            <FormItem className="flex items-center space-x-3 space-y-0">
                                                <FormControl>
                                                    <RadioGroupItem value="Unpaid" />
                                                </FormControl>
                                                <FormLabel className="font-normal">
                                                    Unpaid
                                                </FormLabel>
                                            </FormItem>

                                        </RadioGroup>
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        {isLoading ? (<LoadingButton btnClass="w-full" btnVariant={'outline'} btnText={"Loading"} />) : (<Button className="w-full" type="submit">
                            {
                                id ? 'Update Invoice' : 'Create Invoice'
                            }
                        </Button>)}
                    </form>
                </Form>
            </ActionModal>
        </div>
    )
}

export default CreateInvoice