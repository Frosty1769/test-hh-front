import { useEffect, useRef, useState } from 'react'
import './App.css'
import type { ItemGetOut } from './interfaces/Item'
import { getItems } from './api/functions'
import DragContext from './components/dnd/DragContext'

function App() {
  const [items, setItems] = useState<ItemGetOut[]>([])
  const [currentPage, setCurrentPage] = useState<number>(0)
  const [prevSearch, setPrevSearch] = useState<string>('')
  const [isLoading, setIsLoading] = useState<boolean>(false)
  const listInnerRef = useRef<HTMLDivElement>(null)
  const [search, setSearch] = useState<string>('');
  

  useEffect(()=>{
    if (search === prevSearch){
      readPage(currentPage+1, search)
      setPrevSearch(search)
      return
    }
    readPage(1, search, true)
    setPrevSearch(search)
  }, [search])


  const readPage = (page: number, search?: string, isRefresh: boolean = false) => {
    if (isLoading) return
    setCurrentPage(page)
    setIsLoading(true)
    getItems(page, search || '', (res) => {
      if (res.status === 'success' && res.data) {
        if (isRefresh) setItems([...res.data])
        else setItems([...items, ...res.data])
      }
      setIsLoading(false)
    })
  }

  const onScroll = () => {
    if (listInnerRef.current) {
      const { scrollTop, scrollHeight, clientHeight } = listInnerRef.current;
      if (scrollTop + clientHeight === scrollHeight) {
        readPage(currentPage+1, search)
      }
    }
  };

  const onSearchDebounced = (search: string) => {
    setSearch(search)
  }

  return (
    <>
      <div className='flex justify-center w-screen'>
        <div
          ref={listInnerRef}
          className='flex flex-col items-center w-[600px] bg-gray-900 max-h-screen'>
            <DragContext 
                onSearchDebounced={onSearchDebounced} 
                key={"key"} 
                items={[...items]} 
                setItems={setItems} 
                onScroll={onScroll}
              />
              {isLoading && <div className='fixed flex left-1/2 -translate-1/2 justify-center items-center bottom-3 w-8 h-8 rounded-full p-1 bg-cyan-950 border border-cyan-700'>
                <div
			          	className='border-current inline-block h-4 w-4 animate-spin rounded-full border-2 border-solid border-r-transparent align-[-0.125em] text-cyan-500 motion-reduce:animate-[spin_1.5s_linear_infinite]'
			          	role='status'
			          />
              </div>}
        </div>
      </div>
    </>
  )
}

export default App
