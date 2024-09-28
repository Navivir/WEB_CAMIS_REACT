package com.example.Joyas.service;

import javax.mail.*;
import javax.mail.internet.InternetAddress;
import javax.mail.internet.MimeMessage;
import java.util.Properties;

public class EmailService {

    private final String username = "marcomaceira.r@gmail.com"; // Tu correo
    private final String password = "wbfl iysx skmy gofx "; // Contraseña de aplicación

    public void sendMail(String clientEmail, String subject, String messageBody) throws MessagingException {
        // Configuración de las propiedades del servidor SMTP
        Properties props = new Properties();
        props.put("mail.smtp.auth", "true");
        props.put("mail.smtp.starttls.enable", "true");
        props.put("mail.smtp.host", "smtp.gmail.com");
        props.put("mail.smtp.port", "587");

        // Autenticación con tu cuenta de Gmail y la contraseña de aplicación
        Session session = Session.getInstance(props, new javax.mail.Authenticator() {
            protected PasswordAuthentication getPasswordAuthentication() {
                return new PasswordAuthentication(username, password);
            }
        });

        // Componer el mensaje
        Message message = new MimeMessage(session);
        message.setFrom(new InternetAddress(username));
        message.setRecipients(Message.RecipientType.TO, InternetAddress.parse(username)); // Destinatario
        message.setSubject(subject);
        message.setText(messageBody);

        // Configurar el "Reply-To" con el correo del cliente
        message.setReplyTo(InternetAddress.parse(clientEmail));

        // Enviar el correo
        Transport.send(message);

        System.out.println("Correo enviado correctamente con Reply-To al cliente");
    }
}

