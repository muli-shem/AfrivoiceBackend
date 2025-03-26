import {Hono} from 'hono';
import {listFeebacks , getFeedbacks, createFeedbacks,  updateFeedbacks, deleteFeedbacks} from './feedbackfeedbackreports.Controller'

export const feedbackRouter = new Hono();

feedbackRouter.get('/feedback', listFeebacks )

.get('/feedback/:id', getFeedbacks)

.post('/feedback', createFeedbacks)

.put('/feedback/:id', updateFeedbacks)

.delete('/feedback/:id', deleteFeedbacks);
