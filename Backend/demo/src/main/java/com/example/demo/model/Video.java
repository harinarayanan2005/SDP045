package com.example.demo.model;

import java.time.LocalDateTime;

import com.fasterxml.jackson.annotation.JsonBackReference;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.OneToOne;
import jakarta.persistence.Table;

@Entity
@Table(name = "videos")
public class Video {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String videoUrl;
    private LocalDateTime uploadTime;

    @ManyToOne
    private User user;

    @ManyToOne
    @JoinColumn(name = "task_id")
    @JsonBackReference
    private Task task;

    @OneToOne
    @JsonBackReference
    private AnalysisReport analysisReport;

    public Video() {
    }

    public Video(Long id, String videoUrl, LocalDateTime uploadTime, User user, Task task,
            AnalysisReport analysisReport) {
        this.id = id;
        this.videoUrl = videoUrl;
        this.uploadTime = uploadTime;
        this.user = user;
        this.task = task;
        this.analysisReport = analysisReport;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getVideoUrl() {
        return videoUrl;
    }

    public void setVideoUrl(String videoUrl) {
        this.videoUrl = videoUrl;
    }

    public LocalDateTime getUploadTime() {
        return uploadTime;
    }

    public void setUploadTime(LocalDateTime uploadTime) {
        this.uploadTime = uploadTime;
    }

    public User getUser() {
        return user;
    }

    public void setUser(User user) {
        this.user = user;
    }

    public Task getTask() {
        return task;
    }

    public void setTask(Task task) {
        this.task = task;
    }

    public AnalysisReport getAnalysisReport() {
        return analysisReport;
    }

    public void setAnalysisReport(AnalysisReport analysisReport) {
        this.analysisReport = analysisReport;
    }

}
