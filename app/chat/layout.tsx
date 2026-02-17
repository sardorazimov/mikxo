import React from 'react'

const ChatLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="flex bg-black items-center justify-center min-h-screen">{children}</div>
  )
}

export default ChatLayout