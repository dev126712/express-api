import { Router } from "express";
import authorize from "../middleware/auth.middleware.js";
import { createSubscription, getUserSub, getAllSubscriptions, updateSubscription, deleteSubscription, cancelSubscription, getUpcomingRenewals, getSubscriptionById } from "../controllers/subscription.controller.js";

const subscriptionRouter = Router();

subscriptionRouter.get('/', getAllSubscriptions); // List all subscriptions

subscriptionRouter.get('/:id', authorize, getSubscriptionById); // Get subscription details by ID

subscriptionRouter.post('/:id/', authorize, createSubscription); // Create a new subscription

subscriptionRouter.put('/:id', authorize, updateSubscription); // Update subscription by ID

subscriptionRouter.delete('/:id', authorize, deleteSubscription); // Delete subscription by ID

subscriptionRouter.get('/user/:id', authorize, getUserSub); // Get subscriptions for a specific user
subscriptionRouter.put('/:id/cancel', authorize, cancelSubscription); // Cancel a subscription by ID

subscriptionRouter.get('/upcoming-renewals', getUpcomingRenewals); // List upcoming renewals

export default subscriptionRouter;