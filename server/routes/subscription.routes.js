import { Router } from "express";
import authorize from "../middleware/auth.middleware.js";
import { createSubscription, getUserSub, getAllSubscriptions, updateSubscription, deleteSubscription, cancelSubscription, getUpcomingRenewals, getSubscriptionById } from "../controllers/subscription.controller.js";

const subscriptionRouter = Router();

subscriptionRouter.use(authorize);

subscriptionRouter.get('/', getAllSubscriptions); // List all subscriptions
subscriptionRouter.post('/', createSubscription); // Create a new subscription

subscriptionRouter.get('/upcoming-renewals', getUpcomingRenewals); // List upcoming renewals

subscriptionRouter.get('/:id',  getSubscriptionById); // Get subscription details by ID
subscriptionRouter.put('/:id', updateSubscription); // Update subscription by ID
subscriptionRouter.delete('/:id', deleteSubscription); // Delete subscription by ID
subscriptionRouter.get('/user/:id', getUserSub); // Get subscriptions for a specific user
subscriptionRouter.put('/:id/cancel', cancelSubscription); // Cancel a subscription by ID

export default subscriptionRouter;
