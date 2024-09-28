package com.example.Joyas.controller;

import com.example.Joyas.service.EmailService;
import org.springframework.web.bind.annotation.*;
import javax.mail.MessagingException;

@RestController
@RequestMapping("/mail")
public class MailController {

    private final EmailService emailService = new EmailService();

    @PostMapping("/send")
    public String sendContactEmail(@RequestParam String name,
                                   @RequestParam String email,
                                   @RequestParam String subject,
                                   @RequestParam String message) {
        String fullMessage = "Name: " + name + "\nEmail: " + email + "\n\nMessage:\n" + message;
        try {
            // Enviar el correo, usando el email del cliente para el "Reply-To"
            emailService.sendMail(email, subject, fullMessage);
            return "Message sent successfully!";
        } catch (MessagingException e) {
            e.printStackTrace();
            return "Failed to send message.";
        }
    }
}
