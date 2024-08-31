import React from 'react'
import { Input } from '../ui/input'
import { BiSearch } from 'react-icons/bi'

const Search = ({ value, onChange, defaultValue,placeholder }) => {
    return (
        <div className='relative'>
            <BiSearch size={18} className='absolute left-2 top-1/2 -translate-y-1/2 text-gray-400' />
            <Input className='pl-8 text-color-dark'
                type='text'
                placeholder={placeholder}
                value={value}
                onChange={onChange}
                defaultValue={defaultValue}
            />
        </div>
    )
}

export default Search