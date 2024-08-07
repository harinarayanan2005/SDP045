package com.example.demo.service;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.example.demo.model.AnalysisReport;
import com.example.demo.repository.AnalysisReportRepo;

@Service
public class AnalysisReportService {

    @Autowired
    AnalysisReportRepo arr;

    public AnalysisReport addReport(AnalysisReport ae) {
        return arr.save(ae);
    }

    public List<AnalysisReport> getAll() {
        return arr.findAll();
    }

}
