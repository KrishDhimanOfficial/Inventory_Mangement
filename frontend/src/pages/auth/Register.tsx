import { useState } from 'react'
import { motion } from 'motion/react'
import Button from '../../components/Button'
import Input from '../../components/Input'
import * as yup from 'yup'
import { useForm, Controller } from 'react-hook-form'
import { Link, useNavigate } from 'react-router'
import { yupResolver } from '@hookform/resolvers/yup'
import DataService from '../../hooks/DataService'

const animation = { opacity: [0, 1], x: [20, 0], transition: { duration: 0.5 } }
const fadeOut = { opacity: [0, 1], transition: { duration: 0.8 } }
const defaultValues = { name: '', username: '', phone: '', email: '', password: '', confirmPassword: '' }

const validationSchema = yup.object().shape({
    name: yup.string().required().matches(/^[A-Za-z\s]{1,30}$/, 'Name must be 1-30 characters long.'),
    username: yup.string().required().matches(/^[a-z0-9@_-]{3,20}$/, 'Username must be 3-20 characters long and can include letters, numbers,@ ,underscores, or hyphens.'),
    email: yup.string().email().required().matches(/^[a-z0-9]+@gmail.com$/, 'Incorrect Email!'),
    phone: yup.string().required().matches(/^[0-9]{10}$/, 'Invalid Phone Number!'),
    password: yup.string().required(),
    confirmPassword: yup.string().required().oneOf([yup.ref('password')], 'Passwords do not match!'),
})

