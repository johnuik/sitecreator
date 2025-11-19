import React from 'react'
import { Link } from 'react-router-dom'

const ForgotPassword = () => {
    return (
        <>
            <section className="bg-white dark:bg-neutral-700 flex flex-wrap min-h-[100vh]">
                <div className="lg:w-1/2 lg:block hidden">
                    <div className="flex items-center flex-col h-full justify-center">
                        <img src="../assets/images/auth/forgot-pass-img.png" alt />
                    </div>
                </div>
                <div className="lg:w-1/2 py-8 px-6 flex flex-col justify-center">
                    <div className="lg:max-w-[464px] mx-auto w-full">
                        <div>
                            <h4 className="mb-3">Forgot Password</h4>
                            <p className="mb-8 text-secondary-light text-lg">Enter the email address associated with your account and we will send you a link to reset your password.</p>
                        </div>
                        <form action="#">
                            <div className="icon-field mb-6 relative">
                                <span className="absolute start-4 top-1/2 -translate-y-1/2 pointer-events-none flex text-xl">
                                    <iconify-icon icon="mage:email" />
                                </span>
                                <input type="email" className="form-control h-[56px] ps-11 border-neutral-300 bg-neutral-50 dark:bg-neutral-600 rounded-xl" placeholder="Email" />
                            </div>
                            <button type="button" data-modal-target="popup-modal" data-modal-toggle="popup-modal" className="btn btn-primary justify-center text-sm btn-sm px-3 py-4 w-full rounded-xl"> Continue</button>
                            <div className="text-center">
                                <Link to="/sign-in" className="text-primary-600 font-bold mt-6 hover:underline">Back to Sign In</Link>
                            </div>
                            <div className="mt-10 md:mt-[60px] lg:mt-[100px] xl:mt-[120px] text-center text-sm">
                                <p className="mb-0">Already have an account?  <Link to="/sign-in" className="text-primary-600 font-semibold hover:underline">Sign In</Link></p>
                            </div>
                        </form>
                    </div>
                </div>
            </section>

        </>
    )
}

export default ForgotPassword
