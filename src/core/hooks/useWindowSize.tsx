import { useState, useEffect } from 'react'

export const useWindowSize = () => {
  const [windowSize, setWindowSize] = useState({
    width: window.innerWidth,
    height: window.innerHeight,
  })

  useEffect(() => {
    const handler = () => {
      setWindowSize({
          width: window.innerWidth,
          height: window.innerHeight,
      })
    }
    window.addEventListener('resize', handler)

    return () => {
        window.removeEventListener('resize', handler)
    }
  }, [])

  return windowSize
}