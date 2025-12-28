// import { useEffect, useRef } from 'react'
// import useUser from '../zustand/useUser'
// import { io, type Socket } from 'socket.io-client'

// const useSocket = () => {
//   const SOCKET_URL = import.meta.env.VITE_APP_SOCKET_URL as string

//   const accessToken = useUser((state) => state.user.token)
//   const socketRef = useRef<Socket | null>(null)

//   useEffect(() => {
//     if (accessToken && !socketRef.current) {
//       const socket = io(SOCKET_URL, {
//         transports: ['websocket'],
//         withCredentials: true,
//         auth: {
//           authorization: accessToken,
//         },
//       })

//       socketRef.current = socket

//       return () => {
//         socket.disconnect()
//       }
//     }
//   }, [accessToken])

//   return socketRef.current
// }

// export default useSocket


import { useEffect, useRef } from 'react'
import { io, type Socket } from 'socket.io-client'

const useSocket = () => {
  const SOCKET_URL = 'http://localhost:3000' // Direct URL since backend doesn't need token
  
  const socketRef = useRef<Socket | null>(null)

  useEffect(() => {
    if (!socketRef.current) {
      const socket = io(SOCKET_URL, {
        transports: ['websocket'],
        withCredentials: true,
        // Removed auth section since backend doesn't need token
      })

      socketRef.current = socket

      // Add connection event listeners for debugging
      socket.on('connect', () => {
        console.log('Socket connected:', socket.id)
      })

      socket.on('disconnect', () => {
        console.log('Socket disconnected')
      })

      socket.on('connect_error', (error) => {
        console.error('Socket connection error:', error)
      })

      return () => {
        socket.disconnect()
        socketRef.current = null
      }
    }
  }, []) // Removed accessToken dependency

  return socketRef.current
}

export default useSocket