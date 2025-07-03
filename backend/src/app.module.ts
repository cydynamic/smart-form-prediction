import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { FormsModule } from './modules/forms/forms.module';
import { UsersModule } from './modules/users/users.module';
import { PredictionsModule } from './modules/predictions/predictions.module';
import { AppController } from './app.controller';
import { AppService } from './app.service';

@Module({
    imports: [
        ConfigModule.forRoot({
            isGlobal: true,
            envFilePath: '.env',
        }),
        FormsModule,
        UsersModule,
        PredictionsModule,
    ],
    controllers: [AppController],
    providers: [AppService],
})
export class AppModule { } 