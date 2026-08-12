import { getAuth, clerkClient } from '@clerk/express';

// Middleware to verify auth and check plan/usage
export const auth = async (req, res, next) => {
    try {
        const { userId, has } = getAuth(req);

        if (!userId) {
            return res.status(401).json({ success: false, message: 'Unauthorized. Please sign in.' });
        }

        req.authenticatedUserId = userId;

        // has({ plan }) requires Clerk billing to be configured.
        // Wrap in try/catch so a missing billing setup doesn't block all requests.
        let hasPremiumPlan = false;
        try {
            hasPremiumPlan = await has({ plan: 'premium' });
        } catch (planError) {
            console.warn('[auth] has({ plan }) check failed — defaulting to free plan:', planError.message);
            hasPremiumPlan = false;
        }

        const user = await clerkClient.users.getUser(userId);

        if (!hasPremiumPlan && user.privateMetadata.free_usage) {
            req.free_usage = user.privateMetadata.free_usage;
        } else {
            await clerkClient.users.updateUserMetadata(userId, {
                privateMetadata: {
                    free_usage: 0
                }
            });
            req.free_usage = 0;
        }

        req.plan = hasPremiumPlan ? 'premium' : 'free';
        next();
    } catch (error) {
        console.error('[auth] middleware error:', error.message);
        res.status(401).json({ success: false, message: error.message });
    }
};
