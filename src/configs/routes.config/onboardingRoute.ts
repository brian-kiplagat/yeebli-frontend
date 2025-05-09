import { lazy } from 'react'
import { ONBOARDING_PREFIX_PATH } from '@/constants/route.constant'
import { ADMIN, USER } from '@/constants/roles.constant'
import type { Routes } from '@/@types/routes'

const onboardingRoute: Routes = [
    {
        key: 'onboarding.businessOnboarding',
        path: `${ONBOARDING_PREFIX_PATH}/business-onboarding`,
        component: lazy(() => import('@/views/onboarding/BusinessOnboarding')),
        authority: [ADMIN, USER],
        meta: {
            layout: 'blank',
            pageContainerType: 'gutterless',
            footer: false,
        },
    },
]

export default onboardingRoute
