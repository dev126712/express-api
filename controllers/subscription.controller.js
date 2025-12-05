import Subscription from '../models/subscription.model.js';
//import { workflowClient } from '../utils/workflowClient.js';
import { SERVER_URL } from '../config/env.js';

export const createSubscription = async (req, res, next) => {
    try {
        const subscription = await Subscription.create({
            ... req.body,
            user: req.user._id,
        });

        await workflowClient.trigger({
            url: `${SERVER_URL}/api/v1/workflows/subscription/reminders`,
            body: { subscriptionId: subscription._id, },
        });

        res.status(201).json({ success:true, data: subscription });
    } catch (error) {
        next(error);
    }
}

export const getUserSub = async (req, res, next) => {
    try{
        if(req.user.id !== req.params.id) {
            const error = new Error('Unauthorized access. Not the owner of that subscription');
            error.status = 401;
            throw error;
        }

        const subscriptions = await Subscription.find({user: req.params.id})

        res.status(200).json({ success:true, data: subscriptions });
    } catch (error) {
        next(error);
    }
};   

export const getSubscriptionById = async (req, res, next) => {
    try {
        const subscription = await Subscription.findById(req.params.id);

        if (!subscription) {
            const error = new Error('Subscription not found');
            error.status = 404;
            throw error;
        }

        res.status(200).json({ success: true, data: subscription });
    } catch (error) {
        next(error);
    }
};

export const updateSubscription = async (req, res, next) => {
    try {
        const subscription = await Subscription.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true, runValidators: true }
        );

        if (!subscription) {
            const error = new Error('Subscription not found');
            error.status = 404;
            throw error;
        }

        res.status(200).json({ success: true, data: subscription });
    } catch (error) {
        next(error);
    }
};

export const deleteSubscription = async (req, res, next) => {
    try {
        const subscription = await Subscription.findByIdAndDelete(req.params.id);

        if (!subscription) {
            const error = new Error('Subscription not found');
            error.status = 404;
            throw error;
        }

        res.status(200).json({ success: true, data: {} });
    } catch (error) {
        next(error);
    }   
};

export const cancelSubscription = async (req, res, next) => {
    try {
        const subscription = await Subscription.findById(req.params.id);

        if (!subscription) {
            const error = new Error('Subscription not found');
            error.status = 404;
            throw error;
        }

        subscription.status = 'canceled';
        await subscription.save();

        res.status(200).json({ success: true, data: subscription });
    } catch (error) {
        next(error);
    }
};

export const getAllSubscriptions = async (req, res, next) => {
    try {
        const subscriptions = await Subscription.find();
        res.status(200).json({ success: true, data: subscriptions });
    } catch (error) {
        next(error);
    }
};

export const getUpcomingRenewals = async (req, res, next) => {
    try {
        const now = new Date();
        const upcomingRenewals = await Subscription.find({
            renewalDate: { $gte: now, $lte: new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000) },
            status: 'active'
        });

        res.status(200).json({ success: true, data: upcomingRenewals });
    } catch (error) {
        next(error);
    }
};