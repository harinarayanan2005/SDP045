package com.example.demo.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;

import com.example.demo.model.Video;
import com.example.demo.service.VideoService;

@RestController
public class VideoController {

    @Autowired
    VideoService vs;

    @PostMapping("/api/video")
    public ResponseEntity<Video> create(@RequestBody Video ve) {
        return new ResponseEntity<>(vs.addVideo(ve), HttpStatus.CREATED);
    }

    @GetMapping("/api/video")
    public ResponseEntity<List<Video>> getAll() {
        List<Video> obj = vs.getAllVideo();
        return new ResponseEntity<>(obj, HttpStatus.OK);
    }
}
