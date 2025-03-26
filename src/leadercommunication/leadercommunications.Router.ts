import {Hono} from 'hono';
import { listLeadearscommune, getLeaderscommune, createLeaderscommune, updateLeaderscommune, deleteLeaderscommune } from '../leadercommunication/leadercommunications.Controller';
export const leaderscommuneRouter = new (Hono)

leaderscommuneRouter.get('/leader_communications', listLeadearscommune)
.get("/leader_communications/:id", getLeaderscommune)
.post ("/leader_communications", createLeaderscommune)
.put("/leader_communications/:id", updateLeaderscommune)
.delete("/leader_communications/:id", deleteLeaderscommune)