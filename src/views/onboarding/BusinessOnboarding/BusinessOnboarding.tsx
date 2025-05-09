import { useState } from 'react'
import Input from '@/components/ui/Input'
import Button from '@/components/ui/Button'
import { FormItem, Form } from '@/components/ui/Form'
import { useForm, Controller } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import Side from '@/components/layouts/AuthLayout/Side'
import Logo from '@/components/template/Logo'
import Alert from '@/components/ui/Alert'
import { useThemeStore } from '@/store/themeStore'
import { useAuth } from '@/auth'
import Upload from '@/components/ui/Upload'
import { isValidPhoneNumber } from 'libphonenumber-js'

const BeforeUpload = ({
    onFileSelect,
}: {
    onFileSelect: (base64: string, fileName: string) => void
}) => {
    const maxUpload = 1

    const beforeUpload = (files: FileList | null, fileList: File[]) => {
        if (!files || files.length === 0) {
            return 'Please select a file'
        }

        const file = files[0]

        if (fileList.length >= maxUpload) {
            return `You can only upload ${maxUpload} file(s)`
        }

        const allowedFileType = ['image/jpeg', 'image/png']
        if (!allowedFileType.includes(file.type)) {
            return 'Please upload a .jpeg or .png file!'
        }

        const maxFileSize = 500000
        if (file.size >= maxFileSize) {
            return 'Upload image cannot more then 500kb!'
        }

        // Process the file if all validations pass
        const reader = new FileReader()
        reader.onload = () => {
            const base64 = reader.result as string
            onFileSelect(base64, file.name)
        }
        reader.readAsDataURL(file)

        return true
    }

    const tip = <p className="mt-2">jpeg or png only (max 500kb)</p>

    return (
        <div>
            <Upload
                beforeUpload={beforeUpload}
                uploadLimit={maxUpload}
                tip={tip}
            />
        </div>
    )
}

const BusinessOnboarding = () => {
    const [isSubmitting, setSubmitting] = useState(false)
    const [message, setMessage] = useState('')
    const [logoBase64, setLogoBase64] = useState('')
    const [logoFileName, setLogoFileName] = useState('')
    const { saveBusinessDetails } = useAuth()
    const mode = useThemeStore((state) => state.mode)

    const handleFileSelect = (base64: string, fileName: string) => {
        setLogoBase64(base64)
        setLogoFileName(fileName)
    }

    const validationSchema = z.object({
        email: z
            .string({ required_error: 'Please enter your email' })
            .email('Please enter a valid email'),
        name: z
            .string({ required_error: 'Please enter your business name' })
            .min(2, 'Business name must be at least 2 characters'),
        address: z
            .string({ required_error: 'Please enter your address' })
            .min(5, 'Address is required'),
        phone: z
            .string({ required_error: 'Please enter your phone number' })
            .refine(
                (phone) => {
                    try {
                        return isValidPhoneNumber(phone)
                    } catch {
                        return false
                    }
                },
                {
                    message: 'Include country code (e.g., +1, +44)',
                },
            ),
    })

    type BusinessOnboardingSchema = z.infer<typeof validationSchema>

    const {
        handleSubmit,
        formState: { errors },
        control,
    } = useForm<BusinessOnboardingSchema>({
        resolver: zodResolver(validationSchema),
        defaultValues: {
            name: '',
            email: '',
            address: '',
            phone: '',
        },
    })

    const onSubmit = async (values: BusinessOnboardingSchema) => {
        const { name, email, phone, address } = values

        if (!logoBase64 || !logoFileName) {
            console.log('logoBase64', logoBase64)
            console.log('logoFileName', logoFileName)
            setMessage('Please upload a business logo')
            return
        }

        setSubmitting(true)
        const result = await saveBusinessDetails({
            name,
            email,
            phone,
            address,
            logo: logoBase64,
            logoFileName: logoFileName,
        })

        if (result?.status === 'failed') {
            setMessage?.(result.message)
        }

        setSubmitting(false)
    }

    return (
        <Side>
            <>
                <div className="mb-8">
                    <Logo
                        type="streamline"
                        mode={mode}
                        imgClass="mx-auto"
                        logoWidth={60}
                    />
                </div>
                <div className="mb-8">
                    <h3 className="mb-1">Business Details</h3>
                    <p className="font-semibold heading-text">
                        Enter your business information below
                    </p>
                </div>
                {message && (
                    <Alert showIcon className="mb-4" type="danger">
                        <span className="break-all">{message}</span>
                    </Alert>
                )}
                <Form onSubmit={handleSubmit(onSubmit)}>
                    <FormItem
                        label="Business Name"
                        invalid={Boolean(errors.name)}
                        errorMessage={errors.name?.message}
                    >
                        <Controller
                            name="name"
                            control={control}
                            render={({ field }) => (
                                <Input
                                    type="text"
                                    placeholder="Business Name"
                                    autoComplete="off"
                                    {...field}
                                />
                            )}
                        />
                    </FormItem>
                    <FormItem
                        label="Business Email"
                        invalid={Boolean(errors.email)}
                        errorMessage={errors.email?.message}
                    >
                        <Controller
                            name="email"
                            control={control}
                            render={({ field }) => (
                                <Input
                                    type="email"
                                    placeholder="Business Email"
                                    autoComplete="off"
                                    {...field}
                                />
                            )}
                        />
                    </FormItem>
                    <FormItem
                        label="Business Address"
                        invalid={Boolean(errors.address)}
                        errorMessage={errors.address?.message}
                    >
                        <Controller
                            name="address"
                            control={control}
                            render={({ field }) => (
                                <Input
                                    type="text"
                                    placeholder="Business Address"
                                    autoComplete="off"
                                    {...field}
                                />
                            )}
                        />
                    </FormItem>
                    <FormItem
                        label="Business Phone"
                        invalid={Boolean(errors.phone)}
                        errorMessage={errors.phone?.message}
                    >
                        <Controller
                            name="phone"
                            control={control}
                            render={({ field }) => (
                                <Input
                                    type="tel"
                                    placeholder="Business Phone"
                                    autoComplete="off"
                                    {...field}
                                />
                            )}
                        />
                    </FormItem>
                    <FormItem label="Business Logo" className="mb-4">
                        <BeforeUpload onFileSelect={handleFileSelect} />
                    </FormItem>
                    <Button
                        block
                        loading={isSubmitting}
                        variant="solid"
                        type="submit"
                    >
                        {isSubmitting ? 'Saving...' : 'Save Business Details'}
                    </Button>
                </Form>
            </>
        </Side>
    )
}

export default BusinessOnboarding
