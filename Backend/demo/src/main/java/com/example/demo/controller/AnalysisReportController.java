package com.example.demo.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;

import com.example.demo.model.AnalysisReport;
import com.example.demo.service.AnalysisReportService;

@RestController
public class AnalysisReportController {

    @Autowired
    AnalysisReportService ars;

    @PostMapping("/api/report")
    public ResponseEntity<AnalysisReport> create(@RequestBody AnalysisReport ae) {
        return new ResponseEntity<>(ars.addReport(ae), HttpStatus.CREATED);
    }

    @GetMapping("/api/report")
    public ResponseEntity<List<AnalysisReport>> getAll() {
        List<AnalysisReport> obj = ars.getAll();
        return new ResponseEntity<>(obj, HttpStatus.OK);
    }
}
