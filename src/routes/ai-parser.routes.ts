import Express from 'express';
import AiParserController from '../controllers/ai-parser.controller';

const router = Express.Router();

//POST
router.post('/parse', AiParserController.parseAndCreate);
router.post('/train', AiParserController.trainAndCreate);

export default router;