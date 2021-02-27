import Mail from "nodemailer/lib/mailer";
import * as nodemailer from "nodemailer";
import { SendMailOptions, SentMessageInfo } from "nodemailer";
import { IServerInfo } from "./ServerInfo";

export class Worker {
   private serverInfo: IServerInfo;
   constructor(serverInfo: IServerInfo) {
      this.serverInfo = serverInfo;
   }
}