import CopyButton from './CopyButton'

const About = () => (
  <div className="mt-8 flex-col items-center justify-center">
    <img
      src="alijafri.jpeg"
      alt="Ali Jafri headshot"
      className="mx-auto mt-6 h-32 w-32 transform rounded-full text-center transition-transform duration-200 hover:scale-110 sm:h-48 sm:w-48 lg:h-64 lg:w-64"
    />
    <p className="m-2 mt-6 text-center text-4xl font-extrabold tracking-tight text-slate-800 dark:text-amber-400 sm:text-5xl lg:text-6xl">
      Hello there, my name is Ali and I like to build things!
    </p>
    <div className="mt-6 flex justify-center gap-x-4">
      <div className="group relative flex flex-col items-center">
        <a
          aria-label="Go to Ali Jafri's LinkedIn profile"
          href="https://www.linkedin.com/in/aliisjafri/"
          target="_blank"
          className="inline-block transform transition-transform duration-200 hover:scale-110"
        >
          <i className="fa-brands fa-linkedin text-4xl hover:text-slate-800 dark:hover:text-amber-400 sm:text-5xl lg:text-6xl"></i>
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
          target="_blank"
          className="inline-block transform transition-transform duration-200 hover:scale-110"
        >
          <i className="fa-brands fa-twitter text-4xl hover:text-slate-800 dark:hover:text-amber-400 sm:text-5xl lg:text-6xl"></i>
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
          target="_blank"
          className="inline-block transform transition-transform duration-200 hover:scale-110"
        >
          <i className="fa-brands fa-github text-4xl hover:text-slate-800 dark:hover:text-amber-400 sm:text-5xl lg:text-6xl"></i>
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
          <i className="fa-solid fa-paper-plane text-4xl hover:text-slate-800 dark:hover:text-amber-400 sm:text-5xl lg:text-6xl"></i>
        </a>
        <CopyButton url="jafrimoali@gmail.com" buttonText="Email Address" />
      </div>
    </div>
  </div>
)

export default About
