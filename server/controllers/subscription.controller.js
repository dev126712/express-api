import Subscription from '../models/subscription.model.js';
import asyncHandler from '../middleware/async.middleware.js';
import { workflowClient } from '../config/upstash.js';
import { SERVER_URL } from '../config/env.js';

export const createSubscription = asyncHandler(async (req, res, next) => {
    const subscription = await Subscription.create({
        ... req.body,
        user: req.user._id,
    });

    /* await workflowClient.trigger({
        url: `${SERVER_URL}/api/v1/workflows/subscription/reminders`,
        body: { subscriptionId: subscription._id, },
    });*/

    res.status(201).json({ success:true, data: subscription });
});

export const getUserSub = asyncHandler(async (req, res, next) => {
    if(req.user.id !== req.params.id) {
        const error = new Error('Unauthorized access. Not the owner of that subscription');
        error.status = 401;
        throw error;
    }

    const subscriptions = await Subscription.find({user: req.params.id})

    res.status(200).json({ success:true, data: subscriptions });
});   

export const getSubscriptionById = asyncHandler(async (req, res, next) => {
    const subscription = await Subscription.findById(req.params.id);

    if (subscription.user.toString() !== req.user._id.toString()) {
        const error = new Error('Not authorized to modify this subscription');
        error.status = 403;
        throw error;
    }

    if (!subscription) {
        const error = new Error('Subscription not found');
        error.status = 404;
        throw error;
    }

    res.status(200).json({ success: true, data: subscription });
});

export const updateSubscription = asyncHandler(async (req, res, next) => {
    const subscription = await Subscription.findById(req.params.id);
    if (!subscription) {
        const error = new Error('Subscription not found');
        error.status = 404;
        throw error;
    }
    if (subscription.user.toString() !== req.user._id.toString()) {
        const error = new Error('Not authorized to modify this subscription');
        error.status = 403;
        throw error;
    }

    const updatedSubscription = await Subscription.findByIdAndUpdate(
        req.params.id,
        req.body,
        { new: true, runValidators: true }
    );

    res.status(200).json({ success: true, data: updatedSubscription });
});

export const deleteSubscription = asyncHandler(async (req, res, next) => {
    const subscription = await Subscription.findById(req.params.id);

    if (!subscription) {
        const error = new Error('Subscription not found');
        error.status = 404;
        throw error;
    }

    if (subscription.user.toString() !== req.user._id.toString()) {
        const error = new Error('Not authorized to modify this subscription');
        error.status = 403;
        throw error;
    }

    await Subscription.findByIdAndDelete(req.params.id);

    res.status(200).json({ success: true, data: {} }); 
});

export const cancelSubscription = asyncHandler(async (req, res, next) => {
    
    const subscription = await Subscription.findById(req.params.id);

    if (!subscription) {
        const error = new Error('Subscription not found');
        error.status = 404;
        throw error;
    }

    subscription.status = 'canceled';
    await subscription.save();

    res.status(200).json({ success: true, data: subscription });
   
});

export const getAllSubscriptions = asyncHandler(async (req, res, next) => {
    const subscriptions = await Subscription.find({ user: req.user._id });
    res.status(200).json({ success: true, data: subscriptions });
});

export const getUpcomingRenewals = asyncHandler(async (req, res, next) => {
    
    const now = new Date();
    const upcomingRenewals = await Subscription.find({
        user: req.user._id,
        renewalDate: { $gte: now, $lte: new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000) },
        status: 'active'
    });

    res.status(200).json({ success: true, data: upcomingRenewals });
});
