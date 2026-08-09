import api from "@/utils/api"

export const applyForAuction = async (vehicleId:string)=> {
    try {
        const vehicle = await api.post(`/api/vehicle/register/apply?vehicleId=${vehicleId}`)
        return vehicle.data;
    } catch (error) {
        console.log(error)
    }
}