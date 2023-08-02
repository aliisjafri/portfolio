const CopyButton = ({
  url,
  buttonText = 'Link',
}: {
  url: string
  buttonText?: string
}) => {
  const handleCopyClick = async () => {
    try {
      await navigator.clipboard.writeText(url)
    } catch (err) {
      // eslint-disable-next-line no-console
      console.error('Failed to copy text: ', err)
      throw err
    }
  }

  return (
    <button
      className="absolute top-full left-1/2 mt-2 -translate-x-1/2 transform rounded bg-black px-3 py-1 text-xs text-sm text-white opacity-0 transition-opacity duration-200 group-hover:opacity-100"
      onClick={handleCopyClick}
    >
      Copy {buttonText}
    </button>
  )
}

const About = () => (
  <div className="mt-4 flex-col items-center justify-center">
    <img
      src="alijafri.jpeg"
      alt="Ali Jafri headhot"
      className="mx-auto mt-6 h-32 w-32 rounded-full text-center"
    />
    <p className="m-2 mt-6 text-center text-3xl font-bold text-slate-800 dark:text-amber-400">
      Hello there, my name is Ali and I like to build things!
    </p>
    <div className="mt-6 flex justify-center gap-x-4">
      <div className="group relative flex flex-col items-center">
        <a
          aria-label="Go to Ali Jafri's LinkedIn profile"
          href="https://www.linkedin.com/in/aliisjafri/"
          className="inline-block transform transition-transform duration-200 hover:scale-110"
        >
          <i className="fa-brands fa-linkedin text-4xl hover:text-slate-800 dark:hover:text-amber-400"></i>
        </a>
        <CopyButton
          url="https://www.linkedin.com/in/aliisjafri/"
          buttonText="LinkedIn Url"
        />
      </div>
      <div className="group relative flex flex-col items-center">
        <a
          aria-label="Go to Ali Jafri's Twitter profile"
          href="https://twitter.com/AliJafri315"
          className="inline-block transform transition-transform duration-200 hover:scale-110"
        >
          <i className="fa-brands fa-twitter text-4xl hover:text-slate-800 dark:hover:text-amber-400"></i>
        </a>
        <CopyButton
          url="https://twitter.com/AliJafri315"
          buttonText="Twitter Url"
        />
      </div>
      <div className="group relative flex flex-col items-center">
        <a
          aria-label="Go to Ali Jafri's GitHub profile"
          href="https://github.com/aliisjafri"
          className="inline-block transform transition-transform duration-200 hover:scale-110"
        >
          <i className="fa-brands fa-github text-4xl hover:text-slate-800 dark:hover:text-amber-400"></i>
        </a>
        <CopyButton
          url="https://github.com/aliisjafri"
          buttonText="Github Url"
        />
      </div>
      <div className="group relative flex flex-col items-center">
        <a
          aria-label="Send Ali Jafri an email message"
          href="mailto:jafrimoali@gmail.com"
          className="inline-block transform transition-transform duration-200 hover:scale-110"
        >
          <i className="fa-solid fa-paper-plane text-4xl  hover:text-slate-800 dark:hover:text-amber-400"></i>
        </a>
        <CopyButton url="jafrimoali@gmail.com" buttonText="Email Address" />
      </div>
    </div>
  </div>
)

export default About
