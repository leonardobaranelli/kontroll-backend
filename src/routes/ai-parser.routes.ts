import Express from 'express';
import AiParserController from '../controllers/ai-parser.controller';

const router = Express.Router();

//POST
router.post('/parse', AiParserController.parseAndCreate);
router.get('/parse/:carrier/:trackingId', AiParserController.parseShipment);

export default router;
