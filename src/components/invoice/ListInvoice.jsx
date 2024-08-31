'use client'
import React, { useEffect, useRef, useState } from 'react'
import Search from '../widgets/Search'
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@/components/ui/avatar"
import { format } from 'date-fns'
import { Badge } from "@/components/ui/badge"
import ReactPaginate from 'react-paginate';
import { useSearchParams, useRouter, usePathname } from 'next/navigation'
import { useDebouncedCallback } from 'use-debounce';
import Tooltip from 'rc-tooltip'
import 'rc-tooltip/assets/bootstrap_white.css'
import Link from 'next/link'
import { RiMailSendLine } from "react-icons/ri"
import { FaEdit } from "react-icons/fa"
import DeleteModal from '../widgets/DeleteModal'
import { deleteInvoice } from '@/actions/invoiceAction'
import { toast } from 'react-toastify'

const ListInvoice = ({ total, pageNumber, invoices: data }) => {
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()
  const [pageCount, setPageCount] = useState(1)
  const [search, setSearch] = useState('')
  const currentPage = useRef(1)

  useEffect(() => {
    if (total > 0) {
      setPageCount(pageNumber)
    }
  }, [pageNumber, total])

  useEffect(() => {
    debouncedHandleSearch()
  }, [search])

  function handlePageClick(e) {
    const params = new URLSearchParams(searchParams.toString())
    params.set("page", 1)
    if (currentPage.current) {
      params.set("page", e.selected + 1)
    }
    currentPage.current = e.selected + 1;
    router.replace(`${pathname}?${params.toString()}`)
  }

  // Debounce callback
  const debouncedHandleSearch = useDebouncedCallback(() => {
    const params = new URLSearchParams(searchParams.toString())
    if (search) {
      params.set("search", search)
    } else {
      params.delete("search")
    }
    router.replace(`${pathname}?${params.toString()}`)
  }, 1000);

  const handleSearch = (e) => {
    const params = new URLSearchParams(searchParams.toString())
    if (search) {
      params.set("search", search)
    } else {
      params.delete("search")
    }
    router.replace(`${pathname}?${params.toString()}`)
  }

  const onDelete = async (id) => {
    console.log(id);
    const res = await deleteInvoice(id);
    if(res?.error) {
      toast.error(res.error);
    }
    if(res?.message) {
      toast.success(res?.message)
    }
  }
  return (
    <div>
      <div className='flex-between border-b-[1px] border-gray-400 pb-3'>
        <p>Total: {total} invoices</p>
        <Search
          placeholder={'Search'}
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[100px]">s/n</TableHead>
            <TableHead>Customer</TableHead>
            <TableHead>Email</TableHead>
            <TableHead>Amount</TableHead>
            <TableHead>Date</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Action</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {data?.map((invoice, index) => (
            <TableRow key={invoice._id}>
              <TableCell className="font-medium">{index + 1}</TableCell>
              <TableCell>
                <div className="flex-start space-x-2">
                  <span>
                    <Avatar>
                      <AvatarImage src={invoice?.customer?.image} alt="@shadcn" />
                      <AvatarFallback>{invoice?.customer?.name?.slice(0, 2)}</AvatarFallback>
                    </Avatar>
                  </span>
                  <span>
                    {invoice?.customer?.name}
                  </span>
                </div>
              </TableCell>
              <TableCell>{invoice?.customer.email}</TableCell>
              <TableCell>{invoice?.amount}</TableCell>
              <TableCell>{format(new Date(invoice?.createdAt), "MMM dd,yyyy")}</TableCell>
              <TableCell>
                <Badge variant={invoice.status === 'paid' ? 'default' : 'destructive'}>{invoice.status}</Badge>
              </TableCell>
              <TableCell className='flex space-x-3'>
                <>
                  <span>
                    <Tooltip placement="top" trigger={['hover']} overlay={<span>Send Email</span>}>
                      <RiMailSendLine size={24} color={'purple'} className="cursor-pointer"
                        onClick={() => sendThisInvoice(invoice)} />
                    </Tooltip>
                  </span>
                  <span>
                    <Tooltip placement="top" trigger={['hover']} overlay={<span>Edit</span>}>
                      <Link href={`/?id=${invoice._id}`}>
                        <FaEdit size={24} color={'green'} className='cursor-pointer' />
                      </Link>
                    </Tooltip>
                  </span>
                  <span>
                    <Tooltip placement="top" trigger={['hover']} overlay={<span>Delete</span>}>
                      <DeleteModal title={'Delete Invoice'}
                        desc={'Are you sure you want to delete this invoice'}
                        pass={'delete'}
                        onClick={() => onDelete(invoice._id)}
                      />
                    </Tooltip>
                  </span>
                </>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
      {
        data?.length > 0 && (
          <ReactPaginate
            breakLabel="..."
            nextLabel="Next"
            onPageChange={handlePageClick}
            pageRangeDisplayed={5}
            pageCount={pageCount}
            previousLabel="Prev"
            renderOnZeroPageCount={null}
            marginPagesDisplayed={2}
            containerClassName='pagination'
            pageLinkClassName='page-num'
            previousClassName='page-num'
            nextLinkClassName='page-num'
            activeLinkClassName='activePage'
          />
        )
      }
    </div>
  )
}

export default ListInvoice