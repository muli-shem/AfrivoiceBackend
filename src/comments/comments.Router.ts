import {Hono} from 'hono';
import {listComments , getComments, createComments,  updateComments, deleteComments} from './comments.Controller'

export const commentsRouter = new Hono();

commentsRouter.get('/comments', listComments )

.get('/comments/:id', getComments)

.post('/comments', createComments)

.put('/comments/:id', updateComments)

.delete('/comments/:id', deleteComments);
