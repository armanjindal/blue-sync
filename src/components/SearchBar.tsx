"use client"
import { useState, useEffect, ChangeEvent, useCallback } from "react"
import debounce from "lodash.debounce"

// TODO: Convert this into a real supabase query
const mock_results = ['John', 'Jane', 'Jill', 'Joe']

const getSearchResults = async (searchTerm: string) => {
  console.log('Mock API request TODO: switch to SupaBase')
  await new Promise((resolve) => setTimeout(resolve, 1000)) // Mock call
  const res =  mock_results.filter((result) => result.toLowerCase().includes(searchTerm.toLowerCase()))
  console.log(res)
  return res
}

export default function SearchBar () {
  const [open, setOpen] = useState(true)
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [searchResults, setSearchResults] =  useState<string[]>([]);

  const request = debounce(async (searchTerm : string) => {
      const results = await getSearchResults(searchTerm)
      setSearchResults(results)
    },1000 //debounce time
  )

  const debouncedRequest = useCallback(
    (searchTerm: string)=> request(searchTerm), 
    []
  )


  //
  const onChange = (e: ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value); // constrolled input value 
    debouncedRequest(e.target.value)
  };

  return (
    <div className="flex gap-4 p-2 fixed min-w-[400px]">
      <input
        type="text"
        placeholder="Search..."
        value={searchTerm}
        onChange={onChange}
        className="bg-gray-200 border min-w-[300px] border-gray-300 rounded-lg py-2 px-4 focus:outline-none focus:ring-1"
      />
    </div>
  )
}