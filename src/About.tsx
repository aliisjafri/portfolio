const About = () => (
  <div>
    <div className="mt-4 flex-col items-center justify-center">
      <img
        src="alijafri.jpeg"
        alt="Ali Jafri headhot"
        className="mx-auto mt-6 h-32 w-32 rounded-full text-center"
      />
      <p className="m-2 mt-6 text-center text-3xl font-bold text-indigo-700 dark:text-amber-400">
        Hello there, my name is Ali and I like to build things!
      </p>
      <div className="mt-6 flex justify-center">
        <a
          aria-label="Go to Ali Jafri's LinkedIn profile"
          className="mr-6"
          href="https://www.linkedin.com/in/aliisjafri/"
        >
          <i className="fa-brands fa-linkedin text-4xl hover:text-indigo-700 dark:hover:text-amber-400"></i>
        </a>
        <a
          aria-label="Go to Ali Jafri's Twitter profile"
          className="mr-6"
          href="https://twitter.com/AliJafri315"
        >
          <i className="fa-brands fa-twitter text-4xl hover:text-indigo-700 dark:hover:text-amber-400"></i>
        </a>
        <a
          aria-label="Go to Ali Jafri's GitHub profile"
          className="mr-6"
          href="https://github.com/aliisjafri"
        >
          <i className="fa-brands fa-github text-4xl hover:text-indigo-700 dark:hover:text-amber-400"></i>
        </a>
        <a
          aria-label="Send Ali Jafri an email message"
          href="mailto:jafrimoali@gmail.com"
        >
          <i className="fa-solid fa-paper-plane text-4xl  hover:text-indigo-700 dark:hover:text-amber-400"></i>
        </a>
      </div>
    </div>
  </div>
)

export default About
