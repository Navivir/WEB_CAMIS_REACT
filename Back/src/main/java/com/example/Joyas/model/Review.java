package com.example.Joyas.model;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.Date;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Entity
@Table(name = "reviews")
public class Review {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int id;

    @Column(columnDefinition = "TEXT")
    private String comment;

    @Column
    private int rating;

    @Temporal(TemporalType.TIMESTAMP)
    @Column(name = "comment_date", nullable = false)
    private Date commentDate;

    @ManyToOne
    @JoinColumn(name = "camis_id", nullable = false)
    private Camis camis;

    @ManyToOne
    @JoinColumn(name = "user_id", nullable = false)
    private User user;
}