const Register = () => {
    const navigate = useNavigate()
    const [passwordtype, setpasswordtype] = useState(false)
    const [confirmPassword, setconfirmPassword] = useState(false)
    const { control, handleSubmit, formState: { errors, isSubmitting } } = useForm({
        defaultValues,
        resolver: yupResolver(validationSchema)
    })

    const registeration = async (formdata: object) => {
        try {
            const res = await DataService.post('/user', { formdata })
            if (res.success) navigate('/login')
        } catch (error) {
            console.error(error)
        }
    }

    return (
        <>
            <title>Register</title>
            <div className='min-vh-100 d-flex flex-column align-items-center justify-content-center'>
                <form onSubmit={handleSubmit(registeration)} autoComplete='off' className="form">
                    <h1>Register</h1>
                    <div className="d-flex gap-3">
                        <motion.div animate={animation} className='w-100'>
                            <div className="flex-column mb-2">
                                <label>Name </label>
                                <span className='importantField'>*</span>
                            </div>
                            <div className={`inputForm ${errors.name?.message ? 'inputError' : ''}`}>
                                <Controller
                                    name="name"
                                    control={control}
                                    render={({ field }) => (
                                        <Input
                                            type="text"
                                            className="input"
                                            placeholder="Enter your Name"
                                            {...field}
                                        />
                                    )}
                                />
                            </div>
                        </motion.div>
                        <motion.div animate={animation} className='w-100'>
                            <div className="flex-column mb-2">
                                <label>Username </label>
                                <span className='importantField'>*</span>
                            </div>
                            <div className={`inputForm ${errors.username?.message ? 'inputError' : ''}`}>
                                <Controller
                                    name="username"
                                    control={control}
                                    render={({ field }) => (
                                        <Input
                                            type="text"
                                            className="input"
                                            placeholder="Enter your username"
                                            {...field}
                                        />
                                    )}
                                />
                            </div>
                        </motion.div>
                    </div>
                    <div className="d-flex gap-3">
                        <motion.div animate={animation} className='w-100'>
                            <div className="flex-column mb-2">
                                <label>Email </label>
                                <span className='importantField'>*</span>
                            </div>
                            <div className={`inputForm ${errors.email?.message ? 'inputError' : ''}`}>
                                <Controller
                                    name="email"
                                    control={control}
                                    render={({ field }) => (
                                        <Input
                                            type="text"
                                            className="input"
                                            placeholder="Enter your Email"
                                            {...field}
                                        />
                                    )}
                                />
                            </div>
                        </motion.div>
                        <motion.div animate={animation} className='w-100'>
                            <div className="flex-column mb-2">
                                <label>Phone no. </label>
                                <span className='importantField'>*</span>
                            </div>
                            <div className={`inputForm ${errors.phone?.message ? 'inputError' : ''}`}>
                                <Controller
                                    name="phone"
                                    control={control}
                                    render={({ field }) => (
                                        <Input
                                            type="text"
                                            className="input"
                                            placeholder="Enter your phone no"
                                            {...field}
                                        />
                                    )}
                                />
                            </div>
                        </motion.div>
                    </div>
                    <motion.div animate={animation}>
                        <div className="flex-column mb-2">
                            <label>Set Password </label>
                            <span className='importantField'>*</span>
                        </div>
                        <div className={`inputForm ${errors.password?.message ? 'inputError' : ''}`}>
                            <svg height={20} viewBox="-64 0 512 512" width={20} xmlns="http://www.w3.org/2000/svg"><path d="m336 512h-288c-26.453125 0-48-21.523438-48-48v-224c0-26.476562 21.546875-48 48-48h288c26.453125 0 48 21.523438 48 48v224c0 26.476562-21.546875 48-48 48zm-288-288c-8.8125 0-16 7.167969-16 16v224c0 8.832031 7.1875 16 16 16h288c8.8125 0 16-7.167969 16-16v-224c0-8.832031-7.1875-16-16-16zm0 0" /><path d="m304 224c-8.832031 0-16-7.167969-16-16v-80c0-52.929688-43.070312-96-96-96s-96 43.070312-96 96v80c0 8.832031-7.167969 16-16 16s-16-7.167969-16-16v-80c0-70.59375 57.40625-128 128-128s128 57.40625 128 128v80c0 8.832031-7.167969 16-16 16zm0 0" /></svg>
                            <Controller
                                name="password"
                                control={control}
                                render={({ field }) => (
                                    <Input
                                        type={passwordtype ? 'text' : 'password'}
                                        className="input"
                                        placeholder="Enter your Password"
                                        {...field}
                                    />
                                )}
                            />
                            <svg onClick={() => setpasswordtype(!passwordtype)} viewBox="0 0 576 512" height="1em" xmlns="http://www.w3.org/2000/svg"><path d="M288 32c-80.8 0-145.5 36.8-192.6 80.6C48.6 156 17.3 208 2.5 243.7c-3.3 7.9-3.3 16.7 0 24.6C17.3 304 48.6 356 95.4 399.4C142.5 443.2 207.2 480 288 480s145.5-36.8 192.6-80.6c46.8-43.5 78.1-95.4 93-131.1c3.3-7.9 3.3-16.7 0-24.6c-14.9-35.7-46.2-87.7-93-131.1C433.5 68.8 368.8 32 288 32zM144 256a144 144 0 1 1 288 0 144 144 0 1 1 -288 0zm144-64c0 35.3-28.7 64-64 64c-7.1 0-13.9-1.2-20.3-3.3c-5.5-1.8-11.9 1.6-11.7 7.4c.3 6.9 1.3 13.8 3.2 20.7c13.7 51.2 66.4 81.6 117.6 67.9s81.6-66.4 67.9-117.6c-11.1-41.5-47.8-69.4-88.6-71.1c-5.8-.2-9.2 6.1-7.4 11.7c2.1 6.4 3.3 13.2 3.3 20.3z" /></svg>
                        </div>
                    </motion.div>
                    <motion.div animate={animation}>
                        <div className="flex-column">
                            <label>Confirm Password</label>
                        </div>
                        <div className={`inputForm ${errors.confirmPassword?.message ? 'inputError' : ''}`}>
                            <svg height={20} viewBox="-64 0 512 512" width={20} xmlns="http://www.w3.org/2000/svg"><path d="m336 512h-288c-26.453125 0-48-21.523438-48-48v-224c0-26.476562 21.546875-48 48-48h288c26.453125 0 48 21.523438 48 48v224c0 26.476562-21.546875 48-48 48zm-288-288c-8.8125 0-16 7.167969-16 16v224c0 8.832031 7.1875 16 16 16h288c8.8125 0 16-7.167969 16-16v-224c0-8.832031-7.1875-16-16-16zm0 0" /><path d="m304 224c-8.832031 0-16-7.167969-16-16v-80c0-52.929688-43.070312-96-96-96s-96 43.070312-96 96v80c0 8.832031-7.167969 16-16 16s-16-7.167969-16-16v-80c0-70.59375 57.40625-128 128-128s128 57.40625 128 128v80c0 8.832031-7.167969 16-16 16zm0 0" /></svg>
                            <Controller
                                name="confirmPassword"
                                control={control}
                                render={({ field }) => (
                                    <Input
                                        type={confirmPassword ? 'text' : 'password'}
                                        className="input"
                                        placeholder="Enter your Password"
                                        {...field} />
                                )}
                            />
                            <svg onClick={() => setconfirmPassword(!confirmPassword)} viewBox="0 0 576 512" height="1em" xmlns="http://www.w3.org/2000/svg"><path d="M288 32c-80.8 0-145.5 36.8-192.6 80.6C48.6 156 17.3 208 2.5 243.7c-3.3 7.9-3.3 16.7 0 24.6C17.3 304 48.6 356 95.4 399.4C142.5 443.2 207.2 480 288 480s145.5-36.8 192.6-80.6c46.8-43.5 78.1-95.4 93-131.1c3.3-7.9 3.3-16.7 0-24.6c-14.9-35.7-46.2-87.7-93-131.1C433.5 68.8 368.8 32 288 32zM144 256a144 144 0 1 1 288 0 144 144 0 1 1 -288 0zm144-64c0 35.3-28.7 64-64 64c-7.1 0-13.9-1.2-20.3-3.3c-5.5-1.8-11.9 1.6-11.7 7.4c.3 6.9 1.3 13.8 3.2 20.7c13.7 51.2 66.4 81.6 117.6 67.9s81.6-66.4 67.9-117.6c-11.1-41.5-47.8-69.4-88.6-71.1c-5.8-.2-9.2 6.1-7.4 11.7c2.1 6.4 3.3 13.2 3.3 20.3z" /></svg>
                        </div>
                    </motion.div>
                    <motion.div animate={fadeOut}>
                        <Button
                            type='submit'
                            text={isSubmitting ? 'Submitting...' : 'Register'}
                            className="button-submit"
                            disabled={isSubmitting}
                        />
                    </motion.div>
                    <p className="p">Have an account?
                        <Link className='span' to='/login'>Log In</Link>
                    </p>
                </form>
            </div>
        </>
    )
}

export default Register