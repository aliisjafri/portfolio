import CopyButton from './CopyButton'

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
    iconClass: 'fa-brands fa-twitter',
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

const ProfileLinks = () => (
  <div className="mt-6 flex justify-center gap-x-4">
    {profileLinks.map(({ url, label, buttonText, iconClass }) => (
      <div className="group relative flex flex-col items-center">
        <a
          aria-label={label}
          href={url}
          target="_blank"
          rel="noreferrer"
          className="inline-block transform transition-transform duration-200 hover:scale-110"
        >
          <i
            className={`${iconClass} text-4xl hover:text-slate-800 dark:hover:text-amber-400 sm:text-5xl lg:text-6xl`}
          ></i>
        </a>
        <CopyButton url={url} buttonText={buttonText} />
      </div>
    ))}
  </div>
)

export default ProfileLinks
