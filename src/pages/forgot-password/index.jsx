import React from 'react'
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

const ForgotPassword = () => {
    const [open, setOpen] = React.useState(false);

    const handleClickOpen = () => {
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
    };
    return (
        <>
            <div className='flex justify-center items-center bg-white dark:bg-neutral-800 min-h-screen'>
                <section className="flex flex-wrap min-h-[100vh]">
                    <div className="lg:w-1/2 lg:block hidden">
                        <div className="flex items-center flex-col h-full justify-center">
                            <img src="/assets/images/forgot-password.jpg" alt />
                        </div>
                    </div>
                    <div className="lg:w-1/2 py-8 px-6 flex flex-col justify-center">
                        <div className="lg:max-w-[464px] mx-auto w-full">
                            <div>
                                <h4 className="mb-3">Parolni tiklash</h4>
                                <p className="mb-8 text-secondary-light text-lg">Hisobingizga bog‘langan elektron pochta manzilini kiriting. Parolni tiklash uchun sizga maxsus 6 xonali son yuboriladi.</p>
                            </div>
                            <form action="#">
                                <div className="icon-field mb-6 relative">
                                    <span className="absolute start-4 top-1/2 -translate-y-1/2 pointer-events-none flex text-xl">
                                        <iconify-icon icon="mage:email" />
                                    </span>
                                    <input type="email" className="form-control h-[56px] ps-11 border-neutral-300 bg-neutral-50 dark:bg-neutral-600 rounded-xl" placeholder="Email" />
                                </div>
                                <button type="button" data-modal-target="popup-modal" data-modal-toggle="popup-modal" className="btn btn-primary justify-center text-sm btn-sm px-3 py-4 w-full rounded-xl" onClick={handleClickOpen}>Davom etish</button>
                                <div className="text-center">
                                    <Link to="/login" className="text-primary-600 font-bold mt-6 hover:underline">Kirish</Link>
                                </div>
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

export default ForgotPassword
