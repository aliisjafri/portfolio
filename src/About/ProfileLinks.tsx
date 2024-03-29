import CopyButton from './CopyButton'
import { motion } from 'framer-motion'
const profileLinks = [
  {
    label: "Go to Ali Jafri's LinkedIn profile",
    url: 'https://www.linkedin.com/in/aliisjafri/',
    buttonText: 'LinkedIn Url',
    iconClass: 'fa-brands fa-linkedin',
  },
  {
    label: "Go to Ali Jafri's Twitter profile",
    url: 'https://twitter.com/AliJafri315',
    buttonText: 'Twitter Url',
    iconClass: 'fa-brands fa-x-twitter',
  },
  {
    label: "Go to Ali Jafri's GitHub profile",
    url: 'https://github.com/aliisjafri',
    buttonText: 'Github Url',
    iconClass: 'fa-brands fa-github',
  },
  {
    label: 'Send Ali Jafri an email message',
    url: 'mailto:jafrimoali@gmail.com',
    buttonText: 'Email Address',
    iconClass: 'fa-solid fa-paper-plane',
  },
]

const ProfileLinks = () => {
  const copyButtonEnabled = localStorage.getItem('copyEnabled') || 'false'
  return (
    <section className="mt-6">
      <p className="text-center text-xl font-extrabold tracking-tight text-yellow-200 dark:text-amber-400">
        Let's connect!
      </p>
      <div className="mt-3 flex justify-center gap-x-4">
        {profileLinks.map(({ url, label, buttonText, iconClass }) => (
          <div key={url} className="group relative flex flex-col items-center">
            <motion.a
              aria-label={label}
              href={url}
              target="_blank"
              rel="noreferrer"
              whileHover={{ scale: 1.2 }}
              transition={{ type: 'spring', stiffness: 400, damping: 10 }}
            >
              <i
                className={`${iconClass} text-4xl hover:text-yellow-200 dark:hover:text-amber-400 sm:text-5xl 2xl:text-6xl`}
              ></i>
            </motion.a>
            {copyButtonEnabled === 'true' && (
              <CopyButton url={url} buttonText={buttonText} />
            )}
          </div>
        ))}
      </div>
    </section>
  )
}
export default ProfileLinks
