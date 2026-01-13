'use server'
import nodemailer from 'nodemailer';
import { format, parseISO } from 'date-fns';

const transporter= nodemailer.createTransport({
            host: 'smtp.gmail.com',
            port: 465,
            secure: true,
            auth: {
                user: process.env.MAIL_USER ?? '',
                pass: process.env.MAIL_PASS ?? '',
            },
            tls: {
                rejectUnauthorized: false
            }
        });

export async function sendSchedulingConfirmation(userEmail: string, userName: string, dateString: string, time: string) {
        try {
            const parsedDate = parseISO(dateString);
            const formattedDate = format(parsedDate, 'dd/MM/yyyy');

            const info = await transporter.sendMail({
                from: `"Scheduling App" <${process.env.MAIL_USER ?? ''}>`,
                to: userEmail,
                subject: '🔔 Confirmação de Agendamento',
                html: `
                    <div style="font-family: sans-serif; color: #333;">
                        <h1>Olá, ${userName}!</h1>
                        <p>Seu agendamento foi confirmado com sucesso.</p>
                        <p><strong>Data:</strong> ${formattedDate}</p>
                        <p><strong>Horário:</strong> ${time}</p>
                        <p>Te aguardamos!</p>
                    </div>
                `,
            });
            return info;
        } catch (error) {
            console.error("Erro ao enviar email:", error);
            return null;
        }
    }

    export async function sendSchedulingCancellation(userEmail: string, userName: string, dateString: string, time: string, isAdmin: boolean) {
        if(!isAdmin) return;
        try {
            const parsedDate = parseISO(dateString);
            const formattedDate = format(parsedDate, 'dd/MM/yyyy');

            const info = await transporter.sendMail({
                from: `"Scheduling App" <${process.env.MAIL_USER ?? ''}>`,
                to: userEmail,
                subject: '❌ Cancelamento de Agendamento',
                html: `
                    <div style="font-family: sans-serif; color: #333;">
                        <h1>Olá, ${userName}!</h1>
                        <p>Seu agendamento foi cancelado por um adimnistrador.</p>
                        <p><strong>Data:</strong> ${formattedDate}</p>
                        <p><strong>Horário:</strong> ${time}</p>
                    </div>
                `,
            });
            return info;
        } catch (error) {
            console.error("Erro ao enviar email:", error);
            return null;
        }
    }

export async function notifyAdminNewSchedule(adminEmail: string, userName: string, userEmail: string, dateString: string, time: string) {
        try {
            const parsedDate = parseISO(dateString);
            const formattedDate = format(parsedDate, 'dd/MM/yyyy');

            const info = await transporter.sendMail({
                from: `"Sistema de Agendamento" <${process.env.MAIL_USER ?? ''}>`,
                to: adminEmail,
                subject: `🔔 Novo Agendamento: ${userName}`,
                html: `
                    <div style="font-family: sans-serif; color: #333; border: 1px solid #ddd; padding: 20px; border-radius: 8px;">
                        <h2 style="color: #000;">Novo Agendamento Realizado</h2>
                        <p>Um usuário acabou de realizar um agendamento no sistema.</p>
                        
                        <hr style="border: 0; border-top: 1px solid #eee; margin: 20px 0;" />

                        <p><strong>Usuário:</strong> ${userName} (${userEmail})</p>
                        <p><strong>Data:</strong> ${formattedDate}</p>
                        <p><strong>Horário:</strong> ${time}</p>
                    </div>
                `,
            });
            return info;
        } catch (error) {
            console.error("Erro ao enviar email:", error);
            return null;
        }
    }   