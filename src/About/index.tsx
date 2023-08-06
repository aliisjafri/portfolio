import ProfileLinks from './ProfileLinks'

const calculateExperience = (): string => {
  const startDate = new Date(2018, 0, 1)
  const now = new Date()
  const experienceInMilliseconds = now.getTime() - startDate.getTime()
  let experienceInYears = experienceInMilliseconds / (1000 * 60 * 60 * 24 * 365)
  experienceInYears = Math.round(experienceInYears * 10) / 10

  const integerPart = Math.floor(experienceInYears)
  const decimalPart = experienceInYears - integerPart

  if (decimalPart >= 0.2) {
    return `${integerPart}+`
  } else {
    return `${integerPart}`
  }
}

const yearsOfExperience = calculateExperience() || '5+'
const About = () => (
  <div className="mt-8 mb-16 flex-col items-center justify-center text-center">
    <img
      src="alijafriheadshot.jpeg"
      alt="Ali Jafri headshot"
      className="mx-auto mt-6 h-32 w-32 transform rounded-3xl drop-shadow-[0_0_20px_#fef08a] transition-all duration-200 hover:drop-shadow-[0_0_35px_#fef08a]  dark:drop-shadow-[0_0_20px_#fbbf24] dark:hover:drop-shadow-[0_0_35px_#fbbf24] sm:h-48 sm:w-48 2xl:h-64 2xl:w-64"
    />
    <div className="m-2 mt-8 flex justify-center">
      <h1 className="max-w-3xl text-4xl font-extrabold tracking-tight text-yellow-200 dark:text-amber-400 sm:text-5xl 2xl:text-6xl">
        Hello there, my name is Ali and I like to build things!
      </h1>
    </div>
    <div className="mt-6 flex justify-center">
      <p className="max-w-xl font-bold tracking-tight text-white md:text-xl 2xl:text-2xl">
        I am a Senior Frontend Engineer with {yearsOfExperience} years of
        professional experience and a passion for building intuitive,
        user-friendly web applications. With a strong background in JavaScript,
        HTML, CSS, React, Redux, TypeScript and Tailwind, I have a proven track
        record of delivering high-quality code and driving impactful projects in
        the Health and Finance industries.
      </p>
    </div>
    <ProfileLinks />
  </div>
)

export default About
