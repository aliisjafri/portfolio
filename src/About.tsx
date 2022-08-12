const About = () => (
  <div>
    <div className="mt-4 flex-col items-center justify-center">
      <img
        src="alijafri.jpeg"
        alt="Ali Jafri headhot"
        className="mx-auto h-32 w-32 rounded-full text-center"
      />
      <p className="m-2 text-center text-3xl font-bold text-black dark:text-amber-400">
        Hello there, my name is Ali and I like to build things!
      </p>
      <div className="mt-4 flex justify-center">
        <a href="https://www.linkedin.com/in/aliisjafri/">
          <i className="fa-brands fa-linkedin mr-4 text-3xl hover:text-amber-400"></i>
        </a>
        <a href="https://twitter.com/AliJafri315">
          <i className="fa-brands fa-twitter mr-4 text-3xl hover:text-amber-400"></i>
        </a>
        <a href="https://github.com/aliisjafri">
          <i className="fa-brands fa-github mr-4 text-3xl hover:text-amber-400"></i>
        </a>
        <a href="mailto:jafrimoali@gmail.com">
          <i className="fa-solid fa-paper-plane text-3xl hover:text-amber-400"></i>
        </a>
      </div>
    </div>
  </div>
)

export default About
