import { EverificationTypes } from "src/common/types/verification";

export function getMessages(type:EverificationTypes,otp:string){

    switch (type) {
        case EverificationTypes.REGISTER:
            return `Faxriddin platformasida telefoningizni o'zgartirish uchun tasdiqlash kodi: ${otp}. Kodni hech kimga bermang!`;
        case EverificationTypes.RESET_PASSWORD:
            return `Faxriddin platformasida parolingizni tiklash uchun tasdiqlash kodi: ${otp}. Kodni hech kimga bermang!`;
        case EverificationTypes.EDIT_PHONE:
            return `Faxriddin platformasida telefoningizni o'zgartirish uchun tasdiqlash kodi: ${otp}. Kodni hech kimga bermang!`;
    }

}