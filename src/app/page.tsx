"use client"; // Added "use client"
import React, { useState } from 'react';

const Home = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [isError, setIsError] = useState(false);
  const [formErrors, setFormErrors] = useState({ name: '', email: '', message: '' });

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setIsSuccess(false);
    setIsError(false);
    setFormErrors({ name: '', email: '', message: '' });

    // Validate form fields
    let hasErrors = false;
    const errors = { name: '', email: '', message: '' };

    if (!name.trim()) {
      errors.name = 'Name is required';
      hasErrors = true;
    }
    if (!email.trim()) {
      errors.email = 'Email is required';
      hasErrors = true;
    }
    if (!message.trim()) {
      errors.message = 'Message is required';
      hasErrors = true;
    }

    if (hasErrors) {
      setFormErrors(errors);
      return;
    }

    setIsLoading(true);

    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ name, email, message }),
      });

      if (response.ok) {
        setIsSuccess(true);
      } else {
        setIsError(true);
      }
    } catch (error) {
      setIsError(true);
      console.error('Error sending message:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col items-center justify-start min-h-screen bg-muted-foreground text-muted-foreground">
      <header className="flex items-center justify-between w-full px-4 py-6 sm:px-6 md:py-8 md:px-8">
        <div className="flex items-center gap-4">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Sebastian Boehler</h1>
        </div>
        <nav className="hidden md:flex items-center gap-4">
          <a href="#about" className="text-gray-500 hover:text-gray-900 dark:hover:text-white">
            About
          </a>
          <a href="#projects" className="text-gray-500 hover:text-gray-900 dark:hover:text-white">
            Projects
          </a>
          <a href="#contact" className="text-gray-500 hover:text-gray-900 dark:hover:text-white">
            Contact
          </a>
        </nav>
      </header>
      <main className="flex flex-col items-center justify-start w-full py-12md:py-16">
        <section id="hero" className="flex flex-col items-center justify-center w-full bg-gray-100 p-12 rounded-md mb-24"> {/* Added bg-gray-100 and p-12 */}
          <h1 className="text-5xl font-bold text-gray-900 dark:text-white mb-4"> {/* Increased font size */}
            Hello, I&apos;m Sebastian.
          </h1>
          <p className="text-gray-500 text-lg max-w-3xl text-center mb-8">
            I&apos;m a Web Developer with experience in building high-quality web applications.
          </p>
          <div className="flex items-center gap-4">
            <a
              href="/api/download" // Changed href to api/download
              className="bg-primary text-black font-medium rounded-md px-4 py-2 hover:bg-primary-focus border border-gray-300" // Changed text color
            >
              Download CV
            </a>
            <a
              href="#"
              className="bg-primary text-black font-medium rounded-md px-4 py-2 hover:bg-primary-focus border border-gray-300" // Changed text color
            >
              Contact Me
            </a>
          </div>
        </section>
        <div className='px-4 sm:px-6 md:px-8'>
          <section id="about" className="flex flex-col items-center justify-center w-full max-w-4xl mb-24"> {/* Added mb-24 */}
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
              About Me
            </h2>
            <p className="text-gray-500 text-lg max-w-3xl text-center mb-8">
              I&apos;m passionate about building innovative web applications that solve real-world problems.
              I enjoy exploring new technologies and pushing the boundaries of what&apos;s possible with code.
              I have a strong foundation in JavaScript, TypeScript, React, and Next.js. I&apos;m also proficient in backend development with Node.js and Express.js.
              I&apos;m always eager to learn new things and expand my skillset.
            </p>
          </section>
          <section id="projects" className="flex flex-col items-center justify-center w-full max-w-4xl mb-24"> {/* Added mb-24 */}
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
              My Projects
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 mt-6">
              <a href="https://focusfeed.netlify.app/" target="_blank" className="group rounded-md overflow-hidden"> {/* Removed shadow-md */}
                <div className="flex flex-col h-full"> {/* Added flex-col and h-full */}
                  <div className="p-4 bg-gray-100 dark:bg-gray-800 flex-1"> {/* Added flex-1 */}
                    <h3 className="text-xl font-medium text-gray-900 dark:text-white group-hover:text-primary"> {/* Increased font size */}
                      Focus Feed
                    </h3>
                    <p className="text-gray-500 text-base mt-2"> {/* Increased font size and added mt-2 */}
                      A Chrome extension that helps you stay productive by blocking distracting features on YouTube and Instagram.
                    </p>
                  </div>
                </div>
              </a>
              <a href="https://github.com/SebastianBoehler/smarthome-template" target="_blank" className="group rounded-md overflow-hidden"> {/* Removed shadow-md */}
                <div className="flex flex-col h-full"> {/* Added flex-col and h-full */}
                  <div className="p-4 bg-gray-100 dark:bg-gray-800 flex-1"> {/* Added flex-1 */}
                    <h3 className="text-xl font-medium text-gray-900 dark:text-white group-hover:text-primary"> {/* Increased font size */}
                      Smarthome Automation
                    </h3>
                    <p className="text-gray-500 text-base mt-2"> {/* Increased font size and added mt-2 */}
                      A template for automating your Philips Hue lights based on air quality data.
                    </p>
                  </div>
                </div>
              </a>
              <a href="https://github.com/SebastianBoehler/solana-dapp-learning" target="_blank" className="group rounded-md overflow-hidden"> {/* Removed shadow-md */}
                <div className="flex flex-col h-full"> {/* Added flex-col and h-full */}
                  <div className="p-4 bg-gray-100 dark:bg-gray-800 flex-1"> {/* Added flex-1 */}
                    <h3 className="text-xl font-medium text-gray-900 dark:text-white group-hover:text-primary"> {/* Increased font size */}
                      Smart Contracts
                    </h3>
                    <p className="text-gray-500 text-base mt-2"> {/* Increased font size and added mt-2 */}
                      A repository showcasing my learning journey with Rust and Anchor to build Solana smart contracts.
                    </p>
                  </div>
                </div>
              </a>
            </div>
          </section>
          <section id="hb-capital" className="flex flex-col items-center justify-center w-full max-w-4xl mb-24"> {/* Added mb-24 */}
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
              HB Capital - My Firm
            </h2>
            <p className="text-gray-500 text-lg max-w-3xl text-center mb-8">
              HB Capital is a crypto algo trading company that I co-founded. We are driven by the vision of navigating the market through cutting-edge technology.
              Our team leverages deep learning with Python for strategy optimization, and I&apos;ve built our own backtesting and trading framework.  We also have a dedicated dashboard and chat bot integration for enhanced trading operations.
            </p>
            <a href="https://hb-capital.app/" target="_blank" className="bg-primary text-black font-medium rounded-md px-4 py-2 hover:bg-primary-focus border border-gray-300">
              Visit HB Capital
            </a>
          </section>
          <section id="contact" className="flex flex-col items-center justify-center w-full max-w-4xl">
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
              Contact Me
            </h2>
            <form className="flex flex-col gap-4 w-full max-w-md" onSubmit={handleSubmit}> {/* Added width and max-width */}
              <div>
                <input
                  type="text"
                  placeholder="Your Name"
                  className={`border ${formErrors.name ? 'border-red-500' : 'border-gray-300'} rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-primary w-full`}
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                />
                {formErrors.name && <p className="text-red-500 text-sm mt-1">{formErrors.name}</p>}
              </div>
              <div>
                <input
                  type="email"
                  placeholder="Your Email"
                  className={`border ${formErrors.email ? 'border-red-500' : 'border-gray-300'} rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-primary w-full`}
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
                {formErrors.email && <p className="text-red-500 text-sm mt-1">{formErrors.email}</p>}
              </div>
              <div>
                <textarea
                  placeholder="Your Message"
                  className={`border ${formErrors.message ? 'border-red-500' : 'border-gray-300'} rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-primary resize-none w-full`}
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                />
                {formErrors.message && <p className="text-red-500 text-sm mt-1">{formErrors.message}</p>}
              </div>
              <button
                type="submit"
                className="bg-primary text-black font-medium rounded-md px-4 py-2 hover:bg-primary-focus border border-gray-300" // Added border and background
                disabled={isLoading}
              >
                {isLoading ? 'Sending...' : 'Send Message'}
              </button>
              {isSuccess && (
                <p className="text-green-500 mt-2">Message sent successfully!</p>
              )}
              {isError && (
                <p className="text-red-500 mt-2">Error sending message. Please try again later.</p>
              )}
            </form>
          </section>
        </div>
      </main>
      <footer className="flex items-center justify-between w-full px-4 py-6 sm:px-6 md:py-8 md:px-8">
        <p className="text-gray-500">
          &copy; {new Date().getFullYear()} Sebastian Boehler. All rights reserved.
        </p>
        <ul className="flex items-center gap-4">
          <li>
            <a
              href="https://www.linkedin.com/in/sebastian-boehler/"
              target="_blank"
              className="text-gray-500 hover:text-gray-900 dark:hover:text-white"
            >
              LinkedIn
            </a>
          </li>
          <li>
            <a
              href="https://github.com/SebastianBoehler"
              target="_blank"
              className="text-gray-500 hover:text-gray-900 dark:hover:text-white"
            >
              GitHub
            </a>
          </li>
        </ul>
      </footer>
    </div>
  );
};

export default Home;
