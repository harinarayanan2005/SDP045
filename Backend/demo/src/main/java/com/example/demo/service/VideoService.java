package com.example.demo.service;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.example.demo.model.Video;
import com.example.demo.repository.VideoRepo;

@Service
public class VideoService {

    @Autowired
    VideoRepo vr;

    public Video addVideo(Video video) {
        return vr.save(video);
    }

    public List<Video> getAllVideo() {
        return vr.findAll();
    }
}
