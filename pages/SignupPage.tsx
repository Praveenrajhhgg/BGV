
import React from 'react';
import { Link, useNavigate } from 'react-router-dom';

const logoSrc = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADIAAAAyCAYAAAAeP4ixAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAAJcEhZcwAADsMAAA7DAcdvqGQAAABFSURBVGhD7c0xAQAgDMCwgX/feADHEnlQZRISEhISEhISEhISEhISEhISEhISEhISEhISEhISEhISEhISEhISEhISEhISEhISEpKaA2UAARlD2tAAAAAASUVORK5CYII=";

const SignupPage: React.FC = () => {
    const navigate = useNavigate();

    const handleSignup = (e: React.FormEvent) => {
        e.preventDefault();
        // Simulate successful signup and login
        navigate('/dashboard');
    };

    return (
        <div className="min-h-screen bg-green-50 dark:bg-brand-secondary-dark flex flex-col justify-center items-center py-12 px-4 sm:px-6 lg:px-8">
            <div className="sm:mx-auto sm:w-full sm:max-w-md text-center">
                <Link to="/">
                    <img className="mx-auto h-20 w-auto" src={logoSrc} alt="GetmeVerify" />
                </Link>
                <h2 className="mt-6 text-3xl font-extrabold text-slate-900 dark:text-white">
                    Create your client account
                </h2>
                <p className="mt-2 text-sm text-slate-600 dark:text-slate-400">
                    Already have an account?{' '}
                    <Link to="/login" className="font-medium text-brand-accent hover:text-brand-accent-hover">
                        Sign in
                    </Link>
                </p>
            </div>

            <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
                <div className="bg-brand-primary-light dark:bg-brand-primary-dark py-8 px-4 shadow-xl sm:rounded-lg sm:px-10 border border-slate-200 dark:border-slate-700">
                    <form className="space-y-6" onSubmit={handleSignup}>
                         <div>
                            <label htmlFor="company-name" className="block text-sm font-medium text-slate-700 dark:text-slate-300">
                                Company Name
                            </label>
                            <div className="mt-1">
                                <input
                                    id="company-name"
                                    name="company-name"
                                    type="text"
                                    required
                                    className="appearance-none block w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-md shadow-sm placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:ring-brand-accent focus:border-brand-accent sm:text-sm bg-slate-50 dark:bg-slate-700 text-slate-900 dark:text-slate-200"
                                    placeholder="Cyberdyne Systems"
                                />
                            </div>
                        </div>
                        
                        <div>
                            <label htmlFor="full-name" className="block text-sm font-medium text-slate-700 dark:text-slate-300">
                                Full Name
                            </label>
                            <div className="mt-1">
                                <input
                                    id="full-name"
                                    name="full-name"
                                    type="text"
                                    autoComplete="name"
                                    required
                                    className="appearance-none block w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-md shadow-sm placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:ring-brand-accent focus:border-brand-accent sm:text-sm bg-slate-50 dark:bg-slate-700 text-slate-900 dark:text-slate-200"
                                    placeholder="Sarah Connor"
                                />
                            </div>
                        </div>

                        <div>
                            <label htmlFor="email" className="block text-sm font-medium text-slate-700 dark:text-slate-300">
                                Work Email
                            </label>
                            <div className="mt-1">
                                <input
                                    id="email"
                                    name="email"
                                    type="email"
                                    autoComplete="email"
                                    required
                                    className="appearance-none block w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-md shadow-sm placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:ring-brand-accent focus:border-brand-accent sm:text-sm bg-slate-50 dark:bg-slate-700 text-slate-900 dark:text-slate-200"
                                    placeholder="you@company.com"
                                />
                            </div>
                        </div>

                        <div>
                            <label htmlFor="password" className="block text-sm font-medium text-slate-700 dark:text-slate-300">
                                Password
                            </label>
                            <div className="mt-1">
                                <input
                                    id="password"
                                    name="password"
                                    type="password"
                                    autoComplete="new-password"
                                    required
                                    className="appearance-none block w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-md shadow-sm placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:ring-brand-accent focus:border-brand-accent sm:text-sm bg-slate-50 dark:bg-slate-700 text-slate-900 dark:text-slate-200"
                                    placeholder="••••••••"
                                />
                            </div>
                        </div>
                        
                         <div>
                            <label htmlFor="confirm-password" className="block text-sm font-medium text-slate-700 dark:text-slate-300">
                                Confirm Password
                            </label>
                            <div className="mt-1">
                                <input
                                    id="confirm-password"
                                    name="confirm-password"
                                    type="password"
                                    autoComplete="new-password"
                                    required
                                    className="appearance-none block w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-md shadow-sm placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:ring-brand-accent focus:border-brand-accent sm:text-sm bg-slate-50 dark:bg-slate-700 text-slate-900 dark:text-slate-200"
                                    placeholder="••••••••"
                                />
                            </div>
                        </div>

                        <div>
                            <button
                                type="submit"
                                className="w-full flex justify-center py-3 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-brand-accent hover:bg-brand-accent-hover focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-brand-accent transition-colors"
                            >
                                Create Account
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default SignupPage;