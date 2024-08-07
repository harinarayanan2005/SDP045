package com.example.demo.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.example.demo.model.Video;

public interface VideoRepo extends JpaRepository<Video, Integer> {

}
