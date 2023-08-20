import React, { useState } from 'react'
import MotionButton from './MotionButton'
type CopyToClipboardButtonProps = {
  targetRef: React.RefObject<HTMLDivElement>
}

const CopyToClipboardButton = ({ targetRef }: CopyToClipboardButtonProps) => {
  const [buttonText, setButtonText] = useState<string>('Copy')

  const copyToClipboard = () => {
    const text = targetRef.current?.innerText || ''
    navigator.clipboard.writeText(text).then(() => {
      setButtonText('Copied!')
      setTimeout(() => {
        setButtonText('Copy')
      }, 4000)
    })
  }

  return (
    <MotionButton onClick={copyToClipboard}>
      {buttonText}
      <i className="fa-regular fa-copy pl-2"></i>
    </MotionButton>
  )
}

export default CopyToClipboardButton
