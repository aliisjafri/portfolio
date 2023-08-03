import ProfileLinks from './ProfileLinks'

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
    <ProfileLinks />
  </div>
)

export default About
