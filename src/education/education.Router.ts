import {Hono} from 'hono';
import {ListContent, GetContentById, CreateContent, updateContent, deleteContent} from './education.Controller';

export const educationRouter = new Hono();

educationRouter.get('/education', ListContent);
educationRouter.get('/education/:id', GetContentById);
educationRouter.post('/education', CreateContent);
educationRouter.put('/education/:id', updateContent);
educationRouter.delete('/education/:id', deleteContent);

