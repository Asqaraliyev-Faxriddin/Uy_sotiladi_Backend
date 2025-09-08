import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { IChekOtp, SendOtpDto, VerifyOtpDto } from './dto/verification.dto';
import { EverificationTypes } from 'src/common/types/verification';
import { SmsService } from 'src/common/services/sms.service';
import { RedisService } from 'src/core/prisma/redis/redis.service'; 
import { PrismaService } from 'src/core/prisma/prisma.service';
import { SectoMills } from 'src/core/prisma/utils/times'; 
import { getMessages } from 'src/core/prisma/utils/functions'; 
import { generateOtp } from 'src/core/prisma/utils/random'; 

@Injectable()
export class VerificationService {
    
    constructor(private prismaService:PrismaService,private smsService:SmsService,private redis:RedisService){}

    public getKey(type:string,email:string,confirmation?:boolean){
        const storesKeys: Record<EverificationTypes,string> = {
            [EverificationTypes.REGISTER]:"reg_",
            [EverificationTypes.RESET_PASSWORD]:"respass_",
            [EverificationTypes.EDIT_PHONE]:"edph_",

        }
        let key = storesKeys[type]
        if(confirmation){
            key+="cfm_";
        }
        key+=email
        return key
    }


    private async throwIFUserExist(email:string){
        const user = await this.prismaService.users.findUnique({where:{email}})

        if(user){
            throw new HttpException("Email already used",HttpStatus.BAD_REQUEST)
        }

        return user
    }

    private async throwIFUserNotExist(email:string){
        const user = await this.prismaService.users.findUnique({where:{email}})

        if(!user){
            throw new HttpException("User not found",HttpStatus.NOT_FOUND)
        }

        return user
    }





    async sendOtp(payload:SendOtpDto){
        const {type,email} = payload
        const key = this.getKey(type,email);
        const session = await this.redis.get(key)

        if(session){
            throw new HttpException("Code already sent to user",HttpStatus.BAD_REQUEST )
        }

        switch(type){
            case EverificationTypes.REGISTER:
            await this.throwIFUserExist(email)
            break

            case EverificationTypes.EDIT_PHONE:
                await this.throwIFUserNotExist(email)
                break

                case EverificationTypes.RESET_PASSWORD:
                    await this.throwIFUserNotExist(email)
                    break
        }

        const otp = generateOtp()
        await this.redis.set(key,JSON.stringify(otp),SectoMills(30))
        await this.smsService.sendSms(
            getMessages(type,otp), 
            email,            
            Number(otp),             
          );
        return {message:"Confirmation code Sent"}
        
    }


    async verifyOtp(payload:VerifyOtpDto){

        const {type,email,otp} = payload

        const session = await this.redis.get(this.getKey(type,email))
        
        if(!session){
            throw new HttpException("OTP expired!",HttpStatus.BAD_REQUEST)
        }

        if(otp !==JSON.parse(session)){
            throw new HttpException("invalid OTP!",HttpStatus.BAD_REQUEST)

        }

        await this.redis.del(this.getKey(type,email))
        await this.redis.set(this.getKey(type,email,true),JSON.stringify(otp),SectoMills(4000))
    
        return {
            status:true,
            message:"Verified"
        }
    
    }




   public async checkConfirmOtp(payload:IChekOtp){

        const {type,email,otp} = payload

        const session = await this.redis.get(this.getKey(type,email,true))
        
        if(!session){
            throw new HttpException("OTP expired!",HttpStatus.BAD_REQUEST)
        }

        if(otp !==JSON.parse(session)){
            throw new HttpException("invalid OTP!",HttpStatus.BAD_REQUEST)

        }

        await this.redis.del(this.getKey(type,email,true))

    
        return true
    
    }
}
