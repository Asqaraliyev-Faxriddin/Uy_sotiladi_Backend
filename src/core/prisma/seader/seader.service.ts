import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { PrismaService } from '../prisma.service'; 
import { UserType } from '@prisma/client';
import * as bcrypt from "bcrypt"

@Injectable()
export class SeaderService implements OnModuleInit {

    private loger = new Logger("Seader")

    constructor(private prisma:PrismaService){}


    async onModuleInit() {
                 
        await this.CreateSuperadmin()
    }

    async CreateSuperadmin() {
      let password = await bcrypt.hash("11201111",10)
        await this.prisma.users.createMany({
          data: [
            {
              firstName: 'Faxriddin',
              lastName:"Asqaraliyev",
              email: 'asqaraliyevfaxriddin2011@gmail.com',
              role: UserType.ADMIN,
              password
            },


            {
              firstName: 'Biror',
              lastName:"Kim",
              email: 'asqaraliyevfaxriddin2009@gmail.com',
              role: UserType.SELL,
              password
            },
            

            {
              firstName: 'Men',
              lastName:"Sen",
              email: 'asqaraliyevfaxriddin44@gmail.com',
              role: UserType.BUY,
              password
            },
            
      
           
          ],
          skipDuplicates: true,
        });
       
        this.loger.log("Admin ,Sotuvchi va Xaridor yaratildi.")
      }
}
