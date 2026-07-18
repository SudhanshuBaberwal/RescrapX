import ApiError from "../lib/ApiError.js";
import authRepository from "../repository/auth.repository.js";
import { partnerStatusChangeDto } from "../validations/admin.validation.js";

class AdminService{
    async changePartnerStatus(data:partnerStatusChangeDto){
        try {
            const id = data.partnerId
            const partner = await authRepository.findById(id)
            if (!partner){
                throw new ApiError(404 , "Partner Not found")
            }
            
            
        } catch (error) {
            console.log(error)
        }
    }
}