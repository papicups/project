import nodemailer from 'nodemailer';
import { UserTracker } from './UserTracker';
import 'dotenv/config';

export class EmailReporter {
    private static instance: EmailReporter;
    private transporter: nodemailer.Transporter;
    private isInitialized: boolean = false;
    private lastReportDate: string = '';

    private constructor() {
        if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS) {
            console.error('Email configuration missing. Please set EMAIL_USER and EMAIL_PASS in .env file');
            return;
        }

        this.transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: process.env.EMAIL_USER,
                pass: process.env.EMAIL_PASS
            }
        });
    }

    static getInstance(): EmailReporter {
        if (!EmailReporter.instance) {
            EmailReporter.instance = new EmailReporter();
        }
        return EmailReporter.instance;
    }

    async initialize(): Promise<void> {
        if (this.isInitialized) return;

        try {
            // Verify email configuration
            await this.transporter.verify();
            console.log('Email service configured successfully');

            // Schedule daily report
            this.setupDailyReport();
            this.isInitialized = true;
        } catch (error) {
            console.error('Failed to initialize email service:', error);
        }
    }

    private setupDailyReport(): void {
        // Check every hour instead of every minute to reduce server load
        setInterval(() => {
            const now = new Date();
            const currentDate = now.toDateString();

            // Send report at midnight and ensure we haven't already sent one today
            if (now.getHours() === 0 && this.lastReportDate !== currentDate) {
                this.sendDailyReport();
                this.lastReportDate = currentDate;
            }
        }, 3600000); // Check every hour
    }

    private async sendDailyReport(): Promise<void> {
        const visitorCount = UserTracker.getInstance().getDailyVisitCount();
        const date = new Date().toLocaleDateString('es-AR', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });

        const mailOptions = {
            from: process.env.EMAIL_USER,
            to: 'mgenialive@gmail.com',
            subject: `Reporte Diario Casino Quiniela - ${date}`,
            html: `
                <h2>Reporte de Uso Diario</h2>
                <p>Fecha: ${date}</p>
                <p>Total de visitantes hoy: ${visitorCount}</p>
                <br>
                <p>Este es un reporte automático de Papiweb Casino Quiniela.</p>
                <p>Sistema de reporte generado el ${new Date().toLocaleTimeString('es-AR')}</p>
            `
        };

        try {
            await this.transporter.sendMail(mailOptions);
            console.log('Reporte diario enviado exitosamente');
        } catch (error) {
            console.error('Error al enviar reporte diario:', error);
        }
    }
}