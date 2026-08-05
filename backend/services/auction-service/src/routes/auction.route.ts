import { Router } from "express";

const router = Router();

router.get("/", (_, res) => {

    res.json({
        success: true,
        message: "Auction Service Working"
    });

});

export default router;