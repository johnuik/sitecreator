import React from 'react'
import { Link } from 'react-router-dom'

const SignIn = () => {
    return (
        <>
            <section className="bg-white dark:bg-dark-2 flex flex-wrap min-h-[100vh]">
                <div className="lg:w-1/2 lg:block hidden">
                    <div className="flex items-center flex-col h-full justify-center">
                        <img src="../assets/images/auth/auth-img.png" alt />
                    </div>
                </div>
                <div className="lg:w-1/2 py-8 px-6 flex flex-col justify-center">
                    <div className="lg:max-w-[464px] mx-auto w-full">
                        <div>
                            <Link to="/" className="mb-2.5 max-w-[290px]">
                                <img src="../assets/images/logo.png" alt />
                            </Link>
                            <h4 className="mb-3">Sign In to your Account</h4>
                            <p className="mb-8 text-secondary-light text-lg">Welcome back! please enter your detail</p>
                        </div>
                        <form action="#">
                            <div className="icon-field mb-4 relative">
                                <span className="absolute start-4 top-1/2 -translate-y-1/2 pointer-events-none flex text-xl">
                                    <iconify-icon icon="mage:email" />
                                </span>
                                <input type="email" className="form-control h-[56px] ps-11 border-neutral-300 bg-neutral-50 dark:bg-dark-2 rounded-xl" placeholder="Email" />
                            </div>
                            <div className="relative mb-5">
                                <div className="icon-field">
                                    <span className="absolute start-4 top-1/2 -translate-y-1/2 pointer-events-none flex text-xl">
                                        <iconify-icon icon="solar:lock-password-outline" />
                                    </span>
                                    <input type="password" className="form-control h-[56px] ps-11 border-neutral-300 bg-neutral-50 dark:bg-dark-2 rounded-xl" id="your-password" placeholder="Password" />
                                </div>
                                <span className="toggle-password ri-eye-line cursor-pointer absolute end-0 top-1/2 -translate-y-1/2 me-4 text-secondary-light" data-toggle="#your-password" />
                            </div>
                            <div className="mt-7">
                                <div className="flex justify-between gap-2">
                                    <div className="flex items-center">
                                        <input className="form-check-input border border-neutral-300" type="checkbox" defaultValue id="remeber" />
                                        <label className="ps-2" htmlFor="remeber">Remember me </label>
                                    </div>
                                    <Link to="/forgot-password" className="text-primary-600 font-medium hover:underline">Forgot Password?</Link>
                                </div>
                            </div>
                            <button type="submit" className="btn btn-primary justify-center text-sm btn-sm px-3 py-4 w-full rounded-xl mt-8"> Sign In</button>
                            <div className="mt-8 center-border-horizontal text-center relative before:absolute before:w-full before:h-[1px] before:top-1/2 before:-translate-y-1/2 before:bg-neutral-300 before:start-0">
                                <span className="bg-white dark:bg-dark-2 z-[2] relative px-4">Or sign in with</span>
                            </div>
                            <div className="mt-8 flex items-center gap-3">
                                <button type="button" className="font-semibold text-neutral-600 dark:text-neutral-200 py-4 px-6 w-1/2 border rounded-xl text-base flex items-center justify-center gap-3 line-height-1 hover:bg-primary-50">
                                    <iconify-icon icon="ic:baseline-facebook" className="text-primary-600 text-xl line-height-1" />
                                    Google
                                </button>
                                <button type="button" className="font-semibold text-neutral-600 dark:text-neutral-200 py-4 px-6 w-1/2 border rounded-xl text-base flex items-center justify-center gap-3 line-height-1 hover:bg-primary-50">
                                    <iconify-icon icon="logos:google-icon" className="text-primary-600 text-xl line-height-1" />
                                    Google
                                </button>
                            </div>
                            <div className="mt-8 text-center text-sm">
                                <p className="mb-0">Don't have an account? <Link to="/sign-up" className="text-primary-600 font-semibold hover:underline">Sign Up</Link></p>
                            </div>
                        </form>
                    </div>
                </div>
            </section>

        </>
    )
}

export default SignIn
