import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import Slide from '@mui/material/Slide';
import Captcha from "../../components/captcha"


const Transition = React.forwardRef(function Transition(props, ref) {
    return <Slide direction="up" ref={ref} {...props} />;
});


const SignIn = () => {

    const [password, setPassword] = useState("");
    const [email, setEmail] = useState("");

    const [showPassword, setShowPassword] = useState(false);
    const [open, setOpen] = React.useState(false);

    const handleClickOpen = (e) => {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

        if (!emailRegex.test(email)) {
            setOpen(false);
            return;
        }

        if (password.length < 8) {
            setOpen(false);
            return;
        }

        setOpen(true);
        console.log(email, password);
    };


    const handleClose = () => {
        setOpen(false);
    };


    return (
        <>
            <div className='flex justify-center items-center'>
                <section className="bg-white dark:bg-dark-2 flex flex-wrap min-h-[100vh] max-w-7xl w-full">
                    <div className="lg:w-1/2 lg:block hidden">
                        <div className="flex items-center flex-col h-full justify-center">
                            <img src="../assets/images/auth-img.jpg" alt />
                        </div>
                    </div>
                    <div className="lg:w-1/2 py-8 px-6 flex flex-col justify-center">
                        <div className="lg:max-w-[464px] mx-auto w-full">
                            <div className='mb-5'>
                                <div className="w-full justify-center flex items-center gap-[5px] mb-8">
                                    <img src="../assets/images/jamoa.jpg" className='w-[90px] h-[100px]' alt='Jamoa' />
                                </div>
                            </div>
                            <form action="#">
                                <div className="icon-field mb-4 relative">
                                    <span className="absolute start-4 top-1/2 -translate-y-1/2 pointer-events-none flex text-xl">
                                        <iconify-icon icon="mage:email" />
                                    </span>
                                    <input type="email" className="form-control h-[56px] ps-11 border-neutral-300 bg-neutral-50 dark:bg-dark-2 rounded-xl" placeholder="Email manzilingizni kiriting" value={email} onChange={(e) => setEmail(e.target.value)} />
                                </div>
                                <div className="relative mb-5">
                                    <div className="icon-field">
                                        <span className="absolute start-4 top-1/2 -translate-y-1/2 pointer-events-none flex text-xl">
                                            <iconify-icon icon="solar:lock-password-outline" />
                                        </span>
                                        <input type={showPassword ? "text" : "password"} className="form-control h-[56px] ps-11 border-neutral-300 bg-neutral-50 dark:bg-dark-2 rounded-xl" id="your-password" placeholder="********" value={password} onChange={(e) => setPassword(e.target.value)} />
                                    </div>
                                    {showPassword ?
                                        <span className="toggle-password ri-eye-off-line cursor-pointer absolute end-0 top-1/2 -translate-y-1/2 me-4 text-secondary-light" data-toggle="#your-password" onClick={() => setShowPassword(!showPassword)} />
                                        : <span className="toggle-password ri-eye-line cursor-pointer absolute end-0 top-1/2 -translate-y-1/2 me-4 text-secondary-light" data-toggle="#your-password" onClick={() => setShowPassword(!showPassword)} />
                                    }
                                </div>
                                <div className="mt-7">
                                    <div className="flex justify-between gap-2 items-center">
                                        <div className="flex items-center">
                                        </div>
                                        <Link to="/forgot-password" className="text-primary-600 font-medium hover:underline">Parolni tiklash?</Link>
                                    </div>
                                </div>
                                <button className="btn btn-primary justify-center text-sm btn-sm px-3 py-4 w-full rounded-xl mt-8" onClick={handleClickOpen}>Kirish</button>
                            </form>


                        </div>
                    </div>
                </section>

            </div>


            <Dialog
                open={open}
                slots={{
                    transition: Transition,
                }}
                keepMounted
                onClose={handleClose}
                aria-describedby="alert-dialog-slide-description"
            >
                <DialogTitle>{""}</DialogTitle>
                <DialogContent>
                    <DialogContentText id="alert-dialog-slide-description">
                        <Captcha />
                    </DialogContentText>
                </DialogContent>
                <DialogActions>
                </DialogActions>
            </Dialog>
        </>
    )
}

export default SignIn
