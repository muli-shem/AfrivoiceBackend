import {Hono} from 'hono';
import {listLeadears, getLeaders, createLeaders,  updateLeaders, deleteLeaders} from './leaders.Controller'

export const leadersRouter = new Hono();

leadersRouter.get('/leaders', listLeadears)

.get('/leaders/:id', getLeaders)

.post('/leaders', createLeaders)

.put('/leaders/:id', updateLeaders)

.delete('/leaders/:id', deleteLeaders);
