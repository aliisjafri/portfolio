import React from 'react'
import logo from './logo.svg'

const App = () => {
  return (
    <div className="antialiased text-slate-500 dark:text-slate-400 bg-white dark:bg-slate-900">
      <header>
        <img src={logo} alt="logo" />
      </header>
      <div className="flex-col justify-center items-center mt-4">
        <img
          src="https://media-exp1.licdn.com/dms/image/C5603AQF6Z2YXekgA4Q/profile-displayphoto-shrink_400_400/0/1629500171437?e=1653523200&v=beta&t=z646HBIEPOLK_VZVnpLHvJQvKcoxG3Dv4bRf-iUgS88"
          alt="logo"
          className="rounded-full h-32 w-32 text-center mx-auto"
        />
        <p className="font-bold text-black text-center text-3xl dark:text-amber-400 m-2">
          Hello there, my name is Ali and I like to build things!
        </p>
        <img src={logo} alt="logo" />
      </div>
    </div>
  )
}

export default App
