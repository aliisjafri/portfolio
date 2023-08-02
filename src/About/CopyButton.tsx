import { useState } from 'react'
const CopyButton = ({
  url,
  buttonText = 'Link',
}: {
  url: string
  buttonText?: string
}) => {
  const [isClicked, setIsClicked] = useState(false)
  const handleCopyClick = async () => {
    setIsClicked(true)
    try {
      await navigator.clipboard.writeText(url)
      setIsClicked(false)
    } catch (err) {
      // eslint-disable-next-line no-console
      console.error('Failed to copy text: ', err)
      setIsClicked(false)
      throw err
    }
  }
  return (
    <button
      className={`absolute top-full left-1/2 mt-2 -translate-x-1/2 transform rounded bg-black px-3 py-1 text-sm text-white opacity-0 transition-all duration-200 group-hover:opacity-100 ${
        isClicked ? 'scale-75' : 'scale-100'
      }`}
      onClick={handleCopyClick}
    >
      Copy {buttonText}
    </button>
  )
}

export default CopyButton
