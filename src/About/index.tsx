import ProfileLinks from './ProfileLinks'

const calculateExperience = (): number => {
  const startDate = new Date(2018, 0, 1)
  const now = new Date()
  const experienceInMilliseconds = now.getTime() - startDate.getTime()
  const experienceInYears =
    experienceInMilliseconds / (1000 * 60 * 60 * 24 * 365)
  return Math.round(experienceInYears * 10) / 10
}

const yearsOfExperience = calculateExperience() || '5+'

const About = () => (
  <div className="mt-8 flex-col items-center justify-center text-center">
    <img
      src="alijafriheadshot.jpeg"
      alt="Ali Jafri headshot"
      className="mx-auto mt-6 h-32 w-32 transform rounded-3xl drop-shadow-[0_0_20px_#fef08a] transition-all duration-200 hover:drop-shadow-[0_0_35px_#fef08a]  dark:drop-shadow-[0_0_20px_#fbbf24] dark:hover:drop-shadow-[0_0_35px_#fbbf24] sm:h-48 sm:w-48 lg:h-64 lg:w-64"
    />
    <div className="m-2 mt-8 flex justify-center">
      <h1 className="max-w-3xl text-4xl font-extrabold tracking-tight text-yellow-200 dark:text-amber-400 sm:text-5xl lg:text-6xl">
        Hello there, my name is Ali and I like to build things!
      </h1>
    </div>
    <div className="mt-6 flex justify-center">
      <p className="max-w-md font-bold tracking-tight text-white md:text-xl lg:text-2xl">
        I am a Senior Frontend Engineer with {yearsOfExperience} years of
        experience and a passion for building intuitive, user-friendly web
        applications. With a strong background in JavaScript, HTML, CSS, React,
        Redux, TypeScript and Tailwind, I have a proven track record of
        delivering high-quality code and driving impactful projects in the
        Health and Finance industries.
      </p>
    </div>
    <ProfileLinks />
  </div>
)

export default About
