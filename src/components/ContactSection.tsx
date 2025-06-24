"use client";

import { useState } from 'react';
import { Send } from 'lucide-react';

export default function ContactSection() {
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

    let hasErrors = false;
    const errors = { name: '', email: '', message: '' };

    if (!name.trim()) {
      errors.name = 'Name is required';
      hasErrors = true;
    }
    if (!email.trim()) {
      errors.email = 'Email is required';
      hasErrors = true;
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      errors.email = 'Invalid email format';
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
        setName('');
        setEmail('');
        setMessage('');
      } else {
        setIsError(true);
      }
    } catch (error) {
      setIsError(true);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <section id="contact" className="section-container">
      <div className="max-w-xl mx-auto">
        <h2 className="heading-2 text-center mb-8">Get in Touch</h2>
        <p className="text-gray-600 dark:text-gray-300 text-center mb-8">
          Have a project in mind or want to discuss opportunities? I&apos;d love to hear from you.
        </p>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label htmlFor="name" className="block text-sm font-medium mb-2 dark:text-gray-300">
              Name
            </label>
            <input
              type="text"
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-gray-400 dark:focus:ring-gray-500"
              placeholder="Your name"
            />
            {formErrors.name && (
              <p className="mt-1 text-sm text-red-600 dark:text-red-400">{formErrors.name}</p>
            )}
          </div>
          <div>
            <label htmlFor="email" className="block text-sm font-medium mb-2 dark:text-gray-300">
              Email
            </label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-gray-400 dark:focus:ring-gray-500"
              placeholder="your@email.com"
            />
            {formErrors.email && (
              <p className="mt-1 text-sm text-red-600 dark:text-red-400">{formErrors.email}</p>
            )}
          </div>
          <div>
            <label htmlFor="message" className="block text-sm font-medium mb-2 dark:text-gray-300">
              Message
            </label>
            <textarea
              id="message"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              rows={4}
              className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-gray-400 dark:focus:ring-gray-500"
              placeholder="Your message"
            />
            {formErrors.message && (
              <p className="mt-1 text-sm text-red-600 dark:text-red-400">{formErrors.message}</p>
            )}
          </div>
          <button
            type="submit"
            disabled={isLoading}
            className="w-full flex items-center justify-center px-6 py-3 bg-gray-900 dark:bg-white text-white dark:text-gray-900 rounded-lg hover:bg-gray-800 dark:hover:bg-gray-100 transition-colors disabled:opacity-50"
          >
            {isLoading ? (
              'Sending...'
            ) : (
              <>
                Send Message
                <Send className="ml-2 h-4 w-4" />
              </>
            )}
          </button>
          {isSuccess && (
            <p className="text-center text-green-600 dark:text-green-400">
              Message sent successfully!
            </p>
          )}
          {isError && (
            <p className="text-center text-red-600 dark:text-red-400">
              Failed to send message. Please try again.
            </p>
          )}
        </form>
      </div>
    </section>
  );
}
