import React from 'react'

type StatusIndicatorProps = {
  status: 'playing' | 'recording' | 'idle'
  hasSelectedClip: boolean
}

const StatusIndicator = ({ status, hasSelectedClip }: StatusIndicatorProps) => {
  const statusConfig = {
    recording: {
      icon: 'fas fa-circle',
      color: 'text-red-500',
      text: 'Recording',
    },
    playing: {
      icon: 'fas fa-play',
      color: 'text-green-500',
      text: 'Playing',
    },
    ready: {
      icon: 'fas fa-check-circle',
      color: 'text-green-500',
      text: 'Ready',
    },
    idle: {
      icon: 'fas fa-pause',
      color: 'text-gray-500',
      text: 'No clip selected',
    },
  }

  const currentStatus =
    status === 'recording'
      ? 'recording'
      : status === 'playing'
      ? 'playing'
      : hasSelectedClip
      ? 'ready'
      : 'idle'

  const config = statusConfig[currentStatus]

  return (
    <>
      <i className={`${config.icon} ${config.color}`}></i>
      {config.text}
    </>
  )
}

export default StatusIndicator
