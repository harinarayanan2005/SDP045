package com.example.demo.model;

import com.fasterxml.jackson.annotation.JsonManagedReference;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.OneToOne;
import jakarta.persistence.Table;

@Entity
@Table(name = "analysis_reports")
public class AnalysisReport {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String sentimentAnalysis;
    private String grammarErrors;
    private String audienceCoverage;

    @OneToOne(mappedBy = "analysisReport")
    @JsonManagedReference
    private Video video;

    public AnalysisReport() {
    }

    public AnalysisReport(Long id, String sentimentAnalysis, String grammarErrors, String audienceCoverage,
            Video video) {
        this.id = id;
        this.sentimentAnalysis = sentimentAnalysis;
        this.grammarErrors = grammarErrors;
        this.audienceCoverage = audienceCoverage;
        this.video = video;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getSentimentAnalysis() {
        return sentimentAnalysis;
    }

    public void setSentimentAnalysis(String sentimentAnalysis) {
        this.sentimentAnalysis = sentimentAnalysis;
    }

    public String getGrammarErrors() {
        return grammarErrors;
    }

    public void setGrammarErrors(String grammarErrors) {
        this.grammarErrors = grammarErrors;
    }

    public String getAudienceCoverage() {
        return audienceCoverage;
    }

    public void setAudienceCoverage(String audienceCoverage) {
        this.audienceCoverage = audienceCoverage;
    }

    public Video getVideo() {
        return video;
    }

    public void setVideo(Video video) {
        this.video = video;
    }

}