import express, { Router }  from "express";
import { getAllOrders,
         getPendingOrders,
         getOrderById,
         createOrder,
         updateOrder,
         deleteOrder,
         collectOrder
} from "../controllers/order.controller.js";
import { protect } from "../middleware/auth.middleware.js";

const router = express.Router();

//all routes protected

router.get('/getALL',protect,getAllOrders);
router.get('/pendig',protect,getPendingOrders);
router.get('/ordersID',protect,getOrderById);
router.post('/creating',protect,createOrder);
router.put('/upate',protect,updateOrder);
router.delete('/delet',protect,deleteOrder);
router.patch('/collection',protect,collectOrder);
 export default router;

