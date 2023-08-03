import ProfileLinks from './ProfileLinks'

const About = () => (
  <div className="mt-8 flex-col items-center justify-center">
    <img
      src="alijafriheadshot.jpeg"
      alt="Ali Jafri headshot"
      className="mx-auto mt-6 h-32 w-32 transform rounded-3xl text-center drop-shadow-[0_0_20px_#fef08a] transition-all duration-200 hover:scale-110 hover:drop-shadow-[0_0_35px_#fef08a]  dark:drop-shadow-[0_0_20px_#fbbf24] dark:hover:drop-shadow-[0_0_35px_#fbbf24] sm:h-48 sm:w-48 lg:h-64 lg:w-64"
    />
    <p className="m-2 mt-6 text-center text-4xl font-extrabold tracking-tight text-yellow-200 dark:text-amber-400 sm:text-5xl lg:text-6xl">
      Hello there, my name is Ali and I like to build things!
    </p>
    <ProfileLinks />
  </div>
)

export default About
