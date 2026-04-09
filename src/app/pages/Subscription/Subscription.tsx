import React from 'react'
import { Content } from '../../../_metronic/layout/components/content'
import SubscriptionList from '../../modules/SubscriptionList/SubscriptionList'

const subscriptionData = {
    currentPlan: {
        id: 'silver',
        name: 'Silver',
        price: 1999,
        propertyLimit: 25,
        usedProperties: 25,
    },

    features: [
        'Property Listings',
        'Featured Listings',
        'Agent Profiles',
        'Advanced Analytics',
        'Priority Support',
        'CRM Integration',
        'Lead Management',
        'Custom Branding',
    ],

    plans: [
        {
            id: 'bronze',
            name: 'Bronze',
            price: 999,
            propertyLimit: 10,
            popular: false,
            features: {
                'Property Listings': true,
                'Featured Listings': false,
                'Agent Profiles': true,
                'Advanced Analytics': false,
                'Priority Support': false,
                'CRM Integration': false,
                'Lead Management': false,
                'Custom Branding': false,
            },
        },
        {
            id: 'silver',
            name: 'Silver',
            price: 1999,
            propertyLimit: 25,
            popular: true,
            features: {
                'Property Listings': true,
                'Featured Listings': true,
                'Agent Profiles': true,
                'Advanced Analytics': true,
                'Priority Support': false,
                'CRM Integration': false,
                'Lead Management': true,
                'Custom Branding': false,
            },
        },
        {
            id: 'gold',
            name: 'Gold',
            price: 3999,
            propertyLimit: 100,
            popular: false,
            features: {
                'Property Listings': true,
                'Featured Listings': true,
                'Agent Profiles': true,
                'Advanced Analytics': true,
                'Priority Support': true,
                'CRM Integration': true,
                'Lead Management': true,
                'Custom Branding': true,
            },
        },
    ],
}

const Subscription = () => {
    return (
        <Content>
            <SubscriptionList data={subscriptionData} />
        </Content>
    )
}

export default Subscription