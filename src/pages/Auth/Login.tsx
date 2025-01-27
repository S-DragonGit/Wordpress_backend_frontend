import FormOne from '../../components/FormOne'
import { formFieldsLogin } from '../../app/list'
import { useMutation } from '@tanstack/react-query'
import { authApi } from '../../services/auth'
import { useNavigate } from 'react-router-dom'
import { useState } from 'react'
import { userId, userLogin } from '../../app/redux/userSlice'
import { useDispatch } from 'react-redux'

const Login = () => {
    const [formData, setFormData] = useState({
        username: '',
        password: ''
    })
    
    const [error, setError] = useState<string>('');
    const navigate = useNavigate()
    const dispatch = useDispatch();

    const loginMutation = useMutation({
        mutationFn: (data: { username: string; password: string }) => authApi({ ...data, type: 'email' }),
        onSuccess: (data: any) => {
            console.log(data, 'data')
            if (!formData.username || !formData.password) {
                setError("Please Enter valid data")
                return
            }

            if (data.data.token) {
                if (data.data.user.ID) {
                    const id = data.data.user.ID
                    dispatch(userId({ id }))
                }
                const token = data.data.token
                dispatch(userLogin({ token }))
                navigate('/')
            } else {
                if (!data.data.success) {
                    setError("Invalid user details")
                    return
                }
                if (data.response?.data?.message) {
                    setError(data.response.data.message)
                } else {
                    setError('Login failed')
                }
            }
        },
        onError: (error) => {
            setError("Internal Server Error")
            console.error('Login failed', error)
        },
    })

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target
        setFormData(prev => ({
            ...prev,
            [name]: value
        }))
    }

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault()
        loginMutation.mutate(formData)
    }

    return (
        <div className='w-full h-screen flex flex-col justify-center items-center'>
            <h3 className='text-2xl font-bold text-primary mb-4'>Rafiki Coalition Login</h3>
            <form onSubmit={handleSubmit} className='w-full p-5 flex flex-col gap-6 px-4 max-w-[400px] bg-primary-light3 rounded-lg'>
                {formFieldsLogin.map((field, index) => (
                    <FormOne
                        key={index}
                        {...field}
                        value={formData[field.name as keyof typeof formData]}
                        onChange={handleInputChange}
                    />
                ))}
                {error && <p className="text-failed text-sm">{error}</p>}
                <button
                    type="submit"
                    className='bg-primary text-white font-semibold px-4 p-2 rounded-full'
                    disabled={loginMutation.isPending}
                >
                    {loginMutation.isPending ? 'Logging in...' : 'Login'}
                </button>
            </form>
        </div>
    )
}

export default Login