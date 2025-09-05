import { Global, Module } from '@nestjs/common';
import { MailerModule as NestMalierModule } from '@nestjs-modules/mailer';
import { join } from 'path';
import {HandlebarsAdapter} from "@nestjs-modules/mailer/dist/adapters/handlebars.adapter"
import { AppMailerService } from './mailer.service';
@Global()
@Module({
  imports:[
    NestMalierModule.forRoot({
      transport:{
        service:'gmail',
        auth:{
          user:'asqaraliyevfaxriddin2011@gmail.com',
          pass:"w k a t p l r b i j m i b x g r"
        }
      },

      defaults:{
        from:"IT company<asqaraliyevfaxrididn2011@gmail.com>"
      },

      template:{
        dir:join(process.cwd(),'src','templates'),
        adapter:new HandlebarsAdapter(),
        options:{
          strict:true
        }
      }
    })
  ],
providers:[AppMailerService],
exports:[AppMailerService]

})
export class MailerModule {}
