import dayjs from 'dayjs';
import { createRequire } from 'module';
const require = createRequire(import.meta.url);
const { serve } = require('@upstash/workflow/express');
import Subscription from '../models/subscription.model.js';

const REMINDER = [7, 5, 2, 1, 0];


export const sendReminders = serve( async (context) =>{
    const { subscriptionId } = context.requestPayload;
    const subscription = await fetchSubscription(context, subscriptionId);

    if(!subscription || subscription.status !== 'active') return;

    const renewalDate = dayjs(subscription.nextRenewal);

    if(renewalDate.isBefore(dayjs())) {
        console.log(`Subscription ${subscriptionId} is past due for renewal. Stopping workflows`);
        return;
    }

    for(const daysBefore of REMINDER) {
        const reminderDate = renewalDate.subtract(daysBefore, 'day');

        if(reminderDate.isAfter(dayjs())) {
            await sleepUnitReminder(context, `reminder_${daysBefore} days before`, reminderDate);
        }

        await triggerReminder(context, `reminder_${daysBefore} days before`);
    }
});

const fetchSubscription = async (context, subscriptionId) => {
    return await context.run('get subscription', async () => {
        return Subscription.findById(subscriptionId).populate('user', 'email name');
    })
};

const sleepUnitReminder = async (context, label, date) => {
    console.log(`Sleeping until ${label} reminder: ${date.toISOString()}`);
    await context.sleepUntil(date.toDate());
}

const triggerReminder = async (context, label) => {
    return await context.run(label, () => {
        console.log(`Triggering ${label} reminder`);
    })
}