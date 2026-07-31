import api from "@/utils/api"

export const createDraftVehicle = async () => {
    try {
        const result = await api.post("/api/vehicle/register")
        return result.data;
    } catch (error) {
        console.log(error)
    }
}