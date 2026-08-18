import auctionService from "../service/auction.service.js";
setInterval(async () => {
    try {
        const count = await auctionService.checkAuctionsForStartApproval();
        if (count > 0) {
            console.log(`${count} auction(s) waiting for admin approval`);
        }
    }
    catch (error) {
        console.error("Approval check failed:", error);
    }
}, 10_000);
setInterval(async () => {
    try {
        const count = await auctionService.startApprovedAuctions();
        if (count > 0) {
            console.log(`${count} auction(s) started`);
        }
    }
    catch (error) {
        console.error("Auction start check failed:", error);
    }
}, 10_000);
